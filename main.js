const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const game = document.getElementById("game");

const debug = false;
const version = 'v0.0.2'

const prim = "#84a98c";
const sec = "#2f3e46";
const tert = "#f68404";
const pass = "#cad2c5";
const err = "#333";

const res = 5;
const tileSize = 40;
const tileBorderRadius = 2;
const tileGap = 2;
const size = res * tileSize;
const helpLines = 3; // should be calculated

const disableHelpLines = false;
const disableTiles = false;
const disableTips = false;
const disableStats = false;

let stats = {
  attempts: 0,
  correct: 0,
  mistake: 0,
};

let gameActive = true;
let tiles = [];
let tipsY = [];
let tipsX = [];
let turnCount = 0;

document.getElementById('versionString').innerText = version;

canvas.width = size;
canvas.height = size;
game.style.gridTemplateColumns = `auto 50px ${size}px 50px auto`;
game.style.gridTemplateRows = `auto 50px ${size}px 50px auto`;
document.getElementById(
  "tipsYList"
).style.gridTemplateRows = `repeat(${res}, ${tileSize}px)`;

if (disableStats) {
  document.getElementById("stats").style.display = "none";
}

document.addEventListener("keydown", (e) => e.key === "q" && handleGameEnd());
document.addEventListener("contextmenu", (e) => handleAltTileClick(e));
document.addEventListener("click", (e) => handleTileClick(e));
document
  .getElementById("restartButton")
  .addEventListener("click", () => restartGame());

const render = () => {
  context.fillStyle = err;
  context.beginPath();
  context.rect(0, 0, size, size);
  context.fill();
  if (!disableHelpLines) {
    for (let i = 0; i <= helpLines; i++) {
      const lineHeight = tileSize * 5 * i;
      context.strokeStyle = prim;
      context.beginPath();
      context.moveTo(0, lineHeight);
      context.lineTo(size, tileSize * 5 * i);
      context.stroke();
      context.beginPath();
      context.moveTo(lineHeight, 0);
      context.lineTo(tileSize * 5 * i, size);
      context.stroke();
    }
  }
  if (!disableTiles) {
    for (let i = 0; i < tiles.length; i++) {
      for (let j = 0; j < tiles[i].length; j++) {
        const currentTile = tiles[i][j];
        renderTile(
          currentTile.x * tileSize + tileGap,
          currentTile.y * tileSize + tileGap,
          tileSize - tileGap * 2,
          tileBorderRadius,
          tiles[i][j].correct,
          tiles[i][j].high,
          tiles[i][j].clicked
        );
      }
    }
  }
};

const renderTile = (x, y, size, radius, correct, b, clicked) => {
  context.strokeStyle = "#333";
  context.fillStyle = clicked ? (b === true ? prim : err) : pass;
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(size + x - radius, y);
  context.lineTo(size + x, y + radius);
  context.lineTo(size + x, size + y - radius);
  context.lineTo(size + x - radius, size + y);
  context.lineTo(x + radius, size + y);
  context.lineTo(x, size + y - radius);
  context.lineTo(x, y + radius);
  context.lineTo(x + radius, y);
  context.closePath();
  context.fill();
  context.stroke();

  if (clicked && !correct) {
    console.log(correct);
    const fourth = size / 4;
    context.strokeStyle = tert;
    context.beginPath();
    context.lineWidth = 4;
    context.moveTo(x + fourth, y + fourth);
    context.lineTo(x + size - fourth, y + size - fourth);
    context.moveTo(x + size - fourth, y + fourth);
    context.lineTo(x + fourth, y + size - fourth);
    context.closePath();
    context.stroke();
    context.lineWidth = 1;
  }
};

const refresh = () => {
  context.clearRect(0, 0, size, size);
  if (turnCount >= tiles.length * tiles.length) {
    handleGameEnd();
  }
  render();
};

const handleGameEnd = () => {
  console.log("game end");
  gameActive = false;
  document.getElementById("overlay").style.display = "block";
  document.getElementById("overlayText").innerText = mistakes
    ? `You finished with ${mistakes} mistakes`
    : "Perfect, no mistakes!";
};

const restartGame = () => {
  console.log("reset game");
  gameActive = true;
  tiles = [];
  tipsY = [];
  tipsX = [];
  turnCount = 0;
  mistakes = 0;
  document.getElementById("overlay").style.display = "none";
  startGame();
};

