// Requires section
const Plugin = require.main.require("./classes/plugin.class.js");
const Command = require.main.require("./classes/command.class.js");
const strings = require("./strings.js");
const functions = require.main.require("./functions.js");
const i18n = functions.i18n;

// Main code section
function getRandomMemberQuote(fParams, args) {
    const Discord = require("discord.js");
    return new Promise ((resolve, reject) => {
        let getRandomStr = functions.getRandomStr;
        let messages = strings.memberQuotes;
        let msg = getRandomStr(messages);

        /*let embed = new Discord.MessageEmbed()
        .setTitle('Random Quote')
        .setColor(3447003)
        .setDescription(msg);*/
         
        resolve(msg);
    });
    
}


let commands = [];
let eventHandlers = [];

let randomMemberQuoteCmd = new Command('frase', 'Random Member Quote', i18n.__('plugin.randomMemberQuote.desc'), getRandomMemberQuote);
commands.push(randomMemberQuoteCmd);

let randomMemberQuotePlugin = new Plugin('randomMemberQuote', commands, eventHandlers);


// Exports section
module.exports = randomMemberQuotePlugin;