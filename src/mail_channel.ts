import { Notification, NotificationChannel } from '@benhepburn/adonis-notifications'
import { MailNotification } from './types.js'
import app from '@adonisjs/core/services/app'
import { MailService } from '@adonisjs/mail/types'
import { NotifiableEmail } from '@benhepburn/adonis-notifications/types'

export class MailChannel extends NotificationChannel {
  constructor() {
    super()
  }

  async send(notification: Notification<NotifiableEmail> & MailNotification): Promise<any> {
    const mailService: MailService = await app.container.make('mail.manager')

    const { mail, queue } = await notification.toMail()

    mail.setNotifiable(notification.notifiable!)
    queue ? await mailService.sendLater(mail) : await mailService.send(mail)
  }
}
