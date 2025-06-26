document.addEventListener('DOMContentLoaded', () => {
    const chatBubble = document.getElementById('chat-bubble');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');
    const chatBody = document.getElementById('chat-body');
    const chatInput = document.getElementById('chat-input');

    let conversationState = 'greeting';

    const conversationalScript = {
        greeting: {
            message: "Welcome to Reclaim by Design. I'm an AI assistant that can help you book a free strategy session with Samuel. Would you like to get started?",
            options: [
                { text: "Yes, Let's Do It", next: "interest" },
                { text: "No, Thanks", next: "goodbye" }
            ]
        },
        interest: {
            message: "Great. To make sure we make the most of your time, are you interested in consulting for yourself as an individual, or for your team?",
            options: [
                { text: "Just for Me", next: "calendly" },
                { text: "For My Team", next: "calendly" }
            ]
        },
        calendly: {
            message: "Perfect. Please use the following link to find a time that works for you. After you book, you'll be directed to a brief assessment to prepare for our call.",
            action: "https://calendly.com/your-link" // Replace with the actual Calendly link
        },
        goodbye: {
            message: "No problem at all. If you change your mind, just click on me again. Have a great day!",
            action: "close"
        }
    };

    chatBubble.addEventListener('click', () => {
        chatWindow.style.display = 'flex';
        chatBubble.style.display = 'none';
        displayMessage(conversationState);
    });

    closeChat.addEventListener('click', () => {
        chatWindow.style.display = 'none';
        chatBubble.style.display = 'flex';
        resetChat();
    });

    function displayMessage(state) {
        const node = conversationalScript[state];
        if (!node) return;

        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'bot');
        const textDiv = document.createElement('div');
        textDiv.classList.add('text');
        textDiv.innerText = node.message;
        messageDiv.appendChild(textDiv);
        chatBody.appendChild(messageDiv);

        chatInput.innerHTML = '';

        if (node.options) {
            node.options.forEach(option => {
                const button = document.createElement('button');
                button.innerText = option.text;
                button.addEventListener('click', () => {
                    addUserMessage(option.text);
                    conversationState = option.next;
                    displayMessage(conversationState);
                });
                chatInput.appendChild(button);
            });
        } else if (node.action) {
            if (node.action.startsWith('http')) {
                const link = document.createElement('a');
                link.href = node.action;
                link.innerText = 'Book a time';
                link.target = '_blank';
                chatInput.appendChild(link);
            } else if (node.action === 'close') {
                setTimeout(() => {
                    chatWindow.style.display = 'none';
                    chatBubble.style.display = 'flex';
                    resetChat();
                }, 2000);
            }
        }
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function addUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'user');
        const textDiv = document.createElement('div');
        textDiv.classList.add('text');
        textDiv.innerText = text;
        messageDiv.appendChild(textDiv);
        chatBody.appendChild(messageDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function resetChat() {
        chatBody.innerHTML = '';
        chatInput.innerHTML = '';
        conversationState = 'greeting';
    }
});
