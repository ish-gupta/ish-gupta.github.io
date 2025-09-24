const chatBox = document.getElementById('chat-box');
const userMessageInput = document.getElementById('user-message');
const sendButton = document.getElementById('send-button');
const darkModeToggle = document.getElementById('dark-mode-toggle');

// Messages array - keeping your original messages and timing
const messages = [
    { text: 'Hey there! 👋', type: 'bot' },
    { text: "I'm Ishita (pronounced ih-SHEE-tah)", type: 'bot' },
    { text: "I like to code", type: 'bot' },
    { text: "I've worked on some fascinating projects along the way. <a href='projects.html'>Check them out!</a>", type: 'bot' },
    { text: "<a href='experience.html'>Here</a> is a timeline of my professional journey", type: 'bot' },
    { text: "You can contact me at <a href='mailto:ishitangupta@gmail.com'>ishitangupta@gmail.com</a>", type: 'bot' },
    { text: "Check out my code on <a href='https://github.com/ish-gupta'>GitHub</a> 🚀", type: 'bot' },
    { text: "Or connect with me on <a href='https://linkedin.com/in/ish--gupta'>LinkedIn</a>", type: 'bot' },
    { text: 'Have a great day', type: 'bot' },
];

// Clear welcome message when first bot message appears
let welcomeCleared = false;

// Function to display a single message
function displayMessage(text, type) {
    if (!welcomeCleared && type === 'bot') {
        const welcomeMsg = document.querySelector('.welcome-message');
        if (welcomeMsg) {
            welcomeMsg.remove();
            welcomeCleared = true;
        }
    }

    const messageDiv = document.createElement('div');
    messageDiv.innerHTML = text;
    messageDiv.classList.add('message', type);
    messageDiv.setAttribute('role', type === 'bot' ? 'status' : 'log');
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Track if default messages are still displaying
let defaultMessagesDone = false;
let defaultMessagesIndex = 0;
let defaultMessagesTimeout = null;

// Function to display typing indicator
function displayTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('message', 'bot', 'typing-indicator');
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    typingDiv.setAttribute('aria-label', 'Ishita is typing');
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Force reflow to ensure smooth transition
    setTimeout(() => {
        typingDiv.classList.add('expanded');
    }, 10);

    return typingDiv;
}

// Function to display messages sequentially - keeping original timing of 1.5s
function displayMessagesSequentially(messages, index = 0) {
    defaultMessagesIndex = index;
    if (index < messages.length) {
        const typingIndicator = displayTypingIndicator();
        defaultMessagesTimeout = setTimeout(() => {
            if (typingIndicator && typingIndicator.parentNode) {
                chatBox.removeChild(typingIndicator);
            }
            displayMessage(messages[index].text, messages[index].type);
            displayMessagesSequentially(messages, index + 1);
        }, 1500);
    } else {
        defaultMessagesDone = true;
    }
}

// Enhanced bot response function with more personality
async function getResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Simple keyword matching for more relevant responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        return "Hello! Great to meet you! What would you like to know about me?";
    }
    if (message.includes('project') || message.includes('work')) {
        return "I'd love to tell you about my projects! Check out the projects link I shared earlier, or feel free to ask specific questions!";
    }
    if (message.includes('experience') || message.includes('job') || message.includes('career')) {
        return "My professional journey has been quite exciting! You can see the full timeline in the experience link, or ask me about specific roles.";
    }
    if (message.includes('contact') || message.includes('email') || message.includes('reach')) {
        return "You can reach me at ishitangupta@gmail.com or connect on LinkedIn! I'm always open to interesting conversations."
    }
    if (message.includes('skill') || message.includes('tech') || message.includes('language')) {
        return "I work with various technologies! What specific skills or tech stack are you curious about?";
    }
    if (message.includes('locat') || message.includes('city') || message.includes('where')) {
        return "I reside in New York City! ";
    }
    
    // Fallback -  alternating case transformation
    let result = '';
    let upper = true;

    for (let i = 0; i < userMessage.length; i++) {
        let char = userMessage[i];

        if (char.match(/[a-z]/i)) {
            if (upper) {
                result += char.toLowerCase();
            } else {
                result += char.toUpperCase();
            }
            upper = !upper;
        } else {
            result += char;
        }
    }

    return result;
}

