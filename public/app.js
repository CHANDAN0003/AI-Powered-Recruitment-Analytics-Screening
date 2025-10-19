// REMOVED: legacy file neutralized. This file has been disabled and is no longer used by the project.
// If you need it removed from the repository entirely, run a git rm or delete it locally.

// Authentication Functions
function checkAuthState() {
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('authToken');
    
    if (storedUser && storedToken) {
        currentUser = JSON.parse(storedUser);
        authToken = storedToken;
        
        // Redirect if on login page but already authenticated
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage === 'index.html' || currentPage === '') {
            redirectToDashboard(currentUser.role);
        }
    }
}

function checkAuth(requiredRole) {
    if (!currentUser || !authToken) {
        showToast('Please log in to access this page', 'error');
        window.location.href = 'index.html';
        return false;
    }
    
    if (requiredRole && currentUser.role !== requiredRole) {
        showToast('Access denied. Insufficient permissions.', 'error');
        window.location.href = 'index.html';
        return false;
    }
    
    return true;
}

function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    currentUser = null;
    authToken = null;
    
    showToast('Logged out successfully', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

function redirectToDashboard(role) {
    const targetPage = role === 'candidate' ? 'candidate.html' : 'hr.html';
    window.location.href = targetPage;
}

// Login Page Functions
function initializeLoginPage() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Demo credential click handlers
    const demoCredentials = document.querySelectorAll('.demo-credentials div');
    demoCredentials.forEach(div => {
        div.addEventListener('click', function() {
            const text = this.querySelector('span').textContent;
            const [email, password] = text.split(' / ');
            
            document.getElementById('email').value = email;
            document.getElementById('password').value = password;
            
            // Set the appropriate role
            const role = email.includes('candidate') ? 'candidate' : 'hr';
            document.querySelector(`input[name="role"][value="${role}"]`).checked = true;
            
            showToast('Demo credentials filled', 'info');
        });
    });
}

async function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const loginData = {
        email: formData.get('email'),
        password: formData.get('password'),
        role: formData.get('role')
    };
    
    const loginBtn = document.getElementById('loginBtn');
    const btnText = loginBtn.querySelector('.btn-text');
    const spinner = document.getElementById('loginSpinner');
    
    // Show loading state
    btnText.textContent = 'Signing In...';
    spinner.style.display = 'inline-block';
    loginBtn.disabled = true;
    
    try {
        // Simulate API call (replace with actual endpoint)
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData)
        });
        
        let result;
        if (response.ok) {
            result = await response.json();
        } else {
            // Demo login logic for development
            if ((loginData.email === 'candidate@demo.com' && loginData.password === 'demo123' && loginData.role === 'candidate') ||
                (loginData.email === 'hr@demo.com' && loginData.password === 'demo123' && loginData.role === 'hr')) {
                
                result = {
                    success: true,
                    // REMOVED: legacy file neutralized. This file has been disabled and is no longer used by the project.
                    // If you need it removed from the repository entirely, run a git rm or delete it locally.
            
            setTimeout(() => {
                redirectToDashboard(currentUser.role);
            }, 1500);
        } else {
            throw new Error(result.message || 'Login failed');
        }
        
    } catch (error) {
        console.error('Login error:', error);
        showToast(error.message || 'Login failed. Please check your credentials.', 'error');
    } finally {
        // Reset button state
        btnText.textContent = 'Sign In';
        spinner.style.display = 'none';
        loginBtn.disabled = false;
    }
}

// Candidate Page Functions
function initializeCandidatePage() {
    if (!checkAuth('candidate')) return;
    
    loadJobListings();
    setupJobSearch();
    initializeChatbot();
}

