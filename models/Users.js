module.exports = (sequelize, DataTypes) => {
	return sequelize.define('users', {
		user_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		btag: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	}, {
		timestamps: true,
	});
};