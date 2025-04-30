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
        populate: ['role', 'tenant'],
      });

      if (!populatedUser) {
        console.log('User not found for ID:', user.id);
        return ctx.notFound('User not found');
      }

      console.log('User found:', {
        id: populatedUser.id,
        username: populatedUser.username,
        role: populatedUser.role?.name,
        tenant: populatedUser.tenant?.name,
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

  async find(ctx) {
    return await super.find(ctx);
  },

  async findOne(ctx) {
    return await super.findOne(ctx);
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
