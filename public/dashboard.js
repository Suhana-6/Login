async function requireSession() {
    const response = await fetch('/api/session');
    if (!response.ok) {
        window.location.href = 'login.html';
        return null;
    }
    return response.json();
}

async function loadApplications() {
    const response = await fetch('/api/applications');
    const result = await response.json();
    const list = document.getElementById('applications-list');
    document.getElementById('application-count').textContent = `${result.applications?.length || 0} records`;
    if (!result.applications?.length) {
        list.innerHTML = '<p class="muted">Your submitted applications will appear here.</p>';
        return;
    }
    list.innerHTML = result.applications.map((application) => `<div class="application-item"><strong>${application.work_type}</strong><span>Application</span><span class="status">${application.application_status}</span><span>${new Date(application.created_at).toLocaleDateString('en-GB')}</span></div>`).join('');
}

document.getElementById('logout-button').addEventListener('click', async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = 'login.html';
});
document.getElementById('nav-toggle')?.addEventListener('click', () => document.getElementById('app-nav').classList.toggle('is-open'));
requireSession().then((result) => {
    if (result) {
        document.getElementById('user-name').textContent = result.user.fullName;
        loadApplications();
    }
});
