import { createPromiseHook } from '../../../shared/helpers/config/createPromiseHook';

export const localeUpdateHook = createPromiseHook<{
  locale: string;
}>({
  hookError: 'LOCALE_UPDATE_HOOK_ERROR',
  hookNotExistError: 'LOCALE_UPDATE_HOOK_NOT_EXIST_ERROR',
});