const startGame = () => {
  generateTiles();
  render();
  getTipsX();
  getTipsY();
  renderTips();
  // gameActive = true;
};

const handleTileClick = (e) => {
  if (gameActive) {
    const tileIndicies = getTileIndecies(e);
    const currentTile = tiles[tileIndicies[1]][tileIndicies[0]];

    try {
      if (!currentTile.clicked) {
        stats.attempts++;
        currentTile.clicked = true;
        if (!currentTile.high) {
          currentTile.correct = false;
          stats.mistake++;
        } else {
          stats.correct++;
        }
        turnCount++;
        refresh();
      }
    } catch (e) {
      console.log("You did not click the gameboard");
    }
  } else {
    console.log("game not active");
  }

  updateStats();
};

const handleAltTileClick = (e) => {
  e.preventDefault();

  const tileIndicies = getTileIndecies(e);
  const currentTile = tiles[tileIndicies[1]][tileIndicies[0]];

  if (gameActive) {
    try {
      if (!currentTile.clicked) {
        stats.attempts++;
        currentTile.clicked = true;
        if (currentTile.high) {
          currentTile.correct = false;
          stats.mistake++;
        } else {
          stats.correct++;
        }
        turnCount++;
        refresh();
      }
    } catch (e) {
      console.log("You did not click the gameboard");
    }

    updateStats();
  }
};

const getTileIndecies = (e) => {
  console.log(canvas.offsetLeft, e.clientX);
  const x = Math.floor((e.clientX - canvas.offsetLeft) / tileSize);
  const y = Math.floor((e.clientY - canvas.offsetTop) / tileSize);

  return [x, y];
};

const updateStats = () => {
  if (!disableStats) {
    const statElements = document.getElementById("stats");
    statElements.children[0].innerText = `Attempts: ${stats.attempts}`;
    statElements.children[1].innerText = `Correct: ${stats.correct}`;
    statElements.children[2].innerText = `Mistakes: ${stats.mistake}`;
  }
};

const getTipsX = () => {
  for (let i = 0; i < tiles.length; i++) {
    let tileValString = "";
    for (let j = 0; j < tiles.length; j++) {
      tileValString += tiles[j][i].high === true ? 1 : 0;
    }

    let result = [];
    const split = tileValString.split("0");
    split.map((s) => s.length > 0 && result.push(s.length));
    tipsX.push(result);
  }
};

const getTipsY = () => {
  for (let i = 0; i < tiles.length; i++) {
    let tileValString = "";
    for (let j = 0; j < tiles[i].length; j++) {
      tileValString += tiles[i][j].high === true ? 1 : 0;
    }

    let result = [];
    const split = tileValString.split("0");
    split.map((s) => s.length > 0 && result.push(s.length));
    tipsY.push(result);
  }
};

const renderTips = () => {
  const tipsXList = document.getElementById("tipsXList");
  const tipsYList = document.getElementById("tipsYList");

  tipsXList.innerHTML = "";
  tipsYList.innerHTML = "";

  if (!disableTips) {
    for (let i = 0; i < tipsY.length; i++) {
      const ty = document.getElementById("tipsY").children[0];

      const li = document.createElement("li");
      const span = document.createElement("span");
      span.innerText = tipsY[i];
      li.appendChild(span);

      ty.appendChild(li);
    }

    for (let i = 0; i < tipsX.length; i++) {
      const tx = document.getElementById("tipsX").children[0];

      const li = document.createElement("li");
      const span = document.createElement("span");
      span.innerText = tipsX[i];
      span.className = "tipRotate";
      li.appendChild(span);

      tx.appendChild(li);
    }
  }
};

const randomBool = () => {
  return Math.round(Math.random()) === 1 ? true : false;
};

const generateTiles = () => {
  for (let i = 0; i < res; i++) {
    let c = 0;
    let arr = [];
    for (let j = 0; j < res; j++) {
      const nu = {
        x: j,
        y: i,
        correct: true,
        high: randomBool(),
        clicked: false,
      };
      arr.push(nu);
      c++;

      if (c > res - 1) {
        tiles.push(arr);
        arr = [];
        c = 0;
      }
    }
  }
};

startGame();
