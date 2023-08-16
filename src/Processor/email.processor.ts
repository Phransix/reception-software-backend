import { MailerService } from "@nestjs-modules/mailer";
import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";


import { Logger } from '@nestjs/common';


@Processor('emailVerification')
export class EmailProcessor{
    private readonly logger = new Logger(EmailProcessor.name);
    constructor (private mailService: MailerService){}
    

    @Process('verify_mail')
    async handleTranscode(job: Job) {
        this.logger.debug('Start transcoding...');
        let details = job.data?.details;
        // console.log(details?.email)
        try {
            await this.mailService.sendMail({
                from: process.env.MAIL_FROM_ADDRESS,
                to: details?.email,
                subject: 'Account Verification',
                template: 'Emailverification',
                context: {
                    email : details?.email,
                    org_name: details?.org_name,
                    link: details?.link,
                    year: details?.year
                }
            }).then((r) => {
                console.log(r, 'email is sent');
                this.logger.debug('Transcoding completed');
            }).catch((e) => {
                console.log(e, 'error sending email');
                this.logger.debug('Transcoding Failed');
            })
           
        } catch (error) {
            console.log(error);
        }

    }
}