export async function apiFetch(
  url: string,
  options: RequestInit = {}
) {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null;

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (res.status === 401) {
    console.error('Unauthorized – token missing or expired');
  }

  return res;
}
