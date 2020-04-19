module.exports.getRandomStr = function(list) {
    let item = list[Math.floor(Math.random() * list.length)];
    return (item);
}

module.exports.getPath = function(folder = "appRoot") {

    let path = "";
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
        case 'appRoot':
        default:
            path = require('path').dirname(require.main.filename);
    }

    return (path);
}

module.exports.formatError = function(msg) {
    const Discord = require("discord.js");
    const embed = new Discord.MessageEmbed()
        .setAuthor("Error", "https://freeiconshop.com/wp-content/uploads/edd/error-flat.png")
        .setColor("#b71c1c")
        .setDescription(msg)

    return embed;
}

module.exports.pluginIsEnabled = function(name) {
    const rootPath = module.exports.getPath();
    const config = require(rootPath + "/config.json");

    return config.botConfig.enabledPlugins.includes(name);
}

// Initialize internacionalization support
const i18n = require("i18n");

i18n.configure({
    locales: ['en', 'es'],
    defaultLocale: 'en',
    directory: module.exports.getPath() + '/locales',
    objectNotation: true
});

module.exports.i18n = i18n;