import sgMail from '@sendgrid/mail';
import { envVars } from '@/config';
import type { IResultAndError } from '@/interfaces';
import { ApiErrors } from '@/response_builder';
import logger from './logger';

sgMail.setApiKey(envVars.email.smtp.auth.pass || '');

export type IEmailOptions = {
  html: string;
  subject?: string;
  attachment?: string;
};
class EmailService {
  public static async sendMail(emailOptions: IEmailOptions): Promise<IResultAndError> {
    try {
      const { html, attachment, subject } = emailOptions;
      let msg: sgMail.MailDataRequired;
      const requiredProperties: Omit<sgMail.MailDataRequired, 'content'> = {
        to: envVars.email.from,
        from: envVars.email.from,
        subject: subject || 'Sample Email',
      };
      if (attachment) {
        msg = {
          ...requiredProperties,
          html,
          attachments: [
            {
              content: attachment,
              filename: 'attachment.xlsx',
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              disposition: 'attachment',
            },
          ],
        };
      } else {
        msg = {
          ...requiredProperties,
          html,
        };
      }

      const mailRes = await sgMail.send(msg);
      logger.info(mailRes);
      if (!mailRes) {
        const err = ApiErrors.newBadRequestError('Mail not Sent');
        return { result: null, error: err };
      }
      return { result: mailRes, error: null };
    } catch (err) {
      logger.err('# Error while sending mail! in EmailService.sendMail()', err);
      return {
        error: ApiErrors.newInternalServerError('Something went wrong!'),
        result: null,
      };
    }
  }
}

export default EmailService;
