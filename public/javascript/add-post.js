async function newFormHandler(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const button = form.querySelector('button[type="submit"]');
  const title = document.querySelector('input[name="post-title"]').value.trim();
  const post_url = document.querySelector('input[name="post-url"]').value.trim();

  if (!title || !post_url) {
    window.setStatus(form, 'Post title and URL are required.', 'error');
    return;
  }

  window.setStatus(form, '');
  window.setLoading(button, true);

  try {
    await window.apiRequest('/api/posts', {
      method: 'POST',
      body: JSON.stringify({
        title,
        post_url
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    document.location.replace('/dashboard');
  } catch (error) {
    window.setStatus(form, error.message, 'error');
    window.setLoading(button, false);
  }
}

document.querySelector('.new-post-form').addEventListener('submit', newFormHandler);
