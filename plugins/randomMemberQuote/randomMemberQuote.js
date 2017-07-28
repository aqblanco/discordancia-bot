// Requires section
var Plugin = require.main.require("./classes/plugin.class.js");
var Command = require.main.require("./classes/command.class.js");
var strings = require("./strings.js");
var functions = require.main.require("./functions.js");
<<<<<<< HEAD
var i18n = functions.i18n;
=======
>>>>>>> 302388ab0a731811393817ffdae4cc69e9994222

// Main code section
function getRandomMemberQuote(fParams, args, callback) {
    var getRandomStr = functions.getRandomStr;
    var messages = strings.memberQuotes;
    var msg = getRandomStr(messages);
    callback(null, msg);
}


var commands = [];
var eventHandlers = [];

<<<<<<< HEAD
var randomMemberQuoteCmd = new Command('frase', i18n.__('plugin.randomMemberQuote.desc'), getRandomMemberQuote);
=======
var randomMemberQuoteCmd = new Command('frase', 'Envia una frase aleatoria de los miembros de Rue.', getRandomMemberQuote);
>>>>>>> 302388ab0a731811393817ffdae4cc69e9994222
commands.push(randomMemberQuoteCmd);

var randomMemberQuote = new Plugin(commands, eventHandlers);


// Exports section
module.exports = randomMemberQuote;