async function loadJobListings() {
    const jobsGrid = document.getElementById('jobsGrid');
    const loadingState = document.getElementById('jobsLoading');
    
    if (!jobsGrid) return;
    
    try {
        loadingState.style.display = 'block';
        jobsGrid.style.display = 'none';
        
        const response = await fetch('/api/jobs', {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        let jobs;
        if (response.ok) {
            jobs = await response.json();
        } else {
            // Use mock data for demo
            jobs = generateMockJobs();
        }
        
        displayJobs(jobs);
        
    } catch (error) {
        console.error('Error loading jobs:', error);
        // Use mock data as fallback
        displayJobs(generateMockJobs());
    } finally {
        loadingState.style.display = 'none';
        jobsGrid.style.display = 'grid';
    }
}

function generateMockJobs() {
    return [
        {
            id: 1,
            title: 'Frontend Developer',
            company: 'TechCorp Inc.',
            location: 'San Francisco, CA',
            description: 'We are looking for a passionate Frontend Developer to join our team. You will be responsible for building user-facing features using modern JavaScript frameworks.',
            skills: ['JavaScript', 'React', 'CSS', 'HTML'],
            salary: '$80,000 - $120,000',
            type: 'Full-time',
            experience: 'Mid Level'
        },
        {
            id: 2,
            title: 'Backend Developer',
            company: 'DataSoft Solutions',
            location: 'Austin, TX',
            description: 'Join our backend team to design and implement robust server-side applications. Experience with cloud technologies is a plus.',
            skills: ['Python', 'Django', 'PostgreSQL', 'AWS'],
            salary: '$90,000 - $130,000',
            type: 'Full-time',
            experience: 'Senior Level'
        },
        {
            id: 3,
            title: 'Full Stack Developer',
            company: 'Innovation Labs',
            location: 'Remote',
            description: 'Looking for a versatile Full Stack Developer who can work on both frontend and backend technologies. Great opportunity for growth.',
            skills: ['Node.js', 'React', 'MongoDB', 'Express'],
            salary: '$75,000 - $110,000',
            type: 'Remote',
            experience: 'Mid Level'
        },
        {
            id: 4,
            title: 'UI/UX Designer',
            company: 'Design Studio Pro',
            location: 'New York, NY',
            description: 'Creative UI/UX Designer needed to create beautiful and intuitive user experiences. Portfolio review required.',
            skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping'],
            salary: '$70,000 - $100,000',
            type: 'Full-time',
            experience: 'Mid Level'
        },
        {
            id: 5,
            title: 'Data Analyst',
            company: 'Analytics Corp',
            location: 'Chicago, IL',
            description: 'Analyze complex datasets to drive business insights. Experience with machine learning is preferred.',
            skills: ['Python', 'SQL', 'Pandas', 'Tableau'],
            salary: '$65,000 - $95,000',
            type: 'Full-time',
            experience: 'Entry Level'
        },
        {
            id: 6,
            title: 'DevOps Engineer',
            company: 'CloudTech Systems',
            location: 'Seattle, WA',
            description: 'Manage and optimize our cloud infrastructure. Experience with containerization and CI/CD pipelines required.',
            skills: ['Docker', 'Kubernetes', 'Jenkins', 'AWS'],
            salary: '$95,000 - $140,000',
            type: 'Full-time',
            experience: 'Senior Level'
        }
    ];
}

function displayJobs(jobs) {
    const jobsGrid = document.getElementById('jobsGrid');
    if (!jobsGrid) return;
    
    jobsGrid.innerHTML = jobs.map(job => `
        <div class="job-card fade-in">
            <div class="job-header">
                <h3 class="job-title">${job.title}</h3>
                <div class="job-company">
                    <i class="fas fa-building"></i>
                    ${job.company}
                </div>
                <div class="job-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${job.location}
                </div>
            </div>
            
            <p class="job-description">${job.description}</p>
            
            <div class="job-skills">
                <h4>Required Skills</h4>
                <div class="skills-list">
                    ${job.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
            
            <div class="job-meta">
                <span class="job-salary">${job.salary}</span>
                <span class="job-type">${job.type}</span>
            </div>
            
            <button class="apply-btn" onclick="openApplicationModal(${job.id})">
                <i class="fas fa-paper-plane"></i>
                Apply Now
            </button>
        </div>
    `).join('');
}

function setupJobSearch() {
    const searchInput = document.getElementById('jobSearch');
    const experienceFilter = document.getElementById('experienceFilter');
    const skillsFilter = document.getElementById('skillsFilter');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterJobs);
    }
    
    if (experienceFilter) {
        experienceFilter.addEventListener('change', filterJobs);
    }
    
    if (skillsFilter) {
        skillsFilter.addEventListener('change', filterJobs);
    }
}

