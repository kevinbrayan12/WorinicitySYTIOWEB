const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let level = 1;
let obstacles = [];
let gameOver = false;
let gameWon = false;

const dinosaurImg = new Image();
dinosaurImg.src = "img/dinosaur.png";

const obstacleImg = new Image();
obstacleImg.src = "img/obstacle.png";

const backgroundImages = [
  "img/background1.jpg",
  "img/background2.jpg",
  "img/background3.jpg"
];
let currentBackground = new Image();
currentBackground.src = backgroundImages[0];

// 🎵 Audios
const backgroundMusic = new Audio("music/background.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5;
backgroundMusic.play();

const jumpSound = new Audio("sounds/jump.mp3");
const loseSound = new Audio("sounds/lose.mp3");
const winSound = new Audio("sounds/win.mp3");

let player = {
  x: 50,
  y: 300,
  width: 50,
  height: 50,
  velocityY: 0,
  jumping: false
};

const gravity = 0.5;
const ground = 350;

function loadBackground() {
  currentBackground.src = backgroundImages[(level - 1) % backgroundImages.length];
}

function spawnObstacle() {
  obstacles.push({
    x: canvas.width,
    y: ground,
    width: 40,
    height: 50
  });
}

function drawBackground() {
  ctx.drawImage(currentBackground, 0, 0, canvas.width, canvas.height);
}

function drawPlayer() {
  ctx.drawImage(dinosaurImg, player.x, player.y, player.width, player.height);
}

function drawObstacles() {
  for (let i = 0; i < obstacles.length; i++) {
    const obs = obstacles[i];
    ctx.drawImage(obstacleImg, obs.x, obs.y, obs.width, obs.height);
  }
}

function drawUI() {
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.fillText("Nivel: " + level, 10, 30);

  if (level === 5 && !gameWon) {
    ctx.font = "24px Arial";
    ctx.fillText("🌍 ¡Nivel 5 alcanzado!", 140, 80);
    ctx.fillText("No cualquiera llega aquí... eres único, sigue así!", 60, 110);
  }

  if (level >= 10 && !gameWon) {
    ctx.font = "24px Arial";
    ctx.fillText("🏆 ¡PERFECTO! Has ganado el primer desafío.", 90, 100);
    ctx.fillText("Comparte tu récord con tus amigos 😎", 100, 130);
    winSound.play(); // 💥 sonido de victoria
    gameWon = true;
  } else if (level >= 100) {
    ctx.font = "20px Arial";
    ctx.fillText("★ ¡Eres una leyenda! Nivel 100 alcanzado 💎", 160, 140);
    ctx.fillText("Escribe a elbrayansoypro@gmail.com para reclamar tu premio en dinero real.", 40, 170);
  }
}

function resetGame() {
  player.y = 300;
  player.jumping = false;
  player.velocityY = 0;
  obstacles = [];
  level = 1;
  gameOver = false;
  gameWon = false;
  loadBackground();
  backgroundMusic.currentTime = 0;
  backgroundMusic.play();
  gameLoop();
}

function update() {
  drawBackground();
  drawUI();

  if (player.jumping) {
    player.velocityY += gravity;
    player.y += player.velocityY;

    if (player.y >= ground) {
      player.y = ground;
      player.jumping = false;
      player.velocityY = 0;
    }
  }

  drawPlayer();

  for (let i = 0; i < obstacles.length; i++) {
    let obs = obstacles[i];
    obs.x -= 4 + level;

    if (
      player.x < obs.x + obs.width &&
      player.x + player.width > obs.x &&
      player.y < obs.y + obs.height &&
      player.y + player.height > obs.y
    ) {
      ctx.fillStyle = "#fff";
      ctx.font = "40px Arial";
      ctx.fillText("💀 ¡PERDISTE!", canvas.width / 2 - 120, canvas.height / 2);
      ctx.font = "20px Arial";
      ctx.fillText("Presiona R para reiniciar", canvas.width / 2 - 110, canvas.height / 2 + 30);
      backgroundMusic.pause();
      loseSound.play(); // sonido de pérdida
      gameOver = true;
      return;
    }
  }

  drawObstacles();
  obstacles = obstacles.filter(obs => obs.x + obs.width > 0);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  update();
  if (!gameOver) requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !player.jumping && !gameOver) {
    player.velocityY = -12;
    player.jumping = true;
    jumpSound.play(); // sonido de salto
  }
  if (e.code === "KeyR" && gameOver) {
    resetGame();
  }
});

setInterval(() => {
  if (!gameOver) spawnObstacle();
}, 1800);

setInterval(() => {
  if (!gameOver && level < 100) {
    level++;
    loadBackground();
  }
}, 20000);

loadBackground();
gameLoop();
// Detectar si está en móvil (solo para controles)
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// Botones
const jumpBtn = document.getElementById("jumpBtn");
const restartBtn = document.getElementById("restartBtn");

jumpBtn.addEventListener("click", () => {
  if (!player.jumping && !gameOver) {
    player.velocityY = -12;
    player.jumping = true;
    jumpSound.play();
  }
});

restartBtn.addEventListener("click", () => {
  resetGame();
  restartBtn.style.display = "none";
});

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !player.jumping && !gameOver) {
    player.velocityY = -12;
    player.jumping = true;
    jumpSound.play();
  }
  if (e.code === "KeyR" && gameOver) {
    resetGame();
    restartBtn.style.display = "none";
  }
});

// Mostrar botón de reinicio si pierde
function showRestartIfGameOver() {
  if (gameOver) {
    restartBtn.style.display = "inline-block";
  }
}

// Llamar después de detectar pérdida
function update() {
  drawBackground();
  drawUI();

  if (player.jumping) {
    player.velocityY += gravity;
    player.y += player.velocityY;
    if (player.y >= ground) {
      player.y = ground;
      player.jumping = false;
      player.velocityY = 0;
    }
  }

  drawPlayer();

  for (let i = 0; i < obstacles.length; i++) {
    let obs = obstacles[i];
    obs.x -= 4 + level;

    if (
      player.x < obs.x + obs.width &&
      player.x + player.width > obs.x &&
      player.y < obs.y + obs.height &&
      player.y + player.height > obs.y
    ) {
      ctx.fillStyle = "#fff";
      ctx.font = "40px Arial";
      ctx.fillText("💀 ¡PERDISTE!", canvas.width / 2 - 120, canvas.height / 2);
      ctx.font = "20px Arial";
      ctx.fillText("Presiona R o botón para reiniciar", canvas.width / 2 - 120, canvas.height / 2 + 30);
      backgroundMusic.pause();
      loseSound.play();
      gameOver = true;
      showRestartIfGameOver();
      return;
    }
  }

  drawObstacles();
  obstacles = obstacles.filter(obs => obs.x + obs.width > 0);
}
