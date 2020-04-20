const Plugin = require.main.require('./classes/plugin.class.js');
const Command = require.main.require('./classes/command.class.js');
const functions = require.main.require('./lib/functions.js');
const owjs = require('overwatch-js');
const i18n = functions.i18n;

function owStats(fParams, args) {
	const btagLib = require.main.require('./lib/btag.lib.js');
	const validateBTag = btagLib.validateBTag;
	let btag = null;
	let request = null;

	// Determine which btag to query
	const firstArgIsValidBTag = validateBTag(args[0]);
	const secondArgIsValidBTag = validateBTag(args[1]);

	return new Promise ((resolve, reject) => {
		if (firstArgIsValidBTag || secondArgIsValidBTag) {
			// Check if the first argument is a valid btag
			if (firstArgIsValidBTag) {
				btag = args[0];
				// Check if the second argument is a valid btag
			} else if (secondArgIsValidBTag) {
				btag = args[1];
				request = args[0];
			}
			// If btag is set, get data for it
			if (btag != null) {
				getPlayerStats(btag, request)
					.then((result) => {
						resolve(result);
					})
					.catch((e) => {
						reject(e);
					});
			} else {
				reject(new Error(i18n.__('plugin.owStats.error.noBTagSet', fParams.message.author.username)));
			}
		} else {
			// No (valid) btag, try to get user's btag from persistance
			const Users = require.main.require('./repositories/usersRepository.js');

			const userID = fParams.message.author.id;
			Users.getBTag(userID)
				.then(data => {
					request = args[0];
					btag = data;

					if (btag != null) {
						getPlayerStats(btag, request)
							.then((result) => {
								resolve(result);
							})
							.catch((e) => {
								reject(e);
							});
					} else {
						reject(new Error(i18n.__('plugin.owStats.error.noBTagSet', fParams.message.author.username)));
					}
				});
		}
	});
}

function getPlayerStats(btag, request) {
	return new Promise ((resolve, reject) => {
		owjs
			.getAll('pc', 'eu', btag.replace('#', '-'), false, 'es-es')
			.then((data) => {
				// console.dir(data.quickplay.heroes, { depth: 2, colors: true });
				data.profile.btag = btag;
				let statsEmbed;
				switch (request) {
				case 'comp':
					statsEmbed = getCompStatsEmbed(data);
					break;
				case 'pr':
				default:
					statsEmbed = getQPStatsEmbed(data);
				}
				resolve(statsEmbed);
			})
			.catch(e => {
				reject(e);
			});
	});

}

function getMostPlayedHeroes(n, heroes) {
	// Add 'name' key
	for (const key in heroes) {
		// skip loop if the property is from prototype
		if (!heroes.hasOwnProperty(key)) continue;

		const obj = heroes[key];
		obj['name'] = key;
	}

	// Convert object to array
	let heroesArray = Object.keys(heroes).map((key) => heroes[key]);
	// Sort by time played
	heroesArray = heroesArray.sort(compareValues('time_played', 'desc'));
	// n must be greater than 0
	if (n < 1) n = heroesArray.length;
	// Get first n
	heroesArray = heroesArray.slice(0, n);

	return (heroesArray);
}

function getQPStatsEmbed(pData) {
	const heroes = pData.quickplay.heroes;
	// console.log(getMostPlayedHeroes(5, heroes));
	const mostPHeroes = getMostPlayedHeroes(5, heroes);

	const accStats = {
		level: `${pData.profile.tier}${pData.profile.level}`,
		rank: pData.profile.rank,
	};

	const medals = {
		total: pData.quickplay.global.medals,
		gold: pData.quickplay.global.medals_gold,
		silver: pData.quickplay.global.medals_silver,
		bronze: pData.quickplay.global.medals_bronze,
	};
	const quickPlayStats = {
		victories: pData.quickplay.global.games_won,
		eliminations: pData.quickplay.global.eliminations,
		finalBlows: pData.quickplay.global.final_blows,
		deaths: pData.quickplay.global.deaths,
		ePerD: (Math.floor(pData.quickplay.global.deaths / pData.quickplay.global.eliminations * 100) / 100).toFixed(2),
		totalDmg: pData.quickplay.global.all_damage_done,
		totalHealing: pData.quickplay.global.healing_done,
	};

	const data = {
		account: pData.profile.btag,
		gameMode: i18n.__('plugin.owStats.gameMode.quickMatch'),
		avatar: pData.profile.avatar,
		accountStats: accStats,
		medals: medals,
		gameModeStats: quickPlayStats,
		mostPHeroes: mostPHeroes,
	};

	return getStatsEmbed(data);
}

function getCompStatsEmbed(pData) {
	const heroes = pData.quickplay.heroes;
	// console.log(getMostPlayedHeroes(5, heroes));
	const mostPHeroes = getMostPlayedHeroes(5, heroes);

	const accStats = {
		level: `${pData.profile.tier}${pData.profile.level}`,
		rank: pData.profile.rank,
	};
	const medals = {
		total: pData.competitive.global.medals,
		gold: pData.competitive.global.medals_gold,
		silver: pData.competitive.global.medals_silver,
		bronze: pData.competitive.global.medals_bronze,
	};
	const competitiveStats = {
		victories: pData.competitive.global.games_won,
		eliminations: pData.competitive.global.eliminations,
		finalBlows: pData.competitive.global.final_blows,
		deaths: pData.competitive.global.deaths,
		ePerD: (Math.floor(pData.competitive.global.deaths / pData.competitive.global.eliminations * 100) / 100).toFixed(2),
		totalDmg: pData.competitive.global.all_damage_done,
		totalHealing: pData.competitive.global.healing_done,
	};
	console.log(pData.profile);
	const data = {
		account: pData.profile.btag,
		gameMode: i18n.__('plugin.owStats.gameMode.competitive'),
		avatar: pData.profile.avatar,
		accountStats: accStats,
		medals: medals,
		gameModeStats: competitiveStats,
		mostPHeroes: mostPHeroes,
	};

	return getStatsEmbed(data);
}

