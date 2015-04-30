function findCenterCoord(outer,inner) {
	var coord = parseInt( (outer - inner)/2 );
	if (coord < 1) { coord = 1; }
	return coord;
}

function weightedRandom(list,weight) {
	// adapted from http://codetheory.in/weighted-biased-random-number-generation-with-javascript-based-on-probability/
	var rand = function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
	var generateWeighedList = function(list, weight) {
		var weighed_list = [];
		// Loop over weights
		for (var i = 0; i < weight.length; i++) {
			var multiples = weight[i] * 100;
			// Loop over the list of items
			for (var j = 0; j < multiples; j++) {
				weighed_list.push(list[i]);
			}
		}
		return weighed_list;
	};
	var weighed_list = generateWeighedList(list, weight);
	var random_num = rand(0, weighed_list.length-1);
	return weighed_list[random_num];
}


function debug(debugText) {
	var debugFile = new File( js.exec_dir + '/debug.txt' );
	debugFile.open("a");
	debugFile.write( '\n' + debugText + '\n' );
	debugFile.close();
}


// String repeat
// From: http://snipplr.com/view/699/stringrepeat/
String.prototype.repeat = function( num ) {
	for( var i = 0, buf = ''; i < num; i++ ) buf += this;
	return buf;
}

// Text left justify, right justify, and center
// From: http://snipplr.com/view/709/stringcenter-rjust-ljust/
String.prototype.ljust = function( width, padding ) {
	padding = padding || ' ';
	padding = padding.substr( 0, 1 );
	if ( this.length < width ) {
		return this + padding.repeat( width - this.length );
	}
	else {
		return this;
	}
}
String.prototype.rjust = function( width, padding ) {
	padding = padding || ' ';
	padding = padding.substr( 0, 1 );
	if( this.length < width ) {
		return padding.repeat( width - this.length ) + this;
	}
	else {
		return this;
	}
}
String.prototype.center = function( width, padding ) {
	padding = padding || ' ';
	padding = padding.substr( 0, 1 );
	if( this.length < width ) {
		var len		= width - this.length;
		var remain	= ( len % 2 == 0 ) ? '' : padding;
		var pads	= padding.repeat( parseInt( len / 2 ) );
		return pads + this + pads + remain;
	}
	else {
		return this;
	}
}


// Get distinct values from an array of objects
// http://stackoverflow.com/questions/15125920/how-to-get-distinct-values-from-an-array-of-objects-in-javascript
function uniqueBy(arr, fn) {
  var unique = {};
  var distinct = [];
  arr.forEach(function (x) {
    var key = fn(x);
    if (!unique[key]) {
      distinct.push(key);
      unique[key] = true;
    }
  });
  return distinct;
}


// Sort an array of objects by a key
// Adapted to sort in reverse order
// http://stackoverflow.com/a/8837505/566307
function sortByKey(array, key) {
	return array.sort(function(a, b) {
		var x = a[key]; var y = b[key];
		return ((x > y) ? -1 : ((x < y) ? 1 : 0));
	});
}


function hasDecimal(num) {
	return (num % 1 != 0);
}

function isOdd(num) { return num % 2 == 1; }


// Change date to yyyymmdd format
Date.prototype.yyyymmdd = function() {
	var yyyy = this.getFullYear().toString();
	var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
	var dd  = this.getDate().toString();
	return yyyy + (mm[1]?mm:'0'+mm[0]) + (dd[1]?dd:'0'+dd[0]); // padding
};

// Get time string. Adapted from:
// http://stackoverflow.com/questions/10211145/getting-current-date-and-time-in-javascript#comment25142367_10211214
Date.prototype.timeNow = function(){
	return ((this.getHours() < 10)?"0":"") + ((this.getHours()>12)?(this.getHours()-12):this.getHours()) +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() + ((this.getHours()>12)?(' p.m.'):' a.m.');
};