/*

var BR = require('./index.js')
br = new BR()
br.sort(Math.random())

var n1 = {"ip": "10.10.21.11", "port": "5566"};
br.addNode(n1);
for(var i = 1; i < 20; i++) {
	var node = {"ip": "10.10.21." + (i+11), "port": "5566"};
	br.addNode(node);
}

br.getNeighbor(n1);
br.getNodeList();
br.find("abc");
br.find({"some": "content"});

 */

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
var stringToInt = function(str) {
	var result = 0;
	for(var i = 0; i < str.length; i++) {
		result += str.charCodeAt(i) * (i + 1);
	}

	return result;
};
var bufferConcat = function(buffers) {
	var result;

	if(Array.isArray(buffers)) {
		var l = 0;
		for(var i = 0; i < buffers.length; i++) {
			l += buffers[i].length;
		}

		result = new Uint8Array(l);

		for(var i = 0, p = 0; i < buffers.length; i++) {
			result.set(buffers[i], p);
			p += buffers[i].length;
		}
	}
	else {
		result = buffers;
	}

	return result;
};
var clone = function(obj) {
	var rs;
	if(typeof(obj) == 'object') {
		rs = Array.isArray(obj)? []: {};
		for(var k in obj) {
			rs[k] = clone(obj[k]);
		}
	}
	else {
		rs = obj;
	}

	return rs;
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
			a = new Uint8Array( new Buffer(a) );
		}
		else if(Number.isFinite(a)) {
			a = intToBuffer(a);
		}
		else if(typeof(a) == 'object') {
			a = new Uint8Array( new Buffer( JSON.stringify(a) ) );
		}

		if(typeof(b) == 'string') {
			b = new Uint8Array( new Buffer(b) );
		}
		else if(Number.isFinite(b)) {
			b = intToBuffer(b);
		}
		else if(typeof(b) == 'object') {
			b = new Uint8Array( new Buffer( JSON.stringify(b) ) );
		}

		a = rusha.digest( bufferConcat([a, n]) );
		b = rusha.digest( bufferConcat([b, n]) );

		return stringToInt(a) > stringToInt(b);
	});
};

var BorgRing = function(data) { this.init(data); };
BorgRing.shuffle = shuffle;
BorgRing.guid = guid;

BorgRing.prototype.init = function(data) {
	this.nodes = [];
	this.attr = {};
};

BorgRing.prototype.addNode = function(node) {
	if(!this.exist(node)) {
		this.nodes.push(node);
		this.sort(this.attr.sort);
	}

	return this;
};
BorgRing.prototype.removeNode = function(node) {
	var i = this.indexOf(node);
	if(i > -1) {
		this.nodes.splice(i, 1);
	}

	return this;
};

BorgRing.prototype.sort = function(n) {
	this.attr.sort = n;
	shuffle(this.nodes, n);

	return this;
};

BorgRing.prototype.exist = function(node) {
	var rs = this.indexOf(node) > -1;
	return rs;
};
BorgRing.prototype.indexOf = function(node) {
	var rs = -1;
	if(typeof(node) == 'object') {
		for(var i = 0; i < this.nodes.length; i++) {
			if(JSON.stringify(node) == JSON.stringify(this.nodes[i])) {
				rs = i;
				break;
			}
		}
	}
	else {
		rs = this.nodes.indexOf(node);
	}

	return rs;
};

BorgRing.prototype.getNode = function(n) {
	if(!(n > -1)) { n = Math.floor( Math.random() * this.nodes.length ); }
	return this.nodes[n];
};

BorgRing.prototype.getNodeList = function() {
	return clone(this.nodes);
};

BorgRing.prototype.getNeighbor = function(node) {
	var n = this.indexOf(node);
	if(n > -1) {
		n = (n + 1) % this.nodes.length;
	}

	return this.getNode(n);
};

BorgRing.prototype.find = function(key) {
	var rs;

	if(typeof(key) == 'string') {

	}
	else if(typeof(key) == 'object') {
		key = JSON.stringify(key);
	}
	var i = stringToInt(key) % this.nodes.length;
	rs = this.nodes[i];

	return rs;
};

module.exports = BorgRing;