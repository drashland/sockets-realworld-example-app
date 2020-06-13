import { socketClient } from '/public/main.js';

const opponentBox = document.getElementById('game-opponent');
const userBox = document.getElementById('game-user');
const userJoinButton = document.getElementById('user-join');
const opponentJoinButton = document.getElementById('opponent-join');

let gameroom = 'gameroom-1';
let gameActive = false;
let username;
let activeWord = 'Testing';
let letterPos = 0;

let opponentProgress = '';
let playerCount = 0;
let joined = false;

const joinGame = ({ target }) => {
  if (joined) return alert("You have already joined.");
  const { value: player } = target;
  console.log('who joined: ', player);
  if (player !== 'user') {
  }
  socketClient.send("wordsmith", {
    action: 'playerJoined',
    playerCount: 1,
    username,
    gameroom,
    player,
  });
  playerCount += 1;
  joined = true;
  target.style.display = "none";
}

const sendMessage = () => {
  const input = activeWord.slice(0, letterPos);
  socketClient.send("wordsmith", {
    gameroom,
    username,
    activeWord,
    input,
  });
}

const revealWord = () => {
  opponentBox.innerHTML = activeWord;
  userBox.innerHTML = activeWord;
  gameActive = true;
}

const countdown = () => {
  revealWord();
}

socketClient.on(gameroom, (message) => {
  if (message.action === 'playerJoined') {
    playerCount += 1;
    if (message.player === "user") {
      userJoinButton.style.display = "none";
    } else {
      opponentJoinButton.style.display = "none";
    }

    if (playerCount === 2 && !gameActive) {
      countdown();
      return;
    }
  }
  if (message.username !== username) {
    opponentProgress = message.input;
    if (message.completed && gameActive) {
      gameActive = false;
      alert(`${message.username} won!`);
    }
  } else {
    if (message.completed && gameActive) {
      gameActive = false;
      alert("You've won!");
    }
  }
});

opponentJoinButton.addEventListener('click', joinGame);
userJoinButton.addEventListener('click', joinGame);


document.addEventListener('keyup', (event) => {
  if (!gameActive) return;
  if (event.key.toLowerCase() === activeWord[letterPos].toLowerCase()) {
    letterPos += 1;
    sendMessage(event.key);
  }
});

(() => {
  if (!history.state) {
    localStorage.setItem("returnTo", "/game");
    return location.href = '/';
  }
  username = history.state.username;
})();
