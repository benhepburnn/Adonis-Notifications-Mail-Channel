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

  toMail(): MailMessage {
    return {
      mail: new SignUpMail(),
      // OR
      mail: (message) => message.to(this.notifiable!.notificationGetEmail())...
      
      sendLater: true, // Optional; sends the mail queued instead of immediately
    };
  }
}
```
