# AdonisJS Notifications - Mail Channel

This package requires @benhepburn/adonis-notifications and @adonisjs/mail.

## Install

Install peer dependencies @benhepburn/adonis-notifications and @adonisjs/mail, and then install this package from npm:

```sh
npm install @benhepburn/adonis-notifications-mail-channel
```

or

```sh
pnpm install @benhepburn/adonis-notifications-mail-channel
```

or

```sh
yarn add @benhepburn/adonis-notifications-mail-channel
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

Create a class-based or callback mail message as per the @adonisjs/mail docs.
Then create a new file in app/notifications e.g. app/notifications/sign_up_notification.ts:

```ts
import { Notification } from '@benhepburn/adonis-notifications';
import { MailMessage, MailNotification } from '@benhepburn/adonis-notifications-aws-sns-channel/types';

export default class SignUpNotification extends Notification implements MailNotification {
  constructor() {
    super();
  }

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

Version 3.0 requires `@benhepburn/adonis-notifications` 1.1 or later. The mail
channel always awaits `mail.send()`. SMTP failures propagate to the caller or,
when the notification is queued, to the durable worker for retry.

The mail-specific `queue` option has been removed. Remove it from `toMail()`
results, which now contain only `{ mail }`. To send in the background, queue the
whole notification through `notifications.queueNotification()` and configure a
queue adapter in the core package.

Publish/install the core package first, then this channel. Existing immediate
notifications keep their delivery behaviour after removing the obsolete option.
