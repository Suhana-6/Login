async function checkSession() {
  try {
    const response = await fetch('/api/session', { credentials: 'include' });

    if (!response.ok) {
      window.location.href = '/login.html';
      return;
    }

    const result = await response.json();

    if (result.user && result.user.full_name) {
      const nameElement = document.getElementById('user-name');
      if (nameElement) {
        nameElement.textContent = 'Welcome, ' + result.user.full_name;
      }
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

checkSession();
