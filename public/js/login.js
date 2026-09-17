const form = document.getElementById('login-form');
const message = document.getElementById('form-message');
const password = document.getElementById('password');
const toggle = document.getElementById('toggle-password');

function feedback(text, error = false) { message.textContent = text; message.classList.toggle('error', error); }
toggle?.addEventListener('click', () => { password.type = password.type === 'password' ? 'text' : 'password'; toggle.textContent = password.type === 'password' ? 'Show' : 'Hide'; });
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const identifier = document.getElementById('email').value.trim();
    const value = password.value;
    document.getElementById('email-error').textContent = identifier ? '' : 'Username or email is required.';
    document.getElementById('password-error').textContent = value ? '' : 'Password is required.';
    if (!identifier || !value) return;
    const button = document.getElementById('login-button'); button.disabled = true; feedback('Checking your details...');
    try {
        const response = await fetch('/api/login', { method:'POST', headers:{'Content-Type':'application/json'}, credentials:'include', body:JSON.stringify({ identifier, password:value }) });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Invalid username/email or password.');
        feedback('Login successful. Opening your dashboard...'); window.location.href = '/dashboard.html';
    } catch (error) { feedback(error.message || 'Unable to connect to the server. Please make sure Node.js is running.', true); } finally { button.disabled = false; }
});
