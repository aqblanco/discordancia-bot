module.exports.getRandomStr = function(list) {
    var item = list[Math.floor(Math.random() * list.length)];
    return (item);
}

module.exports.getPath = function(folder = "systemRoot") {

    var path = "";
    switch (folder) {
        case 'classes':
            path = "/classes/";
            break;
        case 'audio':
            path = "/assets/audio/";
            break;
        case 'plugins':
            path = "/plugins/";
            break;
        case 'systemRoot':
        default:
            path = require('path').dirname(require.main.filename);
    }

    return (path);
}

module.exports.formatError = function(msg) {
    const Discord = require("discord.js");
    const embed = new Discord.RichEmbed()
        .setAuthor("Error", "https://freeiconshop.com/wp-content/uploads/edd/error-flat.png")
        .setColor("#b71c1c")
        .setDescription(msg)

    return embed;
}

module.exports.pluginIsEnabled = function(name) {
    const config = require("./config.json");

    return config.botConfig.enabledPlugins.includes(name);
}

module.exports.validateBTag = function(btag) {
    // From the naming policy: http://us.battle.net/support/en/article/battletag-naming-policy
    /*
    BattleTags must be between 3-12 characters long.
    Accented characters are allowed.
    Numbers are allowed, but a BattleTag cannot start with a number.
    Mixed capitals are allowed (ex: TeRrAnMaRiNe).
    No spaces or symbols are allowed (“, *, #, +, etc…).
     */
    var pattern = /^\D.{2,11}#\d{4}$/u;
    return pattern.test(btag);
}

// Initialize internacionalization support
var i18n = require("i18n");

i18n.configure({
    locales: ['en', 'es'],
    defaultLocale: 'es',
    directory: module.exports.getPath() + '/locales',
    objectNotation: true
});

module.exports.i18n = i18n;