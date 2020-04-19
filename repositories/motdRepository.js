const dataConnections = require.main.require("./dataConnections.js");
const motdInfoTable = dataConnections.motdInfoTable;

let MotDRepository = {
    getMotD: (server) => {
        return motdInfoTable.findOne({
            attributes : ['motd', 'updatedAt'],
            where: { 
                server_id: server,
            }
        })
    },

    setMotD: (server, motd) => {
        return motdInfoTable.upsert({
            server_id: server,
            motd: motd,
        });
    },
}

module.exports = MotDRepository;