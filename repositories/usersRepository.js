const dataConnections = require.main.require('./dataConnections.js');
const userInfoTable = dataConnections.userInfoTable;

const UsersRepository = {
	getBTag: userID => {
		// Get user data from persistance
		return new Promise ((resolve, reject) => {
			userInfoTable.findOne({
				attributes : ['btag'],
				where: {
					user_id: userID,
				},
			})
				.then (data => {
					let btag = null;
					if (data) {
						btag = data.btag;
					}
					resolve(btag);
				});
		});
	},

	setBTag: (newBTag, userID) => {
		// Insert/update new info
		return userInfoTable.upsert({
			user_id: userID,
			btag: newBTag,
		});
	},
};

module.exports = UsersRepository;