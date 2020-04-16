module.exports = (sequelize, DataTypes) => {
	return sequelize.define('usersServers', {
		user_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		server_id: {
			type: DataTypes.STRING,
			primary_key: true,
		},
		last_connection: {
			type: DataTypes.DATE
		}
	}, {
		timestamps: true,
	});
};