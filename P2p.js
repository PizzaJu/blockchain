var wrtc = require('wrtc');
var Exchange = require('peer-exchange');
var p2p = new Exchange('my own blockchain', { wrtc: wrtc });
var net =require('net');


class PeerToPeer {
	constructor(blockchain) {
		this.peers = [];
		this.blockchain = blockchain;
	}

	startServer(port) {
		var server = net
			.createServer (socket =>
				p2p.accept(socket, (err, conn) => {
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
			p2p.connect(socket, (err, conn) => {
				if (err) {
					throw err;
				} else {
					this.initConnection.call(this, conn);
				}
			})
		);
	}

	write(peer, message) {
		peer.write(JSON.stringify(message));
	}

	initConnection(connection) {
		this.peers.push(connection);
		this.initMessageHandler(connection);
		this.initErrorHandler(connection);
		this.write(connection, Message.getLatestBlock());
	}

	initMessageHandler(connection) {
		connection.on("data", data => {
			const message = JSON.parse(data.toString("utf8"));
			this.handleMessage(connection, message);
		});
	}

	initErrorHandler(connection) {
		connection.on("error", err => {
			throw err;
		})
	}
}

module.exports = PeerToPeer;