function filterJobs() {
    const searchTerm = document.getElementById('jobSearch')?.value.toLowerCase() || '';
    const experienceLevel = document.getElementById('experienceFilter')?.value || '';
    const skillFilter = document.getElementById('skillsFilter')?.value.toLowerCase() || '';
    
    const jobCards = document.querySelectorAll('.job-card');
    
    jobCards.forEach(card => {
        const title = card.querySelector('.job-title')?.textContent.toLowerCase() || '';
        const company = card.querySelector('.job-company')?.textContent.toLowerCase() || '';
        const description = card.querySelector('.job-description')?.textContent.toLowerCase() || '';
        const skills = Array.from(card.querySelectorAll('.skill-tag')).map(tag => tag.textContent.toLowerCase());
        
        const matchesSearch = !searchTerm || 
            title.includes(searchTerm) || 
            company.includes(searchTerm) || 
            description.includes(searchTerm) ||
            skills.some(skill => skill.includes(searchTerm));
        
        const matchesSkill = !skillFilter || skills.some(skill => skill.includes(skillFilter));
        
        // For experience filtering, you'd need to store experience data in the card
        const matchesExperience = !experienceLevel; // Simplified for demo
        
        if (matchesSearch && matchesSkill && matchesExperience) {
            card.style.display = 'block';
            card.classList.add('fade-in');
        } else {
            card.style.display = 'none';
        }
    });
}

function openApplicationModal(jobId) {
    const modal = document.getElementById('applicationModal');
    const jobIdInput = document.getElementById('jobId');
    
    if (modal && jobIdInput) {
        jobIdInput.value = jobId;
        modal.classList.add('active');
        
        // Pre-fill user email if available
        const emailInput = document.getElementById('applicantEmail');
        if (emailInput && currentUser) {
            emailInput.value = currentUser.email;
        }
        
        // Setup form submission
        const applicationForm = document.getElementById('applicationForm');
        if (applicationForm) {
            applicationForm.onsubmit = handleJobApplication;
        }
    }
}

function closeApplicationModal() {
    const modal = document.getElementById('applicationModal');
    if (modal) {
        modal.classList.remove('active');
        
        // Reset form
        const form = document.getElementById('applicationForm');
        if (form) {
            form.reset();
        }
    }
}

async function handleJobApplication(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const applicationData = {
        jobId: formData.get('jobId'),
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        experience: formData.get('experience'),
        skills: formData.get('skills'),
        coverLetter: formData.get('coverLetter'),
        resume: formData.get('resume') // File will need special handling
    };
    
    const submitBtn = document.getElementById('submitApplicationBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const spinner = document.getElementById('applicationSpinner');
    
    // Show loading state
    btnText.textContent = 'Submitting...';
    spinner.style.display = 'inline-block';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('/api/apply', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(applicationData)
        });
        
        let result;
        if (response.ok) {
            result = await response.json();
        } else {
            // Simulate success for demo
            await new Promise(resolve => setTimeout(resolve, 2000));
            result = { success: true, message: 'Application submitted successfully!' };
        }
        
        if (result.success) {
            showToast('Application submitted successfully! We will review it and get back to you.', 'success');
            closeApplicationModal();
        } else {
            throw new Error(result.message || 'Application submission failed');
        }
        
    } catch (error) {
        console.error('Application error:', error);
        showToast(error.message || 'Failed to submit application. Please try again.', 'error');
    } finally {
        // Reset button state
        btnText.textContent = 'Submit Application';
        spinner.style.display = 'none';
        submitBtn.disabled = false;
    }
}

// HR Page Functions  
function initializeHRPage() {
    if (!checkAuth('hr')) return;
    
    loadDashboardStats();
    loadApplicantsList();
}

