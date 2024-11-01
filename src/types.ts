import { BaseMail } from '@adonisjs/mail'
import { MessageComposeCallback } from '@adonisjs/mail/types'
import { Notifiable } from '@benhepburn/adonis-notifications/types'

export type MailMessage = {
  mail: NotificationMail | MessageComposeCallback
  queue?: boolean
}

export interface MailNotification {
  toMail: () => Promise<MailMessage>
}

export abstract class NotificationMail extends BaseMail {
  setNotifiable(notifiable: Notifiable) {
    this.message.to(notifiable.notificationGetEmail())
    return this
  }
}
