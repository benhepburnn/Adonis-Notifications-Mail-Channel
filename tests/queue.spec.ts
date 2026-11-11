import { IgnitorFactory } from '@adonisjs/core/factories'
import type { ApplicationService } from '@adonisjs/core/types'
import { defineConfig as defineMailConfig, MailResponse } from '@adonisjs/mail'
import type { NodeMailerMessage } from '@adonisjs/mail/types'
import {
  defineConfig as defineNotificationsConfig,
  Notification,
} from '@benhepburn/adonis-notifications'
import type { NotifiableEmail } from '@benhepburn/adonis-notifications/types'
import { test } from '@japa/runner'
import { MailChannel } from '../index.js'
import { NotificationMail, type MailNotification } from '../src/types.js'

const BASE_URL = new URL('./tmp/', import.meta.url)
const recipients = ['first@example.test', 'second@example.test']
const notifiables = recipients.map((email) => ({ notificationGetEmail: () => email }))

class WelcomeMail extends NotificationMail {
  prepare() {
    this.message.subject('Welcome').text('Thanks for joining.')
  }
}

class WelcomeNotification extends Notification<NotifiableEmail> implements MailNotification {
  via() {
    return ['mail']
  }

  async toMail() {
    return { mail: new WelcomeMail() }
  }
}

test.group('Mail delivery', (group) => {
  let app: ApplicationService
  let delivered: NodeMailerMessage[]
  let queued: number
  let failure: boolean

  group.setup(async () => {
    const ignitor = new IgnitorFactory()
      .withCoreConfig()
      .withCoreProviders()
      .merge({
        rcFileContents: {
          providers: [
            () => import('@adonisjs/mail/mail_provider'),
            () => import('@benhepburn/adonis-notifications/notifications_provider'),
          ],
        },
        config: {
          mail: defineMailConfig({
            default: 'test',
            from: 'sender@example.test',
            mailers: {
              test: () => ({
                async send(message: NodeMailerMessage) {
                  if (failure) throw new Error('SMTP unavailable')
                  delivered.push(message)
                  return new MailResponse(
                    'test-message',
                    { from: 'sender@example.test', to: recipients },
                    {}
                  )
                },
              }),
            },
          }),
          notifications: defineNotificationsConfig({ channels: { mail: MailChannel } }),
        },
      })
      .create(BASE_URL)
    app = ignitor.createApp('web')
    await app.init()
    await app.boot()
    const mail = await app.container.make('mail.manager')
    mail.setMessenger(() => ({
      async queue() {
        queued++
      },
    }))
    return () => app.terminate()
  })

  group.each.setup(() => {
    delivered = []
    queued = 0
    failure = false
  })

  test('delivers a notification to every recipient without a second queue', async ({ assert }) => {
    const notifications = await app.container.make('notifications')
    await notifications.sendNotification(notifiables, new WelcomeNotification())
    assert.lengthOf(delivered, 1)
    assert.deepEqual(delivered[0].to, recipients)
    assert.equal(queued, 0)
  })

  test('propagates SMTP failures to the caller', async ({ assert }) => {
    failure = true
    const notification = new WelcomeNotification()
    notification.to(notifiables)
    await assert.rejects(() => new MailChannel().send(notification), /SMTP unavailable/)
    assert.lengthOf(delivered, 0)
    assert.equal(queued, 0)
  })
})
