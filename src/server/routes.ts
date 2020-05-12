import * as express from 'express';
import * as Busboy from 'busboy';
import * as aws from 'aws-sdk';
import uploadToS3 from '../server/services/file-upload';
import * as env from 'dotenv';

env.config();

const router = express.Router();

router.get('/api/upload', function (req, res) {

    console.log('Trying to download file', 'b_101.pdf');
    aws.config.update(
        {
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY,
            region: 'us-east-2'
        }
    );
    var s3 = new aws.S3();
    var params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: 'b_101.pdf',
    };

    var fileStream = s3.getObject(params).createReadStream();
    fileStream.pipe(res);
});


router.post('/api/upload', function (req, res) {
    console.log(req);

    var busboy = new Busboy({ headers: req.headers });

    busboy.on('finish', function () {
        console.log('Upload finished');

        // Grabs your file object from the request.
        const file = req.body.file;
        console.log('grabbed file');

        // Begins the upload to the AWS S3
        // uploadToS3(file);
    });

    req.pipe(busboy);
    res.json({ msg: 'Uploaded file!' })
});

export default router;