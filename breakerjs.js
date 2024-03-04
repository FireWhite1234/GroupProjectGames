let background;
let backgroundWidth = 800;
let backgroundHeight = 550;
let context;
let pongWidth = 160;
let pongHeight = 20;
let pongMoveX = 0;
let ballWidth = 20;
let ballHeight = 20;
let ballVelocityX = 5;
let ballVelocityY = 4;
let brickArray = [];
let brickWidth = 83;
let brickHeight = 20;
let brickColumns = 8;
let brickRows = 3;
let brickMax = 6;
let brickCount = 0;
let brickX = 15;
let brickY = 30;
let rand = Math.floor(Math.random() * 6);
let score = 0;
let gameOver = false;

var KEY_A = 65, KEY_D = 68,
keyHeld_Left = false,
keyHeld_Right = false;

let ball = {
    x : backgroundWidth/2 - 100,
    y : backgroundHeight/2,
    width : ballWidth,
    height : ballHeight,
    velocityX : ballVelocityX,
    velocityY : ballVelocityY
}

let pong = {
    x : backgroundWidth/2 - pongWidth/2,
    y : backgroundHeight - pongHeight - 5,
    width : pongWidth,
    height : pongHeight,
}

function update(){
    requestAnimationFrame(update);
    if (gameOver){
        return;
    }
    context.clearRect(0, 0, backgroundWidth, backgroundHeight);
    context.fillStyle = "white";
    context.fillRect(pong.x, pong.y, pong.width, pong.height);
    ball.x += ballVelocityX;
    ball.y += ballVelocityY;
    context.fillRect(ball.x, ball.y, ball.width, ball.height);
    
    if (ball.y <= 0){
        ballVelocityY *= -1;
    }
    else if (ball.x <= 0 || (ball.x + ball.width >= backgroundWidth)){
        ballVelocityX *= -1;
    }
    else if (ball.y + ball.height >= backgroundHeight){
        //Gameover goes here
        context.font = "40px Wildwest";
        context.fillText("Game Over: Press 'Space' to Restart", 120, 400);
        gameOver = true;
    }
    
    if (topCollision(ball, pong) || bottomCollision(ball, pong)){
        ballVelocityY *= -1;
    }
    else if (leftCollision(ball, pong) || rightCollision(ball, pong)){
        ballVelocityX *= -1;
    }

    if(rand <= 1){
        context.fillStyle = "pink";
    }
    else if (rand <= 2){
        context.fillStyle = "red";
    }
    else if (rand <= 3){
        context.fillStyle = "yellow";
    }
    else if (rand <= 4){
        context.fillStyle = "green";
    }
    else if(rand <= 5){
        context.fillStyle = "blue";
    }

    for (let i = 0; i < brickArray.length; i++){
        let brick = brickArray[i];
        if (!brick.break){
            if (topCollision(ball, brick) || bottomCollision(ball, brick)){
                brick.break = true;
                ballVelocityY *= -1;
                brickCount -= 1;
                score += 100;
            }
            else if (leftCollision(ball, brick) || rightCollision(ball, brick)){
                brick.break = true;
                ballVelocityX *= -1;
                brickCount -= 1;
                score += 100;
            }
            context.fillRect(brick.x, brick.y, brick.width, brick.height);
        }
    }
    context.fillStyle = "white";
    context.font = "20px Wildwest";
    context.fillText(score, 15, 22);

    if(brickCount == 0){
        rand = Math.floor(Math.random() * 6);
        brickRows = Math.min(brickRows + 1, brickMax);
        createBricks();
    }
}

function keyPressed(input){
    if (input.keyCode == KEY_A){
        keyHeld_Left = true;
    }
    else if (input.keyCode == KEY_D){
        keyHeld_Right = true;
    }
    if ((input.code == "Space") && (gameOver == true)){
        rand = Math.floor(Math.random() * 6);
        resetGame();
    }
    input.preventDefault();
}

function keyReleased(input){
    if (input.keyCode == KEY_A){
        keyHeld_Left = false;
        pongMoveX = 0;
    }
    if (input.keyCode == KEY_D){
        keyHeld_Right = false;
        pongMoveX = 0;
    }
}

function movePong(){
    pong.x += pongMoveX;
    if (keyHeld_Left) {
        pongMoveX = -8;
    }
    if (keyHeld_Right) {
        pongMoveX = 8;
    }
    if (pong.x >= backgroundWidth - pongWidth){
        pong.x = backgroundWidth - pongWidth + 2;
        
    }
    else if (pong.x <= 0){
        pong.x = 2;
    }
}

function detectCollision(a, b){
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

function topCollision(ball, block){
    return detectCollision(ball,block) && (ball.y + ball.height) >= block.y;
}

function bottomCollision(ball, block){
    return detectCollision(ball, block) && (block.y + block.height) >= ball.y;
}

function leftCollision(ball, block){
    return detectCollision(ball, block) && (ball.x + ball.width) >= block.x;
}

function rightCollision(ball, block){
    return detectCollision(ball, block) && (ball.x + ball.width) >= ball.x;
}

function createBricks(){
    brickArray = [];
    for (let i = 0; i < brickColumns; i++){
        for (let j =0; j < brickRows; j++){
            let brick = {
                x : brickX + i*brickWidth + i*15,
                y : brickY + j*brickHeight + j*15,
                width : brickWidth,
                height : brickHeight,
                break : false
            }
            brickArray.push(brick);
        }
    }
    brickCount = brickArray.length;
}

function resetGame(){
    gameOver = false;

    pong = {
        x : backgroundWidth/2 - pongWidth/2,
        y : backgroundHeight - pongHeight - 5,
        width : pongWidth,
        height : pongHeight,
    }

    ball = {
        x : backgroundWidth/2,
        y : backgroundHeight/2,
        width : ballWidth,
        height : ballHeight,
        velocityX : ballVelocityX,
        velocityY : ballVelocityY
    }

    brickArray = [];
    score = 0;
    brickRows = 3;
    createBricks();
}

window.onload = function(){
    background = document.getElementById("background");
    background.width = backgroundWidth;
    background.height = backgroundHeight;
    context = background.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(pong.x, pong.y, pong.width, pong.height);
    requestAnimationFrame(update);
    createBricks();
    var framesPerSecond = 60;
    setInterval(function() {
    movePong();
    document.addEventListener("keydown", keyPressed);
    document.addEventListener("keyup", keyReleased);
    }, 1000 / framesPerSecond);
}