const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const debug = false;

const prim = "#84a98c";
const sec = "#2f3e46";
const pass = "#cad2c5";
const err = "#523535";

const res = 10;
const tileSize = 40;
const tileGap = 2;
const size = res * tileSize;

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
  for (let i = 0; i < tiles.length; i++) {
    for (let j = 0; j < tiles[i].length; j++) {
      const c = tiles[i][j];

      context.fillStyle = debug ? (c.b ? "#000" : "#555") : tiles[i][j].c;
      context.fillRect(
        c.x * tileSize + tileGap,
        c.y * tileSize + tileGap,
        tileSize - tileGap * 2,
        tileSize - tileGap * 2
      );
    }
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
    if (tiles[curTile[1]][curTile[0]].b === true) {
      tiles[curTile[1]][curTile[0]].c = prim;
    } else {
      tiles[curTile[1]][curTile[0]].c = err;
    }
    turnCount++;
    tiles[curTile[1]][curTile[0]].dead = true;
    refresh();
  }
};

const handleAltTileClick = (e) => {
  e.preventDefault();

  const curTile = getTile(e);
  if (!tiles[curTile[1]][curTile[0]].dead) {
    if (tiles[curTile[1]][curTile[0]].b === false) {
      tiles[curTile[1]][curTile[0]].c = sec;
    } else {
      tiles[curTile[1]][curTile[0]].c = err;
    }
    turnCount++;
    tiles[curTile[1]][curTile[0]].dead = true;

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
      tileValString += tiles[j][i].b === true ? 1 : 0;
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
      tileValString += tiles[i][j].b === true ? 1 : 0;
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
      const nu = { x: j, y: i, dead: false, b: randomBool(), c: pass };
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
