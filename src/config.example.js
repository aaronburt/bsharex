/*

Once you configured the example then rename the file to config.js


*/

const cryto = require("crypto");

const config = {
    s3: {
        bucket: "",
        endpoint: "",
        secretAccessKey: "",
        accessKeyId: "",
        region: "",
    },

    cdn: {
        cname: "",
        scheme: "https",
    },

    generator: {
        filename: {
            length: 16
        }
    },

    expressjs: {
        port: 80,
        startupMessage: "[Express] started on port",
        authorization: ['']
    }

};

const authentication = {
    authorization: (input) => { return !!config.expressjs.authorization.includes(input); }
}

const generator = {
    expressStartMessage: () => { return `${config.expressjs.startupMessage} ${config.expressjs.port}` },
    timestamp: () => { return Math.round(Date.now() / 1000).toString() },
    random: { filename: () => { return cryto.randomBytes(Math.round(config.generator.filename.length / 2) || 8).toString("hex"); } }
};

module.exports = { config, generator, authentication };
