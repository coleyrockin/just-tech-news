async function deleteFormHandler(event) {
  event.preventDefault();

  const id = window.location.pathname.split('/').filter(Boolean).pop();

  try {
    await window.apiRequest(`/api/posts/${id}`, {
      method: 'DELETE'
    });

    document.location.replace('/dashboard/');
  } catch (error) {
    alert(error.message);
  }
}

document.querySelector('.delete-post-btn').addEventListener('click', deleteFormHandler);
