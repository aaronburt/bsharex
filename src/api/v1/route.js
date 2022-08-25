const generate = require("../../generator");
const { getFirestore } = require('firebase-admin/firestore');
const express = require("express");
const router = express.Router();

router.get("/get/:key", async(req, res) => {
    try {    
        generate.firebaseApp();
        const db = getFirestore();

        const snapshot = await db.collection('bsharex').doc(req.params.key).get();
        /* Check to see if the document the user has specified exists else or return a 404 */
        if(!snapshot.exists) return res.status(404).json({ "status": 404 }); 

        /* Return the document to the user with a status and the "time of response" */
        return res.status(200).json({ "status": 200, "tor": Date.now(), ...snapshot.data() });
    } catch(err){
        return res.status(400).json({ "status": 400 });
    }
})

module.exports = router;