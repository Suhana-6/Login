const roles = ['Software Developer','Web Developer','Front-End Developer','Back-End Developer','Full Stack Developer','Python Developer','Java Developer','PHP Developer','.NET Developer','Mobile App Developer','UI/UX Designer','Data Analyst','Data Scientist','Machine Learning Engineer','AI Engineer','Cloud Engineer','DevOps Engineer','Cyber Security Analyst','Database Administrator','Software Tester','QA Engineer','Technical Support','IT Support','Network Engineer','System Administrator','Business Analyst'];
const form = document.querySelector('.work-form');
const select = document.getElementById('workType');
const message = document.getElementById('form-message');
if (select) select.innerHTML = '<option value="">Select an IT work type</option>' + roles.map(role => `<option>${role}</option>`).join('');
async function ensureSession() { const response = await fetch('/api/session', { credentials:'include' }); const result = await response.json(); if (!result.authenticated) window.location.href = '/login.html'; }
ensureSession();
form?.addEventListener('submit', async (event) => {
    event.preventDefault(); if (!form.checkValidity()) { form.reportValidity(); return; }
    const button = form.querySelector('button'); button.disabled = true; message.textContent = 'Submitting your application...'; message.classList.remove('error');
    try { const response = await fetch(form.dataset.endpoint, { method:'POST', headers:{'Content-Type':'application/json'}, credentials:'include', body:JSON.stringify(Object.fromEntries(new FormData(form))) }); const result = await response.json(); if (!response.ok) throw new Error(result.message); message.textContent = result.message; setTimeout(() => { window.location.href = '/applications.html'; }, 700); } catch (error) { message.textContent = error instanceof TypeError ? 'Server is not running. Please start the Node.js server.' : error.message; message.classList.add('error'); } finally { button.disabled = false; }
});