// Function to send a user message
function sendMessage() {
    const userMessage = userMessageInput.value.trim();

    if (userMessage !== '') {
        // If default messages are not done, instantly show all remaining
        if (!defaultMessagesDone) {
            if (defaultMessagesTimeout) clearTimeout(defaultMessagesTimeout);
            // Remove any typing indicator
            const typing = chatBox.querySelector('.typing-indicator');
            if (typing) typing.remove();
            for (let i = defaultMessagesIndex; i < messages.length; i++) {
                displayMessage(messages[i].text, messages[i].type);
            }
            defaultMessagesDone = true;
        }

        displayMessage(userMessage, 'user');
        userMessageInput.value = '';
        sendButton.disabled = true;

        const typingIndicator = displayTypingIndicator();

        getResponse(userMessage).then(botResponse => {
            setTimeout(() => {
                if (typingIndicator && typingIndicator.parentNode) {
                    chatBox.removeChild(typingIndicator);
                }
                displayMessage(botResponse, 'bot');
                sendButton.disabled = false;
                userMessageInput.focus();
            }, 1000); // Show typing indicator for 1 second
        });
    }
}

// Event listener for the send button
sendButton.addEventListener('click', sendMessage);

// Event listener for the enter key
userMessageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});

// Enable/disable send button based on input content
userMessageInput.addEventListener('input', () => {
    sendButton.disabled = userMessageInput.value.trim() === '';
});

// Display initial messages after an initial delay - keeping your original 1s delay

setTimeout(() => {
    displayMessagesSequentially(messages);
}, 1000); // Start the sequence with an initial delay of 1 second

// Apply dark mode from local storage on page load
window.addEventListener('load', () => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark-mode', darkMode);
    darkModeToggle.checked = darkMode;
});

// Event listener for the dark mode toggle switch
darkModeToggle.addEventListener('change', () => {
    const isChecked = darkModeToggle.checked;
    document.body.classList.toggle('dark-mode', isChecked);
    localStorage.setItem('darkMode', isChecked);
});

// Focus management - auto-focus the input field

userMessageInput.addEventListener('focus', () => {
    if (projectsDock && projectsDock.classList.contains('active')) {
        hideProjectsDock();
    }
});

userMessageInput.focus();

// Close experience palette/modal when clicking outside
document.addEventListener('mousedown', (e) => {
    let closed = false;
    // Experience search palette (command palette)
    if (
        experiencePalette &&
        experiencePalette.classList.contains('active') &&
        !e.target.closest('.palette-content') &&
        !e.target.closest('.palette-header')
    ) {
        hideExperiencePalette();
        closed = true;
    }
    // Experience details modal
    if (experienceModal && experienceModal.classList.contains('active') && !experienceModal.contains(e.target)) {
        experienceModal.classList.remove('active');
        document.body.style.overflow = '';
        closed = true;
    }
    if (closed) {
        userMessageInput.focus();
        chatBox.scrollIntoView({behavior: 'smooth'});
    }
});

