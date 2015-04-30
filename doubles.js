load("sbbsdefs.js");
load("json-client.js");
load("frame.js");
load("layout.js");
// some of the custom functions I'm using
load(js.exec_dir + "helper-functions.js");
load(js.exec_dir + "frame-transitions.js");



// COLORS
var lowBlack = 'NK0';
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
var termRows = console.screen_rows;
var termCols = console.screen_columns;

var largeTerm = false;
if (termRows >= 59 && termCols >= 132) {
	largeTerm = true;
}
var tileW = 17;
var tileH = 5;
var suffix = '';
if (largeTerm) { 
	suffix = '-large';
	tileW = 30;
	tileH = 12;
}


var grid;
var score = 0, sum = 0;
var infoText;
var level = 0, levelText, levelBar;

var player = new Object();
player.highscore = '';
player.name = '';
player.list = [];
player.weight = [];
player.startTiles = 2;




// GRID FUNCTIONS

function updateGrid() {
	var e, x, y;

	for(y = 0; y < 4; y++) {
		for(x = 0; x < 4; x++) {
			if(grid[x][y] !== 0) {
				fixedTiles[x][y].invalidate();
				fixedTiles[x][y].transparent = true;
				fixedTiles[x][y].load(js.exec_dir + '/bin/' + grid[x][y].toString() + suffix + '.bin', tileW, tileH);
				// ascii(219) = solid block
				maskFrame( fixedTiles[x][y], ascii(219), LIGHTGREEN );
				fixedTiles[x][y]
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
	var x,t,stop=0,success=false;

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
				success = true;
			}
		}
	}
	return success;
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
	var x,success;
	for (x=0;x<4;x++) {
		success |= slideArray(grid[x]);
	}
	return success;
}

function moveLeft() {
	var success;
	rotateBoard();
	success = moveUp();
	rotateBoard();
	rotateBoard();
	rotateBoard();
	return success;
}

function moveDown() {
	var success;
	rotateBoard();
	rotateBoard();
	success = moveUp();
	rotateBoard();
	rotateBoard();
	return success;
}

function moveRight() {
	var success;
	rotateBoard();
	rotateBoard();
	rotateBoard();
	success = moveUp();
	rotateBoard();
	return success;
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
//	updateLevel();
	var currentScore = score + sum;
	statusFrame.center( 
		highYellowDarkBlue + 
		'SCORE: ' + 
		currentScore.toString() + 
		'            [Q] TO QUIT' 
	);
	statusFrame.cycle();
}


// LEVEL FUNCTIONS

function updateLevel() {
	level = Math.floor(Math.log(score + sum) / Math.log(4));

	if(level > 10)
		level = 10;
	if(level < 0)
		level = 0;

	levelText = "Level " + level;
//	levelBar.style.width = (level * 10) + "%";
}


// GAME OVER FUNCTIONS

function gameOver() {
	// Close game board
	var wipeFrame = new Frame(1, 1, termCols, termRows, undefined, frame);
	wipeFrame.transparent = true;
	wipeFrame.open();
	if ( largeTerm ) {
		// delay on small screen
		wipeRight(wipeFrame,4,BLACK,0);
	}
	else {
		// remove the delay to speed up wipe on large screen
		wipeRight(wipeFrame,4,BLACK,1);
	}

	statusFrame.close();
	statusFrame.delete();
	boardFrame.close();
	boardFrame.delete();
	fixedFrame.close();
	fixedFrame.delete();
	wipeFrame.close();
	wipeFrame.delete();

	var finalScore = score + sum;

	var scoW = 80;
	if (largeTerm) { var scoH = 40; }
	else { var scoH = 24; }
	var scoX = findCenterCoord( termCols, scoW );
	var scoY = findCenterCoord( termRows, scoH );
	var scoreFrame = new Frame(scoX, scoY, scoW, scoH, BG_BLACK, frame);
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
			if (largeTerm) {
				var scoresPerScreen = 16;
			}
			else {
				var scoresPerScreen = 8;
			}
			if ( playerList.length < scoresPerScreen ) { scoresPerScreen = playerList.length; }
			scoreFrame.gotoxy(2, scoreFrame.getxy().y);
			scoreFrame.putmsg(highBlack + 'Player');
			scoreFrame.gotoxy(28, scoreFrame.getxy().y);
			scoreFrame.putmsg(highBlack + 'Score');
			scoreFrame.gotoxy(47, scoreFrame.getxy().y);
			scoreFrame.putmsg(highBlack + 'BBS');
			scoreFrame.crlf();
			scoreFrame.crlf();
			for (var i=0; i<scoresPerScreen; i++) {
					//debug(playerList[i].name + ' | ' + playerList[i].highscore);
					var scoreColor = lowWhite;
					if (playerList[i].name == user.alias) { scoreColor = highWhite; }
					scoreFrame.gotoxy(2, scoreFrame.getxy().y);
					scoreFrame.putmsg(scoreColor + playerList[i].name);
					scoreFrame.gotoxy(28, scoreFrame.getxy().y);
					scoreFrame.putmsg(scoreColor + playerList[i].highscore.toLocaleString());
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
		jsonClient.disconnect();
	} catch(err) {
		console.write(LOG_ERR, "JSON client error: " + err);
		return false;
	}


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
	var creW = 80;
	var creH = 18;
	var creX = findCenterCoord( termCols, creW );
	var creY = findCenterCoord( termRows, creH );
	var creditsFrame = new Frame(creX, creY, creW, creH, 0, frame);
	creditsFrame.load(js.exec_dir + '/ansi/credits.ans', creW, creH);
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
	// If they press "Q"
	if (ascii(code) === 81 || ascii(code) === 113 )  { 
		gameOver();  // reinit
	}

	// If they press an arrow key
	else if (code === KEY_LEFT || KEY_UP || KEY_RIGHT || KEY_DOWN ) {
  		var success = false;
			 if (code === KEY_LEFT )   { success = moveLeft(); } // left
		else if (code === KEY_UP )     { success = moveUp(); } // up
		else if (code === KEY_RIGHT )  { success = moveRight(); } // right
		else if (code === KEY_DOWN )   { success = moveDown(); } // down

		// Only add to score, spawn new tile, etc if they actually were able
		// to slide in the direction they selected. 
		if (success) {
			afterMove();
		}
		// If they couldn't slide, then let's check if the game is over.
		else {
			if(!checkMovable()) {
				gameOver();
			}
		}
	}
}




