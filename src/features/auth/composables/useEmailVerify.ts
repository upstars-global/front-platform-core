import { authAPI } from '../../../entities/auth';
import { ref } from 'vue';
import { handleVerifyEmailResponse, VerifyEmailStatus } from '../libs';
import { log } from '../../../shared/helpers';

export function useEmailVerify() {
  const isVerified = ref(false);
  const isVerifying = ref(false);
  const invalidCode = ref<string | null>(null);

  function setVerified(valid: boolean) {
    isVerified.value = valid;
  }

  function setVerifying(verifying: boolean) {
    isVerifying.value = verifying;
  }

  function setInvalidCode(code: string | null) {
    invalidCode.value = code;
  }

  async function verifyEmail(email?: string) {
    setVerified(false);
    setInvalidCode(null);

    if (!email) return;

    setVerifying(true);

    try {
      const response = await authAPI.verifyEmail(email);

      if (!response) {
        setVerified(false);
        return;
      }

      const handledEmailResponse = handleVerifyEmailResponse(response);

      if (handledEmailResponse.status === VerifyEmailStatus.INVALID) {
        setVerified(false);
        setInvalidCode(handledEmailResponse.invalidCode || null);

        return handledEmailResponse;
      }

      setVerified(true);

      return handledEmailResponse;
    } catch (error) {
      log.error('EMAIL_VERIFICATION_FAILED', error)

      setVerified(false);
    } finally {
      setVerifying(false);
    }
  }

  return {
    isVerified,
    isVerifying,
    invalidCode,
    setVerified,
    verifyEmail,
  };
}
