import { Notification, NotificationChannel } from '@benhepburn/adonis-notifications'
import { MailNotification } from './types.js'
import mail from '@adonisjs/mail/services/main'

export class MailChannel extends NotificationChannel {
  constructor() {
    super()
  }

  async send(notification: Notification & MailNotification): Promise<any> {
    const mailMessage = notification.toMail()
    return (mailMessage.sendLater ? mail.sendLater : mail.send)(mailMessage.mail)
  }
}
