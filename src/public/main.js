import { SocketClient } from '/public/client.js';
const socketClient = new SocketClient({});

const setUsername = () => {
  const input = document.getElementById("username").value;
  if (input) {
    loadPath(input);
  }
}

const loadPath = (username) => {
  history.pushState({ username }, '', '/game');
  location.reload();
}

const usernameInput = document.getElementById('submitUsername');
if (usernameInput) {
  usernameInput.addEventListener('click', setUsername);
}

export { socketClient };
