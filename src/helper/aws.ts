// import { Injectable } from "@nestjs/common";
// import { ConfigService } from "@nestjs/config";
// import { S3 } from "aws-sdk";
// import {v4 as uuidv4} from 'uuid'


// @Injectable()
// export class uploadedFile{
//     constructor(
//         private readonly configService: ConfigService
//     ){}

//     async uploadFile(dataBuffer: Buffer, fileName: string) {
//         const s3 = new S3();
//         const uploadResult = await s3.upload({
//             Bucket: this.configService.get('AWS_BUCKET_NAME'),
//             Body: dataBuffer,
//             Key: `${uuidv4()}-${fileName}`,
//         }).promise();
//     }
// }
