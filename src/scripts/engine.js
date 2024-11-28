const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.getElementById("score_points"),
  },
  cardSprite: {
    avatar: document.getElementById("card-image"),
    name: document.getElementById("card-name"),
    type: document.getElementById("card-type"),
  },
  fieldCards: {
    player: document.getElementById("player-field-card"),
    computer: document.getElementById("computer-field-card"),
  },
  button: document.getElementById("next-duel"),
};
const player = {
  player1: "player-cards",
  computer: "computer-cards",
};
const cardData = [
  {
    id: 0,
    name: "Blue Eyes White Dragon",
    attack: 3000,
    img: "./src/assets/icons/dragon.png",
  },
  {
    id: 1,
    name: "Dark Magician",
    attack: 2500,
    img: "./src/assets/icons/magician.png",
  },
  {
    id: 2,
    name: "Exodia",
    attack: 9999999,
    img: "./src/assets/icons/exodia.png",
  },
  {
    id: 3,
    name: "Lucifer",
    attack: 3000,
    img: "./src/assets/icons/lucifer.png",
  },
  {
    id: 4,
    name: "Michael",
    attack: 2600,
    img: "./src/assets/icons/michael.png",
  },
  {
    id: 5,
    name: "Erebus",
    attack: 2800,
    img: "./src/assets/icons/erebus.png",
  },
  {
    id: 6,
    name: "Irou",
    attack: 1700,
    img: "./src/assets/icons/irou.png",
  },
  {
    id: 7,
    name: "Red Eyes Black Dragon",
    attack: 2400,
    img: "./src/assets/icons/red.png",
  },
  {
    id: 8,
    name: "Neos",
    attack: 2500,
    img: "./src/assets/icons/neos.png",
  },
  {
    id: 9,
    name: "Stardust Dragon",
    attack: 2500,
    img: "./src/assets/icons/star.png",
  },
];

let usedCards [];

async function getRandomCardId() {
  const availableCards = cardData.filter(card => !usedCards.includes(card.id));
  if (availableCards.length === 0) {
    throw new Error("Todas as cartas já foram distribuídas.");
  }
  const randomIndex = Math.floor(Math.random() * availableCards.length);
  return availableCards[randomIndex].id;
}
async function setCardsField(cardId) {
  await RemoveAllCardImages();
  let computerCardId = await getRandomCardId();
  state.fieldCards.player.style.display = "block";
  state.fieldCards.computer.style.display = "block";
  await hiddenCardDetails();
  state.fieldCards.player.src = cardData[cardId].img;
  state.fieldCards.computer.src = cardData[computerCardId].img;
  let duelResults = await checkDuelResults(cardId, computerCardId);
  await updateScore();
  await drawButton(duelResults);
}
async function checkDuelResults(playerCardId, computerCardId) {
  let playerCard = cardData[playerCardId];
  let computerCard = cardData[computerCardId];
  let duelResults = "Empate";

  if (playerCard.attack > computerCard.attack) {
    duelResults = "Ganhou";
    await playAudio("win");
    state.score.playerScore++;
  } else if (playerCard.attack < computerCard.attack) {
    duelResults = "Perdeu";
    await playAudio("lose");
    state.score.computerScore++;
  }
  return duelResults;
}
async function createCardImage(randomIdCard, fieldSide) {
  const cardImage = document.createElement("img");
  cardImage.setAttribute("height", "100px");
  cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
  cardImage.setAttribute("data-id", randomIdCard);
  cardImage.classList.add("card");
  if (fieldSide === player.player1) {
    cardImage.addEventListener("click", () => {
      setCardsField(cardImage.getAttribute("data-id"));
    });
    cardImage.addEventListener("mouseover", () => {
      drawSelectCard(randomIdCard);
    });
  }
  return cardImage;
}
async function RemoveAllCardImages() {
  let cards = document.querySelector(".card-box.framed#computer-cards");
  let imgElements = cards.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());
  cards = document.querySelector(".card-box.framed#player-cards");
  imgElements = cards.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());
}
async function drawCards(cardNumbers, fieldSide) {
  for (let i = 0; i < cardNumbers; i++) {
    const randomIdCard = await getRandomCardId();
    usedCards.push(randomIdCard);
    const cardImage = await createCardImage(randomIdCard, fieldSide);
    document.getElementById(fieldSide).appendChild(cardImage);
  }
}
function drawSelectCard(index) {
  state.cardSprite.avatar.src = cardData[index].img;
  state.cardSprite.name.innerText = cardData[index].name;
  state.cardSprite.type.innerText = `Attack: ${cardData[index].attack}`;
}

async function hiddenCardDetails() {
  state.cardSprite.avatar.src = "";
  state.cardSprite.name.innerText = "";
  state.cardSprite.type.innerText = "";
}

async function drawButton(text) {
  state.button.innerText = text;
  state.button.style.display = "block";
}
async function resetDuel() {
  usedCards = [];
  state.cardSprite.avatar.src = "";
  state.button.style.display = "none";
  state.fieldCards.player.style.display = "none";
  state.fieldCards.computer.style.display = "none";
  drawCards(5, player.player1);
  drawCards(5, player.computer);
}
async function playAudio(status) {
  const audio = new Audio(`./src/assets/audios/${status}.wav`);
  audio.play();
}
async function updateScore() {
  state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}
function init() {
  state.fieldCards.player.style.display = "none";
  state.fieldCards.computer.style.display = "none";
  drawCards(5, player.player1);
  drawCards(5, player.computer);
 document.addEventListener("click", () => {
  const bgm = document.getElementById("bgm");
  bgm.play();
}, { once: true });
}
init();
