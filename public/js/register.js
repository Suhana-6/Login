const form = document.getElementById('register-form');
const message = document.getElementById('form-message');
function feedback(text, error = false) { message.textContent = text; message.classList.toggle('error', error); }
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(form));
    const errors = { fullName: !values.fullName.trim() ? 'Full name is required.' : '', username: !values.username.trim() ? 'Username is required.' : '', email: !/^\S+@\S+\.\S+$/.test(values.email) ? 'Enter a valid email.' : '', password: values.password.length < 6 ? 'Use at least 6 characters.' : '', confirmPassword: values.password !== values.confirmPassword ? 'Passwords do not match.' : '' };
    Object.entries(errors).forEach(([field, text]) => { document.getElementById(`${field}-error`).textContent = text; });
    if (Object.values(errors).some(Boolean)) return;
    const button = document.getElementById('register-button'); button.disabled = true; feedback('Creating your account...');
    try {
        const response = await fetch('/api/register', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ full_name:values.fullName, username:values.username, email:values.email, password:values.password, confirm_password:values.confirmPassword }) });
        const result = await response.json();
        if (!response.ok) {
            feedback(result.message || 'Registration failed.', true);
            return;
        }
        feedback('Account created successfully. Redirecting to login...'); setTimeout(() => { window.location.href = '/login.html'; }, 900);
    } catch (error) { feedback('Unable to connect to the server. Please make sure Node.js is running.', true); } finally { button.disabled = false; }
});
