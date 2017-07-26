// Requires section
var Plugin = require.main.require("./classes/plugin.class.js");
var Command = require.main.require("./classes/command.class.js");
const config = require.main.require("./config.json");

// Main code section
function getLogs(fParams, args, callback) {
    // Warcraft Logs api
    const api = require('weasel.js');

    // Set the public WCL api-key that you get from https://www.warcraftlogs.com/accounts/changeuser 
    api.setApiKey(config.apiKeys.wLogsAPIKey);

    // Optional parameters for the api call. 
    var params = {};
    // Call the function to list guild reports, can be filtered on start time and end time as a UNIX timestamp with the optional parameters @params. 
    api.getReportsGuild(config.guildInfo.guildName, config.guildInfo.guildRealm, config.guildInfo.guildRegion, params, function(err, data) {
        if (err) {
            //We caught an error, send it to the callback function. 
            callback(err);
            return;
        }
        // Success, log the whole data object to the console. 
        var lastN = 5;
        var logsObj = data.slice(-lastN);
        var logInfo = [];
        logsObj.forEach(function(e) {
            var d = new Date(e.start);
            var options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            var date = d.toLocaleString('en-GB', options);
            var info = [{
                name: e.title + " - https://www.warcraftlogs.com/reports/" + e.id,
                value: "Log del **" + date + "** por **" + e.owner + "**"
            }];
            logInfo = logInfo.concat(info);
        })

        var embedMsg = {
            author: {
                name: "WarCraft Logs",
                icon_url: "https://www.warcraftlogs.com/img/warcraft/header-logo.png"
            },
            color: 3447003,
            title: config.guildInfo.guildName + " en WarCraft Logs",
            url: "https://www.warcraftlogs.com/guilds/154273",
            fields: logInfo,
        };
        callback(null, embedMsg, true);
    });
}


var commands = [];
var eventHandlers = [];

var getLogsCmd = new Command('logs', 'Obtiene los últimos logs de Warcraft Logs', getLogs);
commands.push(getLogsCmd);

var getLogs = new Plugin(commands, eventHandlers);


// Exports section
module.exports = getLogs;