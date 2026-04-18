import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as nodemailer from 'nodemailer';
import { MembersService } from '../members/members.service';

@Injectable()
export class RemindersService {
  private readonly logger = new Logger(RemindersService.name);
  private transporter;

  constructor(private readonly membersService: MembersService) {
    // We'll configure Ethereal Email which is a fake SMTP service
    // Usually, you would get this from env vars
    nodemailer.createTestAccount().then((account) => {
      this.transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });
      this.logger.log('Ethereal Email transporter initialized.');
    });
  }

  // Runs every day at 8:00 AM. For development, you may use CronExpression.EVERY_MINUTE
  //@Cron(CronExpression.EVERY_DAY_AT_8AM)
  @Cron(CronExpression.EVERY_MINUTE) // Setting to every minute for quick testing, usually EVERY_DAY_AT_8AM
  async handleCron() {
    this.logger.debug('Running nightly reminder checks...');
    
    // Auto-cleanup functionality for stale database memory management.
    try {
      const deletedCount = await this.membersService.cleanupOldMembers();
      if (deletedCount > 0) {
        this.logger.log(`Pruned ${deletedCount} members expired for more than 90 days.`);
      }
    } catch (err) {
      this.logger.error('Failed sweeping expired members', err);
    }

    const expiringMembers = await this.membersService.findExpiringSoon();

    for (const member of expiringMembers) {
      if (member.email) {
        await this.sendEmailReminder(member.name, member.email, member.membershipEndDate);
      }
      if (member.phone) {
        this.sendSMSReminder(member.name, member.phone, member.membershipEndDate);
      }
    }
  }

  async sendEmailReminder(name: string, email: string, endDate: Date) {
    if (!this.transporter) return;

    const mailOptions = {
      from: '"Gym Admin" <admin@gym.com>',
      to: email,
      subject: 'Membership Expiring Soon!',
      text: `Hi ${name}, your gym membership is set to expire on ${new Date(endDate).toLocaleDateString()}. Please renew soon!`,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent to ${email}. Preview: ${nodemailer.getTestMessageUrl(info)}`);
    } catch (err) {
      this.logger.error(`Failed to send email to ${email}`, err);
    }
  }

  sendSMSReminder(name: string, phone: string, endDate: Date) {
    // MOCK SMS provider
    this.logger.log(`[SMS MOCK] -> Sent to ${phone}: "Hi ${name}, your gym membership expires on ${new Date(endDate).toLocaleDateString()}. Renew soon!"`);
  }
}
