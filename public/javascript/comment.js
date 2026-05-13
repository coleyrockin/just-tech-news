async function commentFormHandler(event) {
  event.preventDefault();

  const comment_text = document.querySelector('textarea[name="comment-body"]').value.trim();
  const post_id = window.location.pathname.split('/').filter(Boolean).pop();

  if (comment_text) {
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
      alert(error.message);
    }
  }
}

document.querySelector('.comment-form').addEventListener('submit', commentFormHandler);