function spawnRand(num) {
	num = num || 1;
	// Use a loop to spawn as many tiles as specified
	for (var loop=0; loop<num; loop++) {
		var x, y, possibles = [];

		// search grid for empty coordinates, store them in possibles[].
		for(y = 0; y < 4; y++) {
			for(x = 0; x < 4; x++) {
				if(grid[x][y] === 0)
					possibles.push([x, y]);
			}
		}

		// choose one of the coordinates in possibles[] for new tile.
		if( possibles.length ) {
// 			var randomValue = (Math.floor(Math.random() * 9) === 8 ? 4 : 2);
			// The possible tile values and their probabilities depend
			// on the player's chosen difficulty level.
			var randomValue = weightedRandom( player.list, player.weight );
			var randomBlock = possibles[(Math.floor(Math.random() * possibles.length))];
			var x = randomBlock[0];
			var y = randomBlock[1];
			var i;
			
			grid[x][y] = randomValue;
			// animate "creation" of new tile 
			for(i = 0; i < 4; i++) {
				fixedTiles[x][y].invalidate();
				fixedTiles[x][y].transparent = true;
				fixedTiles[x][y].load(js.exec_dir + '/bin/new-tile-' + i.toString() + suffix + '.bin', tileW, tileH);
				maskFrame( fixedTiles[x][y], ascii(219), LIGHTGREEN );
				fixedTiles[x][y].draw();
				// slight pause
				mswait(30);
			}
			// display new title
			fixedTiles[x][y].invalidate();
			fixedTiles[x][y].transparent = true;
			fixedTiles[x][y].load(js.exec_dir + '/bin/' + grid[x][y].toString() + suffix  + '.bin', tileW, tileH);
			maskFrame( fixedTiles[x][y], ascii(219), LIGHTGREEN );
			fixedTiles[x][y].draw();
		}
		else {
			if(!checkMovable()) {
				gameOver();
			}
		}
	} // end for loop
} // end spawnRand(num)

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

	// Number of tiles is based on player's difficulty choice.
	spawnRand(player.startTiles);
	//updateGrid();
}

