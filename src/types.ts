import { BaseMail } from '@adonisjs/mail'
import { MessageComposeCallback } from '@adonisjs/mail/types'

export type MailMessage = {
  mail: BaseMail | MessageComposeCallback
  sendLater?: boolean
}

export interface MailNotification {
  toMail: () => MailMessage
}
