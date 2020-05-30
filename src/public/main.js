const setUsername = () => {
  const input = document.getElementById("username").value;
  if (input) loadChatRoom(input);
}

const loadChatRoom = (username) => {
  history.pushState({ username }, '', '/chat');
  location.reload();
}

document.getElementById('submitUsername').addEventListener('click', setUsername);
