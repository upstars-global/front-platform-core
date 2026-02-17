import { toValue, type MaybeRefOrGetter } from "vue";
import { useFormValidation, type BaseClientErrorKey, type I18nErrorMapper } from "../../../shared/libs/validation";
import type { AuthBackendErrorKey } from "../../../entities/auth";
import { RestorePasswordFormSchema, type RestorePasswordFormSchemaType } from "../libs/validation/restore";
import { useRestorePassword } from "./useRestorePassword";

export type RestoreErrorKey = BaseClientErrorKey | AuthBackendErrorKey

export function useRestorePasswordForm<T extends string>({
  i18nErrorMapper,
  initialValues,
  code,
}: {
  i18nErrorMapper: I18nErrorMapper<RestoreErrorKey, T>;
  initialValues?: Partial<RestorePasswordFormSchemaType>;
  code: MaybeRefOrGetter<string>;
}) {
  const form = useFormValidation<RestorePasswordFormSchemaType, RestoreErrorKey, T>({
    validationSchema: RestorePasswordFormSchema,
    i18nErrorMapper,
    initialValues,
    validationMode: 'lazy',
  });
  
  const {
    values: formValues,
    errors,
    isSubmitting,
    valid,
    dirty,
    setFieldError,
    validateField,
    handleSubmit,
    defineField,
    getFieldState,
    setTouched,
    validateForm
} = form;

  const { restorePassword } = useRestorePassword();

  const passwordField = defineField("password");
  const confirmPasswordField = defineField("confirmPassword");

  const onSubmit = handleSubmit(async (values) => {
    const {
      password,
    } = values;

    return await restorePassword({
      password,
      code: toValue(code),
    });
  });

  return {
    formValues,
    errors,
    valid,
    dirty,
    isSubmitting,
    passwordField,
    confirmPasswordField,
    onSubmit,
    setFieldError,
    validateField,
    getFieldState,
    setTouched,
    validateForm,
  };
}