// Requires section
const Plugin = require.main.require("./classes/plugin.class.js");
const Command = require.main.require("./classes/command.class.js");
const functions = require.main.require("./lib/functions.js");
const i18n = functions.i18n;

// Main code section
function linkUserBTag(fParams, args) {
    const btagLib = require.main.require("./lib/btag.lib.js");
    let userID = fParams.message.author.id;
    let userName = fParams.message.author.username;

    let btag = args[0];
    return new Promise((resolve, reject) => {
        if (!btagLib.validateBTag(btag)) {
            reject(new Error(i18n.__("plugin.manageUserBTag.link.error.notValid")));
        } else {
            btagLib.setBTag(btag, userID)
            .then (() => {
                resolve(i18n.__("plugin.manageUserBTag.link.ok", userName));
            })
            .catch(() => {
                reject(new Error(i18n.__("plugin.manageUserBTag.link.error.writeError", userName)));
            });
        }
    });
}

function unlinkUserBTag(fParams, args) {
    const btagLib = require.main.require("./lib/btag.lib.js");
    let userID = fParams.message.author.id;
    let userName = fParams.message.author.username;
    let btag = null;

    return new Promise((resolve, reject) => {
        btagLib.setBTag(btag, userID)
        .then (() => {
            resolve(i18n.__("plugin.manageUserBTag.unlink.ok", userName));
        })
        .catch(() => {
            reject(new Error(i18n.__("plugin.manageUserBTag.unlink.error", userName)));
        });
    });
}

let linkUserBTagArgs = [{
    "tag": i18n.__("plugin.manageUserBTag.link.args.btag.tag"),
    "desc": i18n.__("plugin.manageUserBTag.link.args.btag.desc"),
    "optional": false
}];

let commands = [];
let eventHandlers = [];

let linkUserBTagCmd = new Command('vincular', 'Link BattleTag', i18n.__('plugin.manageUserBTag.link.desc'), linkUserBTag, 0, [], linkUserBTagArgs);
commands.push(linkUserBTagCmd);
let unlinkUserBTagCmd = new Command('desvincular', 'Unlink BattleTag', i18n.__('plugin.manageUserBTag.unlink.desc'), unlinkUserBTag);
commands.push(unlinkUserBTagCmd);

let manageUserBTagPlugin = new Plugin('manageUserBTag', commands, eventHandlers);


// Exports section
module.exports = manageUserBTagPlugin;