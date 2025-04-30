export async function getTenantBySlug(slug: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tenants?filters[slug][$eq]=${slug}&populate=*`);
    const { data } = await response.json();
    return data[0];
  }
  
  export async function updateTenant(id: number, data: any) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tenants/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });
    return await response.json();
  }