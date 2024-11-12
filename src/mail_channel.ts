import { Notification, NotificationChannel } from '@benhepburn/adonis-notifications'
import { MailNotification, NotificationMail } from './types.js'
import app from '@adonisjs/core/services/app'
import { MailService } from '@adonisjs/mail/types'
import { NotifiableEmail } from '@benhepburn/adonis-notifications/types'

export class MailChannel extends NotificationChannel {
  constructor() {
    super()
  }

  async send(notification: Notification<NotifiableEmail> & MailNotification): Promise<any> {
    const mail: MailService = await app.container.make('mail.manager')

    const mailMessage = await notification.toMail()
    if (mailMessage.mail instanceof NotificationMail)
      mailMessage.mail.setNotifiable(notification.notifiable!)

    return mailMessage.queue ? mail.sendLater(mailMessage.mail) : mail.send(mailMessage.mail)
  }
}
