// Requires section
const Plugin = require.main.require("./classes/plugin.class.js");
const Command = require.main.require("./classes/command.class.js");
const ResourceManager = require.main.require("./classes/resource-manager.class.js");
const resources = require.main.require("./resources.js");
const functions = require.main.require("./functions.js");
const i18n = functions.i18n;

const rm = new ResourceManager(require('path').dirname(require.main.filename) + '/assets/audio/', resources);

// Main code section
function playSound(fParams, args) {
    let message = fParams.message;
    return new Promise ((resolve, reject) => {
        if (args.length > 0) {
            // Only try to join the sender's voice channel if they are in one themselves
            if (message.member.voice.channel) {
                message.member.voice.channel.join()
                    .then(connection => { // Connection is an instance of VoiceConnection
                        let file = '';
                        let rName = args[0];
                        file = rm.getResourcePath(rName, 'audio');
                        // file not empty check
                        const dispatcher = connection.play(file);
                        dispatcher.on('start', () => {
                            resolve(i18n.__("plugin.playAudio.log.playingFile", file));
                        });
                        dispatcher.on('end', () => {
                            connection.disconnect();
                            return
                        });
                        dispatcher.on('error', e => {
                            // Catch any errors that may arise
                           reject(e);
                        });

                    })
                    .catch(e => {
                        reject(e);
                    });
            } else {
                // No voice channel
                callback(new Error(i18n.__("plugin.playAudio.error.noVoiceChannel") /*'You need to join a voice channel first!'*/ ));
                return;
            }
        } else {
            // No args
            reject(new Error(i18n.__("plugin.playAudio.error.noAudio") /*'No audio selected!'*/ ));
        }
    });
    
}

let playAudioArgs = [{
    "tag": i18n.__("plugin.playAudio.args.audio.tag"),
    "desc": i18n.__("plugin.playAudio.args.audio.desc") + "\n\n\t**" + i18n.__("argsPossibleValues") + "**\n\t\t`" + rm.getResourceList('audio').join("`\n\t\t`") + "`",
    "optional": false
}];


let commands = [];
let eventHandlers = [];

let playAudioCmd = new Command('play', 'Play Audio', i18n.__("plugin.playAudio.desc") /*'Reproduce el audio indicado por tu canal de voz actual.'*/ , playSound, 0, [], playAudioArgs);
commands.push(playAudioCmd);

let playAudioPlugin = new Plugin('playAudio', commands, eventHandlers);


// Exports section
module.exports = playAudioPlugin;