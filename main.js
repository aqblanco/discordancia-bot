const Discord = require("discord.js");
const client = new Discord.Client();
var rueBot = require("./rueBot.class.js");

const token = "MzI0MTg5MTczOTQ4ODc0NzY0.DCGERw.YoXdt-pU-GYuG8nt77QUDrw2F20";
const cmdPrefix = "|rue";
var rueBotObj = new rueBot(cmdPrefix);

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', () => {
    console.log('Rue bot inicializado correctamente...\n');
    client.user.setUsername('M.O.T.O.');
    client.user.setGame('Ayuda: ' + cmdPrefix + ' ayuda');
    addCommands(rueBotObj);
});

// Create an event listener for new guild members
client.on('guildMemberAdd', member => {
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
client.on('message', message => {
    var botUser = client.user.username;
    var firstEle = message.content.split(/\s+/g)[0];

    if (firstEle === cmdPrefix || message.mentions.users.find("username", botUser) !== null) {
        // Cut the prefix or bot mention from the message
        var tempA = message.content.split(/\s+/g);
        tempA.splice(0, 1); // Prefix item
        message.content = tempA.join(" "); // Redo string

        rueBotObj.reply(message);
    }
});

// Log our bot in
client.login(token);

function addCommands(bot) {
    var commands = [];

    var help = require("./plugins/help/help.js");
    commands.push(help);
    // Add the command list as a parameter of the getHelp function
    commands.forEach(function(e) {
        if (e.getLabel() == help.getLabel())
            e.addFParams({ 'commands': commands });
    });
    bot.addCommand(help);
}