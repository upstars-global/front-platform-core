import {
  useFormValidation,
  type BaseClientErrorKey,
  type I18nErrorMapper,
  type FormValidationMode,
} from '../../../shared/libs/validation';
import type { AuthBackendErrorKey } from '../../../entities/auth';
import { LoginFormSchema, type LoginFormSchemaType } from '../libs/validation/login';
import { useLogin } from './useLogin';
import { fingerprintHelper } from '../../../entities/covery';
import type { LoginParams } from './useLogin';

export type LoginErrorKey = BaseClientErrorKey | AuthBackendErrorKey;

export function useLoginForm<T extends string>({
  i18nErrorMapper,
  validationMode = 'passive',
  initialValues,
}: {
  i18nErrorMapper: I18nErrorMapper<LoginErrorKey, T>;
  validationMode?: FormValidationMode;
  initialValues?: Partial<LoginFormSchemaType>;
}) {
  const form = useFormValidation<LoginFormSchemaType, LoginErrorKey, T>({
    validationSchema: LoginFormSchema,
    i18nErrorMapper,
    validationMode,
    initialValues,
  });

  const {
    values: formValues,
    fieldsFromSchema,
    setFieldError,
    setValue,
    errors,
    isSubmitting,
    handleSubmit,
    defineField,
    dirty,
    touched,
    valid,
    getFieldState,
    validateForm,
  } = form;

  const emailField = defineField('email');
  const passwordField = defineField('password');

  const { safeLogin } = useLogin();

  const onSubmit = handleSubmit(async (values) => {
    const { email, password } = values;
    
    const loginData = fingerprintHelper<LoginParams>({
        login: email,
        password,
    });

    await safeLogin(loginData);
  });

  return {
    formValues,
    errors,
    isSubmitting,
    fieldsFromSchema,
    emailField,
    passwordField,
    dirty,
    touched,
    valid,
    setValue,
    validateForm,
    setFieldError,
    onSubmit,
    getFieldState,
    handleSubmit,
  };
}
