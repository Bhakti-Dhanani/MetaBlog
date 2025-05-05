import { factories } from '@strapi/strapi';

// Enhanced Interfaces with stricter typing
interface Tenant {
  id: number;
  slug?: string;
  name?: string;
}

interface PostBase {
  id: number;
  title: string;
  slug: string;
  content: string;
  status: 'draft' | 'published';
  meta_title?: string | null;
  meta_description?: string | null;
  publishedAt?: string | Date | null;
  publish_date?: string | Date | null;
  createdAt?: string;
  updatedAt?: string;
  locale?: string;
}

interface PostEntity extends PostBase {
  tenant?: Tenant;
}

interface PostInput {
  title: string;
  slug: string;
  content: string;
  status: 'draft' | 'published';
  meta_title?: string | null;
  meta_description?: string | null;
  tenant: number | { id: number };
  publishedAt?: string | Date | null;
  publish_date?: string | Date | null;
}

interface SanitizedQuery {
  filters?: {
    [key: string]: any;
    tenant?: {
      id?: number;
      slug?: { $eq?: string };
    };
  };
  populate?: string[];
  [key: string]: any;
}

interface StrapiPostResponse {
  id: number;
  attributes: {
    title: string;
    slug: string;
    content: string;
    status: 'draft' | 'published';
    meta_title?: string | null;
    meta_description?: string | null;
    publishedAt?: string | Date | null;
    publish_date?: string | Date | null;
    createdAt?: string;
    updatedAt?: string;
    locale?: string;
    tenant?: {
      data?: {
        id: number;
        attributes?: {
          slug?: string;
          name?: string;
        };
      };
    };
  };
}

interface TenantQueryResponse {
  id: number;
  slug?: string;
  name?: string;
}

interface PostQueryResponse {
  id: number;
  attributes: {
    slug: string;
    tenant?: {
      data?: {
        id: number;
        attributes?: {
          slug?: string;
          name?: string;
        };
      };
    };
  };
}

