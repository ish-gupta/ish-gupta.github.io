const chatBox = document.getElementById('chat-box');
const userMessageInput = document.getElementById('user-message');
const sendButton = document.getElementById('send-button');
const darkModeToggle = document.getElementById('dark-mode-toggle');

// Messages array
const messages = [
    { text: 'Hey there! 👋', type: 'bot' },
    { text: "I'm Ishita", type: 'bot' },
    { text: "I like to code", type: 'bot' },
    { text: "I've worked on some fascinating projects along the way. <a href='projects.html'>Check them out!</a>", type: 'bot' },
    { text: "<a href='experience.html'>Here</a> is a timeline of my professional journey", type: 'bot' },
    { text: "You can contact me at <a href='mailto:ishitangupta@gmail.com'>ishitangupta@gmail.com</a>", type: 'bot' },
    { text: "Or connect with me on LinkedIn: <a href='https://linkedin.com/in/ish--gupta'>linkedin.com/in/ish--gupta/</a>", type: 'bot' },
    { text: 'Have a great day', type: 'bot' },
];

// Function to display a single message
function displayMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.innerHTML = text;
    messageDiv.classList.add('message', type);
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to display typing indicator
function displayTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('message', 'bot', 'typing-indicator');
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Force reflow to ensure smooth transition
    setTimeout(() => {
        typingDiv.classList.add('expanded');
    }, 10);

    return typingDiv;
}

// Function to display messages sequentially
function displayMessagesSequentially(messages, index = 0) {
    if (index < messages.length) {
        const typingIndicator = displayTypingIndicator();

        setTimeout(() => {
            chatBox.removeChild(typingIndicator);
            displayMessage(messages[index].text, messages[index].type);
            displayMessagesSequentially(messages, index + 1);
        }, 1500); // Show typing indicator for 1.5 seconds
    }
}

// Mock function to generate bot response
async function getResponse(userMessage) {
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
        displayMessage(userMessage, 'user');
        userMessageInput.value = '';

        const typingIndicator = displayTypingIndicator();

        getResponse(userMessage).then(botResponse => {
            setTimeout(() => {
                chatBox.removeChild(typingIndicator);
                displayMessage(botResponse, 'bot');
            }, 1000); // Show typing indicator for 1 second
        });
    }
}

// Event listener for the send button
sendButton.addEventListener('click', sendMessage);

// Event listener for the enter key
userMessageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// Display initial messages after an initial delay
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