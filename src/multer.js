const generate = require("./generator");
const { config } = require("./config");
const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');
const multer = require('multer');
const path = require("path");

const s3 = new S3Client({ ...config.s3.config });

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: config.s3.bucket,
        contentDisposition: function(req, file, cb) { cb(null, `inline; filename="${file.originalname}"`) },
        key: function (req, file, cb) { cb(null, `${generate.random.filename()}`) },
        contentType: function (req, file, cb){ cb(null, file.mimetype) }
    })
});

module.exports = upload;
