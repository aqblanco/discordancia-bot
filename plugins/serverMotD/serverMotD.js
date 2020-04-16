var Plugin = require.main.require("./classes/plugin.class.js");
var Command = require.main.require("./classes/command.class.js");
var EventHandler = require.main.require("./classes/event-handler.class.js");

var functions = require.main.require("./functions.js");
var i18n = functions.i18n;

//const PersistentCollection = require('djs-collection-persistent');
var dataConnections = require.main.require("./dataConnections.js");
// Tables
const connectionsTable = dataConnections.userServerInfotable; /*new PersistentCollection({ name: "userInfo" });*/
const motdTable = dataConnections.motdInfoTable; /*new PersistentCollection({ name: "serverInfo" });*/


function onConnectWelcome(oldMember, newMember) {
    const daysInterval = 7; // Interval of days to show MotD if it has not changed
    // Trigger when coming from offline
    if (!oldMember || oldMember.status === 'offline') {
        let lastCon = null;
        // Get user last connection to server
        connectionsTable.findOne({ where: { user_id: newMember.user.id, server_id: newMember.guild.id } })
        .then(data => {
            if (data) {
                lastCon = data.last_connection;
            }
            // Update last connection with current date
            return connectionsTable.upsert({ user_id: newMember.user.id, server_id: newMember.guild.id, last_connection: new Date().getTime()})
        })
        .then(() => {
            // Get MotD
            return motdTable.findOne({ where: { server_id:  newMember.guild.id } });
        })
        .then((data) => {
            if (data != null) {
                var motd = data.motd;
                if (lastCon != null) {
                    // Not first connection, check message changed, or previous connection not in the same day
                    var lastConDate = new Date(lastCon);
                    var daysLastChange = daysDifference(lastConDate, new Date());
                } else {
                    // First connection, force showing motd
                    var daysLastChange = daysInterval;
                }

                // Message of the day is set, show it with welcome message

                var changed = motdChanged(lastCon, data.updatedAt);
                // Check if the MotD changed since last connection or user's lastest connection wasn't on the same day
                if (changed || daysLastChange >= daysInterval) {
                    // PM with welcome message to non-bot users
                    if (!newMember.user.bot) {
                        newMember.user.send("***" + i18n.__("plugin.serverMotD.motd") + `***: ${motd}`)
                        .then(m => console.log(`MotD enviado al usuario ${newMember.user.username}`))
                        .catch(console.error);
                    }
                }
            }
        });
    }
}

function motd(fParams, args, callback) {
    let message = fParams.message;
    let motd = '';

    // Display current MotD
    if (args.length == 0) {
        motdTable.findOne({ where: { server_id: message.guild.id } })
        .then(data => {
            if (data) {
                motd = data.motd;  
            }
            displayMotd(motd, callback);
        });
        // Update MotD
    } else {
        // Create a string from the args, that is, the motd
        motd = args.join(' ');
        motdTable.upsert({ server_id: message.guild.id, motd: motd })
        .then(() => {
            displayMotd(motd, callback);
        })
    }
}

function displayMotd(msg, callback) {
    
    if (msg != null && msg != '') {
        embedMsg = {
            author: {
                name: i18n.__("plugin.serverMotD.motd"),
                icon_url: "https://www.warcraftlogs.com/img/warcraft/header-logo.png"
            },
            color: 3447003,
            description: msg
        };
        callback(null, embedMsg, true);
    } else {
        callback(new Error(i18n.__("plugin.serverMotD.error.noMotDSet") /*"No MotD set."*/ ));
    }
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