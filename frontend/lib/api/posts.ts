export async function getPostsByTenant(tenantSlug: string) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/posts?filters[tenant][slug][$eq]=${tenantSlug}&populate=*`
    );
    return await response.json();
  }
  
  export async function createPost(data: any) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });
    return await response.json();
  }
  
  export async function updatePost(id: number, data: any) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });
    return await response.json();
  }
  
  export async function deletePost(id: number) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`, {
      method: 'DELETE',
    });
    return await response.json();
  }