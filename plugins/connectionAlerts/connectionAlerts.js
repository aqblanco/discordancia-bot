var Plugin = require.main.require("./classes/plugin.class.js");
var EventHandler = require.main.require("./classes/event-handler.class.js");

function connectionAlert(oldMember, newMember) {
    if (oldMember.frozenPresence.status === 'offline') {
        console.log(`${newMember.user.username} se ha conectado.`);
    }
    if (oldMember.frozenPresence.status === 'online') {
        console.log(`${newMember.user.username} se ha desconectado.`);
    }
}

var commands = [];
var eventHandlers = [];

var connectionAlertEvent = new EventHandler('presenceUpdate', connectionAlert);
eventHandlers.push(connectionAlertEvent);

var connectionAlerts = new Plugin(commands, eventHandlers);


// Exports section
module.exports = connectionAlerts;