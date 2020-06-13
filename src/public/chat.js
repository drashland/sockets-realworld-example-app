import { socketClient } from '/public/main.js';

const messagesInRoom = document.getElementById('messages');
const select = document.querySelector('#rooms');
const submitMessageButton = document.getElementById('submitMessage');
const messageBox = document.getElementById('toSend');

let currentRoom = 'general';
let username = '';

const addMessageToChat = (messageString) => {
  const li = document.createElement('li');
  li.className = 'message';
  li.appendChild(document.createTextNode(messageString));
  messagesInRoom.appendChild(li);
}

const sendMessage = () => {
  const message = messageBox.value;
  const messageString = `${username}: ${message}`;

  socketClient.send('chat', { room: currentRoom, username: username, text: message });
  messageBox.value = '';
  addMessageToChat(messageString);
}

socketClient.on('chat', (message) => {
  const messageString = `${message.username}: ${message.text}`;
  if (currentRoom === message.room) addMessageToChat(messageString);
});

const loadMessages = (messages) => {
  messagesInRoom.innerHTML = '';
  messages.forEach(message => {
    const messageString = `${message.username}: ${message.text}`;
    addMessageToChat(messageString);
  })
}

const getCurrentRoom = (room) => {
  const url = `http://localhost:1667/chat/${room || 'general'}`
  fetch(url)
    .then(response => response.json())
    .then(messages => loadMessages(messages));
}

submitMessageButton.addEventListener('click', sendMessage);
messageBox.addEventListener('keyup', (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    sendMessage();
  }
});

select.addEventListener('change', (e) => {
    currentRoom = e.target.value;
    getCurrentRoom(currentRoom);
});

(() => {
  if (!history.state) return location.href = '/';
  username = history.state.username;
  getCurrentRoom(currentRoom);
})();
