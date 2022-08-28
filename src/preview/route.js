const Axios = require('axios').default;
const { config } = require("../config");
const generate = require("../generator");
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const express = require("express");
const previewRoute = express.Router();


previewRoute.get("/:key", async(req, res) => {
    try {
        generate.firebaseApp();
        const db = getFirestore();

        const document = db.collection('bsharex').doc(req.params.key);
        const snapshot = await document.get(); 

        /* Check to see if the document the user has specified exists else or return a 404 */
        if(!snapshot.exists) return res.status(404).json({ "status": 404 }); 

        await document.update({ views: FieldValue.increment(1) });

        const payload = await Axios.get(`https://simple-storage-auth.bsharex.xyz/${config.s3.bucket}/${req.params.key}/json`, {
            "headers": {
                "token": config.token
            }
        })

        if(!(payload.status == 200)) throw new Error('Bucket 404 but database is 200')

        return res.render('index', { 
            presignedUrl: payload.data.url,
            data: snapshot.data(), 
            key: req.params.key, 
            mime: snapshot.data().mimetype.split('/')[0], 
            domain: config.domain.cdn.cname, 
            scheme: config.domain.cdn.scheme,
        });
    } catch(err){
        console.log(err)
        return res.sendStatus(400);
    }
});

module.exports = previewRoute;