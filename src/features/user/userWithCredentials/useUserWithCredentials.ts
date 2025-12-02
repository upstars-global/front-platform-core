import { useUserProfileStore } from '../../../entities/user/store/userProfileStore';

/**
 * Composable that provides helper to ensure query params `userID` and `email`
 * are populated with current user credentials.
 *
 * Behavior:
 * - If `userID`/`email` params are present, their values are overwritten.
 * - If they are absent, they will be added (when corresponding data exists).
 * - Legacy placeholder replacement is no longer supported.
 */
export function useUserWithCredentials() {
  const userProfileStore = useUserProfileStore();

  function fillUrlWithUserCredentials(rawUrl: string): string {
    // Fast exit
    if (!rawUrl || typeof rawUrl !== 'string') return rawUrl;

    const parsed = new URL(rawUrl);

    const userId = userProfileStore.userId || '';
    const email = userProfileStore.userEmail || '';

    const params = parsed.searchParams;

    // Set/overwrite param values for known keys
    const paramMap: Record<string, string> = {
      userID: userId,
      email: email,
    };
    for (const [paramKey, replacement] of Object.entries(paramMap)) {
      if (!replacement) continue; // skip if we don't have a value to set
      // Always set: will overwrite if exists, add if missing
      params.set(paramKey, replacement);
    }

    // Return string; preserve original input format if it was relative
    const result = parsed.toString();
    const isRelativeInput = !/^https?:\/\//i.test(rawUrl);
    if (isRelativeInput) {
      // strip origin for relative inputs
      return result.replace(/^https?:\/\/[^/]+/, '');
    }
    return result;
  }

  return {
    fillUrlWithUserCredentials,
  };
}
