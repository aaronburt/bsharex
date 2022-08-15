const path = require("path");
const { config, generator, authentication } = require("./src/config");
const upload = require("./src/multer");
const express = require("express");
const app = express();

app.use((req, res, next) => {
    if(!authentication.authorization(req.headers.authorization)) return res.status(400).json({ status: 401, err: "authorization invalid" });
    next();
});

app.post('/upload', upload.single("file"), (req, res) => {
    try {
        const { cname, scheme } = config.cdn;
        if(!req?.file?.originalname) return res.sendStatus(400);
        return res.status(200).json({ status: 200, resource: `${scheme}://${cname}/${req.file.key}` });
    } catch(err){
        return res.status(400).json({ status: 400, err: err })
    }
});

app.all("*", (req, res) => { return res.status(400).json({ status: 404, err: "route doesn't exist" }); });

app.listen(config.expressjs.port, () => { console.log(generator.expressStartMessage()) });
