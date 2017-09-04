var dataConnections = require.main.require("./dataConnections.js");

module.exports.validateBTag = function(btag) {
    // From the naming policy: http://us.battle.net/support/en/article/battletag-naming-policy
    /*
    BattleTags must be between 3-12 characters long.
    Accented characters are allowed.
    Numbers are allowed, but a BattleTag cannot start with a number.
    Mixed capitals are allowed (ex: TeRrAnMaRiNe).
    No spaces or symbols are allowed (“, *, #, +, etc…).
     */
    var pattern = /^\D.{2,11}#\d{4}$/u;
    return pattern.test(btag);
}

module.exports.getBTag = function(userID) {
    const userInfoTable = dataConnections.userInfoTable;
    // Get server data from persistance
    var userInfo = userInfoTable.get(userID);
    var btag = typeof userInfo === 'undefined' ? null : userInfo.btag;

    // Fix for empty result (no motd set yet)
    btag = typeof btag === 'undefined' ? null : btag;
    return btag;
}

module.exports.setBTag = function(newBTag, userID) {
    const userInfoTable = dataConnections.userInfoTable;
    // Retrieve current info
    var userInfo = userInfoTable.get(userID);
    // Set new MotD
    var newInfo = {};
    // If records exists update them, else create new ones
    if (typeof userInfo != 'undefined') newInfo = userInfo;
    // Initialice motd object if necessary
    newInfo.btag = newBTag;
    // Write whole object
    userInfoTable.set(userID, newInfo);
}