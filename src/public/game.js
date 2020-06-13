import { socketClient } from '/public/main.js';

const opponentBox = document.getElementById('game-opponent');
const userBox = document.getElementById('game-user');

let gameroom = 'gameroom-1';
let gameActive = true;
let username;
let activeWord = 'Testing';
let letterPos = 0;

let opponentProgress = '';
// let watchers = [];

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
}

const countdown = () => {
  // if (!waiting) { 
    revealWord();
  // } else {
  //   setTimeout(() => countdown(), 500);
  // }
}

socketClient.on(gameroom, (message) => {
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

document.addEventListener('keyup', (event) => {
  if (!gameActive) return;
  if (event.key.toLowerCase() === activeWord[letterPos].toLowerCase()) {
    letterPos += 1;
    sendMessage(event.key);
  }
});

(() => {
  if (!history.state) location.href = '/';
  username = history.state.username;
  countdown();
})();
