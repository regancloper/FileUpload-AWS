import * as express from 'express';
import * as multer from 'multer';
import * as multerS3 from 'multer-s3';
import * as aws from 'aws-sdk';
import * as env from 'dotenv';

env.config();

aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY,
});
const s3 = new aws.S3();

const upload = multer({
    storage: multerS3({
        s3,
        bucket: process.env.AWS_BUCKET_NAME,
        key: (req, file, cb) => {
            cb(null, `${file.originalname}-${Date.now()}`)
        }
    })
});

const router = express.Router();

router.get('/api/upload', function (req, res) {
    const fileStream = s3.getObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: 'Petition (1).pdf-1589253523747',
    }).createReadStream();
    fileStream.pipe(res);
});


router.post('/api/upload', upload.single('file'), (req, res) => {
    console.log(req.file);
   //console.log(req.body);
    res.json({ msg: 'Uploaded file!' })
});

export default router;