// Controller with fully typed responses
export default factories.createCoreController('api::post.post', ({ strapi }) => ({
  async create(ctx) {
    try {
      const { data } = ctx.request.body as { data: PostInput };
      
      // Validation
      if (!data?.title || !data?.slug || !data?.content || !data?.status) {
        return ctx.badRequest('Title, slug, content, and status are required');
      }

      const tenantId = typeof data.tenant === 'number' ? data.tenant : data.tenant?.id;
      if (!tenantId) {
        return ctx.badRequest('Tenant is required');
      }

      // Check for existing posts with same slug
      const existingPosts = await strapi.db.query('api::post.post').findMany({
        where: {
          slug: data.slug,
          tenant: { id: tenantId }
        },
        populate: ['tenant']
      }) as PostQueryResponse[];

      if (existingPosts && existingPosts.length > 0) {
        return ctx.badRequest('Slug must be unique');
      }

      // Create new post
      const post = await strapi.entityService.create('api::post.post', {
        data: {
          ...data,
          tenant: tenantId,
          publishedAt: data.status === 'published' ? new Date() : null,
          publish_date: data.status === 'published' ? new Date() : null
        },
        populate: ['tenant']
      }) as unknown as StrapiPostResponse;

      // Transform response
      const result: PostEntity = {
        id: post.id,
        title: post.attributes.title,
        slug: post.attributes.slug,
        content: post.attributes.content,
        status: post.attributes.status,
        meta_title: post.attributes.meta_title ?? undefined,
        meta_description: post.attributes.meta_description ?? undefined,
        publishedAt: post.attributes.publishedAt,
        publish_date: post.attributes.publish_date,
        createdAt: post.attributes.createdAt,
        updatedAt: post.attributes.updatedAt,
        locale: post.attributes.locale,
        tenant: post.attributes.tenant?.data ? { id: post.attributes.tenant.data.id } : undefined
      };

      return { data: result };
      
    } catch (err) {
      ctx.response.status = 400;
      return { 
        error: {
          message: err instanceof Error ? err.message : 'Failed to create post'
        }
      };
    }
  },

  async find(ctx) {
    try {
      const sanitizedQuery = await this.sanitizeQuery(ctx) as SanitizedQuery;
      const posts = await strapi.entityService.findMany('api::post.post', {
        ...sanitizedQuery,
        populate: ['tenant']
      }) as unknown as StrapiPostResponse[];

      // Transform response
      const results: PostEntity[] = posts.map(post => ({
        id: post.id,
        title: post.attributes.title,
        slug: post.attributes.slug,
        content: post.attributes.content,
        status: post.attributes.status,
        meta_title: post.attributes.meta_title ?? undefined,
        meta_description: post.attributes.meta_description ?? undefined,
        publishedAt: post.attributes.publishedAt,
        publish_date: post.attributes.publish_date,
        createdAt: post.attributes.createdAt,
        updatedAt: post.attributes.updatedAt,
        locale: post.attributes.locale,
        tenant: post.attributes.tenant?.data ? { id: post.attributes.tenant.data.id } : undefined
      }));

      return this.transformResponse(results);
    } catch (err) {
      ctx.response.status = 400;
      return { 
        error: {
          message: err instanceof Error ? err.message : 'Failed to fetch posts'
        }
      };
    }
  },
  async findOne(ctx) {
    try {
      const { id } = ctx.params;
      const sanitizedQuery = await this.sanitizeQuery(ctx) as SanitizedQuery;

      const post = await strapi.entityService.findOne('api::post.post', id, {
        ...sanitizedQuery,
        populate: ['tenant']
      }) as unknown as StrapiPostResponse | null;

      if (!post) {
        return ctx.notFound('Post not found');
      }

      // Transform response
      const result: PostEntity = {
        id: post.id,
        title: post.attributes.title,
        slug: post.attributes.slug,
        content: post.attributes.content,
        status: post.attributes.status,
        meta_title: post.attributes.meta_title ?? undefined,
        meta_description: post.attributes.meta_description ?? undefined,
        publishedAt: post.attributes.publishedAt,
        publish_date: post.attributes.publish_date,
        createdAt: post.attributes.createdAt,
        updatedAt: post.attributes.updatedAt,
        locale: post.attributes.locale,
        tenant: post.attributes.tenant?.data ? { id: post.attributes.tenant.data.id } : undefined
      };

      return this.transformResponse(result);
    } catch (err) {
      ctx.response.status = 400;
      return { 
        error: {
          message: err instanceof Error ? err.message : 'Failed to fetch post'
        }
      };
    }
  },

  async update(ctx) {
    try {
      const { id } = ctx.params;
      const { data } = ctx.request.body as { data: Partial<PostInput> };

      // Get existing post with tenant
      const existingPost = await strapi.db.query('api::post.post').findOne({
        where: { id },
        populate: ['tenant']
      });

      if (!existingPost) {
        return ctx.notFound('Post not found');
      }

      const tenantId = existingPost.tenant?.id;

      // Check for unique slug
      if (data.slug && data.slug !== existingPost.slug && tenantId) {
        const existingPosts = await strapi.db.query('api::post.post').findMany({
          where: { 
            slug: data.slug,
            tenant: { id: tenantId }
          },
          populate: ['tenant']
        });
        
        if (existingPosts && existingPosts.length > 0) {
          return ctx.badRequest('Slug must be unique');
        }
      }

      // Prepare update data
      const updateData: Partial<PostInput> = {
        ...data,
        status: data.status ?? existingPost.status ?? 'draft',
        publishedAt: data.status === 'published' ? new Date() : 
                   (data.status === 'draft' ? null : existingPost.publishedAt),
        publish_date: data.status === 'published' ? new Date() : 
                     (data.status === 'draft' ? null : existingPost.publish_date)
      };

      // Update post
      const updatedPost = await strapi.entityService.update('api::post.post', id, {
        data: updateData,
        populate: ['tenant']
      }) as unknown as StrapiPostResponse;

      // Transform response
      const result: PostEntity = {
        id: updatedPost.id,
        title: updatedPost.attributes.title,
        slug: updatedPost.attributes.slug,
        content: updatedPost.attributes.content,
        status: updatedPost.attributes.status,
        meta_title: updatedPost.attributes.meta_title ?? undefined,
        meta_description: updatedPost.attributes.meta_description ?? undefined,
        publishedAt: updatedPost.attributes.publishedAt,
        publish_date: updatedPost.attributes.publish_date,
        createdAt: updatedPost.attributes.createdAt,
        updatedAt: updatedPost.attributes.updatedAt,
        locale: updatedPost.attributes.locale,
        tenant: updatedPost.attributes.tenant?.data ? { id: updatedPost.attributes.tenant.data.id } : undefined
      };

      return { data: result };
    } catch (err) {
      ctx.response.status = 400;
      return { 
        error: {
          message: err instanceof Error ? err.message : 'Failed to update post'
        }
      };
    }
  },

  async delete(ctx) {
    try {
      const { id } = ctx.params;

      const existingPost = await strapi.db.query('api::post.post').findOne({
        where: { id }
      });

      if (!existingPost) {
        return ctx.notFound('Post not found');
      }

      await strapi.entityService.delete('api::post.post', id);

      return { data: { id } };
    } catch (err) {
      ctx.response.status = 400;
      return { 
        error: {
          message: err instanceof Error ? err.message : 'Failed to delete post'
        }
      };
    }
  }
}));