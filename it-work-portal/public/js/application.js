const jobRoles = [
  'Software Developer', 'Software Engineer', 'Web Developer', 'Frontend Developer',
  'Backend Developer', 'Full Stack Developer', 'Java Developer', 'Python Developer',
  'PHP Developer', 'JavaScript Developer', 'React Developer', 'Node.js Developer',
  '.NET Developer', 'C Developer', 'C++ Developer', 'Android Developer', 'Mobile App Developer',
  'UI Developer', 'UI/UX Designer', 'UX Designer', 'Data Analyst', 'Data Scientist',
  'Machine Learning Engineer', 'AI Engineer', 'Cloud Engineer', 'DevOps Engineer',
  'Cybersecurity Engineer', 'Cybersecurity Analyst', 'Database Administrator', 'Network Engineer',
  'System Administrator', 'IT Support Engineer', 'Technical Support Engineer', 'QA Engineer',
  'Software Tester', 'Automation Tester', 'Business Analyst', 'IT Consultant',
  'IT Project Coordinator', 'IT Project Manager', 'Other'
];

const preferredWork = [
  'Software Development', 'Web Development', 'Frontend Development', 'Backend Development',
  'Full Stack Development', 'Mobile App Development', 'Android Development', 'iOS Development',
  'UI/UX Design', 'Data Analytics', 'Data Science', 'Artificial Intelligence', 'Machine Learning',
  'Deep Learning', 'Cloud Computing', 'Cloud Engineering', 'DevOps', 'Cybersecurity', 'Networking',
  'Database Administration', 'Software Testing', 'Automation Testing', 'Technical Support',
  'IT Support', 'System Administration', 'IT Consulting', 'Business Analysis',
  'IT Project Management', 'Research & Development', 'Remote IT Work', 'Other'
];

const locations = [
  'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri',
  'Dindigul', 'Erode', 'Kallakurichi', 'Kancheepuram', 'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai',
  'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai',
  'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur', 'Theni',
  'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupattur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai',
  'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar', 'Andhra Pradesh', 'Arunachal Pradesh',
  'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
  'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry', 'Remote', 'Hybrid',
  'Any Location in Tamil Nadu', 'Other State in India'
];

const salaryRanges = [
  '₹1,50,000 – ₹2,00,000 per annum', '₹2,00,000 – ₹2,50,000 per annum',
  '₹2,50,000 – ₹3,00,000 per annum', '₹3,00,000 – ₹3,50,000 per annum',
  '₹3,50,000 – ₹4,00,000 per annum', '₹4,00,000 – ₹5,00,000 per annum',
  '₹5,00,000 – ₹6,00,000 per annum', '₹6,00,000 – ₹8,00,000 per annum',
  '₹8,00,000 – ₹10,00,000 per annum', '₹10,00,000 – ₹12,00,000 per annum',
  '₹12,00,000 – ₹15,00,000 per annum', '₹15,00,000 – ₹20,00,000 per annum',
  '₹20,00,000+ per annum', 'Negotiable'
];

