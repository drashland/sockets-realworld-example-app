import { socketClient } from '/public/main.js';

const gameWord = document.getElementsByClassName('game-word');
const joinButtons = document.getElementsByClassName('join');

let gameroom = 'gameroom-1';
let gameActive = false;
let username;
let activeWord = null;
let letterPos = 0;

let player = null;

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
  const wordElements = activeWord.split('').map(l => {
    const letter = document.createElement('span');
    letter.innerHTML = l;
    return letter;
  });
  let index = 0;
  while (index < gameWord.length) {
    console.log(gameWord[index]);
    gameWord[index].append(...wordElements);
    index += 1;
  }
}

const countdown = () => {
  gameActive = true;
  revealWord();
}

const resetGame = () => {
  for (let i = 0; i < gameWord.length; i++) {
    console.log(gameWord[i].firstChild)
    while (gameWord[i].firstChild) {
      gameWord[i].removeChild(gameWord[i].firstChild);
    }
  }
  for (let i = 0; i < joinButtons.length; i++) {
    joinButtons[i].style.display = 'inline';
  }
  player = null;
}

const endGame = (username) => {
  gameActive = false;
  resetGame();
  alert(`${username} won!`);
};

const updateProgress = (message) => {
  gameWord[message.space - 1].children[message.letterPos - 1].style.color = 'green';
}

const getGameStatus = () => {
  socketClient.send("wordsmith", {
    action: 'status',
    gameroom,
  });
}

socketClient.on(gameroom, (message) => {
  const players = message.status ? message.status.players : [];
  console.log(' on game room: ', message);

  if (message.action === 'player_left') {
    if (message.space !== -1) {
      joinButtons[message.space - 1].style.display = "inline";
    }
  }

  if (message.action === 'status') {
    for (let i = 0; i < players.length; i++) {
      if (players[i]) joinButtons[i].style.display = "none";
    }
    return;
  }
  if (message.action === 'player_joined') {
    if (message.space) joinButtons[message.space - 1].style.display = "none";
  }
  if (message.action === 'active_word') {
    if (message.space) joinButtons[message.space - 1].style.display = "none";
    activeWord = message.activeWord;
    countdown();
  }

  if (message.action === 'input') updateProgress(message);
  if (message.completed && gameActive) {
    updateProgress(message);
    endGame(message.username);
  }
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
  if (!history.state) {
    localStorage.setItem("returnTo", "/game");
    return location.href = '/';
  }
  username = history.state.username;
  getGameStatus();
})();
