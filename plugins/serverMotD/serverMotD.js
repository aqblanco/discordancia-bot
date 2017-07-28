var Plugin = require.main.require("./classes/plugin.class.js");
var Command = require.main.require("./classes/command.class.js");
var EventHandler = require.main.require("./classes/event-handler.class.js");

const PersistentCollection = require('djs-collection-persistent');
// Tables
const connectionsTable = new PersistentCollection({ name: "connections" });
const motdTable = new PersistentCollection({ name: "motd" });


function onConnectWelcome(oldMember, newMember) {
    // Trigger when coming from offline
    if (oldMember.frozenPresence.status === 'offline') {
        var lastCon = getUserLastConnection(newMember.user.id, connectionsTable);
        setUserLastConnection(newMember.user.id, new Date(), connectionsTable);
        var motd = getMotD(motdTable);
        if (motd != null) {
            var lastConDate = new Date();
            var sameDay = lastConDate.getDate() == new Date().getDate();
            var sameMonth = lastConDate.getMonth() == new Date().getMonth();
            var sameYear = lastConDate.getYear() == new Date().getYear();
            var changed = motdChanged(lastCon, motd.timestamp);
            // Check if the MotD changed since last connection or user's lastest connection wasn't on the same day
            if (changed || !sameDay || !sameMonth || !sameYear) {
                // PM with welcome message
                newMember.user.send(`Bienvenido al servidor ${newMember.guild.name}!. Disfruta de tu estancia.`);
                newMember.user.send(`***Mensaje del día***: ${motd.message}`);
            }
        }
    }
}

function motd(fParams, args, callback) {
    var message = fParams.message;
    var res = "";

    // Display current MotD
    if (args.length == 0) {
        var motdObject = getMotD(motdTable);
        res = motdObject.message;
        // Update MotD
    } else {
        // Create a string from the args, that is, the motd
        res = args.join(' ');
        setMotD(res, motdTable);
    }

    if (res != null) {
        embedMsg = {
            author: {
                name: "Mensaje del día",
                icon_url: "https://www.warcraftlogs.com/img/warcraft/header-logo.png"
            },
            color: 3447003,
            description: res
        };
        callback(null, embedMsg, true);
    } else {
        callback(new Error("No MotD set."));
    }
}

function getUserLastConnection(userID, table) {
    // Get last connection from persistance
    var lastConnection = table.get(userID);
    // Fix for empty result (first connection)
    lastConnection = typeof lastConnection === 'undefined' ? new Date().getTime() : lastConnection;

    return lastConnection;
}

function setUserLastConnection(userID, lastC, table) {
    table.set(userID, lastC.getTime());
}

function getMotD(table) {
    // Get message of the day data from persistance
    var motd = table.get('motd');
    // Fix for empty result (no motd set yet)
    motd = typeof motd === 'undefined' ? null : motd;

    return motd;
}

function setMotD(msg, table) {
    table.set('motd', { 'message': msg, 'timestamp': new Date().getTime() });
}

function motdChanged(lastLoginDate, motdChangeDate) {
    var res = motdChangeDate > lastLoginDate;
    return res;
}

var motdArgs = [{
    "tag": "nuevoMensaje",
    "desc": "Establece el mensaje diario al indicado.",
    "optional": true
}];

var commands = [];
var eventHandlers = [];

var serverMotDEvent = new EventHandler('presenceUpdate', onConnectWelcome);
eventHandlers.push(serverMotDEvent);
var serverMotDCmd = new Command('motd', 'Muestra el mensaje diario. Si se le indica un mensaje, lo establece como el nuevo mensaje diario.', motd, 1, [], motdArgs);
commands.push(serverMotDCmd);

var serverMotD = new Plugin(commands, eventHandlers);


// Exports section
module.exports = serverMotD;