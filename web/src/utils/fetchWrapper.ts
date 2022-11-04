export async function fetchWrapper<T = unknown>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`http://localhost:3333${endpoint}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    ...options,
  });

  return response.json();
}
