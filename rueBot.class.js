var Bot = require("./bot.class.js");
var botObj = new Bot();
var msgs = require("./strings.js");
var Command = require("./command.class.js");
var resourceManager = require("./resourceManager.class.js");
var resources = require("./resources.js");

module.exports = 
    class rueBot {

        constructor(cmdPrefix) {
            this.commands = this.getCommandList();
            this.cmdPrefix = cmdPrefix;
        }

        async reply(message) {
            console.log("Comando recibido: " + message.content);
            // Process request string
            var reqArray = message.content.split(' ');
            var request = reqArray[0];
            var args = [];
            if (reqArray.length > 1) {
                reqArray.splice(0, 1); // Remove command
                args = reqArray;
            }

            var msg = "";
            var opt = {};
            if (request === 'ayuda') {
                msg = this.getHelp();
                opt = {code: true};
            } else {
                var cmd = this.matchCommand(request);
                if (cmd) {
                    cmd.addFParams({'message': message});
                    //console.log(cmd.execute(args));
                    //cmd.execute(args).then(function(msg) {
                        cmd.execute(args, function(msg) {
                        
                        console.log("Entra then")
                        if (msg !== "") {
                            message.channel.send(msg, opt)
                            .then(m => console.log(`Mensaje enviado: ${m.content}`))
                            .catch(console.error);
                        }
                        });
                    /*}, function(error) {
                        console.log("Entra error")
                        console.log(error);
                    });*/
                    /*msg = exe.result;
                    opt = exe.displayOptions;*/                    
                }
            }
        }

        getHelp() {
            var prefix = this.cmdPrefix;
            var msg = "";
            this.commands.forEach(function(e) {
                msg += prefix + " " + e.getLabel() + " - " + e.getDesc() + "\n";
                //faltan args
            })
            msg += prefix + " ayuda - Consulta la ayuda."
            return msg;
        }

        getRandomMemberQuote() {
            var messages = msgs.memberQuotes;
            var msg = botObj.getRandomStr(messages);
            return msg;
        }

        playSound(fParams, args) {
            var message = fParams.message;
            // Only try to join the sender's voice channel if they are in one themselves
            if (message.member.voiceChannel) {
                message.member.voiceChannel.join()
                    .then(connection => { // Connection is an instance of VoiceConnection
                        //message.reply('I have successfully connected to the channel!');
                        var file = "";
                        // If the name of the resource to play is set
                        if (args.length > 0) {
                            var rName = args[0];
                            var path = require('path').dirname(require.main.filename);
                            //var resources = [{'name': 'pelele', 'file': 'junkrat-pelele.ogg'}];
                            var rM = new resourceManager(path + '/assets/audio/', resources);
                            file = rM.getResourcePath(rName);
                            console.log("Reproduciendo archivo: " + file);
                        } else {
                            // no args
                        }
                        // file not empty check
                        const dispatcher = connection.playFile(file);
                        dispatcher.on('end', () => {
                            dispatcher.end();
                        });
                        dispatcher.on('error', e => {
                            // Catch any errors that may arise
                            console.log(e);
                        });
                        
                    })
                    .catch(console.log);
                } else {
                message.reply('You need to join a voice channel first!');
            }
        return "";
        }
    
        getLogs(callback) {
            console.log(callback);
            console.log("getLogs")
            // Warcraft Logs api
            const api = require('weasel.js');
 
            //Set the public WCL api-key that you get from https://www.warcraftlogs.com/accounts/changeuser 
            api.setApiKey('56503c747edc90d3caffd50accab1237');
            
            //Optional parameters for the api call. 
            var params = {};

            //Call the function to list guild reports, can be filtered on start time and end time as a UNIX timestamp with the optional parameters @params. 
            api.getReportsGuild('Rue del Percebe', 'cthun', 'eu', params, function(err, data, callback) {
                console.log("leidos")
                if (err) {
                //We caught an error, log the error object to the console and exit. 
                    console.log(err);
                    return;
                }
                //Success, log the whole data object to the console. 
                var lastN = 5;
                var logsObj = data.slice(-lastN);
                var logInfo = [];
                logsObj.forEach(function(e) {
                    var info = [{
                            name: "Nombre",
                            value: e.title
                        },
                        {
                            name: "Fecha",
                            value: e.start
                        },
                        {
                            name: "Autor",
                            value: e.owner
                        }
                        ];
                    logInfo = logInfo.concat(info);
                })

                var embedMsg = {embed: {
                    color: 3447003,
                    title: "Rue del Percebe en WarCraft Logs",
                    fields: logInfo,
                }};
                console.log(embedMsg);
                callback(embedMsg);
                //return embedMsg;
            });
        }

        getCommandList() {
            var commands = [];
            var randomMemberQuote = new Command('frase', 'Envia una frase aleatoria de los miembros de Rue', this.getRandomMemberQuote);
            commands.push(randomMemberQuote);
            var playAudio = new Command('audio', 'Envia un audio', this.playSound);
            commands.push(playAudio);
            var getLogs = new Command('logs', 'Obtiene la lista de logs', this.getLogs);
            commands.push(getLogs);
            /*var help = new Command('ayuda', 'Consulta la ayuda.', this.getHelp, [], {code: true});
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