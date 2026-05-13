async function getResponseMessage(response) {
  try {
    const data = await response.json();
    return data.message || response.statusText;
  } catch {
    return response.statusText || 'Request failed.';
  }
}

function getStatusTarget(scope) {
  return scope?.querySelector('[data-status]') || document.querySelector('#global-status');
}

window.setStatus = (scope, message, type = 'info') => {
  const target = getStatusTarget(scope);

  if (!target) {
    return;
  }

  target.textContent = message || '';
  target.dataset.type = type;
};

window.setLoading = (button, isLoading) => {
  if (!button) {
    return;
  }

  if (isLoading) {
    button.dataset.originalText = button.textContent;
    button.textContent = button.dataset.loadingText || 'Working...';
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    return;
  }

  button.textContent = button.dataset.originalText || button.textContent;
  button.disabled = false;
  button.removeAttribute('aria-busy');
  delete button.dataset.originalText;
};

window.apiRequest = async (url, options = {}) => {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(await getResponseMessage(response));
  }

  return response;
};
