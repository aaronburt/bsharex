const { config, generator } = require("./config");
const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');
const multer = require('multer');
const path = require("path");

const { accessKeyId, secretAccessKey, region, endpoint, bucket } = config.s3;

const s3 = new S3Client({ 
    credentials: { 
        accessKeyId: accessKeyId, 
        secretAccessKey: secretAccessKey 
    }, 
    region: region,
    endpoint: endpoint,
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: bucket,
        contentDisposition: function(req, file, cb) { cb(null, `inline; filename="${file.originalname}"`) },
        key: function (req, file, cb) { cb(null, `${generator.random.filename()}`) },
        contentType: function (req, file, cb){ cb(null, file.mimetype) }
    })
});

module.exports = upload;
