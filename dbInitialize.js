// Create the DB tables (just once)
const dataConnections = require.main.require('./dataConnections.js');

dataConnections.serverInfoTable.sync();
dataConnections.motdInfoTable.sync();
dataConnections.userInfoTable.sync();
dataConnections.userServerInfotable.sync();