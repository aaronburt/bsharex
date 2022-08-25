/* Essentials */ 
const { config, authentication } = require("./src/config");
const generate = require('./src/generator');

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

const upload = require("./src/multer");

const v1Api = require("./src/api/v1/route");
const previewRoute = require("./src/preview/route")


const { serviceAccount } = config.firebase;

const express = require("express");
const app = express();

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

app.set('view engine', 'ejs');
app.use('/preview/', previewRoute);

/* Authentication */ 
app.use((req, res, next) => {
    if(!authentication.authorization(req.headers.authorization)) return res.status(400).json({ status: 401, err: "authorization invalid" });
    next();
});

/* Handled in the /src/api dir */ 
app.use('/api/v1', v1Api);

app.post('/upload', upload.single("file"), async(req, res) => {
    try {
        const { cname, scheme } = config.cdn;
        if(!req?.file?.originalname) return res.sendStatus(400);

        console.log(req.file)

        const { originalname, mimetype, key, size, acl, location } = req.file;
        await db.collection('bsharex').doc(key).set({ originalname, mimetype, size, location, key, acl, "views": 1 });
        return res.status(200).json({ status: 200, resource: `${scheme}://${cname}/preview/${req.file.key}` });
    } catch(err){
        return res.status(400).json({ status: 400, err: err })
    }
});

app.all("*", (req, res) => { return res.status(400).json({ status: 404, err: "route doesn't exist" }); });

app.listen(config.expressjs.port, () => { console.log(generate.expressStartMessage()) });
