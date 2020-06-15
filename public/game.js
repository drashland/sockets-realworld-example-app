import { socketClient } from '/public/main.js';

const gameWordContainer = document.getElementsByClassName('game-word');
const joinButtons = document.getElementsByClassName('join');

let username;
let gameroom = 'gameroom-1';
let gameActive = false;
let activeWord = null;
let letterPos = 0;
let player = null;

const playerLeftTrigger = (message) => {
  if (message.space !== -1) {
    joinButtons[message.space - 1].style.display = "inline";
  }
}

const playerJoinedTrigger = (message) => {
  if (message.space) joinButtons[message.space - 1].style.display = "none";
}

const playerInputTrigger = (message) => {
  if (gameActive) {
    updateProgress(message);
    if (message.completed) endAndResetGame(message.username);
  }
}

const statusTrigger = (message) => {
  const players = message.status ? message.status.players : [];
  for (let i = 0; i < players.length; i++) {
    if (players[i]) joinButtons[i].style.display = "none";
  }
}

const activeWordTrigger = (message) => {
  if (message.action === 'active_word') {
    if (message.space) joinButtons[message.space - 1].style.display = "none";
    activeWord = message.activeWord;
    countdown();
  }
}

const reactions = {
  'player_left': playerLeftTrigger,
  'player_joined': playerJoinedTrigger,
  'input': playerInputTrigger,
  'status': statusTrigger,
  'active_word': activeWordTrigger,
}

const joinGame = ({ target }) => {
  if (player) return alert("You have already joined.");
  const { value: space } = target;
  socketClient.send("wordsmith", {
    action: 'player_joined',
    username,
    gameroom,
    space,
  });
  player = space;
}

const sendMessage = () => {
  const input = activeWord.slice(0, letterPos);
  socketClient.send("wordsmith", {
    action: 'input',
    gameroom,
    username,
    activeWord,
    input,
    space: player,
    letterPos,
  });
}

const revealWord = () => {
  const word = activeWord.split('').reduce((acc, curr) => {
    acc += `<span>${curr}</span>`;
    return acc;
  }, '');

  for (let i = 0; i < gameWordContainer.length; i++) {
    const copy = word.slice();
    gameWordContainer[i].innerHTML = copy;
  }
}

const countdown = () => {
  gameActive = true;
  revealWord();
}

const endAndResetGame = (username) => {
  for (let i = 0; i < gameWordContainer.length; i++) {
    gameWordContainer[i].innerHTML = '';
  }
  for (let i = 0; i < joinButtons.length; i++) {
    joinButtons[i].style.display = 'inline';
  }
  player = null;
  activeWord = null;
  letterPos = 0;
  gameActive = false;
  alert(`${username} won!`);
};

const updateProgress = (message) => {
  gameWordContainer[message.space - 1].children[message.letterPos - 1].style.color = 'green';
}

const getGameStatus = () => {
  socketClient.send("wordsmith", {
    action: 'status',
    gameroom,
  });
}

socketClient.on(gameroom, (message) => {
  if (reactions[message.action]) reactions[message.action](message);
});

for (let i = 0; i < joinButtons.length; i++) {
  joinButtons[i].addEventListener('click', joinGame);
}

document.addEventListener('keyup', (event) => {
  if (!gameActive) return;
  if (event.key.toLowerCase() === activeWord[letterPos].toLowerCase()) {
    letterPos += 1;
    sendMessage(event.key);
  }
});

(() => {
  username = localStorage.getItem("username");
  if (!username) {
    localStorage.setItem("returnTo", "/game");
    location.href = '/';
  }
  getGameStatus();
})();