const skillGroups = {
  'PROGRAMMING LANGUAGES': ['C', 'C++', 'Java', 'Python', 'JavaScript', 'TypeScript', 'PHP', 'C#', 'Kotlin', 'Swift', 'Go', 'Rust', 'Ruby', 'Dart', 'R', 'MATLAB'],
  'WEB TECHNOLOGIES': ['HTML', 'CSS', 'Bootstrap', 'Tailwind CSS', 'JavaScript', 'React.js', 'Angular', 'Vue.js', 'Node.js', 'Express.js', 'Next.js', 'jQuery'],
  DATABASE: ['MySQL', 'PostgreSQL', 'MongoDB', 'Oracle', 'SQL Server', 'SQLite', 'Firebase', 'Redis'],
  'FRAMEWORKS & LIBRARIES': ['Spring', 'Spring Boot', 'Django', 'Flask', 'Laravel', 'CodeIgniter', 'ASP.NET', '.NET', 'Flutter', 'React Native'],
  'AI / DATA': ['Artificial Intelligence', 'Machine Learning', 'Deep Learning', 'Data Science', 'Data Analytics', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'OpenCV', 'NLP'],
  'CLOUD & DEVOPS': ['AWS', 'Microsoft Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'Git', 'GitHub', 'GitLab', 'CI/CD'],
  'OTHER TECHNICAL SKILLS': ['REST API', 'API Integration', 'Cybersecurity', 'Networking', 'Linux', 'Windows Server', 'Software Testing', 'Selenium', 'Figma', 'Agile', 'Scrum']
};

const skills = Object.values(skillGroups).flat();

function populateOptions() {
  document.querySelectorAll('select[data-options]').forEach((select) => {
    const optionType = select.dataset.options;
    select.querySelectorAll('option:not([value=""])').forEach((option) => option.remove());

    if (optionType === 'skills') {
      Object.entries(skillGroups).forEach(([groupName, groupSkills]) => {
        const group = document.createElement('optgroup');
        group.label = groupName;
        groupSkills.forEach((value) => {
          const option = document.createElement('option');
          option.value = value;
          option.textContent = value;
          group.appendChild(option);
        });
        select.appendChild(group);
      });
      return;
    }

    const options = { jobRoles, preferredWork, locations, salaryRanges }[optionType] || [];
    options.forEach((value) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  });
}

function enhanceMultiSelect(select) {
  const wrapper = document.createElement('div');
  wrapper.className = 'multi-select';
  select.parentNode.insertBefore(wrapper, select);
  wrapper.appendChild(select);

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'multi-select-button';
  button.setAttribute('aria-haspopup', 'listbox');
  button.setAttribute('aria-expanded', 'false');
  wrapper.appendChild(button);

  const panel = document.createElement('div');
  panel.className = 'multi-select-panel';
  panel.setAttribute('role', 'listbox');
  panel.setAttribute('aria-multiselectable', 'true');
  wrapper.appendChild(panel);

  const updateButton = () => {
    const selected = Array.from(select.selectedOptions).map((option) => option.value);
    button.textContent = selected.length ? selected.join(', ') : 'Select technical skills';
    button.title = selected.join(', ');
    button.classList.toggle('has-selection', selected.length > 0);
  };

  Array.from(select.children).forEach((group) => {
    if (group.tagName !== 'OPTGROUP') return;
    const groupElement = document.createElement('div');
    groupElement.className = 'multi-select-group';
    const title = document.createElement('strong');
    title.textContent = group.label;
    groupElement.appendChild(title);
    Array.from(group.children).forEach((option) => {
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = option.value;
      checkbox.addEventListener('change', () => {
        option.selected = checkbox.checked;
        updateButton();
      });
      label.append(checkbox, document.createTextNode(option.textContent));
      groupElement.appendChild(label);
    });
    panel.appendChild(groupElement);
  });

  button.addEventListener('click', () => {
    const isOpen = wrapper.classList.toggle('open');
    button.setAttribute('aria-expanded', String(isOpen));
  });

  updateButton();
  select.classList.add('multi-select-native');
}

function showMessage(form, message, isError = false) {
  const messageElement = form.querySelector('.form-message');
  messageElement.textContent = message;
  messageElement.classList.toggle('error', isError);
}

function validateForm(form) {
  form.querySelectorAll('.field-error').forEach((element) => element.remove());
  const invalidFields = [];

  form.querySelectorAll('[required]').forEach((field) => {
    const value = field.multiple
      ? Array.from(field.selectedOptions).map((option) => option.value).filter(Boolean)
      : field.value.trim();
    if (!value.length) {
      invalidFields.push(field);
    }
  });

  const email = form.elements.email;
  if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    invalidFields.push(email);
  }

  const phone = form.elements.phone;
  if (phone && phone.value && !/^[0-9+()\s-]{7,20}$/.test(phone.value.trim())) {
    invalidFields.push(phone);
  }

  [...new Set(invalidFields)].forEach((field) => {
    const error = document.createElement('small');
    error.className = 'field-error';
    error.textContent = field === email ? 'Enter a valid email address.' : field === phone ? 'Enter a valid phone number.' : 'This field is required.';
    field.insertAdjacentElement('afterend', error);
  });

  return invalidFields.length === 0;
}

async function submitApplication(form) {
  if (!validateForm(form)) {
    showMessage(form, 'Please correct the highlighted fields.', true);
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());
  payload.skills = Array.from(form.elements.skills.selectedOptions).map((option) => option.value).join(', ');
  payload.work_type = payload.preferred_work;
  payload.jobName = payload.job_role;
  payload.technicalSkills = payload.skills;
  payload.preferredITWork = payload.preferred_work;
  payload.preferredLocation = payload.preferred_location;
  payload.expectedSalary = payload.expected_salary || '';

  submitButton.disabled = true;
  showMessage(form, 'Submitting your application...');

  try {
    const endpoint = form.id === 'fresher-form' ? '/api/fresher' : '/api/experienced';
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (response.status === 401) {
      window.location.href = '/login.html';
      return;
    }
    showMessage(form, result.message || (response.ok ? 'Application submitted successfully.' : 'Unable to submit application.'), !response.ok);
    if (response.ok) form.reset();
  } catch (error) {
    showMessage(form, 'Unable to connect to server. Please try again.', true);
  } finally {
    submitButton.disabled = false;
  }
}

populateOptions();
function initializeApplicationForms() {
  populateOptions();
  document.querySelectorAll('select[data-options="skills"]').forEach(enhanceMultiSelect);
  document.querySelectorAll('#fresher-form, #experienced-form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      submitApplication(form);
    });
    form.addEventListener('reset', () => {
      form.querySelectorAll('.multi-select-panel input').forEach((checkbox) => {
        checkbox.checked = false;
      });
      form.querySelectorAll('.multi-select-button').forEach((button) => {
        button.textContent = 'Select technical skills';
        button.title = '';
        button.classList.remove('has-selection');
      });
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApplicationForms);
} else {
  initializeApplicationForms();
}

document.addEventListener('click', (event) => {
  document.querySelectorAll('.multi-select.open').forEach((wrapper) => {
    if (!wrapper.contains(event.target)) {
      wrapper.classList.remove('open');
      wrapper.querySelector('.multi-select-button').setAttribute('aria-expanded', 'false');
    }
  });
});
