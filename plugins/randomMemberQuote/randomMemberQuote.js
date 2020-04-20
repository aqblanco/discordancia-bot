// Requires section
const Plugin = require.main.require('./classes/plugin.class.js');
const Command = require.main.require('./classes/command.class.js');
const strings = require('./strings.js');
const functions = require.main.require('./lib/functions.js');
const i18n = functions.i18n;

// Main code section
function getRandomMemberQuote(fParams, args) {
	return new Promise ((resolve, reject) => {
		const getRandomStr = functions.getRandomStr;
		const messages = strings.memberQuotes;
		const msg = getRandomStr(messages);

		resolve(msg);
	});

}


const commands = [];
const eventHandlers = [];

const randomMemberQuoteCmd = new Command('frase', 'Random Member Quote', i18n.__('plugin.randomMemberQuote.desc'), getRandomMemberQuote);
commands.push(randomMemberQuoteCmd);

const randomMemberQuotePlugin = new Plugin('randomMemberQuote', commands, eventHandlers);


// Exports section
module.exports = randomMemberQuotePlugin;