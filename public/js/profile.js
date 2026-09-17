const form = document.getElementById('profile-form');
const message = document.getElementById('form-message');
function show(text, error = false) { message.textContent = text; message.classList.toggle('error', error); }
async function loadProfile() {
    try { const response = await fetch('/api/profile', { credentials:'include' }); const result = await response.json(); if (!response.ok) return window.location.href = '/login.html'; const profile = result.profile || {}; const fieldMap = { full_name: 'fullName', work_type: 'workType' }; Object.entries(profile).forEach(([key, value]) => { const field = document.getElementById(fieldMap[key] || key); if (field && value !== null) field.value = value; }); } catch { window.location.href = '/login.html'; }
}
form?.addEventListener('submit', async (event) => { event.preventDefault(); try { const response = await fetch('/api/profile', { method:'PUT', headers:{'Content-Type':'application/json'}, credentials:'include', body:JSON.stringify(Object.fromEntries(new FormData(form))) }); const result = await response.json(); if (!response.ok) throw new Error(result.message); show(result.message); } catch (error) { show(error.message || 'Unable to update your profile.', true); } });
loadProfile();
