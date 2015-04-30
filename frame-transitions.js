load("sbbsdefs.js");

// this version masks the entire sprite up front.
function maskFrame(theFrame,maskChar,maskAttr) {
	var x, y, xl, yl;
	xl = theFrame.data.length;
	for (x=0; x<xl; x++) {
		yl = theFrame.data[x].length;
		for (y=0; y<yl; y++) {
			var theChar = theFrame.data[x][y];
			// If this character is an empty black space, 
			// then delete the character attributes in order
			// to make it act as transparent.
			if (theChar.ch == maskChar && theChar.attr == maskAttr) {
				theFrame.data[x][y].ch = undefined;
				theFrame.data[x][y].attr = undefined;
			} 
		}
	}
}

// Dissolve entire frame
function dissolve(theFrame,color,delay) {
	if (typeof(color) === "undefined") { color = BLACK; }
	if (typeof(delay) === "undefined") { delay = 1; }

	var x, y, xl, yl, pixelArray = [];

	xl = theFrame.width;
	yl = theFrame.height;
	for (x=0; x<xl; x++) {
		for (y=0; y<yl; y++) {
			pixelArray.push([x,y]);
		}
	}
	while( pixelArray.length > 0 ) {
		var randomIndex = Math.floor(Math.random() * pixelArray.length);
		var randomPixel = pixelArray.splice(randomIndex, 1);
		// ascii(219) = solid block; 5 = Magenta
		theFrame.setData(randomPixel[0][0],randomPixel[0][1],ascii(219),color);
		theFrame.cycle();
		// cycle sprites if there are any, so they remain on top layer.
		if (typeof Sprite !== 'undefined') {
			Sprite.cycle();
		}
		if (delay > 0) {
			mswait(delay);
		}
	}
}



//Dissolve, wiping down from top
function wipeDown(theFrame,wipeSize,color,delay) {
	if (typeof(wipeSize) === "undefined") { wipeSize = 2; }
	if (typeof(color) === "undefined") { color = BLACK; }
	if (typeof(delay) === "undefined") { delay = 1; }

	var x, y, xl, yl, p, pixelArray = [];
	xl = theFrame.width;
	yl = theFrame.height;

	for (y=0; y<yl; y+=wipeSize) {
		for (p=0;p<wipeSize; p++) {
			pixelArray[p] = [];
			for (x=0; x<xl; x++) {
				pixelArray[p].push(x);
			}
		}

		while( pixelArray[0].length > 0 ) {
			for (p=0;p<wipeSize; p++) {
				var randomIndex = Math.floor(Math.random() * pixelArray[p].length);
				var randomPixel = pixelArray[p].splice(randomIndex, 1);
				// ascii(219) = solid block; 5 = Magenta
				theFrame.setData(randomPixel,y+p,ascii(219),color);
				theFrame.cycle();
				// cycle sprites if there are any, so they remain on top layer.
				if (typeof Sprite !== 'undefined') {
					Sprite.cycle();
				}
				if (delay > 0) {
					mswait(delay);
				}
			}
		}
	}
}

//Dissolve, wiping right from left
function wipeRight(theFrame,wipeSize,color,delay) {
	if (typeof(wipeSize) === "undefined") { wipeSize = 5; }
	if (typeof(color) === "undefined") { color = BLACK; }
	if (typeof(delay) === "undefined") { delay = 1; }

	var x, y, xl, yl, p, pixelArray = [];
	xl = theFrame.width;
	yl = theFrame.height;

	for (x=0; x<xl; x+=wipeSize) {
		for (p=0;p<wipeSize; p++) {
			pixelArray[p] = [];
			for (y=0; y<yl; y++) {
				pixelArray[p].push(y);
			}
		}
		while( pixelArray[0].length > 0 ) {
			for (p=0;p<wipeSize; p++) {
				var randomIndex = Math.floor(Math.random() * pixelArray[p].length);
				var randomPixel = pixelArray[p].splice(randomIndex, 1);
				// ascii(219) = solid block; 5 = Magenta
				theFrame.setData(x+p,randomPixel,ascii(219),color);
				theFrame.cycle();
				// cycle sprites if there are any, so they remain on top layer.
				if (typeof Sprite !== 'undefined') {
					Sprite.cycle();
				}
				if (delay > 0) {
					mswait(delay);
				}
			}
		}
	}
}
