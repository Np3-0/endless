import Player from "./player.js";
import Enemy from "./enemy.js";

let bgColor1, bgColor2, player, enemySpeed, score, lastScoreTime;
let enemies = [];
let menu, titleFont, bgSound, gameOverSound, gameOverSoundPlayed, movementSound, audioStarted;
let runSpriteSheet, dieSpriteSheet, leftSpriteSheet, rightSpriteSheet, enemySpriteSheet;
let runFrames = [], dieFrames = [], leftFrames = [], rightFrames = [], enemyFrames = [];

window.setup = async function () {
    bgSound = await loadSound("assets/sounds/bgmusic.mp3");
    gameOverSound = await loadSound("assets/sounds/gameover.mp3");
    movementSound = await loadSound("assets/sounds/movement.mp3");

    // spritesheet setup
    runSpriteSheet = await loadImage("assets/sprites/run.png");
    runFrames = getFrames(runSpriteSheet, 140, 100);
    dieSpriteSheet = await loadImage("assets/sprites/die.png");
    dieFrames = getFrames(dieSpriteSheet, 140, 100);
    leftSpriteSheet = await loadImage("assets/sprites/leftdash.png");
    leftFrames = getFrames(leftSpriteSheet, 140, 100);
    rightSpriteSheet = await loadImage("assets/sprites/rightdash.png");
    rightFrames = getFrames(rightSpriteSheet, 140, 100);
    enemySpriteSheet = await loadImage("assets/sprites/enemy.png");
    enemyFrames = getFrames(enemySpriteSheet, 63, 48);

    createCanvas(800, 600);
    angleMode(DEGREES);
    frameRate(60);
    rectMode(CENTER);
    imageMode(CENTER);
    colorMode(RGB);
    titleFont = await loadFont("assets/Oi-Regular.ttf");
    textFont(titleFont);

    bgColor1 = color(197, 55, 204);
    bgColor2 = color(170, 42, 170);
    player = new Player(width / 2, height * 0.8, 1, 37.5, [runFrames, dieFrames, leftFrames, rightFrames]);
    menu = 0;
    score = 0;
    lastScoreTime = 0;
    enemySpeed = 10;
    gameOverSoundPlayed = false;
    audioStarted = false;
}

window.draw = function () {
    renderBackground();
    rectMode(CENTER);
    switch (menu) {
        case 0:
            runMenu();
            break;
        case 1:
            runGame();
            break;
        case 2:
            showCredits();
            break;
        case 3:
            gameOver();
            break;
    }
}

window.mouseClicked = function () {
    if (menu == 0) {
        if (!audioStarted) {
            bgSound.play();
            bgSound.loop();
            audioStarted = true;
            return;
        } else if (mouseX > (width / 2 - width / 8) && mouseX < (width / 2 + width / 8)
            && mouseY > ((height / 2 + 30) - height / 16) && mouseY < ((height / 2 + 30) + height / 16)) {
            menu = 1;
            lastScoreTime = millis();
        } else if (mouseX > (width / 2 - width / 8) && mouseX < (width / 2 + width / 8)
            && mouseY > ((height / 2 + 135) - height / 16) && mouseY < ((height / 2 + 135) + height / 16)) {
            menu = 2;
        }
    } else if (menu == 2) {
        if (mouseX > (width / 2 - width / 8) && mouseX < (width / 2 + width / 8)
            && mouseY > ((height / 2 + 110) - height / 16) && mouseY < ((height / 2 + 110) + height / 16)) {
            menu = 0;
        }
    } else if (menu == 3) {
        if (mouseX > (width / 2 - width / 8) && mouseX < (width / 2 + width / 8)
            && mouseY > ((height / 2 + 25) - height / 16) && mouseY < ((height / 2 + 25) + height / 16)) {
            gameOverSoundPlayed = false;
            score = 0;
            menu = 0;
        }
    }
}

