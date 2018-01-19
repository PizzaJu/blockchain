var Block = require('./Block.js');
var crypto = require('crypto');

class Blockchain {
	constructor() {
		this.blockchain = [Block.genesis];
		this.difficulty = 3;
	}
}

module.exports = Blockchain;
