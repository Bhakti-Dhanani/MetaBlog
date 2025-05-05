import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::tenant.tenant', ({ strapi }) => ({
  async me(ctx) {
    try {
      const user = ctx.state.user;

      if (!user) {
        console.log('Authorization header missing or invalid');
        return ctx.unauthorized('No authorization header was found');
      }

      console.log('Fetching user with ID:', user.id);
      const populatedUser = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { id: user.id },
        populate: ['role', 'tenants'],
      });

      if (!populatedUser) {
        console.log('User not found for ID:', user.id);
        return ctx.notFound('User not found');
      }

      console.log('User found:', {
        id: populatedUser.id,
        username: populatedUser.username,
        role: populatedUser.role?.name,
        tenant: populatedUser.tenants?.[0]?.name,
      });

      if (!populatedUser.role) {
        console.log('User role not found for user ID:', user.id);
        return ctx.forbidden('User role not found');
      }

      if (populatedUser.role.name !== 'Tenant Admin') {
        console.log('Access denied for user ID:', user.id, 'Role:', populatedUser.role.name);
        return ctx.forbidden('Access denied: Tenant Admin role required');
      }

      console.log('Access granted for user ID:', user.id);
      return ctx.send(populatedUser);
    } catch (error) {
      console.error('Error in tenant.me:', error);
      return ctx.badRequest('An error occurred', { error: error.message });
    }
  },

  async getThemeSettings(ctx) {
    try {
      const user = ctx.state.user;
      
      if (!user) {
        return ctx.unauthorized('No authorization header was found');
      }

      // Get user with tenant populated
      const populatedUser = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { id: user.id },
        populate: ['tenants'],
      });

      if (!populatedUser || !populatedUser.tenants || populatedUser.tenants.length === 0) {
        return ctx.notFound('Tenant not found for user');
      }

      const tenant = populatedUser.tenants[0];
      
      // Return theme settings with default values if not set
      const themeSettings = tenant.theme_settings || {
        primaryColor: '#3b82f6',
        secondaryColor: '#10b981',
        fontFamily: 'sans-serif'
      };

      return ctx.send({
        data: {
          theme_settings: themeSettings
        }
      });
    } catch (error) {
      console.error('Error fetching theme settings:', error);
      return ctx.badRequest('Failed to fetch theme settings');
    }
  },

  async updateThemeSettings(ctx) {
    try {
      const user = ctx.state.user;
      const { theme_settings } = ctx.request.body;
      
      if (!user) {
        return ctx.unauthorized('No authorization header was found');
      }

      if (!theme_settings) {
        return ctx.badRequest('Theme settings data is required');
      }

      // Get user with tenant populated
      const populatedUser = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { id: user.id },
        populate: ['tenants'],
      });

      if (!populatedUser || !populatedUser.tenants || populatedUser.tenants.length === 0) {
        return ctx.notFound('Tenant not found for user');
      }

      const tenant = populatedUser.tenants[0];
      
      // Update tenant with new theme settings
      const updatedTenant = await strapi.db.query('api::tenant.tenant').update({
        where: { id: tenant.id },
        data: {
          theme_settings: {
            ...(tenant.theme_settings || {}),
            ...theme_settings
          }
        },
        populate: [],
      });

      return ctx.send({
        data: {
          theme_settings: updatedTenant.theme_settings
        }
      });
    } catch (error) {
      console.error('Error updating theme settings:', error);
      return ctx.badRequest('Failed to update theme settings');
    }
  },

  async find(ctx) {
    return await super.find(ctx);
  },

  async findOne(ctx) {
    return await super.find(ctx);
  },

  async create(ctx) {
    return await super.create(ctx);
  },

  async update(ctx) {
    return await super.update(ctx);
  },

  async delete(ctx) {
    return await super.delete(ctx);
  },
}));