function init() {
	var playerInList = initPlayer();
	// If it's the player's first time, display instructions
	if (!playerInList) {
		instructions();
	}
	// Let user set difficulty level
	difficulty();
	// generate the titles
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
	return playerInList;
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

function instructions() {
	// Draw game board
	var insW = 66;
	var insH = 19;
	var insX = findCenterCoord( termCols, insW );
	var insY = findCenterCoord( termRows, insH );
	var instructFrame = new Frame(insX, insY, insW, insH, BG_LIGHTGRAY,frame);
	instructFrame.crlf();
	instructFrame.crlf();
	instructFrame.center('H O W   T O   P L A Y');
	instructFrame.crlf();
	instructFrame.center('---------------------');
	instructFrame.crlf();
	instructFrame.crlf();
	instructFrame.crlf();
	instructFrame.center('Use your arrow keys to slide tiles across the board.');
	instructFrame.crlf();
	instructFrame.crlf();
	instructFrame.center('When two tiles with the same number touch, they merge into one!');
	instructFrame.crlf();
	instructFrame.crlf();
	instructFrame.center('The game ends when the board is full and no merges are possible.');
	instructFrame.crlf();
	instructFrame.crlf();
	instructFrame.center('Press [Q] to exit the game early.');
	instructFrame.crlf();
	instructFrame.crlf();
	instructFrame.crlf();
	instructFrame.crlf();
	instructFrame.center('T O   C O N T I N U E ,   P R E S S   [ E N T E R ]');
	instructFrame.crlf();
	instructFrame.draw();
	instructFrame.top();

	userInput = '';
	while( ascii(userInput) !== 13) {
		userInput = console.getkey(K_NOCRLF|K_NOECHO);
	}
	instructFrame.close();
	instructFrame.delete();
}



function difficulty() {
	// Draw game board
	var difW = 66;
	var difH = 12;
	var difX = findCenterCoord( termCols, difW );
	var difY = findCenterCoord( termRows, difH );
	var difficultyFrame = new Frame(difX, difY, difW, difH, BG_LIGHTGRAY,frame);
	difficultyFrame.crlf();
	difficultyFrame.crlf();
	difficultyFrame.center('N E W   G A M E');
	difficultyFrame.crlf();
	difficultyFrame.center('---------------');
	difficultyFrame.crlf();
	difficultyFrame.crlf();
	difficultyFrame.crlf();
	difficultyFrame.center('To play a ' + lowCyan + 'normal' + lowBlack + ' game, press [Enter].');
	difficultyFrame.crlf();
	difficultyFrame.crlf();
	difficultyFrame.center('To play a ' + lowCyan + 'difficult' + lowBlack + ' game, press [D].');
	difficultyFrame.draw();
	difficultyFrame.top();

	userInput = '';
	while( ascii(userInput) !== 13 && ascii(userInput) !== 68 && ascii(userInput) !== 100 ) {
		userInput = console.getkey(K_NOCRLF|K_NOECHO);
	}

	difficultyFrame.close();
	difficultyFrame.delete();

	// Difficult mode
	if ( ascii(userInput) == 68 || ascii(userInput) == 100 ) {
		player.list = [2, 4, 8, 16, 32, 64];
		player.weight = [0.5, 0.3, 0.1, 0.05, 0.03, 0.02];
		player.startTiles = 8
	}
	// Normal mode
	else {
		player.list = [2, 4, 8];
		player.weight = [0.8, 0.175, 0.025];
		player.startTiles = 2
	}
}







// INITIAL SETUP

console.clear();

// Frame for the whole app
var frame = new Frame(1, 1, termCols, termRows, BG_BLUE);
frame.bottom();

// Title screen
var titW = 80;
var titH = 18;
var titX = findCenterCoord( termCols, titW );
var titY = findCenterCoord( termRows, titH );
var titleFrame = new Frame(titX, titY, titW, titH, 0, frame);
titleFrame.load(js.exec_dir + '/ansi/title.ans', titW, titH);
titleFrame.draw();
titleFrame.top();

// Wait for user to hit enter
var userInput = '';
while( ascii(userInput) != 13 ) {
	userInput = console.getkey(K_UPPER | K_NOCRLF);
	if ( ascii(userInput) === 81 ) { exit(); } // reinit
} // end while

// Close title screen
titleFrame.close();
frame.cycle();
titleFrame.delete();

var statusFrame = new Frame(1, termRows, termCols, 1, BG_BLUE,frame);
statusFrame.draw();
statusFrame.top();


// Draw game board
var boardFrame = new Frame(1, 1, termCols, termRows-1, BG_BLUE,frame);
boardFrame.load(js.exec_dir + '/bin/game-board' + suffix + '.bin', termCols, termRows-1);
boardFrame.draw();
boardFrame.top();

// Create frame for fixed tiles
var fixedFrame = new Frame(1, 1, termCols, termRows-1, 0, frame);
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
if (largeTerm) {
	fixedTiles = [
		[
			new Frame(4, 2, 30, 12, 0, fixedFrame),
			new Frame(4, 16, 30, 12, 0, fixedFrame),
			new Frame(4, 30, 30, 12, 0, fixedFrame),
			new Frame(4, 44, 30, 12, 0, fixedFrame)
		],
		[
			new Frame(36, 2, 30, 12, 0, fixedFrame),
			new Frame(36, 16, 30, 12, 0, fixedFrame),
			new Frame(36, 30, 30, 12, 0, fixedFrame),
			new Frame(36, 44, 30, 12, 0, fixedFrame)
		],
		[
			new Frame(68, 2, 30, 12, 0, fixedFrame),
			new Frame(68, 16, 30, 12, 0, fixedFrame),
			new Frame(68, 30, 30, 12, 0, fixedFrame),
			new Frame(68, 44, 30, 12, 0, fixedFrame)
		],
		[
			new Frame(100, 2, 30, 12, 0, fixedFrame),
			new Frame(100, 16, 30, 12, 0, fixedFrame),
			new Frame(100, 30, 30, 12, 0, fixedFrame),
			new Frame(100, 44, 30, 12, 0, fixedFrame)
		]
	];

}



init();

userInput = '';
while( ascii(userInput) != 81 ) {
	userInput = console.getkey(K_UPPER | K_NOCRLF);
	keyPress(userInput);
} // end while

gameOver();



