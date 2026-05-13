async function getResponseMessage(response) {
  try {
    const data = await response.json();
    return data.message || response.statusText;
  } catch {
    return response.statusText || 'Request failed.';
  }
}

window.apiRequest = async (url, options = {}) => {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(await getResponseMessage(response));
  }

  return response;
};
