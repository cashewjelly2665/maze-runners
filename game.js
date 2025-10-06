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
let player = { x: 0, y: 0 };

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
  // Draw player
  ctx.fillStyle = "red";
  ctx.fillRect(player.x * cellWidth, player.y * cellHeight, cellWidth, cellHeight);
}

function movePlayer(dx, dy) {
  const newX = player.x + dx;
  const newY = player.y + dy;
  if (newX >= 0 && newX < mazeSize && newY >= 0 && newY < mazeSize) {
    if (maze[newY][newX] === 0) {
      player.x = newX;
      player.y = newY;
    }
  }
  drawMaze();
}

document.addEventListener("keydown", e => {
  if (e.key === "w") movePlayer(0, -1);
  else if (e.key === "s") movePlayer(0, 1);
  else if (e.key === "a") movePlayer(-1, 0);
  else if (e.key === "d") movePlayer(1, 0);
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
  canvas.style.display = "block";
  drawMaze();
};

joinBtn.onclick = () => {
  alert("Join maze clicked!");
};
