import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as AWS from 'aws-sdk';
var Buffer = require('buffer/').Buffer;

@Injectable()
export class orgImageUploadProfile {
  private s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  async uploadOrganizationImage(
    base64: string,
  ): Promise<{ profilePhoto: string; imageUrl: string }> {
    const userId = uuidv4();
    const params: AWS.S3.PutObjectRequest = {
      Bucket: process.env.AWS_BUCKET_NAME + `/organizationProfiles`,
      Key: `${userId}.webp`, // Modify the path accordingly
      Body: Buffer.from(
        base64.replace(/^data:image\/\w+;base64,/, ''),
        'base64',
      ),
      ContentType: 'image/webp', // Modify content type based on your image type
    };

    try {
      let logData = await this.s3.upload(params).promise();
      console.log(logData);

      const photo = {
        key: params.Key,
        locaton: logData.Location,
      };

      const savedPhoto = {
        profilePhoto: photo?.key,
        imageUrl: photo?.locaton,
      };
      // console.log(savedPhoto)

      // Returning the S3 path
      return savedPhoto;
    } catch (e) {
      console.error('Failed to upload image.', e);
      throw new Error('Failed to upload image.');
    }
  }

  async unlinkFile(filePath: string) {
    const params: AWS.S3.DeleteObjectRequest = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: filePath.replace(process.env.AWS_BUCKET_URL, ''), // Assuming filePath contains the full S3 URL
    };

    try {
      await this.s3.deleteObject(params).promise();
      console.log(`${filePath} was deleted from S3`);
    } catch (error) {
      console.error('Failed to delete file from S3.', error);
    }
  }
}
