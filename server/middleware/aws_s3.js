const AWS = require('aws-sdk');
const config = require('../config');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
// Configure AWS SDK
AWS.config.update({
  accessKeyId: config.aws.accessKeyId, // Set these in your environment variables
  secretAccessKey: config.aws.secretAccessKey,
  region: 'us-east-1' // e.g., 'us-west-2'
});

const s3 = new AWS.S3();


const uploadUserFileToS3 = (file, userId) => {
    const params = {
      Bucket: config.aws.s3Bucket, // Your S3 bucket name
      Key: `userfiles/${userId}/${path.basename(file.originalname)}`, // File name you want to save as in S3
      Body: fs.createReadStream(file.path),
      ContentType: file.mimetype,
   };
  
    return s3.upload(params).promise();
  };
  const uploadLogo = (file) => {
    const id = uuidv4()
    const params = {
    
      Bucket: config.aws.s3Bucket, // Your S3 bucket name
      Key: `logo/${id}-${path.basename(file.originalname)}`, // File name you want to save as in S3
      Body: fs.createReadStream(file.path),
      ContentType: file.mimetype,
   };
  
    return s3.upload(params).promise();
  };
const getUrl = (filename, userId)=>{
    try {
        const params = {
          Bucket: process.env.AWS_S3_BUCKET,
          Key:  `userfiles/${userId}/${filename}`,
        };
    
        // Generate a pre-signed URL
        const url = s3.getSignedUrl('getObject', params);
        return url;
      } catch (error) {
        console.error('Error generating pre-signed URL:', error);
        res.status(500).send('Error generating pre-signed URL.');
      }
}
const getFile = (filename, userId)=>{
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key:  `userfiles/${userId}/${filename}`,
  };
  return s3.getObject(params).promise();

}
module.exports = {
    uploadUserFileToS3,
    getUrl,
    uploadLogo,
    getFile
}