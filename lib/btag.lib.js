const dataConnections = require.main.require("./dataConnections.js");

module.exports.validateBTag = function(btag) {
    // From the naming policy: http://us.battle.net/support/en/article/battletag-naming-policy
    /*
    BattleTags must be between 3-12 characters long.
    Accented characters are allowed.
    Numbers are allowed, but a BattleTag cannot start with a number.
    Mixed capitals are allowed (ex: TeRrAnMaRiNe).
    No spaces or symbols are allowed (“, *, #, +, etc…).
     */
    const pattern = /^\D.{2,11}#\d{4}$/u;
    return pattern.test(btag);
}