const form = document.getElementById('login-form');
const identifier = document.getElementById('identifier');
const password = document.getElementById('password');
const toggleBtn = document.getElementById('toggle-password');
const messageBox = document.getElementById('form-message');

function setMessage(text, isError = false) {
  messageBox.textContent = text;
  messageBox.classList.toggle('error', isError);
}

function validateLoginForm() {
  let valid = true;
  document.getElementById('identifier-error').textContent = '';
  document.getElementById('password-error').textContent = '';

  if (!identifier.value.trim()) {
    document.getElementById('identifier-error').textContent = 'Username or email is required.';
    valid = false;
  }

  if (!password.value) {
    document.getElementById('password-error').textContent = 'Password is required.';
    valid = false;
  } else if (password.value.length < 6) {
    document.getElementById('password-error').textContent = 'Password must be at least 6 characters.';
    valid = false;
  }

  return valid;
}

toggleBtn.addEventListener('click', () => {
  const isPassword = password.type === 'password';
  password.type = isPassword ? 'text' : 'password';
  toggleBtn.textContent = isPassword ? 'Hide' : 'Show';
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!validateLoginForm()) {
    setMessage('Please fill all required fields.', true);
    return;
  }

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        identifier: identifier.value.trim(),
        password: password.value
      })
    });

    const result = await response.json();

    if (!response.ok) {
      setMessage(result.message || 'Invalid username/email or password.', true);
      return;
    }

    setMessage(result.message || 'Login successful.', false);
    window.location.href = '/dashboard.html';
  } catch (error) {
    setMessage('Unable to connect to server.', true);
  }
});
