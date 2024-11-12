
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
};

let pipeArr = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;
let topPipeImg;
let bottomPipeImg;

let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;
let gameOver = false;
let score = 0;
let gameStarted = false;

window.onload = function () {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    birdImg = new Image();
    birdImg.src = "./flappybird.png";

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    context.fillStyle = "white";
    context.font = "20px sans-serif";
    context.fillText("Get Ready! Press Jump Button", boardWidth / 8, boardHeight / 2);

    // Delay the start of the game by 2 seconds
    setTimeout(() => {
        gameStarted = true;
        requestAnimationFrame(update);
        setInterval(placePipes, 1500);
        document.addEventListener("keydown", moveBird);
    }, 2000);
};

function update() {
    if (!gameStarted) return; // Skip updating if game hasn't started

    requestAnimationFrame(update);
    if (gameOver) return;

    context.clearRect(0, 0, board.width, board.height);

    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
        document.getElementById("playAg").style.display = "block"; // Show "Play Again" button
    }

    for (let i = 0; i < pipeArr.length; i++) {
        let pipe = pipeArr[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 5;
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
            document.getElementById("playAg").style.display = "block"; // Show "Play Again" button
        }
    }

    while (pipeArr.length > 0 && pipeArr[0].x < -pipeWidth) {
        pipeArr.shift();
    }

    context.fillStyle = "white";
    context.font = "40px sans-serif";
    context.fillText(score, 5, 45);

    if (gameOver) {
        context.fillText("Game Over", 85, 100);
    }
}

function placePipes() {
    if (gameOver) return;

    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = board.height / 4;

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArr.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArr.push(bottomPipe);
}

function moveBird(e) {
    if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyX") {
        if (!gameOver) {
            velocityY = -5;
        } else {
            resetGame();
        }
    }
}

function jumpBird() {
    if (!gameOver && gameStarted) {
        velocityY = -5;
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}

function playAgain() {
    resetGame();
}

function resetGame() {
    bird.y = birdY;
    pipeArr = [];
    score = 0;
    velocityY = 0;
    gameOver = false;
    document.getElementById("playAg").style.display = "none"; // Hide "Play Again" button
}