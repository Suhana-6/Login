const registerForm = document.getElementById('register-form');
const registerMessage = document.getElementById('form-message');

function registerFeedback(message, isError = false) {
    registerMessage.textContent = message;
    registerMessage.classList.toggle('error', isError);
}

registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(registerForm));
    const errors = { fullName: !values.fullName.trim() ? 'Full name is required.' : '', username: !values.username.trim() ? 'Username is required.' : '', email: !/^\S+@\S+\.\S+$/.test(values.email) ? 'Enter a valid email.' : '', password: values.password.length < 6 ? 'Use at least 6 characters.' : '', confirmPassword: values.password !== values.confirmPassword ? 'Passwords do not match.' : '' };
    Object.entries(errors).forEach(([field, message]) => { document.getElementById(`${field}-error`).textContent = message; });
    if (Object.values(errors).some(Boolean)) return;
    const button = document.getElementById('register-button');
    button.disabled = true;
    registerFeedback('Creating your account...');
    try {
        const response = await fetch('/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        registerFeedback('Account created successfully. Redirecting to login...');
        setTimeout(() => { window.location.href = 'login.html'; }, 900);
    } catch (error) {
        registerFeedback(error.message || 'Unable to create the account.', true);
    } finally {
        button.disabled = false;
    }
});
