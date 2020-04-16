// Requires section
var Plugin = require.main.require("./classes/plugin.class.js");
var Command = require.main.require("./classes/command.class.js");
var functions = require.main.require("./functions.js");
var i18n = functions.i18n;

// Main code section
function linkUserBTag(fParams, args, callback) {
    var btagLib = require.main.require("./lib/btag.lib.js");
    var userID = fParams.message.author.id;
    var userName = fParams.message.author.username;

    var btag = args[0];
    if (!btagLib.validateBTag(btag)) {
        callback(new Error(i18n.__("plugin.manageUserBTag.link.error.notValid")));
    } else {
        btagLib.setBTag(btag, userID)
        .then (() => {
            callback(null, i18n.__("plugin.manageUserBTag.link.ok", userName));
        })
        .catch(() => {
            callback(new Error(i18n.__("plugin.manageUserBTag.link.error.writeError", userName)));
        });
    }
}

function unlinkUserBTag(fParams, args, callback) {
    var btagLib = require.main.require("./lib/btag.lib.js");
    var userID = fParams.message.author.id;
    var userName = fParams.message.author.username;
    var btag = null;

    btagLib.setBTag(btag, userID)
    .then (() => {
        callback(null, i18n.__("plugin.manageUserBTag.unlink.ok", userName));
    })
    .catch(() => {
        callback(new Error(i18n.__("plugin.manageUserBTag.unlink.error", userName)));
    });
}

var linkUserBTagArgs = [{
    "tag": i18n.__("plugin.manageUserBTag.link.args.btag.tag"),
    "desc": i18n.__("plugin.manageUserBTag.link.args.btag.desc"),
    "optional": false
}];

var commands = [];
var eventHandlers = [];

var linkUserBTagCmd = new Command('vincular', i18n.__('plugin.manageUserBTag.link.desc'), linkUserBTag, 0, [], linkUserBTagArgs);
commands.push(linkUserBTagCmd);
var unlinkUserBTagCmd = new Command('desvincular', i18n.__('plugin.manageUserBTag.unlink.desc'), unlinkUserBTag);
commands.push(unlinkUserBTagCmd);

var manageUserBTag = new Plugin('manageUserBTag', commands, eventHandlers);


// Exports section
module.exports = manageUserBTag;