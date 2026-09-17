async function loadProfile() {
  try {
    const response = await fetch('/api/profile', { credentials: 'include' });

    if (!response.ok) {
      window.location.href = '/login.html';
      return;
    }

    const result = await response.json();

    if (result.profile) {
      document.getElementById('profile-full-name').textContent = result.profile.full_name || '-';
      document.getElementById('profile-username').textContent = result.profile.username || '-';
      document.getElementById('profile-email').textContent = result.profile.email || '-';
    }
  } catch (error) {
    window.location.href = '/login.html';
  }
}

const logoutButton = document.getElementById('logout-button');

if (logoutButton) {
  logoutButton.addEventListener('click', async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
      window.location.href = '/login.html';
    } catch (error) {
      window.location.href = '/login.html';
    }
  });
}

loadProfile();
