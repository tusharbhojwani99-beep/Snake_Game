const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const tileCount = 20;

let snake = [{ x: 10, y: 10 }];
let direction = 'RIGHT';
let food = { x: 15, y: 10 };
let score = 0;
let gameSpeed = 10;

// Sound
const eatSound = new Audio("eat.mp3");

//dead sound
const deadSound = new Audio("modiji.mp3");

// High Score
let highScore = localStorage.getItem("highScore") || 0;

function draw() {
  // Background
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Snake
  ctx.fillStyle = '#00FF00';
  snake.forEach(segment => {
    ctx.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize - 2,
      gridSize - 2
    );
  });

  ctx.fillStyle = '#ff0000';
  ctx.fillRect(
    food.x * gridSize,
    food.y * gridSize,
    gridSize - 2,
    gridSize - 2
  );

  ctx.fillStyle = 'white';
  ctx.font = '16px Arial';
  ctx.fillText("Score: " + score, 10, 20);
  ctx.fillText("High: " + highScore, 10, 40);
}

function move() {
  let head = { ...snake[0] };

  if (direction === 'UP') head.y--;
  if (direction === 'DOWN') head.y++;
  if (direction === 'LEFT') head.x--;
  if (direction === 'RIGHT') head.x++;

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;

    eatSound.play();

    if (score % 5 === 0 && gameSpeed > 40) {
      gameSpeed -= 5;
    }

    placeFood();
  } else {
    snake.pop();
  }
}

document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
  if (event.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
  if (event.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
  if (event.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
  if (event.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
}

function checkCollision() {
  const head = snake[0];

  if (
    head.x < 0 ||
    head.x >= tileCount ||
    head.y < 0 ||
    head.y >= tileCount
  ) return true;

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y)
      return true;
  }

  return false;
}

function placeFood() {
  food.x = Math.floor(Math.random() * tileCount);
  food.y = Math.floor(Math.random() * tileCount);
}

function gameLoop() {
  move();

  if (checkCollision()) {
    deadSound.play(); 
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
    }

    alert('Game Over! Score: ' + score);
    snake = [{ x: 10, y: 10 }];
    direction = 'RIGHT';
    score = 0;
    gameSpeed = 150;
    placeFood();
  }

  draw();
  setTimeout(gameLoop, gameSpeed);
}

placeFood();
gameLoop();