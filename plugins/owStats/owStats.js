var Plugin = require.main.require("./classes/plugin.class.js");
var Command = require.main.require("./classes/command.class.js");
var functions = require.main.require("./functions.js");
var owjs = require('overwatch-js');

var i18n = functions.i18n;

function owStats(fParams, args, callback) {
    var validateBTag = functions.validateBTag;
    var btag = null;
    var request = null;

    // Determine which btag to query
    // Check if the first argument is a valid btag
    if (validateBTag(args[0])) {
        btag = args[0];
        // Check if the second argument is a valid btag
    } else if (validateBTag(args[1])) {
        btag = args[1];
        request = args[0];
    } else {
        // try to get user's btag from persistance
        btag = readUserBTag();
        request = args[0];
    }

    // If btag is set, get data for it
    if (btag != null) {
        getPlayerStats(btag, request, callback);
    } else {
        callback(new Error(i18n.__("plugin.owstats.error.noBTagSet", fParams.message.author.username)))
    }
}

function getPlayerStats(btag, request, callback) {
    owjs
        .getAll('pc', 'eu', btag.replace('#', '-'))
        .then((data) => {
            //console.dir(data.quickplay.heroes, { depth: 2, colors: true });
            data.profile.btag = btag;
            switch (request) {
                case 'comp':
                    var statsEmbed = getCompStatsEmbed(data);
                    break;
                case 'pr':
                default:
                    var statsEmbed = getQPStatsEmbed(data);
            }
            callback(null, statsEmbed, true);
        });
}

function getMostPlayedHeroes(n, heroes) {
    // Add 'name' key
    for (var key in heroes) {
        // skip loop if the property is from prototype
        if (!heroes.hasOwnProperty(key)) continue;

        var obj = heroes[key];
        obj['name'] = key;
    }

    // Convert object to array
    var heroesArray = Object.keys(heroes).map((key) => heroes[key]);
    // Sort by time played
    heroesArray = heroesArray.sort(compareValues('time_played', 'desc'));
    // n must be greater than 0
    if (n < 1) n = heroesArray.length;
    // Get first n
    heroesArray = heroesArray.slice(0, n);

    return (heroesArray);
}

function getQPStatsEmbed(pData) {
    var heroes = pData.quickplay.heroes;
    //console.log(getMostPlayedHeroes(5, heroes));
    var mostPHeroes = getMostPlayedHeroes(5, heroes);
    var rank = pData.profile.rank || '-';
    var accStatsStr = [
        `*Nivel:* ${pData.profile.tier}${pData.profile.level}`,
        `*Rango:* ${rank}`
    ];
    var medalsStr = [
        `*Total:* ${pData.quickplay.global.medals || '0'}`,
        `*Oro:* ${pData.quickplay.global.medals_gold || '0'}`,
        `*Plata:* ${pData.quickplay.global.medals_silver || '0'}`,
        `*Bronce:* ${pData.quickplay.global.medals_bronze || '0'}`
    ];
    var quickPlayStr = [
        `*Victorias:* ${pData.quickplay.global.games_won}`,
        `*Eliminaciones:* ${pData.quickplay.global.eliminations}`,
        `*Golpes de gracia:* ${pData.quickplay.global.final_blows}`,
        `*Muertes:* ${pData.quickplay.global.deaths}`,
        `*Eliminaciones/Muertes:* ${(Math.floor(pData.quickplay.global.deaths / pData.quickplay.global.eliminations * 100) / 100).toFixed(2)}`,
        `*Daño total:* ${pData.quickplay.global.all_damage_done}`,
        `*Sanación total:* ${pData.quickplay.global.healing_done}`
    ];

    var mostPHeroesStr = mostPHeroes.map(function(v) {
        var played = Math.floor(v.time_played / (60 * 60) / 1000); // Convert from milliseconds
        var name = v.name;
        name = name.replace('_', ' ');
        name = name.charAt(0).toUpperCase() + name.substring(1);
        return `*${name}:* ${played} horas`;
    });

    var data = {
        account: pData.profile.btag,
        gameMode: "Partida rápida",
        avatar: pData.profile.avatar,
        accountStats: accStatsStr,
        medals: medalsStr,
        gameModeStats: quickPlayStr,
        mostPHeroes: mostPHeroes
    }

    return getStatsEmbed(data);
}

function getCompStatsEmbed(pData) {
    var heroes = pData.competitive.heroes;
    //console.log(getMostPlayedHeroes(5, heroes));
    var mostPHeroes = getMostPlayedHeroes(5, heroes);
    var rank = isNaN(pData.profile.rank) ? '-' : pData.profile.rank;
    var accStatsStr = [
        `*Nivel:* ${pData.profile.tier}${pData.profile.level}`,
        `*Rango:* ${rank}`
    ];
    var medalsStr = [
        `*Total:* ${pData.competitive.global.medals || '0'}`,
        `*Oro:* ${pData.competitive.global.medals_gold || '0'}`,
        `*Plata:* ${pData.competitive.global.medals_silver || '0'}`,
        `*Bronce:* ${pData.competitive.global.medals_bronze || '0'}`
    ];
    var competitiveStr = [
        `*Victorias:* ${pData.competitive.global.games_won}`,
        `*Eliminaciones:* ${pData.competitive.global.eliminations}`,
        `*Golpes de gracia:* ${pData.competitive.global.final_blows}`,
        `*Muertes:* ${pData.competitive.global.deaths}`,
        `*Eliminaciones/Muertes:* ${(Math.floor(pData.competitive.global.deaths / pData.competitive.global.eliminations * 100) / 100).toFixed(2)}`,
        `*Daño total:* ${pData.competitive.global.all_damage_done}`,
        `*Sanación total:* ${pData.competitive.global.healing_done}`
    ];

    var data = {
        account: pData.profile.btag,
        gameMode: "Competitivo",
        avatar: pData.profile.avatar,
        accountStats: accStatsStr,
        medals: medalsStr,
        gameModeStats: competitiveStr,
        mostPHeroes: mostPHeroes
    }

    return getStatsEmbed(data);
}

function getStatsEmbed(data) {
    const Discord = require("discord.js");

    var mostPHeroesStr = data.mostPHeroes.map(function(v) {
        var played = (Math.floor(v.time_played / (60 * 60) / 1000 * 100) / 100).toFixed(2); // Convert from milliseconds to hours
        var name = v.name;
        name = name.replace('_', ' ');
        name = name.charAt(0).toUpperCase() + name.substring(1);
        return `*${name}:* ${played} horas`;
    });

    const embed = new Discord.RichEmbed()
        .setTitle(`Estadísticas de Overwatch de ${data.account} (${data.gameMode})`)
        .setAuthor("Overwatch Info", "https://www.flaktest.com/wp-content/uploads/2017/01/owlogo.jpg")
        .setColor(3447003)
        .setThumbnail(data.avatar)
        .setURL("https://playoverwatch.com/es-es/career/pc/eu/Hiro-2564") // TODO
        // Row 1
        .addField("Información de Cuenta", data.accountStats, true)
        .addField("Medallas", data.medals, true)
        // Row 2
        .addField("Números", data.gameModeStats, true)
        .addField("Héroes más usados", mostPHeroesStr, true)

    return (embed);
}

function readUserBTag() {
    var btag = "Hiro#2564";
    return btag;
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

var commands = [];
var eventHandlers = [];

var owStatsCmd = new Command('owstats', 'Lorem Ipsum', owStats);
commands.push(owStatsCmd);
// owstats [pr|competitiva|vincular|desvincular] [btag]
var owStats = new Plugin('owStats', commands, eventHandlers);


// Exports section
module.exports = owStats;