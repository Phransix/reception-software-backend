
import { Injectable } from "@nestjs/common";
import * as fs from 'fs';
import {v4 as uuidv4} from 'uuid'
var Buffer = require('buffer/').Buffer

@Injectable() 
export class orgImageUploadProfile {

    async uploadOrganizationImage(base64: string){
      const organizationId = uuidv4();
      const path = `public/organizationProfiles/${organizationId}.webp`;
      const base64Data = new Buffer.from(
        base64.replace(/^data:image\/\w+;base64,/, ''),
        'base64',
      );
  
      try {
        fs.writeFileSync(path, base64Data, { encoding: 'base64' });
        return path;
      } catch (e) {
        // throw new Error('Failed to upload image.');
      }
    }


    async unlinkFile(filePath: any) {
      try {
        fs.unlink(filePath, (err) => {
          if (err) throw err;
          console.log(`${filePath} was deleted`);
        });
      } catch (error) {}
    }

  }


