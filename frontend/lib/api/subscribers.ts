export async function getSubscribersByTenant(tenantSlug: string) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/subscribers?filters[tenant][slug][$eq]=${tenantSlug}`
    );
    return await response.json();
  }