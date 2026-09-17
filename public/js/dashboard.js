async function loadDashboard() {
    const name = document.getElementById('user-name');
    try { const response = await fetch('/api/session', { credentials:'include' }); const result = await response.json(); if (!result.authenticated) return window.location.href = '/login.html'; name.textContent = result.user.fullName || result.user.username; loadApplications(); } catch { window.location.href = '/login.html'; }
}
async function loadApplications() {
    const list = document.getElementById('applications-list');
    if (!list) return;
    try { const response = await fetch('/api/applications', { credentials:'include' }); const result = await response.json(); if (!response.ok) throw new Error(result.message); document.getElementById('application-count').textContent = `${result.applications.length} records`; list.innerHTML = result.applications.length ? result.applications.map(item => `<article class="application-item"><strong>${item.work_type}</strong><span>${item.experience_type || 'Application'} · ${item.application_status}</span></article>`).join('') : '<p class="muted">No applications submitted yet.</p>'; } catch { list.innerHTML = '<p class="muted">Unable to load applications.</p>'; }
}
document.getElementById('logout-button')?.addEventListener('click', async () => { await fetch('/api/logout', { method:'POST', credentials:'include' }); window.location.href = '/login.html'; });
loadDashboard();
