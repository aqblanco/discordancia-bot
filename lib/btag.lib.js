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
    // Get user data from persistance
    return userInfoTable.findOne({ where: { user_id: userID } });
}

module.exports.setBTag = function(newBTag, userID) {
    const userInfoTable = dataConnections.userInfoTable;
    // Insert/update new info
    return userInfoTable.upsert({ user_id: userID, btag: newBTag});
}