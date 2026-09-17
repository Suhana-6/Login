const profileForm = document.getElementById('profile-form');
const profileMessage = document.getElementById('form-message');

fetch('/api/profile').then(async (response) => {
    if (!response.ok) { window.location.href = 'login.html'; return; }
    const result = await response.json();
    const profile = result.profile;
    const values = { fullName: profile.full_name, username: profile.username, email: profile.email, phone: profile.phone, location: profile.location, qualification: profile.qualification, skills: profile.skills, workType: profile.work_type, experience: profile.experience };
    Object.entries(values).forEach(([name, value]) => {
        const field = document.getElementById(name);
        if (field) field.value = value || '';
    });
});

profileForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const response = await fetch('/api/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(profileForm))) });
    const result = await response.json();
    profileMessage.textContent = result.message;
    profileMessage.classList.toggle('error', !response.ok);
});

document.getElementById('logout-button').addEventListener('click', async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = 'login.html';
});
