//Vars from HTML
let ctx = document.getElementById("canvas").getContext("2d")
let canvasW = document.getElementById("canvas").width
let canvasH = document.getElementById("canvas").height
let scoreElement = document.getElementById("score")

//Global vars
let initGameSpeed = 400
let gameSpeed = initGameSpeed
let drawingSize = 15
let score = 0
let minPosX = 0
let minPosY = 0
let maxPosX = canvasW - drawingSize
let maxPosY = canvasH - drawingSize

class Apple {
    posX
    posY
    color = "rgb(255, 0, 0)"
    display() {
        this.posX = (parseInt(Math.random() * canvasW / drawingSize)) * drawingSize
        this.posY = (parseInt(Math.random() * canvasH / drawingSize)) * drawingSize
        ctx.fillStyle = this.color
        ctx.fillRect(this.posX, this.posY, drawingSize, drawingSize)
    }
}

class Snake {
    dirX = 0
    dirY = 0
    initBody = 3
    body = this.initBody
    posX = canvasW / 2
    posY = canvasH / 2
    trail = []
    color = "rgb(0, 0, 0)"
    display() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.posX, this.posY, drawingSize, drawingSize)
        ctx.strokeRect(this.posX, this.posY, drawingSize, drawingSize)
    }
}

ctx.strokeStyle = "rgb(255, 255, 255)"
apple = new Apple()
snake = new Snake()
apple.display()
snake.display()

function main() {
    snake.posX += snake.dirX
    snake.posY += snake.dirY
    snake.trail[0] = [snake.posX, snake.posY]

    //Set the limits for the snake to move
    if (snake.posX < minPosX) snake.posX = maxPosX
    if (snake.posX > maxPosX) snake.posX = minPosX
    if (snake.posY < minPosY) snake.posY = maxPosY
    if (snake.posY > maxPosY) snake.posY = minPosY

    //Draw canvas
    ctx.fillStyle = "rgb(0, 128, 0)"
    ctx.fillRect(0, 0, canvasW, canvasH)

    //Draw apple
    ctx.fillStyle = apple.color
    ctx.fillRect(apple.posX, apple.posY, drawingSize, drawingSize)

    //Draw snake
    ctx.fillStyle = snake.color
    for (let i = 0; i < snake.trail.length; i++) {
        ctx.fillRect(snake.trail[i][0], snake.trail[i][1], drawingSize, drawingSize)
        ctx.strokeRect(snake.trail[i][0], snake.trail[i][1], drawingSize, drawingSize);
        //In case the snake steps itself
        if (i == 0) {
            for (let index = 1; index < snake.trail.length; index++) {
                if (snake.trail[0][0] == snake.trail[index][0] && snake.trail[0][1] == snake.trail[index][1] && snake.body > snake.initBody) {
                    score = 0
                    snake.body = snake.initBody
                    gameSpeed = initGameSpeed
                    scoreElement.innerText = score
                    clearInterval(game)
                    window.requestAnimationFrame(() => {
                        game = setInterval(main, gameSpeed)
                    })
                }
            }
        }
    }
    snake.trail.push([snake.posX, snake.posY])

    while (snake.trail.length > snake.body) {
        snake.trail.shift()
    }

    //In case the snake eats the apple
    if (snake.posX == apple.posX && snake.posY == apple.posY) {
        apple.display()
        snake.body++
        score++
        scoreElement.innerText = score
        increaseSpeed()
    }
}

document.addEventListener("keydown", (evt) => {
    switch (evt.keyCode) {
        case 37:
            if (snake.dirX != drawingSize) { snake.dirX = -drawingSize; snake.dirY = 0 }
            break
        case 38:
            if (snake.dirY != drawingSize) { snake.dirX = 0; snake.dirY = -drawingSize }
            break
        case 39:
            if (snake.dirX != -drawingSize) { snake.dirX = drawingSize; snake.dirY = 0 }
            break
        case 40:
            if (snake.dirY != -drawingSize) { snake.dirX = 0; snake.dirY = drawingSize }
            break
    }
})

window.requestAnimationFrame(() => {
    game = setInterval(main, gameSpeed)
})

function increaseSpeed() {
    gameSpeed -= 20
    clearInterval(game)
    window.requestAnimationFrame(() => {
        game = setInterval(main, gameSpeed)
    })
}