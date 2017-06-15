var Bot = require("./bot.class.js");
var botObj = new Bot();
var msgs = require("./strings.js");
var Command = require("./command.class.js");

function commandExists(cmd, commands) {
    var res = false;
    commands.forEach(function(e) {
        if (res == false && e.label === cmd) {
            res = true;
        }
    });
    return res;
}

module.exports = 
    class rueBot {
        constructor() {}

        reply(message) {
            // Bot Commands
            var commands = this.getCommandList();

            var request = message.content;
            var msg = "";
            //console.log(commandExists(request, commands));
            // If the message is "ping"
            if (request === 'ping') {
                msg = this.getRandomMemberQuote();
            }
            //if (commandExists(request, commands)) {
                
                if (msg !== "") {
                    message.channel.send(msg)
                    .then(m => console.log(`Mensaje enviado: ${m.content}`))
                    .catch(console.error);
                }
            //}
        }

        getRandomMemberQuote() {
            var messages = msgs.memberQuotes;
            var msg = botObj.getRandomStr(messages);
            return msg;
        } 

        getCommandList() {
            var commands = [];
            var randomMemberQuote = new Command('ruefrase', 'Envia una frase aleatoria de los miembros de Rue', this.getRandomMemberQuote);
            commands.push(randomMemberQuote);

            return commands;
        }
    }