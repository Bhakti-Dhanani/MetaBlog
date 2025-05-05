'use strict';

/**
 * auth controller
 */

import { factories } from '@strapi/strapi';

interface User {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  role?: {
    id: number;
    name: string;
  };
  tenants?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  password?: string;
}

interface AuthContext {
  request: {
    body: any;
  };
  badRequest: (message: string) => any;
  created: (data: any) => any;
  send: (data: any) => any;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: string;
  tenantName?: string;
}

interface CallbackRequest {
  identifier: string;
  password: string;
}

// @ts-ignore
export default factories.createCoreController('api::auth.auth', ({ strapi }) => ({
  async register(ctx: AuthContext) {
    try {
      const { username, email, password, role, tenantName } = ctx.request.body as RegisterRequest;
      console.log('Registration request received:', { username, email, role });

      if (!username || !email || !password || !role) {
        console.log('Missing required fields:', { username, email, role });
        return ctx.badRequest("All fields are required");
      }

      // Find the role
      console.log('Searching for role:', role);
      const roles = await strapi.entityService.findMany("plugin::users-permissions.role", {
        filters: { name: role },
      });
      console.log('Found roles:', roles);

      const roleEntity = roles.length > 0 ? roles[0] : null;

      if (!roleEntity) {
        console.log('Role not found:', role);
        return ctx.badRequest(`Invalid role: ${role}. Please ensure the role exists in the system.`);
      }

      // Check for existing user
      const existingUsers = await strapi.entityService.findMany("plugin::users-permissions.user", {
        filters: { email },
      });
      
      if (existingUsers && existingUsers.length > 0) {
        console.log('Email already taken:', email);
        return ctx.badRequest("Email already taken");
      }

      // Create user
      const userData = {
        username,
        email,
        password,
        role: roleEntity.id,
        provider: "local",
        confirmed: true,
      };
      console.log('Creating user with data:', { ...userData, password: '[REDACTED]' });

      const user = await strapi.plugins["users-permissions"].services.user.add(userData);
      
      // Fetch the user with populated role
      const populatedUser = await strapi.entityService.findOne("plugin::users-permissions.user", user.id, {
        populate: ['role'],
      }) as unknown as User;
      
      // Create tenant if the role is Tenant Admin
      let tenant = null;
      if (role.toLowerCase() === 'tenant admin') {
        // Generate a URL-safe slug
        const slug = username.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        const tenantData = {
          name: tenantName || `${username}'s Organization`,
          slug: slug,
          description: `Organization for ${username}`,
          users: [user.id],
          theme_settings: {
            primaryColor: '#4f46e5',
            secondaryColor: '#f43f5e',
            logo: null
          }
        };

        console.log('Creating tenant with data:', tenantData);
        
        try {
          tenant = await strapi.db.query('api::tenant.tenant').create({
            data: tenantData
          });
          console.log('Tenant created successfully:', tenant);
        } catch (tenantError) {
          console.error('Error creating tenant:', tenantError);
          // Rollback user creation if tenant creation fails
          await strapi.entityService.delete("plugin::users-permissions.user", user.id);
          return ctx.badRequest("Failed to create tenant organization");
        }
      }

      const jwt = strapi.plugins["users-permissions"].services.jwt.issue({ id: user.id });

      // Manually sanitize the user data
      const sanitizedUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        provider: user.provider,
        confirmed: user.confirmed,
        role: populatedUser.role,
        tenant: tenant ? { 
          id: tenant.id, 
          name: tenant.name, 
          slug: tenant.slug 
        } : null
      };

      ctx.created({ 
        jwt, 
        user: sanitizedUser,
        message: role.toLowerCase() === 'tenant admin' 
          ? 'User and tenant organization created successfully' 
          : 'User created successfully'
      });
    } catch (error) {
      console.error('Registration error:', error);
      return ctx.badRequest(error.message || "An error occurred during registration");
    }
  },

  async callback(ctx: AuthContext) {
    try {
      const { identifier, password } = ctx.request.body as CallbackRequest;
      if (!identifier || !password) {
        return ctx.badRequest("Identifier and password are required");
      }

      // Find user with populated role and tenants
      const users = await strapi.db.query('plugin::users-permissions.user').findMany({
        where: {
          $or: [{ email: identifier }, { username: identifier }],
        },
        populate: ['role', 'tenants'],
      }) as unknown as User[];

      const user = users.length > 0 ? users[0] : null;

      if (!user || user.provider !== "local") {
        return ctx.badRequest("Invalid credentials");
      }

      const validPassword = await strapi.plugins["users-permissions"].services.user.validatePassword(password, user.password);
      if (!validPassword) {
        return ctx.badRequest("Invalid credentials");
      }

      const jwt = strapi.plugins["users-permissions"].services.jwt.issue({ id: user.id });

      // Get role name safely
      const roleName = user.role?.name || null;

      // Get first tenant if exists
      const userTenants = user.tenants || [];
      const primaryTenant = userTenants.length > 0 ? userTenants[0] : null;

      // Manually sanitize the user data
      const sanitizedUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        provider: user.provider,
        confirmed: user.confirmed,
        role: user.role,
        tenant: primaryTenant ? { 
          id: primaryTenant.id, 
          name: primaryTenant.name, 
          slug: primaryTenant.slug 
        } : null
      };

      ctx.send({ 
        jwt, 
        user: sanitizedUser, 
        role: roleName 
      });
    } catch (error) {
      console.error('Login error:', error);
      return ctx.badRequest(error.message || "An error occurred during login");
    }
  },
}));