function getStatsEmbed(data) {
	const Discord = require('discord.js');

	const accStatsStr = [
		`*${i18n.__('plugin.owStats.accStats.level')}:* ${data.accountStats.level}`,
		`*${i18n.__('plugin.owStats.accStats.rank')}:* ${data.accountStats.rank || '-'}`,
	];
	const medalsStr = [
		`*${i18n.__('plugin.owStats.medals.total')}:* ${data.medals.total || '0'}`,
		`*${i18n.__('plugin.owStats.medals.gold')}:* ${data.medals.gold || '0'}`,
		`*${i18n.__('plugin.owStats.medals.silver')}:* ${data.medals.silver || '0'}`,
		`*${i18n.__('plugin.owStats.medals.bronze')}:* ${data.medals.bronze || '0'}`,
	];
	const gameModeStatsStr = [
		`*${i18n.__('plugin.owStats.gameModeStats.victories')}:* ${data.gameModeStats.victories}`,
		`*${i18n.__('plugin.owStats.gameModeStats.eliminations')}:* ${data.gameModeStats.eliminations}`,
		`*${i18n.__('plugin.owStats.gameModeStats.finalBlows')}:* ${data.gameModeStats.finalBlows}`,
		`*${i18n.__('plugin.owStats.gameModeStats.deaths')}:* ${data.gameModeStats.deaths}`,
		`*${i18n.__('plugin.owStats.gameModeStats.ePerD')}:* ${data.gameModeStats.ePerD}`,
		`*${i18n.__('plugin.owStats.gameModeStats.totalDmg')}:* ${data.gameModeStats.totalDmg}`,
		`*${i18n.__('plugin.owStats.gameModeStats.totalHealing')}:* ${data.gameModeStats.totalHealing}`,
	];

	const mostPHeroesStr = data.mostPHeroes.map(function(v) {
		const played = (Math.floor(v.time_played / (60 * 60) / 1000 * 100) / 100).toFixed(2); // Convert from milliseconds to hours
		let name = v.name;
		name = name.replace('_', ' ');
		name = name.charAt(0).toUpperCase() + name.substring(1);
		return `*${name}:* ${played} horas`;
	});

	const embed = new Discord.MessageEmbed()
		.setTitle(i18n.__('plugin.owStats.owStatsTitle', data.account, data.gameMode))
		.setAuthor('Overwatch Info', 'https://www.flaktest.com/wp-content/uploads/2017/01/owlogo.jpg')
		.setColor(3447003)
		.setThumbnail(data.avatar)
		.setURL('https://playoverwatch.com/es-es/career/pc/eu/' + data.account.replace('#', '-'))
	// Row 1
		.addField(i18n.__('plugin.owStats.accStats.title'), accStatsStr, true)
		.addField(i18n.__('plugin.owStats.medals.title'), medalsStr, true);
	// Row 2
	/* .addField(i18n.__("plugin.owStats.gameModeStats.title"), gameModeStatsStr, true)
        .addField(i18n.__("plugin.owStats.mostUsedHeroes.title"), mostPHeroesStr, true)*/

	return (embed);
}

function compareValues(key, order = 'asc') {
	return function(a, b) {
		if (!a.hasOwnProperty(key) ||
            !b.hasOwnProperty(key)) {
			return 0;
		}

		const varA = (typeof a[key] === 'string') ?
			a[key].toUpperCase() : a[key];
		const varB = (typeof b[key] === 'string') ?
			b[key].toUpperCase() : b[key];

		let comparison = 0;
		if (varA > varB) {
			comparison = 1;
		} else if (varA < varB) {
			comparison = -1;
		}
		return (
			(order == 'desc') ?
				(comparison * -1) : comparison
		);
	};
}

const owStatsArgs = [{
	'tag': i18n.__('plugin.owStats.args.gameMode.tag'),
	'desc': i18n.__('plugin.owStats.args.gameMode.desc') + '\n\n\t**' + i18n.__('argsPossibleValues') + '**\n\t\t' +
            '`pr`: ' + i18n.__('plugin.owStats.gameMode.quickMatch') + '\n\t\t' +
            '`comp`: ' + i18n.__('plugin.owStats.gameMode.competitive'),
	'optional': true,
},
{
	'tag': i18n.__('plugin.owStats.args.btag.tag'),
	'desc': i18n.__('plugin.owStats.args.btag.desc'),
	'optional': true,
},
];

const commands = [];
const eventHandlers = [];

const owStatsCmd = new Command('owstats', 'Overwatch Stats', i18n.__('plugin.owStats.desc'), owStats, 0, [], owStatsArgs);
commands.push(owStatsCmd);

const owStatsPlugin = new Plugin('owStats', commands, eventHandlers);


// Exports section
module.exports = owStatsPlugin;