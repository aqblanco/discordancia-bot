module.exports = (sequelize, DataTypes) => {
	return sequelize.define('motds', {
		server_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		motd: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	}, {
		timestamps: true,
	});
};