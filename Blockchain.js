var Block = require('./Block.js');
var crypto = require('crypto');

class Blockchain {
	constructor() {
		this.blockchain = [Block.genesis];
		this.difficulty = 3;
	}

	get() {
		return this.blockchain;
	}

	get latestBlock() {
		return this.blockchain[this.blockchain.length - 1];
	}

	isValidHashDifficulty(hash) {   //检测第一次不是‘0’的位置
		for (var i = 0; i < hash.length; i++) {
			if (hash[i] !== "0") {
				break;
			}
		}
		return i >= this.difficulty;   //工作量证明：当hash值前面没有至少3个0的时候，返回false
	}

	calculateHashForBlock(block) {
		const { index, previousHash, timestamp, data, nonce } = block;
		return this.calculateHash(
			index,
			previousHash,
			timestamp,
			data,
			nonce
		);
	}

	calculateHash(index, previousHash, timestamp, data, nonce) {
		return crypto
			.createHash('sha256')
			.update(index + previousHash + timestamp + data + nonce)
			.digest("hex");
	}

	mine(data) {
		const newBlock = this.generateNextBlock(data);
		try {
			this.addBlock(newBlock);
		} catch (err) {
			throw err;
		}
	}

	generateNextBlock(data) {
		const nextIndex = this.latestBlock.index + 1;
		const previousHash = this.latestBlock.hash;
		let timestamp = new Date().getTime();
		let nonce = 0;
		let nextHash = this.calculateHash(
			nextIndex,
			previousHash,
			timestamp,
			data,
			nonce
		);

		while (!this.isValidHashDifficulty(nextHash)) {
			nonce = nonce + 1;
			timestamp = new Date().getTime();
			nextHash = this.calculateHash(
				nextIndex,
				previousHash,
				timestamp,
				data,
				nonce
			);
		}

		const nextBlock = new Block(
			nextIndex,
			previousHash,
			timestamp,
			data,
			nextHash,
			nonce
		);

		return nextBlock;
	}

	addBlock(newBlock) {
		if (this.isValidNextBlock(newBlock, this.latestBlock)) {
			this.blockchain.push(newBlock);
		} else {
			throw "Error: Invalid block";
		}
	}

	isValidNextBlock(nextBlock, previousBlock) {
		const nextBlockHash = this.calculateHashForBlock(nextBlock);

		if (previousBlock.index + 1 !== nextBlock.index) {
			return false;
		} else if (previousBlock.hash !== nextBlock.previousHash) {
			return false;
		} else if (nextBlockHash !== nextBlock.hash) {
			return false;
		} else if (!this.isValidHashDifficulty(nextBlockHash)) {
			return false;
		} else {
			return true;
		}
	}
}

module.exports = Blockchain;
