import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    async sendInvitationEmail(userFromFullName: string, userToEmail: string, workspaceName: string) {

        this.mailerService
            .sendMail({
                to: userToEmail,
                from: `Invitation email<${process.env.EMAIL_USERNAME}>`,
                subject: 'Invitation to workspace',
                text: `${userFromFullName} invite you to join to the workspace: ${workspaceName}`,
            })
            .then(() => {
                console.log('Email sent');
            })
            .catch((e) => {
                console.log('Error sending email', e);
            });
    }
}
