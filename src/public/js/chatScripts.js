const socket = io();
function setUserName() {
    const userData = document.getElementById('userData');
    const userName = userData.getAttribute('data-user-name');
    const userEmail = userData.getAttribute('data-user-email');
    socket.emit('setUserName', { userName, userEmail });

    document.getElementById('messageForm').style.display = 'block';
    document.getElementById('joinChatBtn').style.display = 'none';
}


socket.on('chatHistory', (history) => {
    const chatBox = document.getElementById('chatBox');

    history.forEach((message) => {
        const chatMessage = `<p><strong>${message.user}:</strong> ${message.message}</p>`;
        chatBox.innerHTML += chatMessage;
    });
});

socket.on('chatMessage', (data) => {
    const chatBox = document.getElementById('chatBox');
    chatBox.innerHTML += `<p><strong>${data.userName}:</strong> ${data.message}</p>`;
});

socket.on('userConnected', (userName) => {
    const chatBox = document.getElementById('chatBox');
    chatBox.innerHTML += `<p><em>${userName} has joined the chat</em></p>`;
});

socket.on('userDisconnected', (userName) => {
    const chatBox = document.getElementById('chatBox');
    chatBox.innerHTML += `<p><em>${userName} has disconnected</em></p>`;
});

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value;
    socket.emit('sendMessage', message);
    messageInput.value = '';
}