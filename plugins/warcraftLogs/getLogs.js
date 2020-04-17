// Requires section
const Plugin = require.main.require("./classes/plugin.class.js");
const Command = require.main.require("./classes/command.class.js");
const config = require.main.require("./config.json");
const functions = require.main.require("./functions.js");
const i18n = functions.i18n;

// Main code section
function getLogs(fParams, args) {
    // Warcraft Logs api
    const api = require('weasel.js');

    // Set the public WCL api-key that you get from https://www.warcraftlogs.com/accounts/changeuser 
    api.setApiKey(config.apiKeys.wLogsAPIKey);

    // Optional parameters for the api call. 
    let params = {};
    return new Promise ((resolve, reject) => {
        // Call the function to list guild reports, can be filtered on start time and end time as a UNIX timestamp with the optional parameters @params. 
        api.getReportsGuild(config.guildInfo.guildName, config.guildInfo.guildRealm, config.guildInfo.guildRegion, params, function(err, data) {
            if (err) {
                //We caught an error, send it to the callback function. 
                reject(err);
            }
            // Success, log the whole data object to the console. 
            let lastN = 5;
            let logsObj = data.slice(-lastN);
            let logInfo = [];
            logsObj.forEach(function(e) {
                let d = new Date(e.start);
                let options = { year: 'numeric', month: '2-digit', day: '2-digit' };
                let date = d.toLocaleString('en-GB', options);
                let info = [{
                    name: e.title + " - https://www.warcraftlogs.com/reports/" + e.id,
                    value: i18n.__('plugin.warcraftLogs.logDate', date, e.owner) //"Log del **" + date + "** por **" + e.owner + "**"
                }];
                logInfo = logInfo.concat(info);
            })

            let embedMsg = {
                author: {
                    name: "WarCraft Logs",
                    icon_url: "https://dmszsuqyoe6y6.cloudfront.net/img/warcraft/favicon.png"
                },
                color: 3447003,
                title: i18n.__('plugin.warcraftLogs.atWarcraftLogs', config.guildInfo.guildName),
                url: "https://www.warcraftlogs.com/guilds/154273",
                fields: logInfo,
            };
            resolve(embedMsg);
        });
    });
}


let commands = [];
let eventHandlers = [];

let getLogsCmd = new Command('logs', 'Warcraft Logs', i18n.__('plugin.warcraftLogs.desc'), getLogs);
commands.push(getLogsCmd);

let getLogsPlugin = new Plugin('getLogs', commands, eventHandlers);


// Exports section
module.exports = getLogsPlugin;