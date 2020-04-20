// Requires section
const Command = require.main.require('./classes/command.class.js');
const functions = require.main.require('./lib/functions.js');
const i18n = functions.i18n;

// Main code section
function getHelp(fParams, args) {
	const commandList = fParams['commands'];
	const command = args.length == 0 ? '' : args[0];
	const message = fParams.message;

	// empty check for command, else take first element
	let res = null;

	if (command == '') {
		res = getWholeHelp(commandList, message.member);
	} else {
		res = getCommandHelp(commandList, command);
	}

	return new Promise((resolve, reject) => {
		if (res.err != null) {
			reject(res.err);
		}

		const embed = res.embedMsg;
		message.member.send({ embed });

		const userNotification = {
			author: {
				name: i18n.__('plugin.help.help'),
				icon_url: 'https://dmszsuqyoe6y6.cloudfront.net/img/warcraft/favicon.png',
			},
			color: 3447003,
			description: '**' + i18n.__('plugin.help.helpSentNotification', `<@${message.member.user.id}>`) + '**',
		};
		resolve(userNotification);
	});

}

function getWholeHelp(commandList, requester) {
	// Display the whole command list

	const res = { 'err': null, msg: '' };
	let msg = '';

	commandList.forEach(function(e) {
		if (e.userCanExecute(requester)) {
			// Build argument string for the command signature
			let argString = '';
			e.getArgumentList().forEach(function(arg) {
				let tag = arg.tag;
				if (arg.optional) tag = '[' + tag + ']';
				argString += ' *`' + tag + '`* ';
			});
			msg += '**`' + e.getLabel() + '`' + argString + '** - ' + e.getDesc() + '\n';
		}
	});

	// Prepare embed output
	const embedMsg = {
		author: {
			name: i18n.__('plugin.help.help'),
			icon_url: 'https://dmszsuqyoe6y6.cloudfront.net/img/warcraft/favicon.png',
		},
		color: 3447003,
		description: msg,
	};
	res.embedMsg = embedMsg;

	return res;
}

function getCommandHelp(commandList, command) {
	// Display desired command help

	const res = { 'err': null, msg: '' };
	let embedMsg = {};

	// Search for the command in the list
	let found = null;

	commandList.forEach(function(c) {
		if (c.getLabel() == command) found = c;
	});
	if (found != null) {
		// Command found
		let argsStr = '';
		const args = found.getArgumentList();
		args.forEach(function(a) {
			let opt = '';
			if (a.optional) opt = '(' + i18n.__('plugin.help.optional') + ') ';
			argsStr += '`' + a.tag + '` ' + opt + '- ' + a.desc + '\n';
		});
		if (argsStr === '') argsStr = i18n.__('plugin.help.noAvailableArgs');

		// Prepare embed output
		embedMsg = {
			author: {
				name: i18n.__('plugin.help.help'),
				icon_url: 'https://dmszsuqyoe6y6.cloudfront.net/img/warcraft/favicon.png',
			},
			color: 3447003,
			title: i18n.__('plugin.help.command') + ': `' + found.getLabel() + '`',
			fields: [{
				name: i18n.__('plugin.help.description'),
				value: found.getDesc(),
			},
			{
				name: i18n.__('plugin.help.arguments'),
				value: argsStr,
			},
			{
				name: i18n.__('plugin.help.example'),
				value: 'TODO',
			},
			],
		};

		res.embedMsg = embedMsg;
	} else {
		// Command not found
		res.err = new Error(i18n.__('plugin.help.error.commandNotFound', command));
	}

	return res;
}

const helpArgs = [{
	'tag': i18n.__('plugin.help.args.command.tag'),
	'desc': i18n.__('plugin.help.args.command.desc'),
	'optional': true,
}];

const help = new Command('ayuda', 'Help', i18n.__('plugin.help.desc'), getHelp, 0, [], helpArgs);


// Exports section
module.exports = help;