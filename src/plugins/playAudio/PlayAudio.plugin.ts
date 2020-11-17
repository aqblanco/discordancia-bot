import { Plugin } from '@classes/Plugin.class';
import { EventHandler } from '@classes/EventHandler.class';
import { Command } from '@classes/Command.class';
import { ResourceManager } from '@classes/ResourceManager.class';
import { getPath } from '@helpers/functions';
import { resources } from '../../resources';
import { getI18N } from '@helpers/bootstrapper';
import * as Discord from 'discord.js';
import { BotPlugin } from '@decorators/BotPlugin';

const rm = new ResourceManager(`${getPath('assets')}audio/`, new Map([['audio', resources.audio]]));

@BotPlugin('playaudio')
export class PlayAudioPlugin extends Plugin {
	constructor() {
		super('Play Audio', {});

		const i18n = getI18N();
		const playAudioArgs: CommandArgument[] = [{
			'tag': i18n.translate('plugin.playAudio.args.audio.tag'),
			'desc': i18n.translate('plugin.playAudio.args.audio.desc') + '\n\n\t**' + i18n.translate('argsPossibleValues') + '**\n\t\t`' + rm.getResourceList('audio').join('`\n\t\t`') + '`',
			'optional': false,
		}];

		const playAudioCmd = new Command('play', 'Play Audio', i18n.translate('plugin.playAudio.desc'), this.playSound, CommandLevel.Everyone, [], playAudioArgs);
		super.addCommand(playAudioCmd);	
	}

	// Needs to be declared as an attribute because of it making calls to other internal methods
	private playSound = (fParams: Record<string, any>, args: string[]): Promise<string> => {
		const message = fParams.message;
		const i18n = getI18N();
		return new Promise ((resolve, reject) => {
			if (args.length > 0) {
				// Only try to join the sender's voice channel if they are in one themselves
				if (message.member.voice.channel) {
					message.member.voice.channel.join()
					// Connection is an instance of VoiceConnection
						.then((connection: Discord.VoiceConnection) => {
							let file = '';
							const rName = args[0];
							file = rm.getResourcePath(rName, 'audio');
							// file not empty check
							const dispatcher = connection.play(file);
							dispatcher.on('start', () => {
								resolve(i18n.translate('plugin.playAudio.log.playingAudio', rName));
							});
							dispatcher.on('finish', () => {
								connection.disconnect();
								return;
							});
							dispatcher.on('error', e => {
								// Catch any errors that may arise
								reject(e);
							});

						})
						.catch((e: Error) => {
							reject(e);
						});
				} else {
					// No voice channel
					reject(new Error(i18n.translate('plugin.playAudio.error.noVoiceChannel')));
					return;
				}
			} else {
				// No args
				reject(new Error(i18n.translate('plugin.playAudio.error.noAudio')));
			}
		});
	}
}