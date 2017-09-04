const PersistentCollection = require('djs-collection-persistent');
// Tables
const userInfoTable = new PersistentCollection({ name: "userInfo" });
const serverInfoTable = new PersistentCollection({ name: "serverInfo" });

module.exports.serverInfoTable = serverInfoTable;
module.exports.userInfoTable = userInfoTable;