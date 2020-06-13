import { SocketClient } from '/public/client.js';
const socketClient = new SocketClient({});

const setUsername = () => {
  const input = document.getElementById("username").value;
  if (input) loadPath(input);
}

const loadPath = (username) => {
  const returnTo = localStorage.getItem("returnTo");
  history.pushState({ username }, '', returnTo);
  location.reload();
}

const usernameInput = document.getElementById('submitUsername');
if (usernameInput) {
  usernameInput.addEventListener('click', setUsername);
}

export { socketClient };
