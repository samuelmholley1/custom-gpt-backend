document.addEventListener('DOMContentLoaded', () => {
    const chatBubble = document.getElementById('chat-bubble');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');
    const chatBody = document.getElementById('chat-body');
    const chatInput = document.getElementById('chat-input');

    let conversationState = 'greeting';
    let conversationalScript = {}; // Will be loaded from the server

    // Fetch the conversational script from the server
    fetch('/conversational_script.js')
        .then(response => response.json())
        .then(data => {
            conversationalScript = data;
            // Add a small delay to ensure the chat window is visible before the first message appears
            if (chatWindow.style.display === 'flex') {
                setTimeout(() => displayMessage(conversationState), 100);
            }
        })
        .catch(error => console.error('Error loading conversational script:', error));

    chatBubble.addEventListener('click', () => {
        chatWindow.style.display = 'flex';
        chatBubble.style.display = 'none';
        // Ensure the script is loaded before displaying the first message
        if (Object.keys(conversationalScript).length > 0) {
            displayMessage(conversationState);
        }    
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
