//Enemies on map that cause play to have game over if they collide
var Enemy = function(x, y, speed) {
	this.x = x; //Sets x coordinate
	this.y = y; // Sets y coordinate
	this.speed = speed; // Sets x velocity

	// Sets sides of enemy collision box
	this.top = this.y;
	this.bottom = this.y + 40;
	this.left = this.x;
	this.right = this.x + 70;
	this.sprite = 'images/enemy-bug.png'; //Sets sprite for enemy
};

//Changes the postion of enemy and determines if it should animated or not
Enemy.prototype.update = function(dt) {
	if (dead === false && win === false) { //If the player has not won or lost the game the enemys will be in motion
		this.x += (dt * this.speed); // Moves enemy by its x velocity
		if (this.x > 1205 && this.speed > 0) { // If x velocity is postive and moves off the right side of the map its postion is moved to the left side of the map
			this.x = -100;
		}
		if (this.x < -100 && this.speed < 0) { // If x velocity is negative and moves off the left side of the map its postion is moved to the rightt side of the map
			this.x = 1205;
		}
		this.top = this.y; // Updates enemy collison box
		this.bottom = this.y + 50;
		this.left = this.x;
		this.right = this.x + 70;
	}
};

//Draws the enemy
Enemy.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//The character the player controls
var Player = function() {
	this.x = 605; // Sets x coordinate
	this.y = 390; // Sets y coordinate

	// Sets sides of players collision box
	this.top = this.y;
	this.bottom = this.y + 50;
	this.left = this.x;
	this.right = this.x + 50;
	this.sprite = 'images/char-boy.png'; // Sets sprite of player
};

//Updates the players collision box and determines if it has entered win condition
Player.prototype.update = function(dt) {
	this.top = this.y; // Updates collison box
	this.bottom = this.y + 50;
	this.left = this.x;
	this.right = this.x + 70;
	if (this.y <= 0) { //If the player reaches top of the map they win
		win = true;
	}
};

// Resets the game
Player.prototype.reset = function() {
	this.x = 605;
	this.y = 390;
	win = false;
	dead = false;
};

// Renders the player, the winning and losing text.
Player.prototype.render = function() {
	// Sets the font and style of the text
	ctx.font = "36pt impact";
	ctx.fillStyle = "white";
	ctx.strokeStyle = "black";
	ctx.lineWidth = 3;

	ctx.drawImage(Resources.get(this.sprite), this.x, this.y); // Draws player
	if (dead === true) { //If player loses print message
		ctx.strokeText("Game Over", 550, 300);
		ctx.fillText("Game Over", 550, 300);
		ctx.strokeText("Press Any Key To Try Again", 400, 400);
		ctx.fillText("Press Any Key To Try Again", 400, 400);
	}
	if (win === true) { //If player wins print message
		ctx.strokeText("You Win", 550, 300);
		ctx.fillText("You Win", 550, 300);
		ctx.strokeText("Press Any Key To Play Again", 400, 400);
		ctx.fillText("Press Any Key To Play Again", 400, 400);
	}
};

// Handles values from key listener
Player.prototype.handleInput = function(kC) {
	if (dead === false && win === false) { // If the player has not won or lost
		if (kC === 'up' && this.y > 0) {
			this.y -= 80; // Move up if the up key is pressed and the player is not to high
		}
		if (kC === 'down' && this.y < 320) {
			this.y += 80; // Move down if the down key is pressed and the player is not to low
		}
		if (kC === 'right' && this.x < 1100) {
			this.x += 101; // Move right if the right key is pressed and the player is not to far right
		}
		if (kC === 'left' && this.x > 0) {
			this.x -= 101; // Move left if the left key is pressed and the player is not to far left
		}
	} else {
		this.reset(); // If player has won or lost when they press any key they reset the game
	}
};

// Checks to see if player is colliding with enemies
var checkCollisions = function() {
	allEnemies.forEach(function(enemies) {
		if (enemies.left < this.right && enemies.right > this.left && enemies.top < this.bottom && enemies.bottom > this.top) {
			dead = true; // Kills player
		}
	});
};

// Spawns a line of evenly spaced enemies at set speed
var redSpawner = function(row, number, speed, list) {
	for (var i = 0; i < number; i++) {
		list.push(new Enemy(i * (1250 / number), row * 70, speed));
	}
};

var win = false; // Creates a global variable that determines if have won
var dead = false; // Creates a global variable that determines if have lost
var allEnemies = []; // Array that holds all enemies
var player = new Player(); // Creates player

//Creates lines of enemies
redSpawner(1, 5, 100, allEnemies);
redSpawner(2, 3, 200, allEnemies);
redSpawner(3, 5, -100, allEnemies);
redSpawner(4, 3, 400, allEnemies);

//Key listener
document.addEventListener('keyup', function(e) {
	var allowedKeys = {
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down'
	};
	player.handleInput(allowedKeys[e.keyCode]);
});
