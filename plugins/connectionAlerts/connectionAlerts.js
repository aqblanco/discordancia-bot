var Plugin = require.main.require("./classes/plugin.class.js");
var EventHandler = require.main.require("./classes/event-handler.class.js");

function connectionAlert(oldMember, newMember) {
    var currentStatus = newMember.guild.presences.get(newMember.user.id).status;
    var oldStatus = oldMember.frozenPresence.status;

    // Came from offline status
    if (oldStatus === 'offline') {
        console.log(`${newMember.user.username} se ha conectado al servidor ${newMember.guild.name}.`);
    }

    // Gone to offline status
    if (currentStatus === 'offline') {
        console.log(`${newMember.user.username} se ha desconectado del servidor ${newMember.guild.name}.`);
    }
}

var commands = [];
var eventHandlers = [];

var connectionAlertEvent = new EventHandler('presenceUpdate', connectionAlert);
eventHandlers.push(connectionAlertEvent);

var connectionAlerts = new Plugin(commands, eventHandlers);


// Exports section
module.exports = connectionAlerts;