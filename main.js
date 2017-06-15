const Discord = require("discord.js");
const client = new Discord.Client();
var rueBot = require("./rueBot.class.js");
var rueBotObj = new rueBot();

const token = "MzI0MTg5MTczOTQ4ODc0NzY0.DCGERw.YoXdt-pU-GYuG8nt77QUDrw2F20";


// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', () => {
  console.log('Rue bot inicializado correctamente...');
  client.user.setUsername('M.O.T.O.');
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
  rueBotObj.reply(message);
});

// Log our bot in
client.login(token);