window.keyPressed = function () {
    let val = 0;
    if (keyCode == 39 || keyCode == 68) {
        val = 1;
    } else if (keyCode == 37 || keyCode == 65) {
        val = -1;
    } else {
        return;
    }
    if (val != 0) {
        movementSound.play();
    }
    player.updatePos(val);
}

function renderBackground() {
    rectMode(CORNER);
    for (let y = 0; y < height; y += 25) {
        let n = map(y, 0, height, 0, 1);
        let newC = lerpColor(bgColor1, bgColor2, n);
        noStroke();
        fill(newC);
        rect(0, y, width, 25);
    }
}

function checkCollision(enemy) {
    if (enemy.x == player.x && ((enemy.y + enemy.sizeY / 2 > player.y - player.size / 2)
        && (enemy.y - enemy.sizeY / 2 - 10 < player.y + player.size / 2))) {

        if (!gameOverSoundPlayed) {
            gameOverSound.play();
        }
        gameOverSoundPlayed = true;
        gameOver();
    }
}

function runGame() {
    noCursor();

    player.render();
    if (frameCount % 45 == 0) {
        enemies.push(new Enemy(floor(random(0, 3)), 0, 0, 50, 40, enemySpeed, enemyFrames));
    }
    enemies.forEach((enemy) => {
        enemy.update();
        enemy.render();
        checkCollision(enemy);
    })
    let before = enemies.length;
    enemies = enemies.filter((enemy) => enemy.y < height + enemy.sizeY);
    score += (before - enemies.length) * 100;

    if (millis() - lastScoreTime >= 1000) {
        score++;
        enemySpeed *= 1.035;
        lastScoreTime = millis();
    }

    fill(255, 219, 131);
    rect(width * 0.825, height * 0.1, 175, 75, 20);
    fill(bgColor1);
    text(score, width * 0.825, height * 0.115);

}

function runMenu() {
    textAlign(CENTER);
    fill(255, 219, 131);
    noStroke();
    if (!audioStarted) {
        textSize(48);
        text("Click to start", width / 2, height / 2);        
    } else {
        textSize(68);
        text("endless", width / 2, height / 3);
        textSize(32);
        text("a small game for tagless", width / 2, height * 0.425);

        rect(width / 2, height / 2 + 30, width / 4, height / 8, 20);
        rect(width / 2, height / 2 + 135, width / 4, height / 8, 20);
        fill(bgColor1);

        textSize(24);
        text("Start", width / 2, height / 2 + 40);
        text("Credits", width / 2, height / 2 + 145);
        fill(255, 219, 131);
        text("WASD/Arrow Keys to control!", width/2, height * 0.9);
    }
}

function showCredits() {
    fill(255, 219, 131);
    textSize(32);
    text("Created by nate (np3)", width / 2, height / 4);
    textSize(24);
    text("All sounds and sprites are royalty-free.", width / 2, height / 3);
    text("More information is in the README!", width / 2, height * 0.4);

    textSize(32);
    text("Made for Hack Club: Tagless", width /2, height / 2);
    textSize(24);
    text("hi alex (or other reviewer)", width /2, height * 0.575);
    rect(width / 2, height / 2 + 110, width / 4, height / 8, 20);
    fill(bgColor1);
    textSize(32);
    text("Back", width / 2, height / 2 + 105, 20);
}

function gameOver() {
    cursor();
    menu = 3;
    enemies = [];
    player.pos = 1;
    player.animIndex = 0;
    player.curFrame = 0;
    enemySpeed = 10;
    fill(255, 219, 131);
    textSize(48);
    text("Game Over!", width / 2, height / 3);
    textSize(28);
    text("You scored " + score + " points!", width / 2, height * 0.425);
    rect(width / 2, height / 2 + 25, width / 4, height / 8, 20);
    fill(bgColor1);
    text("Back", width / 2, height / 2 + 15, 20);
}

function getFrames(sprite, w, h) {
    let arr = [];
    for (let x = 0; x < sprite.width; x += w) {
        arr.push(sprite.get(x, 0, w, h));
    }
    return arr;
}