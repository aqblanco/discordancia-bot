var Plugin = require.main.require("./classes/plugin.class.js");
var Command = require.main.require("./classes/command.class.js");
var EventHandler = require.main.require("./classes/event-handler.class.js");

var functions = require.main.require("./functions.js");
var i18n = functions.i18n;

const PersistentCollection = require('djs-collection-persistent');
// Tables
const connectionsTable = new PersistentCollection({ name: "userInfo" });
const motdTable = new PersistentCollection({ name: "serverInfo" });


function onConnectWelcome(oldMember, newMember) {
    const daysInterval = 7; // Interval of days to show MotD if it has not changed
    // Trigger when coming from offline
    if (oldMember.frozenPresence.status === 'offline') {
        var lastCon = getUserLastConnection(newMember.user.id, newMember.guild.id, connectionsTable);
        setUserLastConnection(newMember.user.id, newMember.guild.id, new Date(), connectionsTable);
        var motd = getMotD(newMember.guild.id, motdTable);
        if (motd != null) {
            if (lastCon != null) {
                // Not first connection, check message changed, or previous connection not in the same day
                var lastConDate = new Date(lastCon);
                /*var sameDay = lastConDate.getDate() == new Date().getDate();
                var sameMonth = lastConDate.getMonth() == new Date().getMonth();
                var sameYear = lastConDate.getYear() == new Date().getYear();*/
                var daysLastChange = daysDifference(lastConDate, new Date());
            } else {
                // First connection, force showing motd
                var daysLastChange = daysInterval;
            }

            // Message of the day is set, show it in addition to welcome message
            var changed = motdChanged(lastCon, motd.timestamp);
            // Check if the MotD changed since last connection or user's lastest connection wasn't on the same day
            if (changed || daysLastChange >= daysInterval) {
                // PM with welcome message to non-bot users
                if (!newMember.user.bot) {
                    newMember.user.send(i18n.__("plugin.serverMotD.welcomeMsg", newMember.user.username, newMember.guild.name))
                        .then(m => newMember.user.send("***" + i18n.__("plugin.serverMotD.motd") + `***: ${motd.message}`))
                        .then(m => console.log(`MotD enviado al usuario ${newMember.user.username}`))
                        .catch(console.error);
                }
            }
        }
    }
}

function motd(fParams, args, callback) {
    var message = fParams.message;
    var res = "";

    // Display current MotD
    if (args.length == 0) {
        var motdObject = getMotD(message.guild.id, motdTable);
        res = motdObject != null ? motdObject.message : null;
        // Update MotD
    } else {
        // Create a string from the args, that is, the motd
        res = args.join(' ');
        setMotD(res, message.guild.id, motdTable);
    }

    if (res != null) {
        embedMsg = {
            author: {
                name: i18n.__("plugin.serverMotD.motd"),
                icon_url: "https://www.warcraftlogs.com/img/warcraft/header-logo.png"
            },
            color: 3447003,
            description: res
        };
        callback(null, embedMsg, true);
    } else {
        callback(new Error(i18n.__("plugin.serverMotD.error.noMotDSet") /*"No MotD set."*/ ));
    }
}

function getUserLastConnection(userID, server, table) {
    // Get last connection from persistance
    var usersInfo = table.get(server);
    // No users entries
    usersInfo = typeof usersInfo === 'undefined' ? null : usersInfo;
    var lastConnection = null;
    if (usersInfo != null) {
        // Set to null when no user entry
        lastConnection = typeof usersInfo[userID] === 'undefined' ? null : usersInfo[userID].lastC;
        // Fix for empty result (first connection)
        lastConnection = typeof lastConnection === 'undefined' ? null : lastConnection;
    }
    return lastConnection;
}

function setUserLastConnection(userID, server, lastC, table) {
    // Retrieve current info
    var userInfo = table.get(server);
    // Set new MotD
    var newInfo = {};
    // If records exists update them, else create new ones
    if (typeof userInfo != 'undefined') newInfo = userInfo;
    // Initialice motd object if necessary
    newInfo[userID] = newInfo[userID] || {};
    newInfo[userID].lastC = lastC.getTime();
    // Write whole object
    table.set(server, newInfo);
}

function getMotD(server, table) {
    // Get server data from persistance
    var serverInfo = table.get(server);
    var motd = typeof serverInfo === 'undefined' ? null : serverInfo.motd;

    // Fix for empty result (no motd set yet)
    motd = typeof motd === 'undefined' ? null : motd;
    return motd;
}

function setMotD(msg, server, table) {
    // Retrieve current info
    var serverInfo = table.get(server);
    // Set new MotD
    var newInfo = {};
    // If records exists update them, else create new ones
    if (typeof serverInfo != 'undefined') newInfo = serverInfo;
    // Initialice motd object if necessary
    newInfo.motd = newInfo.motd || {};
    newInfo.motd.message = msg;
    newInfo.motd.timestamp = new Date().getTime();
    // Write whole object
    table.set(server, newInfo);
}

function motdChanged(lastLoginDate, motdChangeDate) {
    var res = motdChangeDate > lastLoginDate;
    return res;
}

// Gets difference in days between to dates
function daysDifference(d1, d2) {
    return d2.getDate() - d1.getDate();
}

var motdArgs = [{
    "tag": i18n.__("plugin.serverMotD.args.newMessage.tag"), //"nuevoMensaje",
    "desc": i18n.__("plugin.serverMotD.args.newMessage.desc"), //"Establece el mensaje diario al indicado.",
    "optional": true
}];

var commands = [];
var eventHandlers = [];

var serverMotDEvent = new EventHandler('presenceUpdate', onConnectWelcome);
eventHandlers.push(serverMotDEvent);
var serverMotDCmd = new Command('motd', i18n.__("plugin.serverMotD.desc") /*'Muestra el mensaje diario. Si se le indica un mensaje, lo establece como el nuevo mensaje diario.'*/ , motd, 1, [], motdArgs);
commands.push(serverMotDCmd);

var serverMotD = new Plugin('serverMotD', commands, eventHandlers);


// Exports section
module.exports = serverMotD;