// ===== EXPERIENCE & PROJECTS DATA =====
const experienceData = [
    {
        id: "swe-company-a",
        role: "📍 Software Engineer - AI/ML",
        company: "Alai Studios.",
        period: "May 2024 - Present",
        description: "Leading development of scalable AI/ML applications",
        achievements: [
            "Built PyTorch LSTM and logistic regression models in Docker, powering course recommendations and reducing manual curriculum planning for ∼1k students/month with ∼80% accuracy.",
            "Deployed AWS Textract and GPT-4o pipeline for transcript extraction and entry (100+/day), cutting processing from 30–45 min to <60 sec with iterative human-in-loop feedback and 93% error-handling accuracy.",
            "Productionized ML workflows on AWS (Lambda, S3, EC2, RDS, API Gateway, CloudWatch) with Slack error alerts, enabling scalable course recommendations and transcript processing.",
            "Built Blaze, a platform with AI agents, RAG pipelines, semantic routing, memory modules to evaluate LLM response quality; won first in internal hackathon."
        ],
        technologies: ["Python", "PyTorch", "Scikit-learn", "MySQL", "PostgreSQL", "AWS (Lambda, S3, EC2, RDS, API Gateway, CloudWatch, Textract)", "Docker"]
    },
    {
        id: "masters-uva",
        role: "CS Grad Student",
        company: "University of Virginia",
        period: "Aug 2023 - Dec 2024",
        description: "Master's degree in Computer Science with focus on AI/ML",
        achievements: [
            "Successfully defended thesis 'Integrating Geometric Understanding in Generative Diffusion Models With Text Instructions'   ",
            "Lead Teaching Assistant for CS 4774: Machine Learning",
            "Graduate Teaching Assistant for CS 3120: Discrete Mathematics",
            "Research Assistant for Division of Student Affairs",
            "Graduated with a 4.0 CGPA"
        ],
        technologies: ["Python", "PyTorch", "TensorFlow", "MySQL"]
    },
    {
        id: "ds-intern-c",
        role: "Data Science Intern",
        company: "Motilal Oswal Financial Services",
        period: "Jul 2022 - Oct 2022",
        description: "Created interactive web experiences for client projects",
        achievements: [
            "Built a real-time AI voice-to-text system using OpenAI Whisper and Mozilla DeepSpeech to transcribe 5k+ multilingual calls/month, generating FAQs and reducing agent handling time by 15%.",
            "Integrated outputs into dashboards via Python, SQL, REST APIs for real-time decision support."
        ],
        technologies: ["Python", "SQL", "REST APIs", "OpenAI Whisper", "Mozilla DeepSpeech", "Flask"]
    },
    {
        id: "cs-education",
        role: "Data Science Student",
        company: "NMIMS University",
        period: "2019 - 2023",
        description: "Bachelor's degree in Data Science",
        achievements: [
            "Graduated with 3.78 CGPA",
            "Chairperson of university's ACM student chapter",
            "Treasurer of The MUN Society",
        ],
        technologies: ["Python", "Java", "C++", "Scikit-learn", "Pandas", "Matplotlib", "Data Structures & Algorithms"]
    },
        {
        id: "ds-intern-e",
        role: "Data Analyst Intern",
        company: "KPMG",
        period: "Summer 2022",
        description: "Bachelor's degree in Data Science",
        achievements: [
            "Developed ETL pipelines in Python + SQL to ingest 50k+ COVID-19 records/day and generate automated healthcare reports.",
            "Built NLP-powered, speech-activated Tableau dashboards to analyze district-level COVID-19 spread."
        ],
        technologies: ["Python", "SQL", "Pandas", "ETL Pipelines", "Tableau", "NLP", "Speech Recognition APIs"]
    }
];

