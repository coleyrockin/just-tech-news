async function logout() {
  const button = document.querySelector('#logout');

  window.setStatus(document, '');
  window.setLoading(button, true);

  try {
    await window.apiRequest('/api/users/logout', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' }
    });

    document.location.replace('/');
  } catch (error) {
    window.setStatus(document, error.message, 'error');
    window.setLoading(button, false);
  }
}

document.querySelector('#logout').addEventListener('click', logout);
