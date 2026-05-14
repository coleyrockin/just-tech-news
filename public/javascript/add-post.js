async function newFormHandler(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const button = form.querySelector('button[type="submit"]');
  const title = form.querySelector('input[name="post-title"]').value.trim();
  const post_url = form.querySelector('input[name="post-url"]').value.trim();
  const tag_ids = Array.from(form.querySelectorAll('input[name="tag-ids"]:checked')).map(
    input => input.value
  );

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
        post_url,
        tag_ids
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
