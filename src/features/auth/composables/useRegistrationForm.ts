import { useMultiLangStore } from '../../../entities/multilang';
import {
  useFormValidation,
  mapErrorFields,
  type BaseClientErrorKey,
  type I18nErrorMapper,
  type FormValidationMode,
} from '../../../shared/libs/validation';
import { RegistrationFormSchema, VerifyEmailStatus, type RegistrationFormSchemaType } from '../libs';
import { useEmailVerify } from './useEmailVerify';
import { useRegister } from './useRegister';
import { fingerprintHelper } from '../../../entities/covery';
import type { IbizaErrorKey, RegisterDTO, AuthBackendErrorKey } from '../../../entities/auth';
import { RegistrationType } from '../../../shared/api';
import { ref } from 'vue';

export type RegistrationErrorKey = BaseClientErrorKey | AuthBackendErrorKey | IbizaErrorKey;

export function useRegistrationForm<T extends string>({
  i18nErrorMapper,
  validationMode = 'passive',
  initialValues,
  isAcceptTermsRequired = true,
}: {
  i18nErrorMapper: I18nErrorMapper<RegistrationErrorKey, T>;
  validationMode?: FormValidationMode;
  initialValues?: Partial<RegistrationFormSchemaType>;
  isAcceptTermsRequired?: boolean;
}) {
  const {
    verifyEmail: verifyEmailByService,
    isVerified: isEmailVerified,
    isVerifying: isEmailVerifying,
    isError: isEmailVerificationError,
  } = useEmailVerify();

  const form = useFormValidation<RegistrationFormSchemaType, RegistrationErrorKey, T>({
    validationSchema: RegistrationFormSchema(isAcceptTermsRequired),
    i18nErrorMapper,
    validationMode,
    initialValues,
  });

  const {
    values: formValues,
    setFieldError,
    validateField,
    errors,
    isSubmitting,
    handleSubmit,
    defineField,
    ...rest
  } = form;

  const emailField = defineField('email');
  const passwordField = defineField('password');
  const countryField = defineField('country');
  const currencyField = defineField('currency');
  const promoCodeField = defineField('promoCode');
  const acceptTermsField = defineField('acceptTerms');
  const acceptNotificationsField = defineField('acceptNotifications');

  const captchaKey = ref<string | undefined>(undefined);

  function setCaptchaKey(value: string) {
    captchaKey.value = value;
  }

  const { register } = useRegister();
  const multiLangStore = useMultiLangStore();

  const onSubmit = handleSubmit(async (values) => {
    const {
      email,
      currency,
      password,
      acceptTerms: accept_terms,
      acceptNotifications: accept_notifications,
      country: chosen_country,
      promoCode,
    } = values;

    const registrationData = fingerprintHelper<RegisterDTO>({
      login: email,
      currency,
      password,
      auth_type: RegistrationType.EMAIL,
      localization: multiLangStore.userLocale || '',
      chosen_country,
      accept_notifications,
      accept_terms: accept_terms || false,
      promo_code: promoCode ? promoCode.trim() : '',
      captcha_key: captchaKey.value,
    });

    await register(registrationData);
  });

  const verifyEmail = async (email?: string) => {
    const EMAIL_FIELD_KEY = 'email';

    const isEmailValid = validateField(EMAIL_FIELD_KEY);

    if (!isEmailValid || !email) {
      return;
    }

    const response = await verifyEmailByService(email);

    if (response?.status === VerifyEmailStatus.INVALID && response.invalidCode) {
      const [{ field, key }] = mapErrorFields({
        errors: {
          [EMAIL_FIELD_KEY]: [response.invalidCode],
        },
      });

      setFieldError(field, key);
    }
  };

  return {
    ...rest,
    isEmailVerified,
    isEmailVerifying,
    isEmailVerificationError,
    formValues,
    errors,
    isSubmitting,
    emailField,
    passwordField,
    countryField,
    currencyField,
    promoCodeField,
    acceptNotificationsField,
    acceptTermsField,
    captchaKey,
    setCaptchaKey,
    setFieldError,
    onSubmit,
    handleSubmit,
    verifyEmail,
  };
}
