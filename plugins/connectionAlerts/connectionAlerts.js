var Plugin = require.main.require("./classes/plugin.class.js");
var EventHandler = require.main.require("./classes/event-handler.class.js");

function connectionAlert(oldStatus, newStatus) {
    //console.log(oldStatus.frozenPresence.status);
    console.log(newStatus);
    if (oldStatus.frozenPresence.status === 'offline') {
        console.log(`${newStatus.user.username} se ha conectado.`);
    }
    if (oldStatus.frozenPresence.status === 'online') {
        console.log(`${newStatus.user.username} se ha desconectado.`);
    }
}

var commands = [];
var eventHandlers = [];

var connectionAlertEvent = new EventHandler('presenceUpdate', connectionAlert);
eventHandlers.push(connectionAlertEvent);

var connectionAlerts = new Plugin(commands, eventHandlers);


// Exports section
module.exports = connectionAlerts;