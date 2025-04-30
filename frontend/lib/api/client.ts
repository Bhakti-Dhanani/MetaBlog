const BASE_URL = 'http://localhost:1337';

interface ApiRequestConfig extends RequestInit {
  requiresAuth?: boolean;
}

export async function apiRequest(
  endpoint: string,
  { requiresAuth = true, ...config }: ApiRequestConfig = {}
) {
  const url = `${BASE_URL}${endpoint}`;
  const jwt = localStorage.getItem('jwt');

  if (requiresAuth && !jwt) {
    throw new Error('No authentication token found');
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(requiresAuth && jwt ? { 'Authorization': `Bearer ${jwt}` } : {}),
    ...config.headers,
  };

  const response = await fetch(url, {
    ...config,
    headers,
    credentials: 'include',
    mode: 'cors',
  });

  if (!response.ok) {
    if (response.status === 403) {
      // Clear auth data on forbidden response
      localStorage.removeItem('jwt');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
    }

    const error = await response.json().catch(() => ({
      message: 'An error occurred',
    }));

    throw {
      status: response.status,
      ...error,
    };
  }

  return response.json();
}