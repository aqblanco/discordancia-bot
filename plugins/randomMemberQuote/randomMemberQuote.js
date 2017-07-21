// Requires section
var Command = require.main.require("./classes/command.class.js");
var strings = require("./strings.js");
var functions = require.main.require("./functions.js");

// Main code section
function getRandomMemberQuote(fParams, args, callback) {
    var getRandomStr = functions.getRandomStr;
    var messages = strings.memberQuotes;
    var msg = getRandomStr(messages);
    callback(null, msg);
}

var randomMemberQuote = new Command('frase', 'Envia una frase aleatoria de los miembros de Rue.', getRandomMemberQuote);


// Exports section
module.exports = randomMemberQuote;