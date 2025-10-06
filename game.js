const createBtn = document.getElementById("createBtn");
const joinBtn = document.getElementById("joinBtn");
const seedInput = document.getElementById("seedInput");
const confirmCreate = document.getElementById("confirmCreate");
const backBtn = document.getElementById("backBtn");
const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

const mazeSize = 20;
const cellWidth = canvas.width / mazeSize;
const cellHeight = canvas.height / mazeSize;
let maze = [];
let player = { x: 0, y: 0 }; // red, top left
let player2 = { x: mazeSize - 1, y: 0 }; // blue, top right
let gameOver = false;
let lastMovedPlayer = null; // 1 for red, 2 for blue

function getRandom(seed) {
  if (!seed) seed = Math.random() * 10000;
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

function generateMaze(seedFunc) {
  const m = [];
  for (let y = 0; y < mazeSize; y++) {
    m[y] = [];
    for (let x = 0; x < mazeSize; x++) {
      m[y][x] = seedFunc() < 0.3 ? 1 : 0;
    }
  }
  m[0][0] = 0;
  m[mazeSize-1][mazeSize-1] = 0;
  m[0][mazeSize-1] = 0;
  return m;
}

function drawMaze() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < mazeSize; y++) {
    for (let x = 0; x < mazeSize; x++) {
      ctx.fillStyle = maze[y][x] ? "#000" : "#fff";
      ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
    }
  }
  // Draw player 1 (red)
  ctx.fillStyle = "red";
  ctx.fillRect(player.x * cellWidth, player.y * cellHeight, cellWidth, cellHeight);

  // Draw player 2 (blue)
  ctx.fillStyle = "blue";
  ctx.fillRect(player2.x * cellWidth, player2.y * cellHeight, cellWidth, cellHeight);

function checkWin() {
  if (player.x === player2.x && player.y === player2.y) {
    gameOver = true;
    setTimeout(() => {
      if (lastMovedPlayer === 1) {
        alert("Red wins!");
      } else if (lastMovedPlayer === 2) {
        alert("Blue wins!");
      } else {
        alert("It's a tie!");
      }
    }, 50);
  }
}

function movePlayer(dx, dy) {
  if (gameOver) return;
  const newX = player.x + dx;
  const newY = player.y + dy;
  if (newX >= 0 && newX < mazeSize && newY >= 0 && newY < mazeSize) {
    if (maze[newY][newX] === 0) {
      player.x = newX;
      player.y = newY;
      lastMovedPlayer = 1;
    }
  }
  drawMaze();
  checkWin();
}

function movePlayer2(dx, dy) {
  if (gameOver) return;
  const newX = player2.x + dx;
  const newY = player2.y + dy;
  if (newX >= 0 && newX < mazeSize && newY >= 0 && newY < mazeSize) {
    if (maze[newY][newX] === 0) {
      player2.x = newX;
      player2.y = newY;
      lastMovedPlayer = 2;
    }
  }
  drawMaze();
  checkWin();
}

document.addEventListener("keydown", e => {
  if (gameOver) return;
  if (e.key === "w") movePlayer(0, -1);
  else if (e.key === "s") movePlayer(0, 1);
  else if (e.key === "a") movePlayer(-1, 0);
  else if (e.key === "d") movePlayer(1, 0);

  else if (e.key === "ArrowUp") movePlayer2(0, -1);
  else if (e.key === "ArrowDown") movePlayer2(0, 1);
  else if (e.key === "ArrowLeft") movePlayer2(-1, 0);
  else if (e.key === "ArrowRight") movePlayer2(1, 0);
});

createBtn.onclick = () => {
  createBtn.style.display = "none";
  joinBtn.style.display = "none";
  seedInput.style.display = "block";
  confirmCreate.style.display = "block";
  backBtn.style.display = "block";
};

backBtn.onclick = () => {
  createBtn.style.display = "block";
  joinBtn.style.display = "block";
  seedInput.style.display = "none";
  confirmCreate.style.display = "none";
  backBtn.style.display = "none";
  canvas.style.display = "none";
};

confirmCreate.onclick = () => {
  const seedValue = seedInput.value;
  const randomFunc = getRandom(seedValue || Math.random()*10000);
  maze = generateMaze(randomFunc);
  player = { x: 0, y: 0 };
  player2 = { x: mazeSize - 1, y: 0 }; // top right
  gameOver = false;
  lastMovedPlayer = null;
  canvas.style.display = "block";
  drawMaze();
};

joinBtn.onclick = () => {
  alert("Join maze clicked!");
};
