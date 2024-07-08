import { Notification, NotificationChannel } from '@benhepburn/adonis-notifications'
import { MailNotification, NotificationMail } from './types.js'
import mail from '@adonisjs/mail/services/main'

export class MailChannel extends NotificationChannel {
  constructor() {
    super()
  }

  async send(notification: Notification & MailNotification): Promise<any> {
    const mailMessage = notification.toMail()
    if (mailMessage.mail instanceof NotificationMail)
      mailMessage.mail.setNotifiable(notification.notifiable!)

    return (mailMessage.queue ? mail.sendLater : mail.send)(mailMessage.mail)
  }
}
