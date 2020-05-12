import * as aws from 'aws-sdk';
import * as env from 'dotenv';

env.config();

function uploadToS3(file: any) {

    let s3bucket = new aws.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
    });
    s3bucket.createBucket(function () {
        var params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: file.name,
            Body: file.data
        };
        s3bucket.upload(params, function (err: Error, data: aws.S3.ManagedUpload.SendData) {
            if (err) {
                console.log('error in callback');
                console.log(err);
            }
            console.log('success');
            console.log(data);
        });
    });
}




export default uploadToS3;