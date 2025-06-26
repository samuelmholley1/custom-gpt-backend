document.addEventListener('DOMContentLoaded', () => {
    const chatBubble = document.getElementById('chat-bubble');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');
    const chatBody = document.getElementById('chat-body');
    const chatInput = document.getElementById('chat-input');

    let conversationState = 'greeting';
    let conversationalScript = null; // Initialize as null to indicate not loaded

    // Hide the chat bubble initially until the script is loaded and ready
    chatBubble.style.display = 'none';

    // Fetch the conversational script from the server
    fetch('/conversational_script.js')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Conversational script loaded successfully.");
            conversationalScript = data;
            // Show the chat bubble now that the script is ready
            chatBubble.style.display = 'flex';
        })
        .catch(error => {
            console.error('Fatal Error: Could not load conversational script:', error);
        });

    chatBubble.addEventListener('click', () => {
        // Add an explicit check for the script to be safe.
        if (!conversationalScript) {
            console.error("Chat opened, but conversational script is not loaded.");
            return;
        }
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
        if (!conversationalScript) {
            console.error("displayMessage called, but script is not loaded.");
            return;
        }
        const node = conversationalScript[state];
        if (!node) {
            console.error(`State "${state}" not found in conversational script.`);
            return;
        }

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
                    if (!conversationalScript) return;
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
