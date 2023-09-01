
import { Injectable } from "@nestjs/common";
import * as fs from 'fs';
import {v4 as uuidv4} from 'uuid'
var Buffer = require('buffer/').Buffer

@Injectable() 
export class imageUploadProfile {

    async uploadUserImage(base64: string){
      const userId = uuidv4();
      const path = `public/userProfiles/${userId}.webp`;
      const base64Data =new Buffer.from(
        base64.replace(/^data:image\/\w+;base64,/, ''),
        'base64',
      );
  
      try {
        fs.writeFileSync(path, base64Data, { encoding: 'base64' });

        return path;
      } catch (e) {
        // console.log(e);
        
        // throw new Error('Failed to upload image.');
      }
    }
  }


  

