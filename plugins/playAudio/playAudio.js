// Requires section
const Plugin = require.main.require('./classes/plugin.class.js');
const Command = require.main.require('./classes/command.class.js');
const ResourceManager = require.main.require('./classes/resource-manager.class.js');
const resources = require.main.require('./resources.js');
const functions = require.main.require('./lib/functions.js');
const i18n = functions.i18n;

const rm = new ResourceManager(require('path').dirname(require.main.filename) + '/assets/audio/', resources);

// Main code section
function playSound(fParams, args) {
	const message = fParams.message;
	return new Promise ((resolve, reject) => {
		if (args.length > 0) {
			// Only try to join the sender's voice channel if they are in one themselves
			if (message.member.voice.channel) {
				message.member.voice.channel.join()
				// Connection is an instance of VoiceConnection
					.then(connection => {
						let file = '';
						const rName = args[0];
						file = rm.getResourcePath(rName, 'audio');
						// file not empty check
						const dispatcher = connection.play(file);
						dispatcher.on('start', () => {
							resolve(i18n.__('plugin.playAudio.log.playingFile', file));
						});
						dispatcher.on('end', () => {
							connection.disconnect();
							return;
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
				reject(new Error(i18n.__('plugin.playAudio.error.noVoiceChannel')));
				return;
			}
		} else {
			// No args
			reject(new Error(i18n.__('plugin.playAudio.error.noAudio')));
		}
	});
}

const playAudioArgs = [{
	'tag': i18n.__('plugin.playAudio.args.audio.tag'),
	'desc': i18n.__('plugin.playAudio.args.audio.desc') + '\n\n\t**' + i18n.__('argsPossibleValues') + '**\n\t\t`' + rm.getResourceList('audio').join('`\n\t\t`') + '`',
	'optional': false,
}];


const commands = [];
const eventHandlers = [];

const playAudioCmd = new Command('play', 'Play Audio', i18n.__('plugin.playAudio.desc'), playSound, 0, [], playAudioArgs);
commands.push(playAudioCmd);

const playAudioPlugin = new Plugin('playAudio', commands, eventHandlers);


// Exports section
module.exports = playAudioPlugin;