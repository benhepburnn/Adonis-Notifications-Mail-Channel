# AdonisJS Notifications - Mail Channel

## Compatibility

| AdonisJS | `@adonisjs/mail` | `@benhepburn/adonis-notifications` | Node.js |
| --- | --- | --- | --- |
| 7 | 10 | 2.1+ | 24+ |
| 6 | 9 | 1.1+ or 2 | As required by your AdonisJS v6 release |

## Install

Install the compatible mail and notifications packages in your application, then
add this channel:

```sh
npm install @benhepburn/adonis-notifications-mail-channel
```

## Configuration

[Configure @adonisjs/mail as required](https://docs.adonisjs.com/guides/digging-deeper/mail), then add the mail channel to config/notifications.ts.

```ts
import { MailChannel } from '@benhepburn/adonis-notifications-mail-channel';
...

const notificationsConfig = defineConfig({
  channels: {
    ...
    mail: MailChannel,
  },
});
```

## Usage

Create a class-based mail that extends `NotificationMail` from the channel’s
`/types` export. Return an instance from your notification’s `toMail()` method.

```ts
import { Notification } from '@benhepburn/adonis-notifications';
import type { NotifiableEmail } from '@benhepburn/adonis-notifications/types';
import type { MailMessage, MailNotification } from '@benhepburn/adonis-notifications-mail-channel/types';
import SignUpMail from '../mails/sign_up_mail.js';

export default class SignUpNotification extends Notification<NotifiableEmail> implements MailNotification {
  via(): string[] {
    return ['mail'];
  }

  async toMail(): Promise<MailMessage> {
    return {
      mail: new SignUpMail(),
    };
  }
}
```

## Durable notification delivery

The mail channel always awaits `mail.send()`. SMTP failures propagate to the caller or,
when the notification is queued, to the durable worker for retry.

The mail-specific `queue` option has been removed. Remove it from `toMail()`
results, which now contain only `{ mail }`. To send in the background, queue the
whole notification through `notifications.queueNotification()` and configure a
queue adapter in the core package.
