export async function getTagsByTenant(tenantSlug: string) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/tags?filters[tenant][slug][$eq]=${tenantSlug}`
    );
    return await response.json();
  }
  
  export async function createTag(data: any) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });
    return await response.json();
  }