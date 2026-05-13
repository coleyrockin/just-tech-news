async function logout() {
  try {
    await window.apiRequest('/api/users/logout', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' }
    });

    document.location.replace('/');
  } catch (error) {
    alert(error.message);
  }
}

document.querySelector('#logout').addEventListener('click', logout);
