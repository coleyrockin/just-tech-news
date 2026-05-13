async function upvoteClickHandler(event) {
  event.preventDefault();

  const form = event.currentTarget.closest('[data-status-scope]');
  const button = event.currentTarget;
  const id = window.location.pathname.split('/').filter(Boolean).pop();

  window.setStatus(form, '');
  window.setLoading(button, true);

  try {
    await window.apiRequest('/api/posts/upvote', {
      method: 'PUT',
      body: JSON.stringify({
        post_id: id
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    document.location.reload();
  } catch (error) {
    window.setStatus(form, error.message, 'error');
    window.setLoading(button, false);
  }
}

document.querySelector('.upvote-btn').addEventListener('click', upvoteClickHandler);
