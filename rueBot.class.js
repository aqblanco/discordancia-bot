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

        reply(message) {
            console.log("Comando recibido: " + message.content);
            // Process request string
            var reqArray = message.content.split(/\s+/g);
            var request = reqArray[0];
            var args = [];
            if (reqArray.length > 1) {
                reqArray.splice(0, 1); // Remove command
                args = reqArray;
            }


            if (request === 'ayuda') {
                var command = "";
                if (args.length > 0) command = args[0];
                var embed = this.getHelp(this.getCommandList(), command);
                console.log({ embed });
                //var opt = { code: true };
                message.channel.send({ embed })
                    .then(m => console.log('Mensaje enviado: ' + JSON.stringify(embed)))
                    .catch(console.error);
            } else {
                var cmd = this.matchCommand(request);
                if (cmd != null) {
                    // Send the message object to the command
                    cmd.addFParams({ 'message': message });

                    cmd.execute(args, function(msg, isEmbed = false) {
                        var formatedMsg;
                        // Correctly generate embed object if needed
                        if (isEmbed) {
                            var embed = msg;
                            formatedMsg = { embed };
                        } else {
                            formatedMsg = msg;
                        };

                        if (formatedMsg !== "") {
                            message.channel.send(formatedMsg)
                                .then(m => console.log('Mensaje enviado: ' + JSON.stringify(formatedMsg)))
                                .catch(console.error);
                        }
                    });
                } else {
                    // Command is not valid
                    //TODO: Notify user (whisp?)
                }
            }
        }

        getHelp(commandList, command = "") {
            var prefix = this.cmdPrefix;
            var msg = "";
            console.log(command);
            if (command === "") {
                // Display the whole command list
                commandList.forEach(function(e) {
                    // Build argument string for the command signature
                    var argString = "";
                    e.getArgumentList().forEach(function(arg) {
                        var tag = arg.tag;
                        if (arg.optional) tag = "[" + tag + "]";
                        argString += " *`" + tag + "`* ";
                    });
                    msg += "**`" + e.getLabel() + "`" + argString + "** - " + e.getDesc() + "\n";
                })
                msg += "**`ayuda`** - Consulta la ayuda."
            } else {
                // Display desired command help
                var found = null;
                commandList.forEach(function(c) {
                   if (c.getLabel() == command) found = c;
                });
                if (found != null) {
                    var args = found.getArgumentList();
                    args.forEach(function(a) {
                        var opt = "";
                        if (a.optional) opt = "(Opcional) ";
                        msg += a.tag + " " + opt + "- " + a.desc + "\n";
                    });
                }
            }

            var embedMsg = {
                    author: {
                        name: "Ayuda",
                        icon_url: "https://www.warcraftlogs.com/img/warcraft/header-logo.png"
                    },
                    color: 3447003,
                    description: msg
                };
            return embedMsg;
        }

        getRandomMemberQuote(fParams, args, callback) {
            var messages = msgs.memberQuotes;
            var msg = botObj.getRandomStr(messages);
            callback(msg);
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

        getLogs(fParams, args, callback) {
            // Warcraft Logs api
            const api = require('weasel.js');

            // Set the public WCL api-key that you get from https://www.warcraftlogs.com/accounts/changeuser 
            api.setApiKey('56503c747edc90d3caffd50accab1237');

            // Optional parameters for the api call. 
            var params = {};

            // Call the function to list guild reports, can be filtered on start time and end time as a UNIX timestamp with the optional parameters @params. 
            api.getReportsGuild('Rue del Percebe', 'cthun', 'eu', params, function(err, data) {
                if (err) {
                    //We caught an error, log the error object to the console and exit. 
                    console.log(err);
                    return;
                }
                // Success, log the whole data object to the console. 
                var lastN = 5;
                var logsObj = data.slice(-lastN);
                var logInfo = [];
                logsObj.forEach(function(e) {
                    var d = new Date(e.start);
                    var options = { year: 'numeric', month: '2-digit', day: '2-digit' };
                    var date = d.toLocaleString('es-ES', options);
                    var info = [{
                        name: e.title + " - https://www.warcraftlogs.com/reports/" + e.id,
                        value: "Log del **" + date + "** por **" + e.owner + "**"
                    }];
                    logInfo = logInfo.concat(info);
                })

                var embedMsg = {
                    author: {
                        name: "WarCraft Logs",
                        icon_url: "https://www.warcraftlogs.com/img/warcraft/header-logo.png"
                    },
                    color: 3447003,
                    title: "Rue del Percebe en WarCraft Logs",
                    url: "https://www.warcraftlogs.com/guilds/154273",
                    fields: logInfo,
                };
                callback(embedMsg, true);
            });
        }

        getCommandList() {
            var commands = [];
            var randomMemberQuote = new Command('frase', 'Envia una frase aleatoria de los miembros de Rue', this.getRandomMemberQuote);
            commands.push(randomMemberQuote);
            var playAudioArgs = [
                {
                    "tag": "recurso",
                    "desc": "Nombre del audio que reproducir",
                    "optional": false,
                    "order": 1
                }
            ]
            var playAudio = new Command('audio', 'Reproduce un audio por tu canal de voz actual.', this.playSound, [], playAudioArgs);
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