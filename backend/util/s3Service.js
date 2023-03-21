const { S3 } = require("aws-sdk");
require('aws-sdk/lib/maintenance_mode_message').suppress = true;
const uuid = require("uuid").v4;

exports.uploadFile = async (files) => {
  const s3 = new S3();

  const params = files.map((file) => {
    return {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${uuid()}-lenzz${file.originalname}`,
      Body: file.buffer,
    };
  });

  return await Promise.all(params.map((param) => s3.upload(param).promise()));
};

exports.find = async () => {
  const s3 = new S3();
  try {
    const data = await s3.listObjectsV2({
      Bucket: process.env.AWS_BUCKET_NAME,
      Prefix: "uploads/"
    }).promise();
    console.log(data.Contents);
    return (data.Contents)
  } catch (error) {
    console.log(error);
  }
}

exports.deleteOne = async (key) => {
  try {
    const s3 = new S3();
    await s3.deleteObject({ Bucket: process.env.AWS_BUCKET_NAME, Key: key }).promise();
    return ({ "status": "deleted" })
  } catch (error) {
    console.log(error);
    return (error);
  }
}
exports.downloadOne = async (key) => {
  try {
    const s3 = new S3();
    const params = { Bucket: process.env.AWS_BUCKET_NAME, Key: key };
    const data = await s3.getObject(params).promise();
    const url = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
    console.log(url);
    return ({ "url": url });
  } catch (error) {
    return (error)
  }
}