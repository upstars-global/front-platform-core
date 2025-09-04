import type { I18n } from 'vue-i18n';

export interface MessageSchema {
  [key: string]: string | string[] | MessageSchema | MessageSchema[];
}

export type I18nGlobal<T extends MessageSchema = MessageSchema> = I18n<
  { [key: string]: T },
  Record<string, unknown>,
  Record<string, unknown>,
  'en',
  false
>['global'];

export interface I18nInstance<T extends MessageSchema = MessageSchema> {
  instance: I18nGlobal<T> | null;
}
