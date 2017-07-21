// Requires section
var Command = require.main.require("./classes/command.class.js");
var resourceManager = require.main.require("./classes/resourceManager.class.js");
var resources = require.main.require("./resources.js");

var rm = new resourceManager(require('path').dirname(require.main.filename) + '/assets/audio/', resources);

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
                    //var resources = [{'name': 'pelele', 'file': 'junkrat-pelele.ogg'}];
                    file = rm.getResourcePath(rName);
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
            // No voice channel
            callback(new Error('You need to join a voice channel first!'));
            return;
        }
    } else {
        // No args
        callback(new Error('No audio selected!'));
        return;
    }
    callback(null, "");
}

var playAudioArgs = [{
    "tag": "recurso",
    "desc": "Nombre del audio que reproducir.\n\n\t**Valores posibles:**\n\t\t`" + rm.getResourceList().join("`\n\t\t`") + "`",
    "optional": false,
    "order": 1
}];

var playAudio = new Command('audio', 'Reproduce el audio indicado por tu canal de voz actual.', playSound, [], playAudioArgs);;


// Exports section
module.exports = playAudio;