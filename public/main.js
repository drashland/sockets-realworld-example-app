import SocketClient from 'https://cdn.jsdelivr.net/gh/drashland/sockets-client@latest/client.js';
const socketClient = new SocketClient({});

const setUsername = () => {
  const input = document.getElementById("username").value;
  if (input) loadPath(input);
}

const loadPath = (username) => {
  const returnTo = localStorage.getItem("returnTo");
  localStorage.setItem("username", username);
  history.pushState({ username }, '', returnTo || '/chat');
  location.reload();
}

const usernameInput = document.getElementById('submitUsername');
if (usernameInput) {
  usernameInput.addEventListener('click', setUsername);
}

export { socketClient };
