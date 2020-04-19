const Plugin = require.main.require("./classes/plugin.class.js");
const Command = require.main.require("./classes/command.class.js");
const EventHandler = require.main.require("./classes/event-handler.class.js");

const functions = require.main.require("./lib/functions.js");
const i18n = functions.i18n;

const UsersServers = require.main.require("./repositories/usersServersRepository.js");
const MotD = require.main.require("./repositories/motdRepository.js");


function onConnectWelcome(oldMember, newMember) {
    const daysInterval = 7; // Interval of days to show MotD if it has not changed
    // Trigger when coming from offline
    if (!oldMember || oldMember.status === 'offline') {
        let lastCon = null;
        // Get user last connection to server
        UsersServers.getLastConnection(newMember.user.id, newMember.guild.id)
        .then(data => {
            lastCon = data;
            // Update last connection with current date
            return UsersServers.setLastConnection(newMember.user.id, newMember.guild.id, new Date().getTime())
        })
        .then(() => {
            // Get MotD
            return MotD.getMotD(newMember.guild.id);
        })
        .then((data) => {
            if (data != null) {
                let motd = data.motd;
                let daysLastChange;
                if (lastCon != null) {
                    // Not first connection, check message changed, or previous connection not in the same day
                    let lastConDate = new Date(lastCon);
                    daysLastChange = daysDifference(lastConDate, new Date());
                } else {
                    // First connection, force showing motd
                    daysLastChange = daysInterval;
                }

                // Message of the day is set, show it with welcome message

                let changed = motdChanged(lastCon, data.updatedAt);
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

function motd(fParams, args) {
    let message = fParams.message;
    let motd = '';
    return new Promise ((resolve, reject) => {
        // Display current MotD
        if (args.length == 0) {
            MotD.getMotD(message.guild.id)
            .then(data => {
                if (data) {
                    motd = data.motd;  
                }
                displayMotd(motd)
                .then((msg) => {
                    resolve(msg);
                })
                .catch((e) => {
                    reject(e);
                });
            });
            // Update MotD
        } else {
            // Create a string from the args, that is, the motd
            motd = args.join(' ');
            MotD.setMotD(message.guild.id, motd)
            .then(() => {
                displayMotd(motd)
                .then((msg) => {
                    resolve(msg);
                })
                .catch((e) => {
                    reject(e);
                });
            })
        }
    });
    
}

function displayMotd(msg) {
    return new Promise((resolve, reject) => {
        if (msg != null && msg != '') {
            embedMsg = {
                author: {
                    name: i18n.__("plugin.serverMotD.motd"),
                    icon_url: "https://dmszsuqyoe6y6.cloudfront.net/img/warcraft/favicon.png"
                },
                color: 3447003,
                description: msg
            };
            resolve(embedMsg);
        } else {
            reject(new Error(i18n.__("plugin.serverMotD.error.noMotDSet") /*"No MotD set."*/ ));
        }
    });
}

function motdChanged(lastLoginDate, motdChangeDate) {
    let res = motdChangeDate > lastLoginDate;
    return res;
}

// Gets difference in days between to dates
function daysDifference(d1, d2) {
    return d2.getDate() - d1.getDate();
}

let motdArgs = [{
    "tag": i18n.__("plugin.serverMotD.args.newMessage.tag"), //"nuevoMensaje",
    "desc": i18n.__("plugin.serverMotD.args.newMessage.desc"), //"Establece el mensaje diario al indicado.",
    "optional": true
}];

let commands = [];
let eventHandlers = [];

let serverMotDEvent = new EventHandler('presenceUpdate', onConnectWelcome);
eventHandlers.push(serverMotDEvent);
let serverMotDCmd = new Command('motd', 'Message of the Day', i18n.__("plugin.serverMotD.desc") /*'Muestra el mensaje diario. Si se le indica un mensaje, lo establece como el nuevo mensaje diario.'*/ , motd, 1, [], motdArgs);
commands.push(serverMotDCmd);

let serverMotDPlugin = new Plugin('serverMotD', commands, eventHandlers);


// Exports section
module.exports = serverMotDPlugin;