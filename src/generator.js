const cryto = require("crypto");
const { config } = require("./config");
const { getApp, initializeApp } = require('firebase-admin/app');

const generate = {
    firebaseApp: () => {
        try {
            return getApp();
        } catch(err){
            return initializeApp(config)
        }
    },
    expressStartMessage: () => { return `${config.expressjs.startupMessage} ${config.expressjs.port}` },
    timestamp: () => { return Math.round(Date.now() / 1000).toString() },
    random: { filename: () => { return cryto.randomBytes(Math.round(config.generator.filename.length / 2) || 8).toString("hex"); } }
}

module.exports = generate;