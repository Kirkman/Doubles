// VALUES

var grid, gridElem = document.getElementById("grid");

var touchElem = document.getElementById("touch");

var score = 0, sum = 0,
	scoreElem = document.getElementById("score");

var infoText = document.getElementById("text");

var level = 0,
	levelText = infoText.getElementsByTagName("p")[0],
	levelBar = document.getElementById("bar").getElementsByTagName("div")[0];

var best = 0,
	bestElem = infoText.getElementsByTagName("p")[1];

var shareElem = document.getElementById("share");

// GRID FUNCTIONS

function updateGrid() {
	var e, x, y;

	for(y = 0; y < 4; y++) {
		for(x = 0; x < 4; x++) {
			e = gridElem.getElementsByTagName("div")[(y * 4) + x];

			if(grid[x][y] !== 0) {
				e.innerHTML = grid[x][y];
				e.setAttribute("class", "b" + grid[x][y]);
			} else {
				e.innerHTML = "";
				e.setAttribute("class", "bv");
			}
		}
	}
}


function findTarget(array,x,stop) {
	var t;
	// if the position is already on the first, don't evaluate
	if (x==0) {
		return x;
	}
	for(t=x-1;t>=0;t--) {
		if (array[t]!=0) {
			if (array[t]!=array[x]) {
				// merge is not possible, take next position
				return t+1;
			}
			return t;
		} else {
			// we should not slide further, return this one
			if (t==stop) {
				return t;
			}
		}
	}
	// we did not find a
	return x;
}


function slideArray(array) {
	var x,t,stop=0;

	for (x=0;x<array.length;x++) {
		if (array[x]!=0) {
			t = findTarget(array,x,stop);
			// if target is not original position, then move or merge
			if (t!=x) {
				// if target is not zero, set stop to avoid double merge
				if (array[t]!=0) {
					score+=array[t]+array[x];
					stop = t+1;
				}
				array[t]+=array[x];
				array[x]=0;
			}
		}
	}
}

function rotateBoard() {
	var i,j,n=4;
	var tmp;
	for (i=0; i<n/2; i++){
		for (j=i; j<n-i-1; j++){
			tmp = grid[i][j];
			grid[i][j] = grid[j][n-i-1];
			grid[j][n-i-1] = grid[n-i-1][n-j-1];
			grid[n-i-1][n-j-1] = grid[n-j-1][i];
			grid[n-j-1][i] = tmp;
		}
	}
}

function moveUp() {
	var x;
	for (x=0;x<4;x++) {
		slideArray(grid[x]);
	}
}

function moveLeft() {
	rotateBoard();
	moveUp();
	rotateBoard();
	rotateBoard();
	rotateBoard();
}

function moveDown() {
	rotateBoard();
	rotateBoard();
	moveUp();
	rotateBoard();
	rotateBoard();
}

function moveRight() {
	rotateBoard();
	rotateBoard();
	rotateBoard();
	moveUp();
	rotateBoard();
}



// SCORE FUNCTIONS

function calcScore(n) {
	if(n === 2)
		return 2;
	else if(n === 4)
		return 5;
	else if(n === 8)
		return 10;
	else if(n === 16)
		return 25;
	else if(n === 32)
		return 50;
	else if(n === 64)
		return 125;
	else if(n === 128)
		return 250;
	else if(n === 256)
		return 500;
	else if(n === 512)
		return 1000;
	else if(n === 1024)
		return 2000;
	else if(n === 2048)
		return 4000;
	else if(n === 4096)
		return 8000;
	else if(n === 8192)
		return 16000;
	else if(n === 16384)
		return 32500;
	else
		return 0;
}

function addScore(block) {
	score += calcScore(block);
}

function getScore() {
	var x, y;

	sum = 0;

	for(y = 0; y < 4; y++) {
		for(x = 0; x < 4; x++) {
			if(grid[x][y] !== 0)
				sum += grid[x][y];
		}
	}

	updateScore();
}

function updateScore() {
	shareElem.href = "https://twitter.com/home?status=Got%20a%20score%20of%20" + (score + sum) + "%20on%20%232048%20saming.fr/p/2048";

	scoreElem.innerHTML = (score + sum) + "pts";

	updateBest();

	updateLevel();
}

// LEVEL FUNCTIONS

