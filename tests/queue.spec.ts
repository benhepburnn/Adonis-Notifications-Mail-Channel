import type {} from '@adonisjs/mail/mail_provider'
import { test } from '@japa/runner'
import { IgnitorFactory } from '@adonisjs/core/factories'
import type { ApplicationService } from '@adonisjs/core/types'
import type { MailChannel } from '../src/mail_channel.js'

const BASE_URL = new URL('./tmp/', import.meta.url)

test.group('Mail delivery', (group) => {
  let app: ApplicationService
  let channel: MailChannel
  let sent: number
  let queued: number
  let failure: boolean

  group.setup(async () => {
    const ignitor = new IgnitorFactory()
      .withCoreConfig()
      .withCoreProviders()
      .create(BASE_URL, {
        importer: (filePath) =>
          import(filePath.startsWith('.') ? new URL(filePath, BASE_URL).href : filePath),
      })
    app = ignitor.createApp('web')
    await app.init()
    await app.boot()
    const { MailChannel: Channel } = await import('../src/mail_channel.js')
    channel = new Channel()
    app.container.bindValue('mail.manager', {
      async send() {
        if (failure) throw new Error('SMTP unavailable')
        sent++
      },
      async sendLater() {
        queued++
      },
    } as any)
    return () => app.terminate()
  })
  group.each.setup(() => {
    sent = 0
    queued = 0
    failure = false
  })

  function notification() {
    return {
      notifiable: [{ notificationGetEmail: () => 'user@example.test' }],
      async toMail() {
        return { mail: { setNotifiable() {} } }
      },
    } as any
  }

  test('sends directly without a second queue', async ({ assert }) => {
    await channel.send(notification())
    assert.equal(sent, 1)
    assert.equal(queued, 0)
  })
  test('propagates SMTP failures to the caller', async ({ assert }) => {
    failure = true
    await assert.rejects(() => channel.send(notification()), /SMTP unavailable/)
    assert.equal(sent, 0)
    assert.equal(queued, 0)
  })
})
