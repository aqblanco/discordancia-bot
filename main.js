const Discord = require("discord.js");
const client = new Discord.Client();
var Bot = require("./classes/discord-bot.class.js");
const config = require("./config.json");


const token = config.apiKeys.discordAPIKey;
const cmdPrefix = config.botConfig.cmdPrefix;
var botObj = new Bot(cmdPrefix);

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', function() {
    client.user.setUsername(config.botConfig.username);
    client.user.setGame('Ayuda: ' + cmdPrefix + ' ayuda');
    addCommands(botObj);
    console.log('Bot inicializado correctamente...\n');
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

    if (firstEle === cmdPrefix || message.mentions.users.find("username", botUser) !== null) {
        // Cut the prefix or bot mention from the message
        var tempA = message.content.split(/\s+/g);
        tempA.splice(0, 1); // Prefix item
        message.content = tempA.join(" "); // Redo string

        botObj.reply(message);
    }
});

const PersistentCollection = require('djs-collection-persistent');
const connectionsTable = new PersistentCollection({ name: "connections" });

client.on('presenceUpdate', function(oldStatus, newStatus) {
    if (oldStatus.frozenPresence.status === 'offline') {
        const currentDate = new Date();
        // Get las connection from persistance
        var lastConnection = connectionsTable.get(newStatus.user.id);
        // Fix for first connection
        lastConnection = typeof lastConnection === 'undefined' ? currentDate.getTime() : lastConnection;
        var lastConDate = new Date(lastConnection);
        // Update last connection time to current one
        connectionsTable.set(newStatus.user.id, currentDate.getTime());
        console.log(`${newStatus.user.username} se ha conectado.`);

        // Check that last connection wasn't today or MotD changed since last connection in order to show it
        var sameDay = lastConDate.getDate() == currentDate.getDate();
        var sameMonth = lastConDate.getMonth() == currentDate.getMonth();
        var sameYear = lastConDate.getYear() == currentDate.getYear();
        //if (!sameDay) {
        //if (!sameMonth)
        /*newStatus.user.send(`Bienvenido al servidor ${newStatus.guild.name}!. Disfruta de tu estancia.`);
        newStatus.user.send(`***Mensaje del día***: Esto es un placeholder dónde irá el mensaje diario.`);*/
        console.log("Mensaje diario.");
        //}
        //newStatus.user.send("Bienvenido!");
    }
    if (oldStatus.frozenPresence.status === 'online') {
        console.log(`${newStatus.user.username} se ha desconectado.`);
    }
});

// Log our bot in
client.login(token);

function addCommands(bot) {
    var commands = [];
    var plugins = [];

    // Random Member Quote
    plugins.push(require("./plugins/randomMemberQuote/randomMemberQuote.js"));
    // Play Audio
    plugins.push(require("./plugins/playAudio/playAudio.js"));
    // Get Logs
    plugins.push(require("./plugins/getLogs/getLogs.js"));

    plugins.forEach(function(p) {
        commands = commands.concat(p.getCommands());
        bot.addCommands(p.getCommands());
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

var EventHandler = require("./classes/event-handler.class.js");
var handler = new EventHandler("presenceUpdate", function() {
    console.log("Event binded");
});

handler.bind(client);