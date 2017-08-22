// Requires section
var Plugin = require.main.require("./classes/plugin.class.js");
var Command = require.main.require("./classes/command.class.js");
var strings = require("./strings.js");
var functions = require.main.require("./functions.js");
var i18n = functions.i18n;

// Main code section
function getRandomMemberQuote(fParams, args, callback) {
    var getRandomStr = functions.getRandomStr;
    var messages = strings.memberQuotes;
    var msg = getRandomStr(messages);
    callback(null, msg);
}


var commands = [];
var eventHandlers = [];

var randomMemberQuoteCmd = new Command('frase', i18n.__('plugin.randomMemberQuote.desc'), getRandomMemberQuote);
commands.push(randomMemberQuoteCmd);

var randomMemberQuote = new Plugin('randomMemberQuote', commands, eventHandlers);


// Exports section
module.exports = randomMemberQuote;