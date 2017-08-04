var Plugin = require.main.require("./classes/plugin.class.js");
var Command = require.main.require("./classes/command.class.js");
var functions = require.main.require("./functions.js");
var i18n = functions.i18n;

var owjs = require('overwatch-js');

function owStats(fParams, args, callback) {
    if (args.length > 0) {
        var action = args[0];
        var btag = "";
        if (args[1]) {
            btag = args[1];
        } else {
            // Try to get from db
            btag = "Hiro#2564";
        }

        switch (action) {
            case 'pr':
                getQPStats(btag, callback);
                break;
            case 'comp':
                getCompStats(btag, callback);
                break;
            default:
                callback(new Error("Invalid option."));
        }
    } else {
        // If linked btag is present, show quick match stats
        callback(new Error("Choose an option."));
    }

}

function getQPStats(btag, callback) {
    var accName = btag.replace("#", "-");
    owjs
        .getAll('pc', 'eu', accName)
        .then((data) => {
            //console.dir(data.profile, { depth: 2, colors: true });
            var qPStatsEmbed = getQPStatsEmbed(btag, data);
            callback(null, qPStatsEmbed, true);
        });
}

function getCompStats(btag, callback) {
    var accName = btag.replace("#", "-");
    owjs
        .getAll('pc', 'eu', accName)
        .then((data) => {
            //console.dir(data.profile, { depth: 2, colors: true });
            var compStatsEmbed = getCompStatsEmbed(btag, data);
            callback(null, compStatsEmbed, true);
        });
}

function linkBTag(userID, btag) {

}

function unlinkBTag(userID) {

}

function getLinkedBTag(userID) {
    return "Hiro#2564"
}

function bTagIsLinked(userID) {
    return getLinkedBTag(userID) != "";
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

function getQPStatsEmbed(btag, pData) {
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
        account: btag,
        gameMode: "Partida rápida",
        avatar: pData.profile.avatar,
        accountStats: accStatsStr,
        medals: medalsStr,
        gameModeStats: quickPlayStr,
        mostPHeroes: mostPHeroes
    }

    return getStatsEmbed(data);
}

function getCompStatsEmbed(btag, pData) {
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
        account: btag,
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
// owstats [pr|comp|vincular|desvincular] [btag]
var owStats = new Plugin(commands, eventHandlers);


// Exports section
module.exports = owStats;