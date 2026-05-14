async function commentFormHandler(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const button = form.querySelector('button[type="submit"]');
  const comment_text = form.querySelector('textarea[name="comment-body"]').value.trim();
  const post_id = window.location.pathname.split('/').filter(Boolean).pop();

  if (comment_text) {
    window.setStatus(form, '');
    window.setLoading(button, true);

    try {
      await window.apiRequest('/api/comments', {
        method: 'POST',
        body: JSON.stringify({
          post_id,
          comment_text
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
  } else {
    window.setStatus(form, 'Comment text is required.', 'error');
  }
}

document.querySelector('.comment-form').addEventListener('submit', commentFormHandler);
