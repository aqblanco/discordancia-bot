let Command = require("./command.class.js");

module.exports =
    class DiscordBot {

        constructor(cmdPrefix) {
            this.commands = [];
            this.cmdPrefix = cmdPrefix;
        }

        reply(message) {
            const functions = require.main.require("./functions.js");
            const Discord = require("discord.js");

            const formatError = functions.formatError;

            console.log("Comando recibido: " + message.content);
            // Process request string
            let reqArray = message.content.split(/\s+/g);
            let request = reqArray[0];
            let args = [];
            if (reqArray.length > 1) {
                reqArray.splice(0, 1); // Remove command
                args = reqArray;
            }

            let cmd = this.matchCommand(request);
            if (cmd != null) {
                if (cmd.userCanExecute(message.member)) {
                    // Send the message object to the command
                    cmd.addFParams({ 'message': message });
                    // Show "processing" message while retrieving data
                    const processingEmbed = new Discord.MessageEmbed()
                        .setTitle('Processing...')
                        .setColor(3447003)
                        .setDescription('We are working to provide you some cool features...');
                    message.channel.send(processingEmbed)
                    .then(processingMsg => {
                        //cmd.execute(args, function(err, msg, isEmbed = false) {
                        cmd.execute(args)
                        .then((msg) => {
                            let embed, formatedMsg;
                            // Correctly generate embed object if needed
                            if (typeof msg === 'string') {
                                // Convert it into embed
                                embed = new Discord.MessageEmbed()
                                .setTitle(cmd.getName())
                                .setColor(3447003)
                                .setDescription(msg);
                            } else {
                                embed = msg; 
                            }
                            
                            formatedMsg = { embed };
                            if (Object.keys(formatedMsg).length > 0) {
                                //Delete "processing" message
                                processingMsg.edit(formatedMsg)
                                    //message.channel.send(formatedMsg)
                                    .then(m => console.log(JSON.stringify(m)))
                                    .catch(console.error);
                            } else {
                                // Blank message, delete processing one
                                processingMsg.delete();
                            }
                        })
                        .catch((e) => {
                            let embed = formatError(e.message);
                            processingMsg.edit({ embed })
                                .then(m => console.log(e))
                                .catch(console.error);
                            return;
                        });
                    });
                } else {
                    // User has no rights to use the command
                    let err = new Error("No tienes los permisos necesarios para ejecutar ese comando.");
                    let embed = formatError(err.message);
                    message.channel.send({ embed })
                        .then(m => console.log(err))
                        .catch(console.error);
                    return;
                }
            } else {
                // Command is not valid
                let err = new Error("Comando no válido. Mencióname e introduce la palabra ayuda o escribe |rue ayuda para ver la lista de comandos disponibles.");
                let embed = formatError(err.message);
                message.channel.send({ embed })
                    .then(m => console.log(err))
                    .catch(console.error);
                return;
            }
        }

        addCommand(cmd) {
            this.commands.push(cmd);
        }

        addCommands(cmdList) {
            this.commands = this.commands.concat(cmdList);
        }

        matchCommand(cmd) {
            let res = null;
            this.commands.forEach(function(e) {
                if (res === null && e.getLabel() === cmd) {
                    res = e;
                }
            });
            return res;
        }
    }