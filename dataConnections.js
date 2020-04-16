/*const Enmap = require('enmap');
const EnmapLevel = require('enmap-level');

// Tables
const userInfoTable = new Enmap({
    provider: new EnmapLevel ({
        name: "userInfo",
    }),
});
const serverInfoTable = new Enmap({
    provider: new EnmapLevel ({
        name: "serverInfo",
    }),   
 });

module.exports.serverInfoTable = serverInfoTable;
module.exports.userInfoTable = userInfoTable;*/
const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: console.log,
	storage: 'data.sqlite',
});

const Users = sequelize.import('models/Users');
const Motd = sequelize.import('models/Motd');
const Servers = sequelize.import('models/Servers');
const UsersServers = sequelize.import('models/UsersServers');

module.exports.serverInfoTable = Servers;
module.exports.motdInfoTable = Motd;
module.exports.userInfoTable = Users;
module.exports.userServerInfotable = UsersServers;
