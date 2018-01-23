var Blockchain = require('./Blockchain.js');
var blockchain = new Blockchain();
var P2p = require('./P2p.js');
var p2p = new P2p(blockchain);

function cli(vorpal) {
	vorpal
		.use(welcome)
		.use(connectCommand)
		.use(blockchainCommand)
		.use(peersCommand)
		.use(mineCommand)
		.use(openCommand)
		.delimiter('blockchain ->')
		.show()
}

module.exports = cli;

function welcome(vorpal) {
	vorpal.log("Welcome to my own blockchain CLI");
	vorpal.exec("help");
}

function connectCommand(vorpal) {
	vorpal
		.command('connect <host> <port>', "Connect to a new peer.")
		.alias('c')
		.action(function (args, callback) {
			if (args.host && args.port) {
				try {
					p2p.connectToPeer(args.host, args.port);
				} catch (err) {
					this.log(err);
				}
			}
			callback();
		})
}

function blockchainCommand(vorpal) {
	vorpal
		.command('blockchain', 'See the current state of the blockchain.')
		.alias('b')
		.action(function (args, callback) {
			this.log(blockchain);
			callback();
		})
}

function peersCommand(vorpal) {
	vorpal
		.command('peers', 'Get the list of connected peers.')
		.action(function (args, callback) {
			this.log('peersCommand');
			callback();
		})
}

function mineCommand(vorpal) {
	vorpal
		.command('mine <data>', 'Mine a new block.Eg: mine hello!')
		.alias('m')
		.action(function (args, callback) {
			if (args.data) {
				blockchain.mine(args.data);   //生成区块
				p2p.broadcastLatest();
			}
			callback();
		});
}

function openCommand(vorpal) {
	vorpal
		.command('open <port>', 'Open port to accept incoming connections.')
		.alias('o')
		.action(function (args, callback) {
			if (args.port) {
				if (typeof args.port === 'number') {
					p2p.startServer(args.port);
					this.log('Listening to peers on ' + args.port);
				} else {
					this.log('Invalid port!');
				}
			}
			callback();
		})
}
