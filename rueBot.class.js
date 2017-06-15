var Bot = require("./bot.class.js");
var botObj = new Bot();
var msgs = require("./strings.js");
var Command = require("./command.class.js");

function matchCommand(cmd, commands) {
    var res = null;
    commands.forEach(function(e) {
        if (res === null && e.getLabel() === cmd) {
            res = e;
        }
    });
    return res;
}

module.exports = 
    class rueBot {
        constructor() {}

        reply(message) {
            // Process request string
            var reqArray = message.content.split(' ');
            var request = reqArray[0];
            var params = [];
            if (reqArray.length > 1) {
                params = reqArray.shift();
            }
            // Load bot commands
            var commands = this.getCommandList();

            var msg = "";

            var cmd = matchCommand(request, commands);
            if (cmd) {
                msg = cmd.execute(params);
                if (msg !== "") {
                    message.channel.send(msg)
                    .then(m => console.log(`Mensaje enviado: ${m.content}`))
                    .catch(console.error);
                }
            }
        }

        getRandomMemberQuote() {
            var messages = msgs.memberQuotes;
            var msg = botObj.getRandomStr(messages);
            return msg;
        } 

        getCommandList() {
            var commands = [];
            var randomMemberQuote = new Command('-ruefrase', 'Envia una frase aleatoria de los miembros de Rue', this.getRandomMemberQuote);
            commands.push(randomMemberQuote);

            return commands;
        }
    }