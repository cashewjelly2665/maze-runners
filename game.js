const createBtn = document.getElementById("createBtn");
const joinBtn = document.getElementById("joinBtn");
const seedInput = document.getElementById("seedInput");
const confirmCreate = document.getElementById("confirmCreate");
const backBtn = document.getElementById("backBtn");
const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

let mazeSize = 20;

function getRandom(seed) {
  if (!seed) seed = Math.random() * 10000;
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }
}

function generateMaze(seedFunc) {
  let maze = [];
  for (let y = 0; y < mazeSize; y++) {
    maze[y] = [];
    for (let x = 0; x < mazeSize; x++) {
      maze[y][x] = seedFunc() < 0.3 ? 1 : 0;
    }
  }
  maze[0][0] = 0;
  maze[mazeSize-1][mazeSize-1] = 0;
  return maze;
}

function drawMaze(maze) {
  const cellSize = canvas.width / mazeSize;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < mazeSize; y++) {
    for (let x = 0; x < mazeSize; x++) {
      ctx.fillStyle = maze[y][x] ? "#000" : "#fff";
      ctx.fillRect(x*cellSize, y*cellSize, cellSize, cellSize);
    }
  }
  canvas.style.display = "block";
}

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
  const maze = generateMaze(randomFunc);
  drawMaze(maze);
};

joinBtn.onclick = () => {
  alert("Join maze clicked!");
};
