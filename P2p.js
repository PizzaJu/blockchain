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
						this.initConnection.call(this, conn);
					}
				})
			)
			.listen(port);
	}

}

module.exports = PeerToPeer;
