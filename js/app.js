// Enemies our player must avoid
// Create Enemy object.
var Enemy = function(x, y, speed) {
    this.x = x;
    this.y = y;
    this.height = 40;
    this.width = 30;
    this.speed = speed + 50 + Math.floor(Math.random() * 400);
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
    //Canvas width = 505
    if (this.x > 505) {
        this.x = 0;
    }

    this.detectCollision(this);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.detectCollision = function(enemy) {
    if (player.x < enemy.x + enemy.width && player.x + player.width > enemy.x &&
        player.y < enemy.y + enemy.height && player.height + player.y > enemy.y) {
        // When collision detected, display console.log messege and reset player position th the starting point.
        console.log("Ooops!!");
        player.reset();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Create a Player object.
var Player = function() {
    this.x = 200;
    this.y = 380;
    this.speed = 50;
    this.height = 30;
    this.width = 35;
    this.sprite = 'images/char-princess-girl.png';
};

// Update the Player position, required method for game
Player.prototype.update = function() {
    // To make sure the Player doesn't move outside the canvas.
    if (this.y > 400) {
        this.y = 400;
    } else if (this.y < 0) {
        //If the Player reach the water, display the console.log messege and reset the Player position.
        console.log("Congratulations, you've made it :)");
        player.reset();
    }

    if (this.x > 400) {
        this.x = 400;
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

// To draw the Player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Reset Player x,y coordinates to the starting point.
Player.prototype.reset = function() {
    this.x = 200;
    this.y = 380;
};

//Initiate array to add all enemies objects
var allEnemies = [];

// The Y position for all enemies objects.
var enemyPosY = [60, 145, 230, 310];

//Initiate a new Player.
var player = new Player();

//Loop through the enemyPosY array
for (var i in enemyPosY) {
    var enemy;
    //Create enemies objects and add them to allEnemies array.
    enemy = new Enemy(0, enemyPosY[i], Math.floor(Math.random() * 450));
    allEnemies.push(enemy);
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