async function loadDashboardStats() {
    try {
        const response = await fetch('/api/dashboard', {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        let stats;
        if (response.ok) {
            stats = await response.json();
        } else {
            // Use mock data for demo
            stats = {
                totalApplicants: 156,
                recentApplicants: 23,
                eligibleApplicants: 89,
                conversionRate: 57
            };
        }
        
        updateDashboardStats(stats);
        
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
        // Use mock data as fallback
        updateDashboardStats({
            totalApplicants: 156,
            recentApplicants: 23,
            eligibleApplicants: 89,
            conversionRate: 57
        });
    }
}

function updateDashboardStats(stats) {
    const elements = {
        totalApplicants: document.getElementById('totalApplicants'),
        recentApplicants: document.getElementById('recentApplicants'),
        eligibleApplicants: document.getElementById('eligibleApplicants'),
        conversionRate: document.getElementById('conversionRate')
    };
    
    Object.keys(elements).forEach(key => {
        if (elements[key]) {
            if (key === 'conversionRate') {
                elements[key].textContent = stats[key] + '%';
            } else {
                elements[key].textContent = stats[key];
            }
        }
    });
}

async function loadApplicantsList() {
    try {
        const response = await fetch('/api/applicants', {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        let applicants;
        if (response.ok) {
            applicants = await response.json();
        } else {
            // Use mock data for demo
            applicants = generateMockApplicants();
        }
        
        displayApplicants(applicants);
        
    } catch (error) {
        console.error('Error loading applicants:', error);
        displayApplicants(generateMockApplicants());
    }
}

function generateMockApplicants() {
    const mockApplicants = [];
    const names = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown'];
    const positions = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'UI/UX Designer'];
    const skills = [
        ['JavaScript', 'React', 'CSS'],
        ['Python', 'Django', 'PostgreSQL'],
        ['Node.js', 'MongoDB', 'Express'],
        ['Figma', 'Adobe XD', 'Sketch']
    ];
    const statuses = ['new', 'reviewed', 'shortlisted', 'rejected'];
    
    for (let i = 0; i < 15; i++) {
        mockApplicants.push({
            id: i + 1,
            name: names[i % names.length] + ` ${i + 1}`,
            email: `applicant${i + 1}@email.com`,
            position: positions[i % positions.length],
            skills: skills[i % skills.length],
            experience: ['0-1', '2-5', '5-10'][i % 3] + ' years',
            status: statuses[i % statuses.length],
            appliedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            resume: 'resume.pdf'
        });
    }
    
    return mockApplicants;
}

function displayApplicants(applicants) {
    const tableBody = document.getElementById('applicantsTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = applicants.map(applicant => `
        <tr>
            <td><input type="checkbox" class="applicant-checkbox" data-id="${applicant.id}"></td>
            <td>
                <div class="applicant-name">
                    <strong>${applicant.name}</strong>
                </div>
            </td>
            <td>${applicant.email}</td>
            <td><span class="position-badge">${applicant.position}</span></td>
            <td>
                <div class="skills-list">
                    ${applicant.skills.slice(0, 2).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    ${applicant.skills.length > 2 ? `<span class="skill-more">+${applicant.skills.length - 2}</span>` : ''}
                </div>
            </td>
            <td>${applicant.experience}</td>
            <td><span class="status-badge status-${applicant.status}">${applicant.status}</span></td>
            <td>${applicant.appliedDate}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon" onclick="viewApplicant(${applicant.id})" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" onclick="downloadResume(${applicant.id})" title="Download Resume">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

async function sendPersonalizedEmails() {
    const selectedApplicants = getSelectedApplicants();
    
    if (selectedApplicants.length === 0) {
        showToast('Please select applicants to send emails to', 'warning');
        return;
    }
    
    const btn = document.getElementById('sendEmailsBtn');
    const btnText = btn.querySelector('.btn-text');
    const spinner = document.getElementById('emailSpinner');
    
    btnText.textContent = 'Sending Emails...';
    spinner.style.display = 'inline-block';
    btn.disabled = true;
    
    try {
        const response = await fetch('/api/send_email', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                applicantIds: selectedApplicants
            })
        });
        
        let result;
        if (response.ok) {
            result = await response.json();
        } else {
            // Simulate success for demo
            await new Promise(resolve => setTimeout(resolve, 2000));
            result = { success: true, message: 'Emails sent successfully!' };
        }
        
        if (result.success) {
            showToast(`Personalized emails sent to ${selectedApplicants.length} applicants!`, 'success');
            // Clear selections
            document.querySelectorAll('.applicant-checkbox').forEach(cb => cb.checked = false);
        } else {
            throw new Error(result.message || 'Failed to send emails');
        }
        
    } catch (error) {
        console.error('Email sending error:', error);
        showToast(error.message || 'Failed to send emails. Please try again.', 'error');
    } finally {
        btnText.textContent = 'Send Personalized Emails';
        spinner.style.display = 'none';
        btn.disabled = false;
    }
}

function getSelectedApplicants() {
    const checkboxes = document.querySelectorAll('.applicant-checkbox:checked');
    return Array.from(checkboxes).map(cb => parseInt(cb.dataset.id));
}

function viewApplicant(id) {
    showToast(`Viewing applicant ${id} details`, 'info');
    // In a real app, this would open a detailed modal or navigate to a detail page
}

function downloadResume(id) {
    showToast(`Downloading resume for applicant ${id}`, 'info');
    // In a real app, this would trigger a file download
}

// Utility Functions
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Initialize chatbot functionality
function initializeChatbot() {
    const chatbotWidget = document.getElementById('chatbotWidget');
    const chatbotInput = document.getElementById('chatbotInput');
    
    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }
}

function toggleChatbot() {
    const chatbotWidget = document.getElementById('chatbotWidget');
    if (chatbotWidget) {
        chatbotWidget.classList.toggle('expanded');
    }
}

async function sendChatMessage() {
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotMessages = document.getElementById('chatbotMessages');
    
    if (!chatbotInput || !chatbotMessages) return;
    
    const message = chatbotInput.value.trim();
    if (!message) return;
    
    // Add user message to chat
    const userMessage = createChatMessage(message, 'user');
    chatbotMessages.appendChild(userMessage);
    
    // Clear input
    chatbotInput.value = '';
    
    // Scroll to bottom
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    
    try {
        const response = await fetch('/api/chatbot', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message })
        });
        
        let botResponse;
        if (response.ok) {
            const result = await response.json();
            botResponse = result.response;
        } else {
            // Mock response for demo
            botResponse = generateMockChatbotResponse(message);
        }
        
        // Add bot response to chat
        const botMessage = createChatMessage(botResponse, 'bot');
        chatbotMessages.appendChild(botMessage);
        
    } catch (error) {
        console.error('Chatbot error:', error);
        const errorMessage = createChatMessage('I apologize, but I\'m having trouble responding right now. Please try again later.', 'bot');
        chatbotMessages.appendChild(errorMessage);
    }
    
    // Scroll to bottom
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function createChatMessage(content, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-${sender === 'user' ? 'user' : 'robot'}"></i>
        </div>
        <div class="message-content">
            <p>${content}</p>
            <span class="message-time">${time}</span>
        </div>
    `;
    
    return messageDiv;
}

function generateMockChatbotResponse(userMessage) {
    const responses = {
        'help': 'I can help you with job applications, application status, and general questions about the recruitment process.',
        'jobs': 'You can browse available jobs on this page. Use the search filters to find positions that match your skills and experience.',
        'apply': 'To apply for a job, click the "Apply Now" button on any job card. Fill out the application form with your details and upload your resume.',
        'status': 'You can check your application status by logging into your account. We\'ll also send email updates about your applications.',
        'default': 'Thank you for your question! I\'m here to help with job applications and the recruitment process. You can ask me about available jobs, how to apply, or check your application status.'
    };
    
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('help')) return responses.help;
    if (lowerMessage.includes('job')) return responses.jobs;
    if (lowerMessage.includes('apply')) return responses.apply;
    if (lowerMessage.includes('status')) return responses.status;
    
    return responses.default;
}

// Export functions for global access
window.logout = logout;
window.openApplicationModal = openApplicationModal;
window.closeApplicationModal = closeApplicationModal;
window.sendPersonalizedEmails = sendPersonalizedEmails;
window.viewApplicant = viewApplicant;
window.downloadResume = downloadResume;
window.toggleChatbot = toggleChatbot;
window.sendChatMessage = sendChatMessage;
window.checkAuth = checkAuth;
window.showToast = showToast;