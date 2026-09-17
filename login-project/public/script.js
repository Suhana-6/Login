const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const formMessage = document.getElementById('formMessage');
const togglePasswordBtn = document.getElementById('togglePassword');

function showMessage(message, isError = false) {
  formMessage.textContent = message;
  formMessage.classList.remove('success', 'error');
  formMessage.classList.add(isError ? 'error' : 'success');
}

function validateField() {
  const emailValue = emailInput.value.trim();
  const passwordValue = passwordInput.value.trim();

  let emailValid = true;
  let passwordValid = true;

  if (!emailValue) {
    emailError.textContent = 'Username or email is required.';
    emailValid = false;
  } else {
    emailError.textContent = '';
  }

  if (!passwordValue) {
    passwordError.textContent = 'Password is required.';
    passwordValid = false;
  } else if (passwordValue.length < 6) {
    passwordError.textContent = 'Password must be at least 6 characters long.';
    passwordValid = false;
  } else {
    passwordError.textContent = '';
  }

  return emailValid && passwordValid;
}

togglePasswordBtn.addEventListener('click', () => {
  const isPassword = passwordInput.type === 'password';
  passwordInput.type = isPassword ? 'text' : 'password';
  togglePasswordBtn.textContent = isPassword ? 'Hide' : 'Show';
});

loginForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  formMessage.textContent = '';
  formMessage.classList.remove('success', 'error');

  if (!validateField()) {
    return;
  }

  const payload = {
    email: emailInput.value.trim(),
    password: passwordInput.value
  };

  try {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      showMessage(result.message || 'Invalid email or password.', true);
      return;
    }

    showMessage(result.message || 'Login successful!', false);
  } catch (error) {
    showMessage('Unable to connect to the server.', true);
  }
});
