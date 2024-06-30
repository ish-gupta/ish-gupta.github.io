const chatBox = document.getElementById('chat-box');
const userMessageInput = document.getElementById('user-message');
const sendButton = document.getElementById('send-button');

const messages = [
    { text: 'Hey there! 👋', type: 'bot' },
    { text: "I'm Ishita", type: 'bot' },
    { text: 'I like to code', type: 'bot' },
    { text: "You can contact me at <a href='mailto:ishitangupta@gmail.com'>ishitangupta@gmail.com</a>", type: 'bot' },
    { text: "Or connect with me on LinkedIn: <a href='linkedin.com/in/ish--gupta'>linkedin.com/in/ish-gupta/</a>", type: 'bot' },
    { text: 'Have a nice evening', type: 'bot' }
];

function displayMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.innerHTML = text;
    messageDiv.classList.add('message', type);
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function displayMessagesSequentially(messages, index = 0) {
    if (index < messages.length) {
        setTimeout(() => {
            displayMessage(messages[index].text, messages[index].type);
            displayMessagesSequentially(messages, index + 1);
        }, 1000);
    }
}

async function getResponse(userMessage) {
    let result = '';
    let upper = true;

    for (let i = 0; i < userMessage.length; i++) {
        let char = userMessage[i];
        if (char.match(/[a-z]/i)) { // Check if the character is a letter
            if (upper) {
                result += char.toLowerCase();
            } else {
                result += char.toUpperCase();
            }
            upper = !upper; // Toggle the case for the next letter
        } else {
            result += char; // Non-letter characters remain unchanged
        }
    }

    return result;
}

function sendMessage() {
    const userMessage = userMessageInput.value.trim();
    if (userMessage !== '') {
        displayMessage(userMessage, 'user');
        userMessageInput.value = '';

        // Fetch the response and display it
        getResponse(userMessage).then(botResponse => {
            setTimeout(() => {
                displayMessage(botResponse, 'bot');
            }, 1000);
        });
    }
}

sendButton.addEventListener('click', sendMessage);

userMessageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

displayMessagesSequentially(messages);