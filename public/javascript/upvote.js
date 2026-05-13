async function upvoteClickHandler(event) {
  event.preventDefault();

  const id = window.location.pathname.split('/').filter(Boolean).pop();

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
    alert(error.message);
  }
}

document.querySelector('.upvote-btn').addEventListener('click', upvoteClickHandler);
