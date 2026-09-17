const form = document.querySelector('.work-form');
const jobRoles = ['Software Developer', 'Software Engineer', 'Web Developer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Java Developer', 'Python Developer', 'PHP Developer', 'JavaScript Developer', 'React Developer', 'Node.js Developer', '.NET Developer', 'C Developer', 'C++ Developer', 'Android Developer', 'Mobile App Developer', 'UI Developer', 'UI/UX Designer', 'Data Analyst', 'Data Scientist', 'Machine Learning Engineer', 'AI Engineer', 'Cloud Engineer', 'DevOps Engineer', 'Cybersecurity Engineer', 'Cybersecurity Analyst', 'Database Administrator', 'Network Engineer', 'System Administrator', 'IT Support Engineer', 'Technical Support Engineer', 'QA Engineer', 'Software Tester', 'Automation Tester', 'Business Analyst', 'IT Consultant', 'IT Project Manager', 'Other'];
const workOptions = ['Software Development', 'Web Development', 'Frontend Development', 'Backend Development', 'Full Stack Development', 'Mobile App Development', 'Android Development', 'iOS Development', 'UI/UX Design', 'Data Analytics', 'Data Science', 'Artificial Intelligence', 'Machine Learning', 'Deep Learning', 'Cloud Computing', 'Cloud Engineering', 'DevOps', 'Cybersecurity', 'Networking', 'Database Management', 'Software Testing', 'Automation Testing', 'Technical Support', 'IT Support', 'System Administration', 'IT Consulting', 'Business Analysis', 'IT Project Management', 'Research & Development', 'Remote IT Work', 'Other'];
const locations = ['Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul', 'Erode', 'Kallakurichi', 'Kancheepuram', 'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupattur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar', 'Ooty', 'Pollachi', 'Mettupalayam', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry', 'Any Location in Tamil Nadu', 'Remote', 'Hybrid'];
const salaryRanges = ['₹1,50,000 – ₹2,00,000 per annum', '₹2,00,000 – ₹2,50,000 per annum', '₹2,50,000 – ₹3,00,000 per annum', '₹3,00,000 – ₹3,50,000 per annum', '₹3,50,000 – ₹4,00,000 per annum', '₹4,00,000 – ₹5,00,000 per annum', '₹5,00,000 – ₹6,00,000 per annum', '₹6,00,000 – ₹8,00,000 per annum', '₹8,00,000 – ₹10,00,000 per annum', '₹10,00,000 – ₹12,00,000 per annum', '₹12,00,000 – ₹15,00,000 per annum', '₹15,00,000 – ₹20,00,000 per annum', '₹20,00,000+ per annum', 'Negotiable'];
const skillGroups = { 'Programming Languages': ['C', 'C++', 'Java', 'Python', 'JavaScript', 'TypeScript', 'PHP', 'C#', 'Kotlin', 'Swift', 'Go', 'Rust', 'Ruby', 'Dart', 'R', 'MATLAB'], 'Web Technologies': ['HTML', 'CSS', 'Bootstrap', 'Tailwind CSS', 'React.js', 'Angular', 'Vue.js', 'Node.js', 'Express.js', 'Next.js', 'jQuery'], Database: ['MySQL', 'PostgreSQL', 'MongoDB', 'Oracle', 'SQL Server', 'SQLite', 'Firebase', 'Redis'], Frameworks: ['Spring', 'Spring Boot', 'Django', 'Flask', 'Laravel', 'CodeIgniter', 'ASP.NET', '.NET', 'Flutter', 'React Native'], 'AI & Data': ['Artificial Intelligence', 'Machine Learning', 'Deep Learning', 'Data Science', 'Data Analytics', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'OpenCV', 'Natural Language Processing'], 'Cloud & DevOps': ['AWS', 'Microsoft Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'Git', 'GitHub', 'GitLab', 'CI/CD'], 'Other Technical Skills': ['REST API', 'API Integration', 'Cybersecurity', 'Networking', 'Linux', 'Windows Server', 'Software Testing', 'Selenium', 'Figma', 'Agile', 'Scrum'] };
const message = document.getElementById('form-message');

function replaceWithSelect(input, options, placeholder) {
    if (!input) return input;
    if (input.tagName === 'SELECT') {
        input.replaceChildren(new Option(placeholder, ''));
        options.forEach((option) => input.add(new Option(option, option)));
        return input;
    }
    const select = document.createElement('select');
    Array.from(input.attributes).forEach((attribute) => select.setAttribute(attribute.name, attribute.value));
    select.innerHTML = `<option value="">${placeholder}</option>`;
    options.forEach((option) => select.add(new Option(option, option)));
    input.replaceWith(select);
    return select;
}

function addJobName() {
    if (form.elements.jobName) return;
    const workField = form.elements.workType.closest('div');
    const field = document.createElement('div');
    field.innerHTML = '<label for="jobName">Job Name</label><select id="jobName" name="jobName" required><option value="">Select job name</option></select>';
    const select = field.querySelector('select');
    jobRoles.forEach((role) => select.add(new Option(role, role)));
    workField.parentNode.insertBefore(field, workField);
}

function addSkillsField() {
    const source = form.elements.skills || form.elements.primarySkill;
    if (!source || source.closest('.multi-select')) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'multi-select';
    const select = document.createElement('select');
    select.name = 'technicalSkills'; select.multiple = true; select.className = 'multi-select-native';
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'multi-select-button'; button.textContent = 'Select technical skills';
    const panel = document.createElement('div'); panel.className = 'multi-select-panel';
    Object.entries(skillGroups).forEach(([groupName, values]) => {
        const group = document.createElement('div'); group.className = 'multi-select-group';
        const heading = document.createElement('strong'); heading.textContent = groupName; group.appendChild(heading);
        values.forEach((value) => {
            const label = document.createElement('label'); const checkbox = document.createElement('input');
            checkbox.type = 'checkbox'; checkbox.value = value;
            checkbox.addEventListener('change', () => {
                let option = Array.from(select.options).find((item) => item.value === value);
                if (!option) { option = new Option(value, value); select.appendChild(option); }
                option.selected = checkbox.checked;
                const selected = Array.from(select.selectedOptions).map((item) => item.value);
                button.textContent = selected.join(', ') || 'Select technical skills';
                button.classList.toggle('has-selection', selected.length > 0);
            });
            label.append(checkbox, document.createTextNode(value)); group.appendChild(label);
        });
        panel.appendChild(group);
    });
    wrapper.append(select, button, panel);
    if (source.name === 'primarySkill') source.closest('div').parentNode.insertBefore(wrapper, source.closest('div').nextSibling);
    else source.replaceWith(wrapper);
    button.addEventListener('click', () => wrapper.classList.toggle('open'));
}

function updateSectionHeadings() {
    const headings = form.querySelectorAll('h2');
    if (headings[0]) headings[0].textContent = 'Personal Information';
    if (headings[1]) headings[1].textContent = 'Career Information';
    if (headings[2]) headings[2].textContent = 'Job Preferences';
}

addJobName();
replaceWithSelect(form.elements.workType, workOptions, 'Select preferred IT work');
const locationSelect = replaceWithSelect(form.elements.location, locations, 'Select district or state');
locationSelect.setAttribute('aria-label', 'Location district or state');
const preferredLocationSelect = replaceWithSelect(form.elements.preferredLocation, locations, 'Select preferred district or state');
preferredLocationSelect.setAttribute('aria-label', 'Preferred location district or state');
replaceWithSelect(form.elements.expectedSalary, salaryRanges, 'Select expected salary');
addSkillsField();
updateSectionHeadings();

fetch('/api/session').then((response) => { if (!response.ok) window.location.href = 'login.html'; });

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const button = form.querySelector('button[type="submit"]');
    const payload = Object.fromEntries(new FormData(form));
    payload.skills = Array.from(form.elements.technicalSkills?.selectedOptions || []).map((option) => option.value).join(', ');
    payload.jobName = payload.jobName || '';
    payload.technicalSkills = payload.skills;
    payload.preferredITWork = payload.workType || '';
    payload.preferredLocation = payload.preferredLocation || '';
    payload.expectedSalary = payload.expectedSalary || '';
    button.disabled = true; message.classList.remove('error'); message.textContent = 'Saving your application...';
    try {
        const response = await fetch(form.dataset.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(payload) });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Unable to save your application.');
        message.textContent = result.message || 'Application submitted successfully.'; form.reset();
    } catch (error) { message.textContent = error.message; message.classList.add('error'); } finally { button.disabled = false; }
});

document.addEventListener('click', (event) => document.querySelectorAll('.multi-select.open').forEach((wrapper) => { if (!wrapper.contains(event.target)) wrapper.classList.remove('open'); }));

form.addEventListener('reset', () => {
    form.querySelectorAll('.multi-select-panel input[type="checkbox"]').forEach((checkbox) => { checkbox.checked = false; });
    form.querySelectorAll('.multi-select-button').forEach((button) => {
        button.textContent = 'Select technical skills';
        button.classList.remove('has-selection');
    });
});
