import { createPromiseHook } from '../../../shared/helpers/config/createPromiseHook';

export const USER_DATA_HOOK_ERRORS = {
  FETCH_USER_DATA: 'FETCH_USER_DATA_HOOK_ERROR',
  AFTER_PROFILE_DATA_LOADED: 'AFTER_PROFILE_DATA_LOADED_HOOK_ERROR',
  CLEAR_USER_DATA: 'CLEAR_USER_DATA_HOOK_ERROR',
} as const;

export const fetchUserDataHook = createPromiseHook<{ isInit?: boolean }>({
  hookError: USER_DATA_HOOK_ERRORS.FETCH_USER_DATA,
});

export const afterProfileDataLoadedHook = createPromiseHook({
  hookError: USER_DATA_HOOK_ERRORS.AFTER_PROFILE_DATA_LOADED,
});

export const clearUserDataHook = createPromiseHook({
  hookError: USER_DATA_HOOK_ERRORS.CLEAR_USER_DATA,
});
