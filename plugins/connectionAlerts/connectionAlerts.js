const Plugin = require.main.require("./classes/plugin.class.js");
const EventHandler = require.main.require("./classes/event-handler.class.js");

const functions = require.main.require("./functions.js");
const i18n = functions.i18n;

function connectionAlert(oldMember, newMember) {
    /*let currentStatus = newMember.guild.presences.get(newMember.user.id).status;
    let oldStatus = oldMember.frozenPresence.status;

    // Came from offline status
    if (oldStatus === 'offline') {
        console.log(i18n.__("plugin.connectionAlerts.userConnected", newMember.user.username, newMember.guild.name));
    }

    // Gone to offline status
    if (currentStatus === 'offline') {
        console.log(i18n.__("plugin.connectionAlerts.userDisconnected", newMember.user.username, newMember.guild.name));
    }*/
}

let commands = [];
let eventHandlers = [];

let connectionAlertEvent = new EventHandler('presenceUpdate', connectionAlert);
eventHandlers.push(connectionAlertEvent);

let connectionAlertsPlugin = new Plugin('connectionAlerts', commands, eventHandlers);


// Exports section
module.exports = connectionAlertsPlugin;