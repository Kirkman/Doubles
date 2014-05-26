load("sbbsdefs.js");
load("json-client.js");
load("frame.js");
load("layout.js");
// some of the custom functions I'm using
load(js.exec_dir + "helper-functions.js");




// COLORS
var lowWhite = 'NW0';
var highWhite = 'HW0';
var lowCyan = 'NC0';
var highCyan = 'HC0';
var highBlack = 'HK0';
var highYellowDarkBlue = 'HY4';

// CHARACTERS
var charHorizSingle = ascii(196);
var charHorizSingleDownDouble = ascii(210);
var charVertDouble = ascii(186);
var frac12 = ascii(171);


// VALUES

var grid;
var score = 0, sum = 0;
var infoText;
var level = 0, levelText, levelBar;
var best = 0;

var player = new Object();
player.score = '';
player.name = '';




// GRID FUNCTIONS

function updateGrid() {
	var e, x, y;

	for(y = 0; y < 4; y++) {
		for(x = 0; x < 4; x++) {
			if(grid[x][y] !== 0) {
				fixedTiles[x][y].invalidate();
				fixedTiles[x][y].load(js.exec_dir + '/ansi/' + grid[x][y].toString() + '.ans', 16, 4);
				fixedTiles[x][y].open();
			} else {
				fixedTiles[x][y].close();
			}
		}
	}
//	boardFrame.draw();
	fixedFrame.cycle();
}

/*
Verbal Algorithm
Source: http://www.leaseweblabs.com/2014/03/text-mode-2048-game-c-algorithm-explained/

- walk over the array from the first to the last number
  - for each original number in the array that is not zero
    - look backwards for a target position that does not contain a zero (unless it is position zero)
      - if the target position does not contain the original number use the next position
    - if the target position is different from the original position
      - add the number to the number on the target position
      - replace the original number by zero
*/

function afterMove() {
//	var gridText = JSON.stringify( grid, null, '\t' );
//	debug(gridText);
	updateGrid();
	spawnRand();
	getScore();
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
					addScore(array[x]);
//					score+=array[t]+array[x];
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
//	updateBest();
//	updateLevel();
	var currentScore = score + sum;
	currentScore = highYellowDarkBlue + currentScore.toString()
	statusFrame.center( currentScore.center(10) );
	statusFrame.cycle();
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

	levelText = "Level " + level + (desc === "" ? "" : (" — " + desc));
//	levelBar.style.width = (level * 10) + "%";
}


// GAME OVER FUNCTIONS

function gameOver() {
	// Close game board
	statusFrame.close();
	statusFrame.delete();
	boardFrame.close();
	boardFrame.delete();
	fixedFrame.close();
	fixedFrame.delete();

	var finalScore = score + sum;
	var scoreFrame = new Frame(1, 1, 80, 24, 0, frame);
	scoreFrame.crlf();
	scoreFrame.crlf();
	scoreFrame.center(highWhite + player.name + lowWhite + ', this time you scored ' + highCyan + finalScore.toString() );
	scoreFrame.crlf();
	scoreFrame.crlf();
	if( player.highscore < finalScore ) {
		updateScoreList( finalScore );
		scoreFrame.center( lowWhite + 'This is your new high score!' );
		scoreFrame.crlf();
	}

	// Display high scores
	try {
		var jsonClient = new JSONClient(serverIni.host, serverIni.port);
		var playerList = jsonClient.read("DOUBLES", "DOUBLES.PLAYERS", 1);

		if ( playerList.length > 0 ) {
			playerList  = sortByKey(playerList, 'highscore');
			//debug( JSON.stringify( playerList, null, '\t' ) );
			var scoresPerScreen = 8;
			if ( playerList.length < scoresPerScreen ) { scoresPerScreen = playerList.length; }
			for (var i=0; i<scoresPerScreen; i++) {
					//debug(playerList[i].name + ' | ' + playerList[i].highscore);
					var scoreColor = lowWhite;
					if (playerList[i].name == user.alias) { scoreColor = highWhite; }
					scoreFrame.gotoxy(2, scoreFrame.getxy().y);
					scoreFrame.putmsg(scoreColor + playerList[i].name);
					scoreFrame.gotoxy(32, scoreFrame.getxy().y);
					scoreFrame.putmsg(scoreColor + playerList[i].highscore);
					scoreFrame.gotoxy(47, scoreFrame.getxy().y);
					scoreFrame.putmsg(scoreColor + playerList[i].system);
					scoreFrame.crlf();			
					if ( i !== scoresPerScreen-1 ) {
						var separator = charHorizSingle.repeat(80);
						scoreFrame.putmsg(highBlack + separator);
						scoreFrame.crlf();			
					}
			}
		}
	} catch(err) {
		console.write(LOG_ERR, "JSON client error: " + err);
		return false;
	}
	jsonClient.disconnect();


	scoreFrame.crlf();
	scoreFrame.center( lowWhite + 'Press ' + lowCyan + '[' + highCyan + 'enter' + lowCyan + ']' + lowWhite + ' to return to the BBS.' );

	scoreFrame.top();
	scoreFrame.draw();
	scoreFrame.cycle();

	// Wait for user to hit enter
	while( ascii(userInput) !== 13) {
		userInput = console.getkey(K_NOCRLF|K_NOECHO);
	}

	scoreFrame.close();
	scoreFrame.delete();
	frame.cycle();

	// Credits screen
	var creditsFrame = new Frame(1, 6, 80, 18, 0, frame);
	creditsFrame.load(js.exec_dir + '/ansi/credits.ans', 80, 18);
	creditsFrame.draw();
	creditsFrame.top();
	frame.cycle();

	// Wait for user to hit enter
	while( ascii(console.getkey(K_NOCRLF|K_NOECHO)) !== 13) {}

	// Close credits screen
	creditsFrame.close();
	frame.cycle();
	titleFrame.delete();

	// Return to BBS
	exit();
}

