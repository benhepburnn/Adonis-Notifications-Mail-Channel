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
  setNotifiable(notifiables: NotifiableEmail | NotifiableEmail[]) {
    const emails = Array.isArray(notifiables)
      ? notifiables.map((notifiable) => notifiable.notificationGetEmail())
      : [notifiables.notificationGetEmail()]

    emails.forEach((email) => this.message.to(email))
    return this
  }
}
