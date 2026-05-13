async function newFormHandler(event) {
  event.preventDefault();

  const title = document.querySelector('input[name="post-title"]').value.trim();
  const post_url = document.querySelector('input[name="post-url"]').value.trim();

  if (!title || !post_url) {
    alert('Post title and URL are required.');
    return;
  }

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
    alert(error.message);
  }
}

document.querySelector('.new-post-form').addEventListener('submit', newFormHandler);
