export default async function apiCall(method: string, url: string, body?: any) {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status !== 200) {
    try {
      return await response.json();
    } catch (err) {
      return { error: err };
    }
  }

  try {
    return await response.json();
  } catch (err) {
    return { error: err };
  }
}
