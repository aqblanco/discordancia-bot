const dataConnections = require.main.require("./dataConnections.js");
const userServerInfoTable = dataConnections.userServerInfoTable;

let UsersServersRepository = {
    getLastConnection: (user, server) => {
        return new Promise ((resolve, reject) => {
            userServerInfoTable.findOne({
                attributes : ['last_connection'],
                where: { 
                    user_id: user, 
                    server_id: server,
                }
            })
            .then(data => {
                let lastCon = null;
                if (data) {
                    lastCon = data.last_connection;
                }
                resolve(lastCon);
            })
            .catch(e => {
                reject(e);
            });
        })
    },

    setLastConnection: (user, server, time) => {
        return userServerInfoTable.upsert({
            user_id: user,
            server_id: server,
            last_connection: time,
        });
    },
}

module.exports = UsersServersRepository;