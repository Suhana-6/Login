const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('form-message');
const togglePassword = document.getElementById('toggle-password');

function showMessage(message, isError = false) {
    loginMessage.textContent = message;
    loginMessage.classList.toggle('error', isError);
}

togglePassword.addEventListener('click', () => {
    const password = document.getElementById('password');
    const visible = password.type === 'text';
    password.type = visible ? 'password' : 'text';
    togglePassword.textContent = visible ? 'Show' : 'Hide';
});

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const identifier = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    document.getElementById('email-error').textContent = identifier ? '' : 'Username or email is required.';
    document.getElementById('password-error').textContent = password ? '' : 'Password is required.';
    if (!identifier || !password) return;
    const button = document.getElementById('login-button');
    button.disabled = true;
    showMessage('Checking your details...');
    try {
        const response = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: identifier, password }) });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        showMessage('Login successful. Opening your dashboard...');
        window.location.href = 'dashboard.html';
    } catch (error) {
        showMessage(error.message || 'Unable to login right now.', true);
    } finally {
        button.disabled = false;
    }
});
