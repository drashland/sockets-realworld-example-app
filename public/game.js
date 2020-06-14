import { socketClient } from '/public/main.js';

const opponentBox = document.getElementById('game-opponent');
const userBox = document.getElementById('game-user');
const joinButtons = document.getElementsByClassName('join');

let gameroom = 'gameroom-1';
let gameActive = false;
let username;
let activeWord = 'Testing';
let letterPos = 0;

let opponentProgress = '';
let playerCount = 0;
let player = null;

const joinGame = ({ target }) => {
  if (player) return alert("You have already joined.");
  const { value: space } = target;
  console.log('join what position: ', space);
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
  gameActive = true;
  revealWord();
}

const endGame = (username) => {
  gameActive = false;
  alert(`${username} won!`);
};

const updateProgress = (message) => {
  if (message.username !== username) {
    // update opponent
  } else {
    // update user
  }

}

socketClient.on(gameroom, (message) => {
  console.log(gameroom);
  if (message.action === 'player_joined') {
    playerCount += 1;
    if (message.space) joinButtons[space].style.display = "none";
    if (playerCount === 2) {
      countdown();
      return;
    }
  }

  updateProgress(message);
  if (message.completed && gameActive) {
    endGame(message.username);
  }
});

for (var i = 0; i < joinButtons.length; i++) {
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
})();
