const createBtn = document.getElementById("createBtn");
const timedTagBtn = document.getElementById("timedTagBtn");
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

const keys = {};
document.addEventListener("keydown", e => { keys[e.key] = true; });
document.addEventListener("keyup", e => { keys[e.key] = false; });

function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return function() {
    x = Math.sin(x) * 10000;
    return x - Math.floor(x);
  };
}

function generateMazeDFS(size, rng) {
  const maze = Array.from({ length: size }, () => Array(size).fill(1));

  function carve(x, y) {
    maze[y][x] = 0;
    const dirs = [
      [0, -2], [0, 2], [-2, 0], [2, 0]
    ];
    for (let i = dirs.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
    }
    for (const [dx, dy] of dirs) {
      const nx = x + dx;
      const ny = y + dy;
      if (
        nx >= 0 && nx < size && ny >= 0 && ny < size &&
        maze[ny][nx] === 1
      ) {
        maze[y + dy / 2][x + dx / 2] = 0;
        carve(nx, ny);
      }
    }
  }

  if (size % 2 === 0) size -= 1;
  carve(0, 0);

  for (let x = 0; x < size; x++) {
    maze[0][x] = 0;
  }

  return maze;
}

function drawMaze() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < mazeSize; y++) {
    for (let x = 0; x < mazeSize; x++) {
      ctx.fillStyle = maze[y][x] ? "#000" : "#fff";
      ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
    }
  }

  ctx.fillStyle = "red";
  ctx.fillRect(player.x * cellWidth, player.y * cellHeight, cellWidth, cellHeight);

  ctx.fillStyle = "blue";
  ctx.fillRect(player2.x * cellWidth, player2.y * cellHeight, cellWidth, cellHeight);
}

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

function gameLoop() {
  if (!gameOver) {
    // Player 1 (red, WASD)
    if (keys["w"]) movePlayer(0, -1);
    if (keys["s"]) movePlayer(0, 1);
    if (keys["a"]) movePlayer(-1, 0);
    if (keys["d"]) movePlayer(1, 0);
    // Player 2 (blue, arrows)
    if (keys["ArrowUp"]) movePlayer2(0, -1);
    if (keys["ArrowDown"]) movePlayer2(0, 1);
    if (keys["ArrowLeft"]) movePlayer2(-1, 0);
    if (keys["ArrowRight"]) movePlayer2(1, 0);
  }
  setTimeout(gameLoop, 100);
}

createBtn.onclick = () => {
  createBtn.style.display = "none";
  timedTagBtn.style.display = "none";
  seedInput.style.display = "block";
  confirmCreate.style.display = "block";
  backBtn.style.display = "block";
};

backBtn.onclick = () => {
  createBtn.style.display = "block";
  timedTagBtn.style.display = "block";
  seedInput.style.display = "none";
  confirmCreate.style.display = "none";
  backBtn.style.display = "none";
  canvas.style.display = "none";
};

confirmCreate.onclick = () => {
  const seedValue = seedInput.value;
  const seed = seedValue === "" ? Math.floor(Math.random() * 1000000) : parseInt(seedValue.split('').map(c=>c.charCodeAt(0)).join(''));
  const rng = seededRandom(seed);
  maze = generateMazeDFS(mazeSize, rng);
  player = { x: 0, y: 0 };
  player2 = { x: mazeSize - 1, y: 0 };
  gameOver = false;
  lastMovedPlayer = null;
  canvas.style.display = "block";
  drawMaze();
  gameLoop();
};

timedTagBtn.onclick = () => {
  alert("Join maze clicked!");
};
