
import { Injectable } from "@nestjs/common";
import * as fs from 'fs';
import {v4 as uuidv4} from 'uuid'

@Injectable() 
export class ImageUploadProfile {
    async uploadUserImage(base64: string): Promise<string> {
      const userId = uuidv4();
      const path = `./public/organizationProfiles/${userId}.webp`;
      const base64Data = Buffer.from(
        base64.replace(/^data:image\/\w+;base64,/, ''),
        'base64',
      );
  
      try {
        fs.writeFileSync(path, base64Data, { encoding: 'base64' });
        return path;
      } catch (e) {
        throw new Error('Failed to upload image.');
      }
    }
  }


