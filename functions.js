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