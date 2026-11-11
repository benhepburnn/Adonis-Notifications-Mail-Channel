import { NotificationChannel, type Notification } from '@benhepburn/adonis-notifications'
import type { NotifiableEmail } from '@benhepburn/adonis-notifications/types'
import app from '@adonisjs/core/services/app'
import type { MailNotification } from './types.js'

export class MailChannel extends NotificationChannel {
  async send(notification: Notification<NotifiableEmail> & MailNotification): Promise<void> {
    const mailService = await app.container.make('mail.manager')

    const { mail } = await notification.toMail()

    mail.setNotifiable(notification.notifiable!)
    // Await delivery so notification-level retries receive SMTP failures.
    await mailService.send(mail)
  }
}
