import { useFormValidation, type BaseClientErrorKey, type FormValidationMode, type I18nErrorMapper } from "../../../shared/libs/validation";
import { RemindFormSchema, type RemindFormSchemaType } from "../libs";
import type { AuthBackendErrorKey } from "../../../entities/auth";
import { useRestorePasswordRequest } from "./useRestorePasswordRequest";

export type RemindErrorKey = BaseClientErrorKey | AuthBackendErrorKey

export function useRemindForm<T extends string>({
  i18nErrorMapper,
  initialValues,
  validationMode,
}: {
  i18nErrorMapper: I18nErrorMapper<RemindErrorKey, T>;
  initialValues?: Partial<RemindFormSchemaType>;
  validationMode?: FormValidationMode;
}) {
  const form = useFormValidation<RemindFormSchemaType, RemindErrorKey, T>({
    validationSchema: RemindFormSchema,
    i18nErrorMapper,
    initialValues,
    validationMode: validationMode || 'lazy',
  });
  
  const {
    values: formValues,
    setFieldError,
    validateField,
    errors,
    isSubmitting,
    handleSubmit,
    defineField,
    getFieldState,
    setTouched,
} = form;

  const { restorePasswordRequest } = useRestorePasswordRequest();

  const loginField = defineField("login");

  const onSubmit = handleSubmit(async (values) => {
    const {
      login,
    } = values;

    await restorePasswordRequest(login);
  });

  return {
    formValues,
    setFieldError,
    validateField,
    errors,
    isSubmitting,
    onSubmit,
    loginField,
    getFieldState,
    setTouched,
  };
}