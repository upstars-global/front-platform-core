import { createPromiseHook } from '../../../shared/helpers/config/createPromiseHook';

export const fetchUserDataHook = createPromiseHook<{ isInit?: boolean }>({
  hookError: 'FETCH_USER_DATA_HOOK_ERROR',
});

export const afterProfileDataLoadedHook = createPromiseHook({
  hookError: 'AFTER_PROFILE_DATA_LOADED_HOOK_ERROR',
});

export const clearUserDataHook = createPromiseHook({
  hookError: 'CLEAR_USER_DATA_HOOK_ERROR',
});
