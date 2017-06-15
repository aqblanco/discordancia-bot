var Bot = require("./bot.class.js");
var botObj = new Bot();
var msgs = require("./strings.js");
var Command = require("./command.class.js");

module.exports = 
    class rueBot {
        constructor() {
            this.commands = this.getCommandList();
        }

        reply(message) {
            // Process request string
            var reqArray = message.content.split(' ');
            var request = reqArray[0];
            var params = [];
            if (reqArray.length > 1) {
                params = reqArray.shift();
            }

            var msg = "";
            var opt = {};
            if (request === '-rueayuda') {
                msg = this.getHelp();
                opt = {code: true};
            } else {
                var cmd = this.matchCommand(request);
                if (cmd) {
                    var exe = cmd.execute(params);
                    msg = exe.result;
                    opt = exe.displayOptions;                    
                }
            }

            if (msg !== "") {
                message.channel.send(msg, opt)
                .then(m => console.log(`Mensaje enviado: ${m.content}`))
                .catch(console.error);
            }
        }

        getHelp() {
            console.log(this.commands);
            var msg = "";
            this.commands.forEach(function(e) {
                msg += e.getLabel() + " -> " + e.getDesc() + "\n";
                //faltan params
            })
            msg += "-rueayuda -> Consulta la ayuda."
            return msg;
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
            /*var help = new Command('-rueayuda', 'Consulta la ayuda.', this.getHelp, {code: true});
            commands.push(help);*/

            return commands;
        }

        matchCommand(cmd) {
            var res = null;
            this.commands.forEach(function(e) {
                if (res === null && e.getLabel() === cmd) {
                    res = e;
                }
            });
            return res;
        }
    }