function getLevelText(lvl) {
	if(lvl === 1) // 4+
		return "Welcome newbie";
	else if(lvl === 2) // 16+
		return "Now you're playing";
	else if(lvl === 3) // 64+
		return "Keep calm and press up";
	else if(lvl === 4) // 256+
		return "That's okay for a first time I guess";
	else if(lvl === 5) // 1024+
		return "That's okay for a second time I guess";
	else if(lvl === 6) // 4,096+
		return "This is getting serious isn't it";
	else if(lvl === 7) // 16,384+
		return "Wow!";
	else if(lvl === 8) // 65,536+
		return "Can I have an autograph?";
	else if(lvl === 9) // 262,144+
		return "You're not supposed to see this, stop";
	else if(lvl === 10) // 1,048,576+
		return "I'm pretty sure it's illegal to use supercomputers for that";
	else
		return "";
}

function updateLevel() {
	level = Math.floor(Math.log(score + sum) / Math.log(4));

	if(level > 10)
		level = 10;
	if(level < 0)
		level = 0;

	var desc = getLevelText(level);

	levelText.innerHTML = "Level " + level + (desc === "" ? "" : (" — " + desc));
	levelBar.style.width = (level * 10) + "%";
}

// BEST SCORE FUNCTIONS

function getBest() {
	best = localStorage.getItem("2048best");
}

function setBest(n) {
	localStorage.setItem("2048best", n);
	best = n;
}

function updateBest() {
	if(best < (score + sum))
		setBest(score + sum);

	bestElem.innerHTML = best + "pts";
}

// GAME OVER FUNCTIONS

function gameOver() {
	gridElem.setAttribute("class", "over");
	console.log("LOL");
}

// UTIL FUNCTIONS

function keyPress(code) {
	if (code === 13) {
		init(); // reinit
	}
	else { 
		if(code === 37 || code === 74)
			moveLeft(); // left
		else if(code === 38 || code === 73)
			moveUp(); // up
		else if(code === 39 || code === 76)
			moveRight(); // right
		else if(code === 40 || code === 75)
			moveDown(); // down
		spawnRand();
		updateGrid();
		getScore();
	}
}

function spawnRand() {
	var x, y, possibles = [];

	for(y = 0; y < 4; y++) {
		for(x = 0; x < 4; x++) {
			if(grid[x][y] === 0)
				possibles.push([x, y]);
		}
	}

	if(possibles.length) {
		var randomValue = (Math.floor(Math.random() * 9) === 8 ? 4 : 2),
			randomBlock = possibles[(Math.floor(Math.random() * possibles.length))],
			x = randomBlock[0],
			y = randomBlock[1];

		grid[x][y] = randomValue;
	} else {
		if(!checkMovable()) {
			gameOver();
		}
	}
}

function checkMovable() {
	for(y = 0; y < 4; y++) {
		for(x = 0; x < 4; x++) {
			if((grid[x + 1] !== undefined &&
					(grid[x + 1][y] === grid[x][y] || grid[x + 1][y] == 0)) ||
				 (grid[x][y + 1] !== undefined &&
				 	(grid[x][y + 1] === grid[x][y] || grid[x][y + 1] == 0)) ||
				  grid[x][y] == 0)
				return true;
		}
	}

	return false;
}

// INIT FUNCTIONS

function initScore() {
	score = 0, sum = 0;

	updateScore();
}

function initBest() {
	if(localStorage.getItem("2048best") === undefined)
		setBest(0);

	getBest();
}

function initGrid() {
	grid = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];

	spawnRand();
	spawnRand();

	updateGrid();
}

function init() {
	gridElem.removeAttribute("class");

	initScore();
	initBest();
	initGrid();
}

// INITIAL SETUP

document.onkeydown = function(e) { keyPress(e.keyCode); }

document.getElementsByTagName("header")[0].getElementsByTagName("a")[0].onclick = init;

touchElem.getElementsByTagName("div")[0].onclick = function() { moveUp(); }
touchElem.getElementsByTagName("div")[1].onclick = function() { moveLeft(); }
touchElem.getElementsByTagName("div")[2].onclick = function() { moveRight(); }
touchElem.getElementsByTagName("div")[3].onclick = function() { moveDown(); }

initGrid();
initBest();
