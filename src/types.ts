import { Exception } from '@adonisjs/core/exceptions'
import { BaseMail } from '@adonisjs/mail'
import { MessageComposeCallback } from '@adonisjs/mail/types'
import { NotifiableEmail } from '@benhepburn/adonis-notifications/types'

export type MailMessage = {
  mail: NotificationMail | MessageComposeCallback
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

export class BulkSendNotSupportedException extends Exception {
  constructor() {
    super('Bulk sending emails is not supported', {
      code: 'E_BULK_SEND_NOT_SUPPORTED',
      status: 500,
    })
  }
}