// UTIL FUNCTIONS

function keyPress(code) {
	if (ascii(code) === 81 || ascii(code) === 113 )  { gameOver(); } // reinit
	else if (code === KEY_LEFT || KEY_UP || KEY_RIGHT || KEY_DOWN ) {
			 if (code === KEY_LEFT )   { moveLeft(); } // left
		else if (code === KEY_UP )     { moveUp(); } // up
		else if (code === KEY_RIGHT )  { moveRight(); } // right
		else if (code === KEY_DOWN )   { moveDown(); } // down
		afterMove();
	}
}

function spawnRand() {
	var x, y, possibles = [];

	// search grid for empty coordinates, store them in possibles[].
	for(y = 0; y < 4; y++) {
		for(x = 0; x < 4; x++) {
			if(grid[x][y] === 0)
				possibles.push([x, y]);
		}
	}

	// choose one of the coordinates in possibles[] for new tile.
	if(possibles.length) {
		var randomValue = (Math.floor(Math.random() * 9) === 8 ? 4 : 2);
		var randomBlock = possibles[(Math.floor(Math.random() * possibles.length))];
		var x = randomBlock[0];
		var y = randomBlock[1];
		var i;
		grid[x][y] = randomValue;
		// animate "creation" of new tile 
		for(i = 0; i < 4; i++) {
			fixedTiles[x][y].invalidate();
			fixedTiles[x][y].load(js.exec_dir + '/ansi/new-tile-' + i.toString() + '.ans', 16, 4);
			fixedTiles[x][y].draw();
			// slight pause
			mswait(50);
		}
		// display new title
		fixedTiles[x][y].invalidate();
		fixedTiles[x][y].load(js.exec_dir + '/ansi/' + grid[x][y].toString() + '.ans', 16, 4);
		fixedTiles[x][y].draw();
	}
	else {
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

function initGrid() {
	grid = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
	//log( JSON.stringify(grid) );

	spawnRand();
	spawnRand();

	//updateGrid();
}

function init() {
	initPlayer();
	initGrid();
}


function createPlayer() {
	var playerObj = {
		'name' : user.alias,
		'highscore' : 0,
		'system' : system.name
	};
	return playerObj;
}

function initPlayer() {
	var f = new File(js.exec_dir + "server.ini");
	f.open("r");
	serverIni = f.iniGetObject();
	f.close();
	try {
		var jsonClient = new JSONClient(serverIni.host, serverIni.port);
		var playerList = jsonClient.read("DOUBLES", "DOUBLES.PLAYERS", 1);
		// No players yet. We need to create the players database
		if (playerList === undefined) {
			playerList = [];
			player = createPlayer();
			playerList.push(player);
			jsonClient.write("DOUBLES", "DOUBLES.PLAYERS", playerList, 2);
		}
		// There have already been players.
		else {
			var playerInList = false;
			// Iterate over list and see if this user has entry in high score list.
			for (var i=0; i<playerList.length; i++) {
				if (playerList[i].name == user.alias) {
					player.name = playerList[i].name;
					player.highscore = playerList[i].highscore;
					player.system = playerList[i].system;
					playerInList = true;
				}
			}
			// User was NOT in the list, so create them.
			if (!playerInList) { 
				player = createPlayer();
				playerList.push(player);
				jsonClient.write("DOUBLES", "DOUBLES.PLAYERS", playerList, 2);
			}
		}
	} catch(err) {
		console.write(LOG_ERR, "JSON client error: " + err);
		return false;
	}
	jsonClient.disconnect();
}


function updateScoreList(finalScore) {
	// If the player's new score is greater than all-time score,
	// overwrite his entry in the scorelist.
	var f = new File(js.exec_dir + "server.ini");
	f.open("r");
	serverIni = f.iniGetObject();
	f.close();
	try {
		var jsonClient = new JSONClient(serverIni.host, serverIni.port);
		var playerList = jsonClient.read("DOUBLES", "DOUBLES.PLAYERS", 1);
		if (playerList !== undefined) {
			// Look for player's entry in the list.
			for (var i=0; i<playerList.length; i++) {
				if (playerList[i].name == user.alias) {
					playerList[i].highscore = finalScore;
				}
			}
		}
		jsonClient.write("DOUBLES", "DOUBLES.PLAYERS", playerList, 2);
	} catch(err) {
		console.write(LOG_ERR, "JSON client error: " + err);
		return false;
	}
	jsonClient.disconnect();
}









// INITIAL SETUP

console.clear();

// Frame for the whole app
var frame = new Frame(1, 1, 80, 24, BG_BLUE);
frame.bottom();

// Title screen
var titleFrame = new Frame(1, 6, 80, 18, 0, frame);
titleFrame.load(js.exec_dir + '/ansi/title.ans', 80, 18);
titleFrame.draw();
titleFrame.top();

// Wait for user to hit enter
var userInput = '';
while( ascii(userInput) != 13 ) {
	userInput = console.getkey(K_UPPER | K_NOCRLF);
	if (ascii(userInput) === 81 ) { exit(); } // reinit
} // end while

// Close title screen
titleFrame.close();
frame.cycle();
titleFrame.delete();

var statusFrame = new Frame(1, 24, 80, 1, BG_BLUE,frame);
statusFrame.draw();
statusFrame.top();


// Draw game board
var boardFrame = new Frame(1, 1, 80, 23, BG_BLUE,frame);
boardFrame.load(js.exec_dir + '/ansi/game-board-23x80.ans', 80, 23);
boardFrame.draw();
boardFrame.top();

// Create frame for fixed tiles
var fixedFrame = new Frame(1, 1, 80, 23, 0, frame);
fixedFrame.top();

// Create frame for tiles in motion
//var active = new Frame(1, 1, 80, 25, 0, frame);
//active.top();

var fixedTiles = [
	[
		new Frame(4, 1, 17, 5, 0, fixedFrame),
		new Frame(4, 7, 17, 5, 0, fixedFrame),
		new Frame(4, 13, 17, 5, 0, fixedFrame),
		new Frame(4, 19, 17, 5, 0, fixedFrame)
	],
	[
		new Frame(23, 1, 17, 5, 0, fixedFrame),
		new Frame(23, 7, 17, 5, 0, fixedFrame),
		new Frame(23, 13, 17, 5, 0, fixedFrame),
		new Frame(23, 19, 17, 5, 0, fixedFrame)
	],
	[
		new Frame(42, 1, 17, 5, 0, fixedFrame),
		new Frame(42, 7, 17, 5, 0, fixedFrame),
		new Frame(42, 13, 17, 5, 0, fixedFrame),
		new Frame(42, 19, 17, 5, 0, fixedFrame)
	],
	[
		new Frame(61, 1, 17, 5, 0, fixedFrame),
		new Frame(61, 7, 17, 5, 0, fixedFrame),
		new Frame(61, 13, 17, 5, 0, fixedFrame),
		new Frame(61, 19, 17, 5, 0, fixedFrame)
	]

];



init();

userInput = '';
while( ascii(userInput) != 81 ) {
	userInput = console.getkey(K_UPPER | K_NOCRLF);
	keyPress(userInput);
} // end while

gameOver();



