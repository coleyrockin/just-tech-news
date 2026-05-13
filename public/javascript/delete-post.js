async function deleteFormHandler(event) {
  event.preventDefault();

  const form = event.currentTarget.closest('[data-status-scope]');
  const button = event.currentTarget;
  const id = window.location.pathname.split('/').filter(Boolean).pop();

  window.setStatus(form, '');
  window.setLoading(button, true);

  try {
    await window.apiRequest(`/api/posts/${id}`, {
      method: 'DELETE'
    });

    document.location.replace('/dashboard/');
  } catch (error) {
    window.setStatus(form, error.message, 'error');
    window.setLoading(button, false);
  }
}

document.querySelector('.delete-post-btn').addEventListener('click', deleteFormHandler);
