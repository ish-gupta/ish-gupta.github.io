const chatBox = document.getElementById('chat-box');
const userMessageInput = document.getElementById('user-message');
const sendButton = document.getElementById('send-button');

const messages = [
    { text: 'Hey there! 👋', type: 'bot' },
    { text: "I'm Ishita", type: 'bot' },
    { text: 'I like to code', type: 'bot' },
    { text: "You can contact me at <a href='mailto:ishitangupta@gmail.com'>ishitangupta@gmail.com</a>", type: 'bot' },
    { text: "Or connect with me on LinkedIn: <a href='https://linkedin.com/in/ish--gupta'>linkedin.com/in/ish--gupta/</a>", type: 'bot' },
    { text: 'Have a nice evening', type: 'bot' }
];

function displayMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.innerHTML = text;
    messageDiv.classList.add('message', type);
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function displayTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('message', 'bot', 'typing-indicator');
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return typingDiv;
}

function displayMessagesSequentially(messages, index = 0) {
    if (index < messages.length) {
        const typingIndicator = displayTypingIndicator();

        setTimeout(() => {
            chatBox.removeChild(typingIndicator);
            displayMessage(messages[index].text, messages[index].type);
            displayMessagesSequentially(messages, index + 1);
        }, 1500); // Show typing indicator for 2 seconds
    }
}

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
            }, 1000); // Show typing indicator for 2 seconds
        });
    }
}

sendButton.addEventListener('click', sendMessage);

userMessageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

setTimeout(() => {
    displayMessagesSequentially(messages);
}, 1000); // Start the sequence with an initial delay of 1 second