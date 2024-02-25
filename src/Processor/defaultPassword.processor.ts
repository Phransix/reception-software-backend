import { MailerService } from "@nestjs-modules/mailer";
import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";


import { Logger } from '@nestjs/common';
import { getFullTemplatePath } from "src/mail.module";


@Processor('defaultPassword')
export class defaultPaswordProcessor{
    private readonly logger = new Logger(defaultPaswordProcessor.name);
    constructor (private mailService: MailerService){}
    

    @Process('default_password')
    async handleTranscode(job: Job) {
        this.logger.debug('Start transcoding...');
        let details = job.data?.details;
        // console.log(details?.email)

        let mail_path = getFullTemplatePath('defaultPassword');
        try {
            await this.mailService.sendMail({
                from: process.env.MAIL_FROM_ADDRESS,
                to: details?.email,
                subject: 'Default Password',
                template:mail_path,
                context: {
                    email : details?.email,
                    org_name: details?.org_name,
                    link: details?.link,
                    year: details?.year,
                    password:details?.password
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




