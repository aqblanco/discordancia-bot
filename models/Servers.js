module.exports = (sequelize, DataTypes) => {
	return sequelize.define('servers', {
		server_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
	}, {
		timestamps: true,
	});
};