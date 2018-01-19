
function cli(vorpal) {
	vorpal
		.use(welcome)
		.use(connectCommand)
		.use(discoverCommand)
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
		.command('connect', "Connect to a new peer.")
		.action(function (args, callback) {
			this.log('connectCommand');
			callback();
		})
}

function discoverCommand(vorpal) {
	vorpal
		.command('discover', "Discover new peers from your connected peers.")
		.action(function (args, callback) {
			this.log('discoverCommand');
			callback();
		})
}

function blockchainCommand(vorpal) {
	vorpal
		.command('blockchain', 'See the current state of the blockchain.')
		.action(function (args, callback) {
			this.log('blockchainCommand');
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
		.command('mine', 'Mine a new block.')
		.action(function (args, callback) {
			this.log('mineCommand');
			callback();
		})
}

function openCommand(vorpal) {
	vorpal
		.command('open <port>', 'Open port to accept incoming connections.')
		.action(function (args, callback) {
			this.log('openCommand');
			callback();
		})
}
