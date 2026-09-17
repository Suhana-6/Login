const registerForm = document.getElementById('register-form');
const formMessage = document.getElementById('form-message');

function setMessage(text, isError = false) {
  formMessage.textContent = text;
  formMessage.classList.toggle('error', isError);
}

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const fullName = document.getElementById('full_name').value.trim();
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm_password').value;

  document.getElementById('full_name-error').textContent = fullName ? '' : 'Full name is required.';
  document.getElementById('username-error').textContent = username ? '' : 'Username is required.';
  document.getElementById('email-error').textContent = email ? '' : 'Email is required.';
  document.getElementById('password-error').textContent = password ? '' : 'Password is required.';
  document.getElementById('confirm_password-error').textContent = confirmPassword ? '' : 'Confirm password is required.';

  if (!fullName || !username || !email || !password || !confirmPassword) {
    setMessage('Please fill all required fields.', true);
    return;
  }

  if (password.length < 6) {
    document.getElementById('password-error').textContent = 'Password must be at least 6 characters.';
    setMessage('Password must be at least 6 characters.', true);
    return;
  }

  if (password !== confirmPassword) {
    document.getElementById('confirm_password-error').textContent = 'Passwords do not match.';
    setMessage('Passwords do not match.', true);
    return;
  }

  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        full_name: fullName,
        username,
        email,
        password
      })
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      setMessage(result.message || 'Unable to connect to server.', true);
      return;
    }

    setMessage(result.message || 'Account created successfully.', false);
    setTimeout(() => {
      window.location.href = '/login.html';
    }, 1000);
  } catch (error) {
    setMessage(error.message || 'Unable to connect to server. Check the deployment configuration.', true);
  }
});
