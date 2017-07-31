const Discord = require("discord.js");
const client = new Discord.Client();
var Bot = require("./classes/discord-bot.class.js");
var functions = require("./functions.js");
const config = require("./config.json");
var i18n = functions.i18n;

const token = config.apiKeys.discordAPIKey;
const cmdPrefix = config.botConfig.cmdPrefix;
var botObj = new Bot(cmdPrefix);

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', function() {
    client.user.setUsername(config.botConfig.username);
    client.user.setGame('Ayuda: ' + cmdPrefix + ' ayuda');
    loadPlugins(botObj, client);
    console.log(i18n.__('botStarted'));
});

// Create an event listener for new guild members
client.on('guildMemberAdd', function(member) {
    // Send the message to the guilds default channel (usually #general), mentioning the member
    member.guild.defaultChannel.send(`Welcome to the server, ${member}!`);

    // If you want to send the message to a designated channel on a server instead
    // you can do the following:
    const channel = member.guild.channels.find('name', 'member-log');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(`Welcome to the server, ${member}`);
});

// Create an event listener for messages
client.on('message', function(message) {
    var botUser = client.user.username;
    var firstEle = message.content.split(/\s+/g)[0];

    if (firstEle.toLowerCase() === cmdPrefix.toLowerCase() || message.mentions.users.find("username", botUser) !== null) {
        // Cut the prefix or bot mention from the message
        var tempA = message.content.split(/\s+/g);
        tempA.splice(0, 1); // Prefix item
        message.content = tempA.join(" "); // Redo string

        botObj.reply(message);
    }
});

// Log our bot in
client.login(token);

function loadPlugins(bot, client) {
    var plugins = [];
    var commands = []; // Used by the help plugin

    // Random Member Quote
    plugins.push(require("./plugins/randomMemberQuote/randomMemberQuote.js"));
    // Play Audio
    plugins.push(require("./plugins/playAudio/playAudio.js"));
    // Get Logs
    plugins.push(require("./plugins/warcraftLogs/getLogs.js"));
    // Connection Alerts (Needs redo, alerts for voice channel connections)
    plugins.push(require("./plugins/connectionAlerts/connectionAlerts.js"));
    // Server MotD
    plugins.push(require("./plugins/serverMotD/serverMotD.js"));

    plugins.forEach(function(p) {
        commands = commands.concat(p.getCommands());

        bot.addCommands(p.getCommands());
        p.getEventHandlers().forEach(function(handler) {
            handler.bind(client);
        });
    });

    // Help
    var help = require("./plugins/help/help.js");
    commands.push(help);
    // Add the command list as a parameter of the getHelp function
    commands.forEach(function(e) {
        if (e.getLabel() == help.getLabel()) {
            e.addFParams({ 'commands': commands });
            e.addFParams({ 'cmdPrefix': cmdPrefix });
            //Bot user
        }
    });

    bot.addCommand(help);
}