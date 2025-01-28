import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import * as Util from 'src/utils/index';
import { props } from 'bluebird';
import { log } from 'console';


export class EmailService {
    constructor(
        @InjectQueue('emailVerification') private readonly emailQueue: Queue,
        @InjectQueue('defaultPassword') private readonly defaultPasswordemailQueue: Queue

    ) { }

    async sendMailNotification(props) {
        let {org_id,email,org_name,password} =props
        
        try {
            let token = Util.createEmailToken({ email, org_id });
            let details = {
                email,
                org_name,
                link: process.env.FRONT_END_URL + '/'+ token,
                year: new Date().getFullYear(),
                password:password

            }

            return await this.emailQueue.add(
                'verify_mail',
                {
                    details,
                },
                { delay: 1000 },
            );

        } catch (error) {

        }
    }


    async sendDeaultPassword(props) {
        let {org_id,email,org_name,password} =props
      //  console.log(password);
        
        try {
            let token = Util.createEmailToken({ email, org_id });
            let details = {
                email,
                org_name,
                link: process.env.FRONT_END_URL + '/'+ token,
                year: new Date().getFullYear(),
                password:password

            }

            return await this.defaultPasswordemailQueue.add(
                'default_password',
                {
                    details,
                },
                { delay: 5000 },
            );

        } catch (error) {

        }
    }





}
