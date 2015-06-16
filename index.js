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
	var n = new Buffer( new String(n) );
	arr.sort(a, b) {
		if(typeof(a) == 'string') {
			a = rusha.digestFromString(a);
		}
		else if(Number.isFinite(a)) {
			a = rusha.digest( intToBuffer(a) );
		}
		
	}
};

var BorgRing = function(data) { this.init(data); };
BorgRing.sort = sort;
BorgRing.shuffle = shuffle;
BorgRing.guid = guid;

BorgRing.prototype.init = function(data) {
	this.nodes = [];
};

module.exports = BorgRing;