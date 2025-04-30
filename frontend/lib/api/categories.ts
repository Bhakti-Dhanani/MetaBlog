export async function getCategoriesByTenant(tenantSlug: string) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/categories?filters[tenant][slug][$eq]=${tenantSlug}`
    );
    return await response.json();
  }
  
  export async function createCategory(data: any) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });
    return await response.json();
  }