const projectsData = [
    {
        id: "dollar-diary",
        name: "Dollar Diary",
        icon: "💲",
        techStack: ["Gemini API", "Python", "Google Sheets API"],
        description: "An automated personal finance tracker that ingests credit card emails, categorizes transactions using Gemini AI and Python NLP models, and updates a live Google Sheet; processes 1,000+ transactions/month, reducing manual tracking time by ~90%",
        liveUrl: "#",
        githubUrl: "#"
    },
    {
        id: "hit-or-miss",
        name: "Hit or Miss",
        icon: "🎾",
        techStack: ["Python", "Smartwatch Sensors (Accelerometer, Gyroscope)", "Machine Learning"],
        description: "A cyber-physical system to classify tennis strokes as successful hits or misses using smartwatch accelerometer and gyroscope data. Motion signals were segmented into sliding windows, transformed into statistical features, and analyzed using machine learning models. Support Vector Machines achieved peak accuracy of 98.3%, while Recursive Feature Elimination improved feature efficiency and interpretability. The project demonstrates how wearable technology and ML can enable real-time sports analytics and performance optimization.",
        liveUrl: "https://docs.google.com/presentation/d/1-CO4tv4fQTNYF__Va-ylBJvRSAP-KOniyRmFo4ujkXU/edit?slide=id.p#slide=id.p",
        githubUrl: "https://github.com/ish-gupta/hit-or-miss"
    },
    {
        id: "vibe-check",
        name: "Vibe Check",
        icon: "🌍",
        techStack: ["Python", "Geospatial Analysis"],
        description: "A Python script built with open-source tools to plug in an address and evaluate the area's livability based on proximity to amenities like grocery stores, bus stops, and fitness centers.",
        liveUrl: "#",
        githubUrl: "https://github.com/ish-gupta/vibe-check"
    },
    {
        id: "plant-care",
        name: "Smart Plant Care: When Plants Talk Back!",
        icon: "🌱",
        techStack: ["IoT", "OpenAI", "Python"],
        description: "A cyber-physical system for smart plant care, utilizing NVIDIA Jetson Nano, IoT sensors (DHT22, soil moisture sensors), and GPT-3.5 API. This system revolutionized plant maintenance by providing real-time data analysis, automated adjustments via a PID controller, and interactive voice feedback, enhancing user engagement and plant health management. ",
        liveUrl: "#",
        githubUrl: "#"
    },
    {
        id: "robot-nav",
        name: "Autonomous Robot Navigation",
        icon: "🚗",
        techStack: ["Python", "ROS", "C++", "LiDAR", "Computer Vision", "Deep Learning"],
        description: "A safety-critical system for autonomous navigation with RosbotXL in the hallways of UVA’s Rice Hall using NVIDIA's DAVE2 model based on the CNN architecture. Integrated with the ZED2 Camera, RPLIDAR, and XBOX One Controller for comprehensive data collection.\nAchieved a notable increase in model robustness through continued data collection, data augmentation, and model training under diverse conditions, and established a LiDAR-based collision prevention protocol, resulting in flawless track record with zero collisions.",
        liveUrl: "https://youtu.be/qPos7vMBse8",
        githubUrl: "https://github.com/ish-gupta/ml-robot"
    },
    {
        id: "boundary-detection",
        name: "Agricultural Field Boundary Detection",
        icon: "📡",
        techStack: ["Python", "TensorFlow", "OpenCV"],
        description: "Curated a dataset comprising satellite images from Google Earth and corresponding masks depicting agricultural fields in Odisha, India. Harnessed the U-Net image model for segmentation and ResNet model for transfer learning to accurately detect field boundaries.\nAccelerated land area calculations and pricing assessments with contour detection and latitude-longitude mapping. Constructed a Python package 'graddy', based on the TensorFlow framework, on PyPI for applying Grad-CAM methodology across diverse models.",
        liveUrl: "#",
        githubUrl: "#"
    },
    {
        id: "accessories-store",
        name: "E-commerce platform for Accessories Store",
        icon: "👜",
        techStack: ["MySQL", "Flask", "JavaScript", "CSS"],
        description: "An online accessories store experience built with Flask (backend), and JavaScript plus CSS (frontend). Embedded a chatbot that leverages Facebook's Blender Bot and neural networks to personalize product recommendations by examining user-provided images with a VGG-19 CNN model to find similar products. MySQL was used to manage and access the database for efficient product data retrieval.",
        liveUrl: "#",
        githubUrl: "#"
    }
];

