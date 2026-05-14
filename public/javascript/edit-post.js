async function editFormHandler(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const button = form.querySelector('button[type="submit"]');
  const title = form.querySelector('input[name="post-title"]').value.trim();
  const tag_ids = Array.from(form.querySelectorAll('input[name="tag-ids"]:checked')).map(
    input => input.value
  );
  const id = window.location.pathname.split('/').filter(Boolean).pop();

  if (!title) {
    window.setStatus(form, 'Post title is required.', 'error');
    return;
  }

  window.setStatus(form, '');
  window.setLoading(button, true);

  try {
    await window.apiRequest(`/api/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        title,
        tag_ids
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    document.location.replace('/dashboard/');
  } catch (error) {
    window.setStatus(form, error.message, 'error');
    window.setLoading(button, false);
  }
}

document.querySelector('.edit-post-form').addEventListener('submit', editFormHandler);
