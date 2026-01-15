import { authAPI } from '../../../entities/auth';
import { ref } from 'vue';
import { handleVerifyEmailResponse, VerifyEmailStatus } from '../libs';
import { log } from '../../../shared/helpers';
import { afterEmailVerifyHook } from '../config';

export function useEmailVerify() {
  const isVerified = ref(false);
  const isVerifying = ref(false);
  const isError = ref(false);
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

  function setError(error: boolean) {
    isError.value = error;
  }

  async function verifyEmail(email?: string) {
    setVerified(false);
    setInvalidCode(null);
    setError(false);

    if (!email) return;

    setVerifying(true);

    try {
      const response = await authAPI.verifyEmail(email);

      if (!response) {
        setVerified(false);
        setError(true);
        return;
      }

      const handledEmailResponse = handleVerifyEmailResponse(response);

      await afterEmailVerifyHook.run({
        email,
        status: handledEmailResponse.status,
        invalidCode: handledEmailResponse.invalidCode,
      });

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
      setError(true);
    } finally {
      setVerifying(false);
    }
  }

  return {
    isVerified,
    isError,
    isVerifying,
    invalidCode,
    setVerified,
    setError,
    verifyEmail,
  };
}
