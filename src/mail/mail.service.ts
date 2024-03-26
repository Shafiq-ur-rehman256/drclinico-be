import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {

    constructor(
        private mailerService: MailerService,
    ){}
    async sendOtpToDoc(mailObj: any) {
        const { to, otp_code } = mailObj;

        await this.mailerService.sendMail({
            to: to,
            subject: "DR-CLINICO OTP DOCTOR ACCOUNT VERIFICATION",
            bcc: process.env.NODE_MAILER_BCC,
            template: __dirname + '/templates/doctor_otp',
            context: {
                otp_code: otp_code
            }
        })

    }

    async sendOtpToPatient(mailObj: any) {
        const { to, otp_code } = mailObj;

        await this.mailerService.sendMail({
            to: to,
            subject: "DR-CLINICO OTP PATIENT ACCOUNT VERIFICATION",
            bcc: process.env.NODE_MAILER_BCC,
            template: __dirname + '/templates/doctor_otp',
            context: {
                otp_code: otp_code
            }
        })

    }
}
