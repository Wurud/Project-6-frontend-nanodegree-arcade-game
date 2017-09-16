//Global variables to be used many times in the game.
var score = 0;
var playerLive = 3;
var playerStartPosX = 400;
var playerStartPosY = 300;
var seconds = 60;
var gemSound;
var enemyPunch;
var waterPoints;
var themeSound;
var achievement;
var gong;

// Initiate a new objects, then call timer and play functions
// when loading the body tag of the index file.
function startGame() {
    gemSound = new audio("sound/gem.mp3");
    enemyPunch = new audio("sound/punch.mp3");
    themeSound = new audio("sound/music.mp3");
    waterPoints = new audio("sound/water.mp3");
    achievement = new audio("sound/achievement.mp3");
    gong = new audio("sound/gong.mp3");
    timer();
    themeSound.start();
}

//https://www.w3schools.com/graphics/game_sound.asp
//Create an audio object to play mp3 files.
var audio = function(src) {
    this.audio = document.createElement("audio");
    this.audio.src = src;
    this.audio.setAttribute("preload", "auto");
    this.audio.style.display = "none";
    document.body.appendChild(this.audio)
    this.start = function() {
        this.audio.play();
    }
    this.stop = function() {
        this.audio.pause();
    }
}

// Create a new Enemy object.
var Enemy = function(x, y, speed) {
    this.x = x;
    this.y = y;
    this.height = 40;
    this.width = 30;
    this.speed = speed + 50 + Math.floor(Math.random() * 300);
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += (this.speed * dt);

    //To reset position of the enemies to the left side of canvas.
    //Canvas width = 900;
    if (this.x > 900) {
        this.x = 0;
    }
    this.detectCollision(this);
};


// Detect when the Enemy and the Player objects collide.
Enemy.prototype.detectCollision = function(enemy) {
    if (player.x < enemy.x + enemy.width && player.x + player.width > enemy.x &&
        player.y < enemy.y + enemy.height && player.height + player.y > enemy.y) {
        playerLive -= 1;
        enemyPunch.start();
        //Initiate a new sound object.
        enemyPunch = new audio("sound/punch.mp3");
        //Check if player lives equal to 0, then set seconds to 0 to end the game.
        if (playerLive <= 0) {
            playerLive = 0;
            seconds = 0;
            timer();
        }
        //Send the updated result to the index file.
        document.getElementById('score').innerHTML = score;
        document.getElementById('lives').innerHTML = playerLive;
        //Display console.log messege and reset player position to the starting point.
        console.log("Autch!");
        player.reset();
    }
};

// Draw the enemy on the screen, required method for game.
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


//Create a Player object.
var Player = function() {
    this.x = playerStartPosX;
    this.y = playerStartPosY;
    this.speed = 55;
    this.height = 32;
    this.width = 35;
    this.sprite = 'images/char-boy.png';
};

// Update the Player position, required method for game.
Player.prototype.update = function() {
    // To make sure the Player doesn't move outside the canvas.
    if (this.y >= 620) {
        this.y = 465;
        //Check if the player reaches the water in either sides of the canvas.
    } else if (this.y <= 0 || this.y == 465) {
        waterPoints.start();
        //Initiate a new object to load the sound when reach the water the second time.
        waterPoints = new audio("sound/water.mp3");
        score += 25;
        //Update score on index file.
        document.getElementById('score').innerHTML = score;
        //Display a messege on the console, then reset the Player position.
        console.log("+25 points (water)");
        player.reset();
    }
    if (this.x > 800) {
        this.x = 800;
    } else if (this.x < 0) {
        this.x = 0;
    }
};

//To update the player position, after pressing one of the keys (Left, Right, Up or Down).
Player.prototype.handleInput = function(keyPress) {
    if (keyPress == 'left') {
        this.x -= this.speed + 50;
    } else if (keyPress == 'right') {
        this.x += this.speed + 50;
    } else if (keyPress == 'up') {
        this.y -= this.speed + 30;
    } else if (keyPress == 'down') {
        this.y += this.speed + 30;
    }
};