// ===== EXPERIENCE COMMAND PALETTE =====
const experiencePalette = document.getElementById('experience-palette');
const experienceSearch = document.getElementById('experience-search');
const experienceResults = document.getElementById('experience-results');
const closeExperience = document.getElementById('close-experience');

// Experience Modal
const experienceModal = document.getElementById('experience-modal');
const experienceDetails = document.getElementById('experience-details');
const closeExperienceDetail = document.getElementById('close-experience-detail');

function showExperiencePalette() {
    // If projects dock is open, close it
    if (projectsDock && projectsDock.classList.contains('active')) {
        hideProjectsDock();
    }
    experiencePalette.classList.add('active');
    setTimeout(() => experienceSearch.focus(), 300);
    renderExperienceResults(experienceData);
    document.body.style.overflow = 'hidden';
}

function hideExperiencePalette() {
    experiencePalette.classList.remove('active');
    experienceSearch.value = '';
    document.body.style.overflow = '';
}

function renderExperienceResults(data) {
    experienceResults.innerHTML = data.map(exp => `
        <div class="experience-item" data-id="${exp.id}">
            <div class="experience-title">${exp.role}</div>
            <div class="experience-meta">${exp.company} • ${exp.period}</div>
            <div class="experience-preview">${exp.description}</div>
        </div>
    `).join('');
}

function showExperienceDetail(experienceId) {
    const exp = experienceData.find(e => e.id === experienceId);
    if (!exp) return;


    experienceDetails.innerHTML = `
        <div class="experience-header">
            <div class="experience-role">${exp.role}</div>
            <div class="experience-company">${exp.company}</div>
            <div class="experience-period">${exp.period}</div>
        </div>
        <div class="experience-section">
            <div class="section-title">Description</div>
            <div class="section-content">${exp.description}</div>
        </div>
        <div class="experience-section">
            <div class="section-title">Key Achievements</div>
            <ul class="achievements-list section-content">
                ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
            </ul>
        </div>
        <div class="experience-section">
            <div class="section-title">Technologies Used</div>
            <div class="section-content">
                <div class="tech-list">
                    ${exp.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            </div>
        </div>
    `;

    experiencePalette.classList.remove('active');
    experienceModal.classList.add('active');
}

// Experience search functionality
experienceSearch.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = experienceData.filter(exp => 
        exp.role.toLowerCase().includes(query) ||
        exp.company.toLowerCase().includes(query) ||
        exp.description.toLowerCase().includes(query) ||
        exp.technologies.some(tech => tech.toLowerCase().includes(query))
    );
    renderExperienceResults(filtered);
});

// Experience event listeners
experienceResults.addEventListener('click', (e) => {
    const item = e.target.closest('.experience-item');
    if (item) {
        showExperienceDetail(item.dataset.id);
    }
});

closeExperience.addEventListener('click', hideExperiencePalette);
closeExperienceDetail.addEventListener('click', () => {
    experienceModal.classList.remove('active');
    showExperiencePalette(); // Show the search palette again
    // Don't set body.style.overflow here, let palette manage it
});

// ===== PROJECTS DOCK =====
const projectsDock = document.getElementById('projects-dock');
const dockItems = document.getElementById('dock-items');
const projectModal = document.getElementById('project-modal');
const projectDetails = document.getElementById('project-details');
const closeProject = document.getElementById('close-project');
const closeProjectsDock = document.getElementById('close-projects-dock');

function showProjectsDock() {
    // Check if dock is already active (open)
    if (projectsDock.classList.contains('active')) {
        // If already open, trigger bounce animation
        projectsDock.classList.remove('bounce');
        // Force reflow
        projectsDock.offsetHeight;
        projectsDock.classList.add('bounce');
        
        // Remove bounce class after animation completes
        setTimeout(() => {
            projectsDock.classList.remove('bounce');
        }, 400);
        return;
    }

    // If not open, show normally
    projectsDock.classList.add('active');
    renderDockItems();
    document.body.style.overflow = 'hidden';
}

