const list = document.getElementById('applications-list');
async function loadApplications() {
    try { const response = await fetch('/api/applications', { credentials:'include' }); const result = await response.json(); if (!response.ok) return window.location.href = '/login.html'; list.innerHTML = result.applications.length ? result.applications.map(item => `<article class="application-item"><div><strong>${item.work_type}</strong><p class="muted">${item.experience_type || 'Application'}</p></div><span>${item.application_status}<br>${new Date(item.created_at).toLocaleDateString()}</span></article>`).join('') : '<p class="muted">You have not submitted an application yet.</p>'; } catch { list.innerHTML = '<p class="muted">Unable to load applications.</p>'; }
}
loadApplications();
