// Requires section
var Plugin = require.main.require("./classes/plugin.class.js");
var Command = require.main.require("./classes/command.class.js");
var functions = require.main.require("./functions.js");
var i18n = functions.i18n;
const PersistentCollection = require('djs-collection-persistent');
const userInfoTable = new PersistentCollection({ name: "userInfo" });

// Main code section
function linkUserBTag(fParams, args, callback) {
    var userID = fParams.message.author.id;
    var btag = args[0];
    if (btag != "") {
        setBTag(btag, userID, userInfoTable);
    }
    console.log(btag);
    //callback(null, msg);
}


function getBTag(userID, table) {
    // Get server data from persistance
    var userInfo = table.get(userID);
    var btag = typeof userInfo === 'undefined' ? null : userInfo.btag;

    // Fix for empty result (no motd set yet)
    btag = typeof btag === 'undefined' ? null : btag;
    return btag;
}

function setBTag(newBTag, userID, table) {
    // Retrieve current info
    var userInfo = table.get(userID);
    // Set new MotD
    var newInfo = {};
    // If records exists update them, else create new ones
    if (typeof userInfo != 'undefined') newInfo = userInfo;
    // Initialice motd object if necessary
    newInfo.btag = newBTag;
    // Write whole object
    table.set(userID, newInfo);
}


var commands = [];
var eventHandlers = [];

var linkUserBTagCmd = new Command('vincular', i18n.__('plugin.randomMemberQuote.desc'), linkUserBTag);
commands.push(linkUserBTagCmd);

var manageUserBTag = new Plugin('manageUserBTag', commands, eventHandlers);


// Exports section
module.exports = manageUserBTag;