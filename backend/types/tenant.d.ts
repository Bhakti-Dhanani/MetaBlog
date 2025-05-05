// types/tenant.d.ts
declare module 'api::tenant.tenant' {
    export interface Tenant {
      id: number;
      name: string;
      slug: string;
      description?: string;
      theme_settings?: Record<string, any>;
      users?: UsersPermissionsUser[];
      posts?: Post[];
      categories?: Category[];
      tags?: Tag[];
      authors?: Author[];
      subscribers?: Subscriber[];
      createdAt: string;
      updatedAt: string;
    }
  }
  
  // types/user.d.ts
  declare module 'plugin::users-permissions.user' {
    export interface UsersPermissionsUser {
      id: number;
      username: string;
      email: string;
      provider: string;
      password: string;
      resetPasswordToken?: string;
      confirmationToken?: string;
      confirmed: boolean;
      blocked: boolean;
      role?: UsersPermissionsRole;
      tenants?: Tenant[];
      createdAt: string;
      updatedAt: string;
    }
  
    export interface UsersPermissionsRole {
      id: number;
      name: string;
      description?: string;
      type?: string;
    }
  }