// Requires section
var Command = require.main.require("./classes/command.class.js");

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

    callback(null, res.embedMsg, true);
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
            name: "Ayuda",
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
            if (a.optional) opt = "(Opcional) ";
            argsStr += "`" + a.tag + "` " + opt + "- " + a.desc + "\n";
        });
        if (argsStr === "") argsStr = "No hay argumentos disponibles para este comando.";

        // Prepare embed output
        embedMsg = {
            author: {
                name: "Ayuda",
                icon_url: "https://www.warcraftlogs.com/img/warcraft/header-logo.png"
            },
            color: 3447003,
            title: found.getLabel(),
            fields: [{
                    name: "Descripción",
                    value: found.getDesc()
                },
                {
                    name: "Argumentos",
                    value: argsStr
                },
                {
                    name: "Ejemplo",
                    value: "TODO"
                }
            ]
        };

        res.embedMsg = embedMsg;
    } else {
        // Command not found
        res.err = new Error("Command `" + command + "` not found!");
    }

    return res;
}

var helpArgs = [{
    "tag": "comando",
    "desc": "Nombre del comando del que ver la ayuda extendida.",
    "optional": true,
    "order": 1
}];

var help = new Command('ayuda', 'Muestra la lista de comandos disponibles. Si se especifica un comando, se muestra la ayuda extendida del mismo.', getHelp, 0, [], helpArgs);


// Exports section
module.exports = help;