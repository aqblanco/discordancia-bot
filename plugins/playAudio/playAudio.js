// Requires section
var Command = require("../../classes/command.class.js");
var resourceManager = require("../../classes/resourceManager.class.js");
var resources = require("../../resources.js");

// Main code section
function playSound(fParams, args, callback) {
            var message = fParams.message;
            if (args.length > 0) {
                // Only try to join the sender's voice channel if they are in one themselves
                if (message.member.voiceChannel) {
                    message.member.voiceChannel.join()
                        .then(connection => { // Connection is an instance of VoiceConnection
                            //message.reply('I have successfully connected to the channel!');
                            var file = "";
                            var rName = args[0];
                            var path = require('path').dirname(require.main.filename);
                            //var resources = [{'name': 'pelele', 'file': 'junkrat-pelele.ogg'}];
                            var rM = new resourceManager(path + '/assets/audio/', resources);
                            file = rM.getResourcePath(rName);
                            console.log("Reproduciendo archivo: " + file);
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
            } else {
                // no args
            }
            callback("");
        }

var playAudioArgs = [{
    "tag": "recurso",
    "desc": "Nombre del audio que reproducir",
    "optional": false,
    "order": 1
}];

var playAudio = new Command('audio', 'Reproduce un audio por tu canal de voz actual.', playSound, [], playAudioArgs);;


// Exports section
module.exports = playAudio;