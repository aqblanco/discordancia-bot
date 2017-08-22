var Plugin = require.main.require("./classes/plugin.class.js");
var EventHandler = require.main.require("./classes/event-handler.class.js");

var functions = require.main.require("./functions.js");
var i18n = functions.i18n;

function connectionAlert(oldMember, newMember) {
    var currentStatus = newMember.guild.presences.get(newMember.user.id).status;
    var oldStatus = oldMember.frozenPresence.status;

    // Came from offline status
    if (oldStatus === 'offline') {
        console.log(i18n.__("plugin.connectionAlerts.userConnected", newMember.user.username, newMember.guild.name));
    }

    // Gone to offline status
    if (currentStatus === 'offline') {
        console.log(i18n.__("plugin.connectionAlerts.userDisconnected", newMember.user.username, newMember.guild.name));
    }
}

var commands = [];
var eventHandlers = [];

var connectionAlertEvent = new EventHandler('presenceUpdate', connectionAlert);
eventHandlers.push(connectionAlertEvent);

var connectionAlerts = new Plugin('connectionAlerts', commands, eventHandlers);


// Exports section
module.exports = connectionAlerts;