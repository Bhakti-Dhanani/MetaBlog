export async function getAuthorsByTenant(tenantSlug: string) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/authors?filters[tenant][slug][$eq]=${tenantSlug}&populate=*`
    );
    return await response.json();
  }
  
  export async function createAuthor(data: any) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/authors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });
    return await response.json();
  }