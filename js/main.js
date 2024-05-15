const gameCanvas = document.getElementById("canvas");
const context = gameCanvas.getContext("2d");
const screenWidth = window.innerWidth * 0.80;
const screenHeight = window.innerHeight;
gameCanvas.width = screenWidth;
gameCanvas.height = screenHeight;

let backgroundColor = "#96259c";
let alternateBackgroundColor = "#d6eb1a";
let mouseX = 0;
let mouseY = 0;
let score = 0;
let level = 1;
let numCircles = 3;
let gameFinished = false;
let missedCircles = 0;
const maxMissedCircles = 3;

function updateMousePosition(event) {
    const rect = gameCanvas.getBoundingClientRect(); 
    mouseX = event.clientX - rect.left; 
    mouseY = event.clientY - rect.top; 
}

function drawText(context) {
    context.font = "40px Arial";
    context.fillStyle = "#fcfcfc"; 
    context.fillText(`Nivel: ${level} Puntuación: ${score}`, screenWidth - 200, 40);
    context.fillText("X: " + mouseX.toFixed(2) + " Y: " + mouseY.toFixed(2), 200, 40);
}

class GameCircle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.color = color;
        this.fillColor = getRandomColor();
        this.text = text;
        this.speed = speed;
        this.dx = 0;
        this.dy = -this.speed;
        this.visible = true;
    }

    draw(context) {
        if (!this.visible) return;
        context.beginPath();
        context.strokeStyle = this.color;
        context.fillStyle = this.fillColor;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillText(this.text, this.posX, this.posY);
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.fill();
        context.stroke();
        context.closePath();
    }

    update(context) {
        this.draw(context);
        this.posX += this.dx;
        this.posY += this.dy;
        if (this.posY + this.radius < 0) { 
            this.reset();
            missedCircles++;
            if (missedCircles >= maxMissedCircles) {
                endGame();
            }
        }
    }

    reset() {
        this.posX = Math.random() * screenWidth; 
        this.posY = screenHeight + this.radius;
        this.fillColor = getRandomColor();
        while (this.fillColor === backgroundColor) {
            this.fillColor = getRandomColor();
        }
    }
}

function getDistance(x1, x2, y1, y2) {
    const xDistance = x2 - x1;
    const yDistance = y2 - y1;
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

function getRandomColor() {
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += Math.floor(Math.random() * 16).toString(16);
    }
    return color;
}

let gameCircles = [];

function createCircles() {
    gameCircles = [];
    for (let i = 0; i < numCircles; i++) {
        const randomX = Math.random() * screenWidth;
        const randomRadius = 25 + Math.random() * 25;
        const randomSpeed = 2 + Math.random() * 2;
        gameCircles.push(new GameCircle(randomX, screenHeight + randomRadius, randomRadius, getRandomColor(), (i + 1).toString(), randomSpeed));
    }
}

function increaseLevel() {
    level++;
    numCircles++;
    missedCircles = 0;
}

function endGame() {
    gameFinished = true;
}

function handleMouseClick(event) {
    const rect = gameCanvas.getBoundingClientRect(); 
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    gameCircles.forEach(circle => {
        if (!circle.visible) return;
        const distanceFromCenter = getDistance(clickX, circle.posX, clickY, circle.posY);
        if (distanceFromCenter <= circle.radius) {
            circle.visible = false;
            score++;
            backgroundColor = alternateBackgroundColor;
            setTimeout(() => {
                backgroundColor = "#96259c";
            }, 200);
            return;
        }
    });
    if (gameCircles.every(circle => !circle.visible)) {
        increaseLevel();
        createCircles();
    }
}

function updateGameCircles() {
    requestAnimationFrame(updateGameCircles);
    context.clearRect(0, 0, screenWidth, screenHeight);
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, screenWidth, screenHeight);
    gameFinished ? drawEndText() : (gameCircles.forEach(circle => circle.update(context)), drawText(context));
}

function drawEndText() {
    context.font = "30px Arial";
    context.fillStyle = "#fcfcfc";
    context.fillText(`Felicidades, llegaste al Nivel ${level - 1} , Puntuación: ${score}`, screenWidth / 2, screenHeight / 2);
}

gameCanvas.addEventListener("mousemove", updateMousePosition); 
gameCanvas.addEventListener("click", handleMouseClick); 

createCircles();
updateGameCircles();
