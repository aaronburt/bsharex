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

        return res.render('index', { data: snapshot.data(), key: req.params.key, mime: snapshot.data().mimetype.split('/')[0] });
    } catch(err){
        console.log(err)
        return res.sendStatus(400);
    }
});

module.exports = previewRoute;