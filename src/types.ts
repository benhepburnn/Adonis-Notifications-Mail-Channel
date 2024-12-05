import { BaseMail } from '@adonisjs/mail'
import { NotifiableEmail } from '@benhepburn/adonis-notifications/types'

export type MailMessage = {
  mail: NotificationMail
  queue?: boolean
}

export interface MailNotification {
  toMail: () => Promise<MailMessage>
}

export abstract class NotificationMail extends BaseMail {
  setNotifiable(notifiable: NotifiableEmail) {
    this.message.to(notifiable.notificationGetEmail())
    return this
  }
}
