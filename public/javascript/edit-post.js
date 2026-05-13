async function editFormHandler(event) {
  event.preventDefault();

  const title = document.querySelector('input[name="post-title"]').value.trim();
  const id = window.location.pathname.split('/').filter(Boolean).pop();

  if (!title) {
    alert('Post title is required.');
    return;
  }

  try {
    await window.apiRequest(`/api/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        title
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    document.location.replace('/dashboard/');
  } catch (error) {
    alert(error.message);
  }
}

document.querySelector('.edit-post-form').addEventListener('submit', editFormHandler);
