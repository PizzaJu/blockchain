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

	isValidNextBlock(nextBlock, previousBlock) {           //检测新区块是否有效
		const nextBlockHash = this.calculateHashForBlock(nextBlock);

		if (previousBlock.index + 1 !== nextBlock.index) {            //index是否加1
			return false;
		} else if (previousBlock.hash !== nextBlock.previousHash) {      //新区块的previousHash是否是前一个区块的Hash
			return false;
		} else if (nextBlockHash !== nextBlock.hash) {          //再次计算的Hash值是否和现在的一样(sha256算法是可以重现的)
			return false;
		} else if (!this.isValidHashDifficulty(nextBlockHash)) {       //当前区块的Hash值的难度是否合适
			return false;
		} else {
			return true;
		}
	}

	isValidChain(chain) {
		if (JSON.stingify(chain[0]) !== JSON.stringify(Block.genesis)) {   //如果初始区块错误，返回错误
			return false;
		}

		const tempChain = [chain[0]];
		for (let i = 1; i < chain.length; i++) {
			if (this.isValidNextBlock(chain[i], tempChain[i - 1])) {
				tempChain.push(chain[i]);
			} else {
				return false;
			}
		}
		return true;          //每个区块都没问题，返回true
	}

	isChainLonger(chain) {
		return chain.length > this.blockchain.length;
	}

	replaceChain(newChain) {
		if (this.isValidChain(newChain) && this.isChainLonger(newChain)) {
			this.blockchain = JSON.parse(JSON.stringify(newChain));   //?
		} else {
			throw "Error: invalid chain";
		}
	}
}

module.exports = Blockchain;
