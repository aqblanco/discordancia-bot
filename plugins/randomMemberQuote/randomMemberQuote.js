// Requires section
var Command = require.main.require("./classes/command.class.js");
var strings = require("./strings.js");
var Bot = require.main.require("./classes/bot.class.js");

// Main code section
function getRandomMemberQuote(fParams, args, callback) {
    var botObj = new Bot();
    var messages = strings.memberQuotes;
    var msg = botObj.getRandomStr(messages);
    callback(msg);
}

var randomMemberQuote = new Command('frase', 'Envia una frase aleatoria de los miembros de Rue.', getRandomMemberQuote);


// Exports section
module.exports = randomMemberQuote;