async function loginFormHandler(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const button = form.querySelector('button[type="submit"]');
  const email = document.querySelector('#email-login').value.trim();
  const password = document.querySelector('#password-login').value.trim();

  if (email && password) {
    window.setStatus(form, '');
    window.setLoading(button, true);

    try {
      await window.apiRequest('/api/users/login', {
        method: 'post',
        body: JSON.stringify({
          email,
          password
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      document.location.replace('/dashboard/');
    } catch (error) {
      window.setStatus(form, error.message, 'error');
      window.setLoading(button, false);
    }
  }
}

async function signupFormHandler(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const button = form.querySelector('button[type="submit"]');
  const username = document.querySelector('#username-signup').value.trim();
  const email = document.querySelector('#email-signup').value.trim();
  const password = document.querySelector('#password-signup').value.trim();

  if (username && email && password) {
    window.setStatus(form, '');
    window.setLoading(button, true);

    try {
      await window.apiRequest('/api/users', {
        method: 'post',
        body: JSON.stringify({
          username,
          email,
          password
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      document.location.replace('/dashboard/');
    } catch (error) {
      window.setStatus(form, error.message, 'error');
      window.setLoading(button, false);
    }
  }
}

document.querySelector('.login-form').addEventListener('submit', loginFormHandler);

document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);
