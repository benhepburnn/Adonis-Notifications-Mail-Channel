export type NotificationsAwsSnsChannelConfig = {
  awsRegion: string
  awsAccessKeyId?: string
  awsSecretAccessKey?: string
  awsSessionToken?: string
}

export type SnsSmsMessage = {
  message: string
  to: string
}

export interface SnsSmsNotification {
  toSnsSms: () => SnsSmsMessage
}
