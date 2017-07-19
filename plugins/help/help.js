var Command = require("../../command.class.js");

function getHelp(fParams, args, callback) {
    //var prefix = this.cmdPrefix;
    var commandList = fParams['commands'];
    var command = args.length == 0 ? "" : args[0];
    console.log(command);
    // empty check for command, else take first element
    var embedMsg = null;
    if (command == []) {
        embedMsg = getWholeHelp(commandList);
    } else {
        embedMsg = getCommandHelp(commandList, command);
    }

    callback(embedMsg, true);
}

function getWholeHelp(commandList) {
    // Display the whole command list

    var msg = "";

    commandList.forEach(function(e) {
        // Build argument string for the command signature
        var argString = "";
        e.getArgumentList().forEach(function(arg) {
            var tag = arg.tag;
            if (arg.optional) tag = "[" + tag + "]";
            argString += " *`" + tag + "`* ";
        });
        msg += "**`" + e.getLabel() + "`" + argString + "** - " + e.getDesc() + "\n";
    })

    var embedMsg = {
        author: {
            name: "Ayuda",
            icon_url: "https://www.warcraftlogs.com/img/warcraft/header-logo.png"
        },
        color: 3447003,
        description: msg
    };

    return embedMsg;
}

function getCommandHelp(commandList, command) {
    // Display desired command help

    var msg = "";

    // Search for the command in the list
    var found = null;
    commandList.forEach(function(c) {
        if (c.getLabel() == command) found = c;
    });
    if (found != null) {
        // Command found
        msg = "";
        var args = found.getArgumentList();
        args.forEach(function(a) {
            var opt = "";
            if (a.optional) opt = "(Opcional) ";
            msg += a.tag + " " + opt + "- " + a.desc + "\n";
        });
    }

    var embedMsg = {
        author: {
            name: "Ayuda",
            icon_url: "https://www.warcraftlogs.com/img/warcraft/header-logo.png"
        },
        color: 3447003,
        description: msg
    };

    return embedMsg;
}

var help = new Command('ayuda', 'Consulta la ayuda.', getHelp);


// Exports section
module.exports = help;