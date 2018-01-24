var wrtc = require('wrtc');
var Exchange = require('peer-exchange');
var p2p = new Exchange('my own blockchain', { wrtc: wrtc });
var net =require('net');
var messageType = require('./message-type.js');
const {
	REQUEST_LATEST_BLOCK,
	RECEIVE_LATEST_BLOCK,
	REQUEST_BLOCKCHAIN,
	RECEIVE_BLOCKCHAIN
} = messageType;
var Messages = require('./Messages.js')


class PeerToPeer {
	constructor(blockchain) {
		this.peers = [];   //P2P通道列表
		this.blockchain = blockchain;
	}

	startServer(port) {
		var server = net
			.createServer (socket =>
				p2p.accept(socket, (err, conn) => {   //outgoing connection
					if (err) {
						throw err;
					} else {
						// console.log(conn)
						this.initConnection.call(this, conn);
					}
				})
			)
			.listen(port);
	}

	connectToPeer(host, port) {
		const socket = net.connect(port, host, () =>
			p2p.connect(socket, (err, conn) => {    //incoming connection
				if (err) {
					throw err;
				} else {
					this.initConnection.call(this, conn);
				}
			})
		);
	}

	broadcastLatest() {     //广播消息
		this.broadcast(Messages.sendLatestBlock(this.blockchain.latestBlock));
	}

	broadcast(message) {      //向每个P2P通道都传递消息
		this.peers.forEach(peer => this.write(peer, message));
	}

	write(peer, message) {
		peer.write(JSON.stringify(message));
	}

	initConnection(connection) {
		this.peers.push(connection);
		this.initMessageHandler(connection);
		this.initErrorHandler(connection);
		this.write(connection, Messages.getLatestBlock());
	}

	initMessageHandler(connection) {
		connection.on("data", data => {
			const message = JSON.parse(data.toString("utf8"));
			this.handleMessage(connection, message);
		});
	}

	handleMessage(peer, message) {
		switch (message.type) {
			case REQUEST_LATEST_BLOCK:
				this.write(peer, Messages.sendLatestBlock(this.blockchain.latestBlock));
				break;
			case REQUEST_BLOCKCHAIN:
				this.write(peer, Messages.sendBlockchain(this.blockchain.get()));
				break;
			case RECEIVE_LATEST_BLOCK:
				this.handleReceivedLatestBlock(message, peer);
				break;
			case RECEIVE_BLOCKCHAIN:
				this.handleReceivedBlockchain(message);
				break;
			default:
				throw "Received invalid message.";
		}
	}

	handleReceivedLatestBlock(message, peer) {
		const receivedBlock = message.data;
		const latestBlock = this.blockchain.latestBlock;

		if (latestBlock.hash === receivedBlock.previousHash) {
			try {
				this.blockchain.addBlock(receivedBlock);
			} catch(err) {
				throw err;
			}
		} else if (receivedBlock.index > latestBlock.index) {
			this.write(peer, Messages.getBlockchain());
		} else {
			// Do nothing
		}
	}

	handleReceivedBlockchain(message) {
		const receivedChain = message.data;

		try {
			this.blockchain.replaceChain(reveivedChain);
		} catch(err) {
			throw err;
		}
	}

	initErrorHandler(connection) {
		connection.on("error", err => {
			throw err;
		})
	}
}

module.exports = PeerToPeer;
