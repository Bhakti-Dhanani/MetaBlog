/**
 * tenant router
 */

export default {
  routes: [
    // Keep the default routes
    {
      method: 'GET',
      path: '/tenant',
      handler: 'tenant.find',
    },
    {
      method: 'GET',
      path: '/tenant/:id',
      handler: 'tenant.findOne',
    },
    {
      method: 'POST',
      path: '/tenant',
      handler: 'tenant.create',
    },
    {
      method: 'PUT',
      path: '/tenant/:id',
      handler: 'tenant.update',
    },
    {
      method: 'DELETE',
      path: '/tenant/:id',
      handler: 'tenant.delete',
    },
    // Add the new /me route
    {
      method: 'GET',
      path: '/tenant/users/me',
      handler: 'tenant.me',
    },
  ],
};
