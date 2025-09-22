// Chatbot functionality for TalentConnect
// Advanced chatbot features and natural language processing

class TalentConnectChatbot {
    constructor() {
        this.isInitialized = false;
        this.conversationHistory = [];
        this.userContext = {
            role: null,
            recentQueries: []
        };
        this.responses = this.initializeResponses();
    }

    initialize() {
        if (this.isInitialized) return;
        
        // Get user context
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        this.userContext.role = currentUser.role;
        
        // Setup chatbot widget
        this.setupChatbotWidget();
        
        // Add initial greeting
        this.addInitialGreeting();
        
        this.isInitialized = true;
    }

    setupChatbotWidget() {
        const chatbotInput = document.getElementById('chatbotInput');
        const sendButton = document.querySelector('.chatbot-input button');
        
        if (chatbotInput) {
            chatbotInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handleUserMessage();
                }
            });
        }
        
        if (sendButton) {
            sendButton.addEventListener('click', () => {
                this.handleUserMessage();
            });
        }

        // Auto-expand chatbot after a few seconds for first-time users
        if (!localStorage.getItem('chatbotUsed')) {
            setTimeout(() => {
                this.expandChatbot();
                setTimeout(() => {
                    this.addBotMessage("👋 Hi! I'm here to help you with any questions about jobs or applications. Feel free to ask me anything!");
                }, 1000);
            }, 3000);
        }
    }

    addInitialGreeting() {
        const role = this.userContext.role;
        let greeting = '';
        
        if (role === 'candidate') {
            greeting = "Hello! I'm your job search assistant. I can help you find jobs, understand application requirements, or answer questions about the recruitment process. What would you like to know?";
        } else if (role === 'hr') {
            greeting = "Hi there! I'm here to assist you with recruitment tasks. I can help you understand applicant data, explain features, or provide guidance on managing candidates. How can I help you today?";
        } else {
            greeting = "Welcome to TalentConnect! I'm here to help you navigate our platform. What questions do you have?";
        }
        
        // Don't show initial greeting if chat history exists
        const chatMessages = document.getElementById('chatbotMessages');
        if (chatMessages && chatMessages.children.length <= 1) {
            setTimeout(() => {
                this.addBotMessage(greeting);
            }, 500);
        }
    }

    async handleUserMessage() {
        const chatbotInput = document.getElementById('chatbotInput');
        if (!chatbotInput) return;
        
        const message = chatbotInput.value.trim();
        if (!message) return;
        
        // Add user message to chat
        this.addUserMessage(message);
        
        // Clear input
        chatbotInput.value = '';
        
        // Add to conversation history
        this.conversationHistory.push({
            type: 'user',
            message: message,
            timestamp: new Date()
        });
        
        // Add to recent queries for context
        this.userContext.recentQueries.push(message);
        if (this.userContext.recentQueries.length > 5) {
            this.userContext.recentQueries.shift();
        }
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Get AI response
            const response = await this.getAIResponse(message);
            
            // Remove typing indicator
            this.hideTypingIndicator();
            
            // Add bot response
            this.addBotMessage(response);
            
            // Add to conversation history
            this.conversationHistory.push({
                type: 'bot',
                message: response,
                timestamp: new Date()
            });
            
            // Mark chatbot as used
            localStorage.setItem('chatbotUsed', 'true');
            
        } catch (error) {
            console.error('Chatbot error:', error);
            this.hideTypingIndicator();
            this.addBotMessage("I apologize, but I'm having trouble processing your request right now. Please try again in a moment.");
        }
    }

    async getAIResponse(message) {
        try {
            // Try to call the backend API first
            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    context: this.userContext,
                    history: this.conversationHistory.slice(-10) // Last 10 messages for context
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                return result.response;
            }
        } catch (error) {
            console.log('API unavailable, using local responses');
        }
        
        // Fallback to local AI-like responses
        return this.generateIntelligentResponse(message);
    }

    generateIntelligentResponse(message) {
        const lowerMessage = message.toLowerCase();
        const role = this.userContext.role;
        
        // Intent recognition
        const intent = this.recognizeIntent(lowerMessage);
        
        // Context-aware responses based on user role
        if (role === 'candidate') {
            return this.getCandidateResponse(intent, lowerMessage);
        } else if (role === 'hr') {
            return this.getHRResponse(intent, lowerMessage);
        } else {
            return this.getGeneralResponse(intent, lowerMessage);
        }
    }

    recognizeIntent(message) {
        const intents = {
            greeting: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
            jobs: ['job', 'jobs', 'position', 'positions', 'opening', 'openings', 'career', 'careers'],
            apply: ['apply', 'application', 'applications', 'submit', 'resume', 'cv'],
            status: ['status', 'progress', 'update', 'updates', 'check', 'tracking'],
            help: ['help', 'assist', 'support', 'guide', 'how to', 'what is', 'explain'],
            skills: ['skills', 'skill', 'requirement', 'requirements', 'qualifications', 'experience'],
            salary: ['salary', 'pay', 'compensation', 'wage', 'money', 'benefits'],
            company: ['company', 'companies', 'employer', 'employers', 'organization'],
            interview: ['interview', 'interviews', 'meeting', 'call', 'screening'],
            thanks: ['thank', 'thanks', 'appreciate', 'grateful']
        };
        
        for (const [intent, keywords] of Object.entries(intents)) {
            if (keywords.some(keyword => message.includes(keyword))) {
                return intent;
            }
        }
        
        return 'general';
    }

    getCandidateResponse(intent, message) {
        const responses = {
            greeting: [
                "Hello! I'm excited to help you find your next great opportunity. What type of job are you looking for?",
                "Hi there! Ready to explore some amazing job opportunities? I'm here to guide you through the process.",
                "Hey! Welcome to your job search journey. How can I assist you in finding the perfect role?"
            ],
            jobs: [
                "Great question! You can browse all available jobs on this page. Use the search bar to filter by job title, company, or skills. We have positions ranging from entry-level to senior roles across various industries.",
                "I can help you find the perfect job! Try using our filters to narrow down positions by experience level and required skills. What type of role are you most interested in?",
                "Our job listings are updated regularly with new opportunities. You can search by keywords, filter by skills, or browse by categories. Would you like me to explain how to use the search filters?"
            ],
            apply: [
                "Applying is easy! Just click the 'Apply Now' button on any job that interests you. You'll need to fill out your personal information, list your skills, and upload your resume. Make sure your resume is in PDF format for the best results.",
                "To submit an application, click 'Apply Now' on the job card. The application form will ask for your details, experience, and skills. Pro tip: Tailor your cover letter to each specific role for better chances!",
                "Ready to apply? Click the blue 'Apply Now' button, fill out the form with your information, and don't forget to upload an updated resume. We'll notify you once your application is received!"
            ],
            status: [
                "You can check your application status by contacting HR or waiting for email updates. We typically review applications within 3-5 business days and will keep you informed throughout the process.",
                "Application updates are sent via email. If you haven't heard back within a week, feel free to reach out. Remember, the hiring process can take time, so patience is key!",
                "We'll send you email notifications about your application progress. The typical process includes: Application Review → Initial Screening → Interview → Decision. Each step may take a few days."
            ],
            help: [
                "I'm here to help! I can assist you with finding jobs, understanding application requirements, preparing for interviews, or navigating our platform. What specific area would you like help with?",
                "Of course! I can guide you through job searching, applications, or answer questions about specific roles. What do you need assistance with?",
                "I'm your personal job search assistant! Whether you need help with applications, want to know more about a company, or need interview tips, just ask!"
            ],
            skills: [
                "Skills are crucial for job matching! Make sure to list all relevant technical and soft skills in your application. Look at job descriptions to see what employers are seeking and highlight those skills you possess.",
                "When listing skills, be specific and honest. Include programming languages, tools, frameworks, and soft skills like communication or leadership. Match your skills to what's required in the job description.",
                "Great question about skills! Focus on both technical abilities and soft skills. Don't forget to mention any certifications or training you've completed. Quantify your experience when possible (e.g., '3 years of React development')."
            ],
            salary: [
                "Salary information is typically provided in the job listings. If not specified, you can discuss compensation during the interview process. Research industry standards for your role and location to know your worth.",
                "Most job postings include salary ranges. If you don't see one, it's perfectly acceptable to ask about compensation during your interview. Consider the full package including benefits, not just base salary.",
                "Compensation varies by role, experience, and location. Check the job listing for salary ranges. During interviews, you can inquire about the complete benefits package including health insurance, vacation time, and other perks."
            ],
            company: [
                "Each job listing includes company information. I recommend researching companies before applying - check their website, recent news, and employee reviews. This shows genuine interest and helps you ask informed questions.",
                "Company research is key to successful applications! Look into their mission, recent projects, and company culture. This knowledge will help you tailor your application and prepare for interviews.",
                "Getting to know potential employers is smart! Most job cards show company names and locations. You can research their background, values, and recent developments to make a strong impression."
            ],
            interview: [
                "Congratulations on getting to the interview stage! Prepare by researching the company, practicing common interview questions, and preparing questions to ask them. Dress professionally and arrive a few minutes early.",
                "Interview preparation is key! Review the job description, prepare examples of your work, and think about how your experience matches their needs. Don't forget to prepare thoughtful questions about the role and company.",
                "Great news about the interview! Be ready to discuss your experience, ask insightful questions, and show enthusiasm for the role. Practice your elevator pitch and prepare specific examples of your achievements."
            ],
            thanks: [
                "You're very welcome! I'm here whenever you need help with your job search. Best of luck with your applications!",
                "Happy to help! Feel free to reach out anytime if you have more questions. Wishing you success in finding your dream job!",
                "My pleasure! Remember, I'm always here to assist you throughout your job search journey. Good luck!"
            ]
        };
        
        const intentResponses = responses[intent] || responses.help;
        return intentResponses[Math.floor(Math.random() * intentResponses.length)];
    }

    getHRResponse(intent, message) {
        const responses = {
            greeting: [
                "Hello! I'm here to help you manage your recruitment process efficiently. What would you like assistance with today?",
                "Hi! Ready to streamline your hiring process? I can help with applicant management, dashboard insights, or recruitment best practices.",
                "Welcome! I'm your recruitment assistant. Whether you need help with candidate evaluation or using platform features, I'm here to help."
            ],
            applicants: [
                "You can manage all applicants from your dashboard. Use the search and filter options to find candidates with specific skills or experience levels. The table shows key information and allows bulk actions.",
                "The applicants section shows all job applications with filtering capabilities. You can sort by skills, experience, status, or application date. Use checkboxes to select multiple candidates for bulk actions.",
                "Your applicant management tools include search, filtering, and bulk actions. Click on any applicant row to view detailed information, download resumes, or update application status."
            ],
            dashboard: [
                "Your dashboard provides key recruitment metrics including total applicants, recent applications, and ML-predicted eligible candidates. These insights help you track recruitment performance and identify trends.",
                "The dashboard shows real-time statistics about your recruitment funnel. Monitor application volumes, track recent activity, and see how many candidates our ML model flagged as potentially eligible.",
                "Dashboard metrics give you a comprehensive view of your hiring pipeline. Track total applications, recent activity, eligible candidates, and conversion rates to optimize your recruitment strategy."
            ],
            email: [
                "The personalized email feature uses AI to send tailored messages to selected candidates. Select applicants using checkboxes, then click 'Send Personalized Emails' to engage with potential hires automatically.",
                "Our email system creates personalized outreach messages based on candidate profiles and job requirements. Simply select the candidates you want to contact and let our AI craft appropriate messages.",
                "Personalized emails help improve candidate engagement. Select candidates from the table and use our automated system to send customized messages based on their skills and the positions they applied for."
            ],
            filtering: [
                "Use the filter options above the applicant table to narrow down candidates by skills, experience level, or application status. You can also use the search box to find specific candidates by name or email.",
                "Filtering helps you quickly identify qualified candidates. Available filters include skills (JavaScript, Python, etc.), experience levels (Entry, Mid, Senior), and application status (New, Reviewed, Shortlisted).",
                "The search and filter system lets you efficiently manage large applicant pools. Combine multiple filters to find exactly the candidates you're looking for based on your specific requirements."
            ],
            help: [
                "I can assist with applicant management, understanding dashboard metrics, using the email system, or general recruitment best practices. What specific area needs attention?",
                "I'm here to help optimize your recruitment process! Whether you need guidance on candidate evaluation, platform features, or hiring strategies, just ask.",
                "As your recruitment assistant, I can help with candidate screening, dashboard insights, bulk actions, or any other hiring-related questions you might have."
            ]
        };
        
        // Check for specific HR-related keywords
        if (message.includes('applicant') || message.includes('candidate')) {
            return responses.applicants[Math.floor(Math.random() * responses.applicants.length)];
        }
        
        if (message.includes('dashboard') || message.includes('metric') || message.includes('stat')) {
            return responses.dashboard[Math.floor(Math.random() * responses.dashboard.length)];
        }
        
        if (message.includes('email') || message.includes('message') || message.includes('contact')) {
            return responses.email[Math.floor(Math.random() * responses.email.length)];
        }
        
        if (message.includes('filter') || message.includes('search') || message.includes('find')) {
            return responses.filtering[Math.floor(Math.random() * responses.filtering.length)];
        }
        
        const intentResponses = responses[intent] || responses.help;
        return intentResponses[Math.floor(Math.random() * intentResponses.length)];
    }

    getGeneralResponse(intent, message) {
        const responses = {
            greeting: [
                "Hello! Welcome to TalentConnect. I'm here to help you navigate our recruitment platform. What can I assist you with?",
                "Hi there! I'm your TalentConnect assistant. Whether you're a job seeker or recruiter, I'm here to help you make the most of our platform.",
                "Welcome! I'm here to guide you through TalentConnect's features and answer any questions you might have."
            ],
            platform: [
                "TalentConnect is a comprehensive recruitment platform that connects talented candidates with great employers. We offer job listings, application management, and AI-powered matching.",
                "Our platform serves both job seekers and HR professionals with tools for job searching, application tracking, candidate management, and recruitment analytics.",
                "TalentConnect streamlines the hiring process with features like intelligent job matching, automated communications, and comprehensive applicant tracking."
            ],
            help: [
                "I'm here to help! I can explain platform features, guide you through processes, or answer specific questions. What would you like to know?",
                "Happy to assist! Whether you need help with navigation, features, or have general questions, I'm here to help make your experience smooth.",
                "Of course! I can provide information about our platform, explain features, or help you get started. What specific area interests you?"
            ]
        };
        
        if (message.includes('platform') || message.includes('talentconnect') || message.includes('what is')) {
            return responses.platform[Math.floor(Math.random() * responses.platform.length)];
        }
        
        const intentResponses = responses[intent] || responses.help;
        return intentResponses[Math.floor(Math.random() * intentResponses.length)];
    }

    initializeResponses() {
        // This could be expanded with more sophisticated NLP
        return {
            fallback: [
                "I'm not sure I understand that completely. Could you rephrase your question or ask about something specific like job applications or platform features?",
                "That's an interesting question! Could you provide a bit more context so I can give you a better answer?",
                "I want to make sure I give you the most helpful response. Could you clarify what you're looking for help with?",
                "I'm here to help with job search and recruitment questions. Could you ask about something specific like applications, jobs, or platform features?"
            ]
        };
    }

    addUserMessage(message) {
        const chatMessages = document.getElementById('chatbotMessages');
        if (!chatMessages) return;
        
        const messageElement = this.createMessageElement(message, 'user');
        chatMessages.appendChild(messageElement);
        this.scrollToBottom();
    }

    addBotMessage(message) {
        const chatMessages = document.getElementById('chatbotMessages');
        if (!chatMessages) return;
        
        const messageElement = this.createMessageElement(message, 'bot');
        chatMessages.appendChild(messageElement);
        this.scrollToBottom();
    }

    createMessageElement(content, sender) {
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

    showTypingIndicator() {
        const chatMessages = document.getElementById('chatbotMessages');
        if (!chatMessages) return;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.id = 'typing-indicator';
        
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
        
        // Add CSS for typing animation if not already present
        this.addTypingStyles();
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    addTypingStyles() {
        if (document.getElementById('typing-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'typing-styles';
        style.textContent = `
            .typing-dots {
                display: flex;
                align-items: center;
                gap: 4px;
                padding: 12px;
            }
            
            .typing-dots span {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background-color: var(--gray-400);
                animation: typing 1.4s infinite ease-in-out;
            }
            
            .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
            .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
            
            @keyframes typing {
                0%, 80%, 100% {
                    transform: scale(0.8);
                    opacity: 0.5;
                }
                40% {
                    transform: scale(1);
                    opacity: 1;
                }
            }
        `;
        
        document.head.appendChild(style);
    }

    expandChatbot() {
        const chatbotWidget = document.getElementById('chatbotWidget');
        if (chatbotWidget) {
            chatbotWidget.classList.add('expanded');
        }
    }

    scrollToBottom() {
        const chatMessages = document.getElementById('chatbotMessages');
        if (chatMessages) {
            setTimeout(() => {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 100);
        }
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (typeof window.talentConnectChatbot === 'undefined') {
        window.talentConnectChatbot = new TalentConnectChatbot();
        
        // Initialize chatbot if on candidate page
        if (window.location.pathname.includes('candidate.html')) {
            setTimeout(() => {
                window.talentConnectChatbot.initialize();
            }, 1000);
        }
    }
});

// Override global sendChatMessage function to use the new chatbot class
window.sendChatMessage = function() {
    if (window.talentConnectChatbot && window.talentConnectChatbot.isInitialized) {
        window.talentConnectChatbot.handleUserMessage();
    }
};