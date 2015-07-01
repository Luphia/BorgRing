var Rusha = require('rusha');

var rusha = new Rusha();

var guid = function() {
	var s4 = function() {
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	};
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' +s4() + '-' + s4() + s4() + s4();
};
var intToBuffer = function(int) {
	if(!Number.isFinite(int)) { return false; }

	var length = Math.ceil((Math.log(int + 1)/Math.log(2))/8);
	var buffer = new Buffer(length);
	var arr = [];

	while (int > 0) {
		var temp = int % 2;
		arr.push(temp);
		int = Math.floor(int / 2);
	}

	var counter = 0;
	var total = 0;

	for (var i = 0, j = arr.length; i < j; i++) {
		if (counter % 8 == 0 && counter > 0) {
			buffer[length - 1] = total;
			total = 0;
			counter = 0;
			length--;
		}

		if (arr[i] == 1) {
			total += Math.pow(2, counter);
		}
		counter++;
	}

	buffer[0] = total;

	return new Uint8Array[buffer];
};
var XOR = function(buff1, buff2) {
	if(!util.isBuffer(buff1) || !util.isBuffer(buff2)) { return false; }
	if(buff2.length > buff1.length) { return XOR(buff2, buff1); }

	var res = [];
	for(var i = 0; i < buff1.length; i++) {
		res.push(buff1[i] ^ buff2[i]);
	}
	return new Buffer(res);
};
var	shuffle = function(arr, n) {
	if(!Array.isArray(arr)) { return false; }
	var n = new Uint8Array( new Buffer( new String(n) ) );
	arr.sort(function(a, b) {
		if(typeof(a) == 'string') {
			a = rusha.digestFromString(a);
		}
		else if(Number.isFinite(a)) {
			a = rusha.digest( intToBuffer(a) );
		}
		
	});
};

var BorgRing = function(data) { this.init(data); };
BorgRing.sort = sort;
BorgRing.shuffle = shuffle;
BorgRing.guid = guid;

BorgRing.prototype.init = function(data) {
	this.nodes = [];
};

module.exports = BorgRing;