function hideProjectsDock() {
    projectsDock.classList.remove('active');
    projectsDock.classList.remove('bounce');
    document.body.style.overflow = '';
}

function renderDockItems() {
    dockItems.innerHTML = projectsData.map(project => `
        <div class="dock-item" data-id="${project.id}" data-tooltip="${project.name}">
            ${project.icon}
        </div>
    `).join('');
}

function showProjectDetail(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    if (!project) return;

    projectDetails.innerHTML = `
        <div class="project-header">
            <span class="project-icon">${project.icon}</span>
            <div class="project-title">${project.name}</div>
            <div class="project-tech-stack">
                ${project.techStack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
        </div>
        <div class="project-description">${project.description}</div>
        <div class="project-links">
            <a href="${project.liveUrl}" class="project-link primary" target="_blank" rel="noopener">
                View Live
            </a>
            <a href="${project.githubUrl}" class="project-link secondary" target="_blank" rel="noopener">
                View Code
            </a>
        </div>
    `;

    hideProjectsDock();
    projectModal.classList.add('active');
}

// Projects event listeners
dockItems.addEventListener('click', (e) => {
    const item = e.target.closest('.dock-item');
    if (item) {
        showProjectDetail(item.dataset.id);
    }
});

closeProject.addEventListener('click', () => {
    projectModal.classList.remove('active');
    showProjectsDock(); // Show the dock again
    document.body.style.overflow = '';
    // Do not focus chat input here, so dock stays visible until user clicks input
});

// Close projects dock button event listener
closeProjectsDock.addEventListener('click', hideProjectsDock);

// ===== LINK INTEGRATION WITH CHAT =====
function handleChatLinks() {
    chatBox.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            const href = e.target.getAttribute('href');
            
            if (href === 'experience.html') {
                showExperiencePalette();
            } else if (href === 'projects.html') {
                showProjectsDock();
            } else if (href.startsWith('mailto:') || href.startsWith('https://')) {
                window.open(href, '_blank', 'noopener,noreferrer');
            }
        }
    });
}

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hideExperiencePalette();
        hideProjectsDock();
        experienceModal.classList.remove('active');
        projectModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Experience palette keyboard navigation
experienceSearch.addEventListener('keydown', (e) => {
    const items = document.querySelectorAll('.experience-item');
    let currentIndex = Array.from(items).findIndex(item => item.classList.contains('highlighted'));
    
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (currentIndex < items.length - 1) {
            if (currentIndex >= 0) items[currentIndex].classList.remove('highlighted');
            currentIndex++;
            items[currentIndex].classList.add('highlighted');
            items[currentIndex].scrollIntoView({ block: 'nearest' });
        }
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentIndex > 0) {
            items[currentIndex].classList.remove('highlighted');
            currentIndex--;
            items[currentIndex].classList.add('highlighted');
            items[currentIndex].scrollIntoView({ block: 'nearest' });
        }
    } else if (e.key === 'Enter') {
        e.preventDefault();
        if (currentIndex >= 0) {
            showExperienceDetail(items[currentIndex].dataset.id);
        }
    }
});

// ===== INITIALIZATION =====
// Initialize all systems when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    handleChatLinks();
    setupDockPeek();
    startIdleTimer();
});


// Add highlighted style for keyboard navigation
const style = document.createElement('style');
style.textContent = `
    .experience-item.highlighted {
        background: #007aff !important;
        color: white !important;
        transform: translateX(4px);
    }
    .experience-item.highlighted .experience-title,
    .experience-item.highlighted .experience-meta,
    .experience-item.highlighted .experience-preview {
        color: white !important;
    }
`;
document.head.appendChild(style);

// Placeholder functions for dock peek and idle timer (if needed)
function setupDockPeek() {
    // Add any dock peek functionality here if needed
}

function startIdleTimer() {
    // Add any idle timer functionality here if needed
}