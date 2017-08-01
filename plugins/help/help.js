// Requires section
var Command = require.main.require("./classes/command.class.js");

var functions = require.main.require("./functions.js");
var i18n = functions.i18n;

// Main code section
function getHelp(fParams, args, callback) {
    var prefix = fParams['cmdPrefix'];
    var commandList = fParams['commands'];
    var command = args.length == 0 ? "" : args[0];
    var message = fParams.message;

    // empty check for command, else take first element
    var res = null;

    if (command == "") {
        res = getWholeHelp(commandList, message.member);
    } else {
        res = getCommandHelp(commandList, command);
    }

    if (res.err != null) {
        callback(res.err);
        return;
    }

    var embed = res.embedMsg;
    message.member.send({ embed });

    var userNotification = {
        author: {
            name: i18n.__("plugin.help.help"),
            icon_url: "https://www.warcraftlogs.com/img/warcraft/header-logo.png"
        },
        color: 3447003,
        description: "**" + i18n.__("plugin.help.helpSentNotification", `<@${message.member.user.id}>`) + "**"
    };
    callback(null, userNotification, true);
}

function getWholeHelp(commandList, requester) {
    // Display the whole command list

    var res = { "err": null, msg: "" }
    var msg = "";

    commandList.forEach(function(e) {
        if (e.userCanExecute(requester)) {
            // Build argument string for the command signature
            var argString = "";
            e.getArgumentList().forEach(function(arg) {
                var tag = arg.tag;
                if (arg.optional) tag = "[" + tag + "]";
                argString += " *`" + tag + "`* ";
            });
            msg += "**`" + e.getLabel() + "`" + argString + "** - " + e.getDesc() + "\n";
        }
    })

    // Prepare embed output
    var embedMsg = {
        author: {
            name: i18n.__("plugin.help.help"),
            icon_url: "https://www.warcraftlogs.com/img/warcraft/header-logo.png"
        },
        color: 3447003,
        description: msg
    };
    res.embedMsg = embedMsg;

    return res;
}

function getCommandHelp(commandList, command, callback) {
    // Display desired command help

    var res = { "err": null, msg: "" }
    var embedMsg = {};

    // Search for the command in the list
    var found = null;

    commandList.forEach(function(c) {
        if (c.getLabel() == command) found = c;
    });
    if (found != null) {
        // Command found
        var argsStr = "";
        var args = found.getArgumentList();
        args.forEach(function(a) {
            var opt = "";
            if (a.optional) opt = "(" + i18n.__("plugin.help.optional") + ") ";
            argsStr += "`" + a.tag + "` " + opt + "- " + a.desc + "\n";
        });
        if (argsStr === "") argsStr = i18n.__("plugin.help.noAvailableArgs") /*"No hay argumentos disponibles para este comando."*/ ;

        // Prepare embed output
        embedMsg = {
            author: {
                name: i18n.__("plugin.help.help"),
                icon_url: "https://www.warcraftlogs.com/img/warcraft/header-logo.png"
            },
            color: 3447003,
            title: i18n.__("plugin.help.command") + ": `" + found.getLabel() + "`",
            fields: [{
                    name: i18n.__("plugin.help.description"),
                    value: found.getDesc()
                },
                {
                    name: i18n.__("plugin.help.arguments"),
                    value: argsStr
                },
                {
                    name: i18n.__("plugin.help.example"),
                    value: "TODO"
                }
            ]
        };

        res.embedMsg = embedMsg;
    } else {
        // Command not found
        res.err = new Error(i18n.__("plugin.help.error.commandNotFound", command) /*"Command `" + command + "` not found!"*/ );
    }

    return res;
}

var helpArgs = [{
    "tag": i18n.__("plugin.help.args.command.tag"),
    "desc": i18n.__("plugin.help.args.command.desc") /*"Nombre del comando del que ver la ayuda extendida."*/ ,
    "optional": true
}];

var help = new Command('ayuda', i18n.__("plugin.help.desc") /*'Muestra la lista de comandos disponibles. Si se especifica un comando, se muestra la ayuda extendida del mismo.'*/ , getHelp, 0, [], helpArgs);


// Exports section
module.exports = help;