// To draw the Player on the screen, required method for game.
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Reset Player position on the canvas.
Player.prototype.reset = function() {
    this.x = playerStartPosX;
    this.y = playerStartPosY;
};

// Create a new Gem object.
//Add speed property to allow Gems to move on the canvas.
var Gem = function(x, y, speed) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/Gem Orange.png';
    this.height = 25;
    this.width = 25;
    this.speed = speed + (Math.random() * 400 + 150);
};

Gem.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += (this.speed * dt);

    if (this.x > 900) {
        // To update the gem position randomly.
        this.x = 20 + Math.floor(Math.random() * 300);
    }
    // If the player collide with one Gem, call detectCollision function.
    this.detectCollision(this);
};

// To play gem sound, then update score and display messege when the player collide with the gem.
Gem.prototype.detectCollision = function(gem) {
    if (player.x < gem.x + gem.width && player.x + player.width > gem.x &&
        player.y < gem.y + gem.height && player.height + player.y > gem.y) {
        gemSound.start();
        //Initiate a new gem sound.
        gemSound = new audio("sound/gem.mp3");
        score += 10;
        document.getElementById('score').innerHTML = score;
        console.log("+10 points (Gem)");
        //Reset Gem position on x coordinate.
        gem.x = -5;
    }
};

// Display Gems on the canvas.
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


//Initiate array to add all enemies objects
var allEnemies = [];

// The Y coordinate for all enemies objects.
var enemyPosY = [60, 145, 230, 390, 470];

//Initiate a new Player.
var player = new Player();

//Initiate array to add all Gems objects
var allGems = [];

// The Y coordinate for all Gems objects.
var allGemsY = [70, 155, 405, 485];

//Loop through the enemyPosY array, then add the enemy objects to allEnemies array.
for (var i in enemyPosY) {
    var enemy;
    // Check Enemy Y position, then create three Enemy objects with random speed.
    // to increase the leve of difficulty.
    if (enemyPosY[i] > 380) {
        enemyOne = new Enemy(0, enemyPosY[i], Math.floor(Math.random() * 200));
        enemyTwo = new Enemy(0, enemyPosY[i], Math.floor(Math.random() * 400));
        enemyThree = new Enemy(0, enemyPosY[i], Math.floor(Math.random() * 600));
        // Add new objects to the array, then display them on the canvas.
        allEnemies.push(enemyOne, enemyTwo, enemyThree);
    } else {
        enemy = new Enemy(0, enemyPosY[i], Math.floor(Math.random() * 200));
        allEnemies.push(enemy);
    }
};

//Loop through the allGemsY array, then add the gem objects to allGems array.
for (var x in allGemsY) {
    var gem;
    gem = new Gem(0, allGemsY[x], Math.floor(Math.random() * 100));
    allGems.push(gem);
};

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

// Countdown timer function.
function timer() {
    function tick() {
        var time = document.getElementById("time");
        seconds = seconds - 1;
        time.innerHTML = "0:" + (seconds < 10 ? "0" : "") + String(seconds);
        if (seconds > 0) {
            setTimeout(tick, 1000);
        }
        // If the remaining time equal to 0, display Game Over Page with the final score.
        else if (seconds <= 0) {
            if (score > 0) {
                themeSound.stop();
                achievement.start();
                document.getElementById("gameOver").style.display = "block";
                $("#gameOver #score").html(score);
            }
            if (score === 0) {
                themeSound.stop();
                gong.start();
                document.getElementById("gameOver").style.display = "block";
                $("#gameOver #score").html(score);
            }
        }
        //If player live is equal to 0, display Game Over Page with the final score.
        if (playerLive == 0) {
            document.getElementById("gameOver").style.display = "block";
            $("#gameOver #score").html(score);
        }
    }
    tick();
}
