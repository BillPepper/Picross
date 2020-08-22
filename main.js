const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const debug = false;

const prim = "#84a98c";
const sec = "#2f3e46";
const pass = "#cad2c5";
// const err = "#523535";
const err = "#333";

const res = 10;
const tileSize = 40;
const tileBorderRadius = 2;
const tileGap = 2;
const size = res * tileSize;
const helpLines = 3; // should be calculated

const disableHelpLines = false;
const disableTiles = false;

const tiles = [];

let tipsY = [];
let tipsX = [];

let turnCount = 0;

canvas.width = size;
canvas.height = size;
document.getElementById("game").style.gridTemplateColumns = `${size}px`;
document.getElementById(
  "tipsYList"
).style.gridTemplateRows = `repeat(${res}, ${tileSize}px)`;

document.addEventListener("contextmenu", (e) => handleAltTileClick(e));
document.addEventListener("click", (e) => handleTileClick(e));

const render = () => {
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
    context.strokeStyle = "#555";
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
  // document.getElementById("overlay").style.display = "block";
};

const handleTileClick = (e) => {
  const curTile = getTile(e);

  if (!tiles[curTile[1]][curTile[0]].dead) {
    tiles[curTile[1]][curTile[0]].clicked = true;
    if (!tiles[curTile[1]][curTile[0]].high) {
      tiles[curTile[1]][curTile[0]].correct = false;
    }
    turnCount++;
    refresh();
  }
};

const handleAltTileClick = (e) => {
  e.preventDefault();

  const curTile = getTile(e);
  if (!tiles[curTile[1]][curTile[0]].dead) {
    tiles[curTile[1]][curTile[0]].clicked = true;
    if (tiles[curTile[1]][curTile[0]].high) {
      tiles[curTile[1]][curTile[0]].correct = false;
    }
    turnCount++;
    refresh();
  }
};

const getTile = (e) => {
  const x = Math.floor(e.clientX / tileSize);
  const y = Math.floor(e.clientY / tileSize);

  return [x, y];
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
  for (let i = 0; i < tipsY.length; i++) {
    const ty = document.getElementById("tipsY").children[0];

    const e = document.createElement("li");
    e.innerText = tipsY[i];

    ty.appendChild(e);
  }

  for (let i = 0; i < tipsX.length; i++) {
    const tx = document.getElementById("tipsX").children[0];

    const e = document.createElement("li");
    e.innerText = tipsX[i];

    tx.appendChild(e);
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

generateTiles();
render();
getTipsX();
getTipsY();
renderTips();
