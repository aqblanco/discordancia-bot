const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'data.sqlite',
});

const Users = sequelize.import('models/Users');
const Motd = sequelize.import('models/Motd');
const Servers = sequelize.import('models/Servers');
const UsersServers = sequelize.import('models/UsersServers');

module.exports.serverInfoTable = Servers;
module.exports.motdInfoTable = Motd;
module.exports.userInfoTable = Users;
module.exports.userServerInfoTable = UsersServers;
