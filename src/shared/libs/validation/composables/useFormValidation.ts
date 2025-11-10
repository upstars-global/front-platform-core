import { log } from '../../../../shared/helpers';
import { ref, computed, toRaw } from 'vue';
import * as z from 'zod';
import type { I18nErrorMapper } from '../helpers';

type FieldValue = string | number | boolean | undefined;
type FormErrors<T extends Record<string, unknown>, U extends string> =
  Partial<Record<keyof T, U>>;

interface FieldMeta {
  touched: boolean;
  dirty: boolean;
  valid: boolean;
}

interface FieldState<T = FieldValue, U extends string = string> {
  value: T;
  errors: U | '';
  meta: FieldMeta;
}

interface FormState<T extends Record<string, unknown>, U extends string> {
  values: T;
  errors: FormErrors<T, U>;
  meta: {
    touched: Partial<Record<keyof T, boolean>>;
    dirty: Partial<Record<keyof T, boolean>>;
    valid: boolean;
    submitting: boolean;
  };
}

type ValidationMode = 'eager' | 'lazy' | 'passive';

interface FormOptions<
  T extends Record<string, unknown>,
  TErrorKeys extends string = string,
  TI18nKeys extends string = TErrorKeys
> {
  validationSchema?: z.ZodType<T>;
  initialValues?: Partial<T>;
  validateOnMount?: boolean;
  validationMode?: ValidationMode;
  i18nErrorMapper: I18nErrorMapper<TErrorKeys, TI18nKeys>;
}

export function useFormValidation<
  T extends Record<string, FieldValue>,
  TErrorKeys extends string = string,
  TI18nKeys extends string = TErrorKeys
>(options: FormOptions<T, TErrorKeys, TI18nKeys>) {
  const schema = ref<z.ZodType<T> | undefined>(options.validationSchema);
  const i18nErrorMapper = options.i18nErrorMapper;

  const values = ref<Partial<T>>((options.initialValues || {}) as T);
  const errors = ref<FormErrors<T, TI18nKeys>>({});
  const touched = ref<Partial<Record<keyof T, boolean>>>({});
  const dirty = ref<Partial<Record<keyof T, boolean>>>({});
  const valid = ref(true);
  const submitting = ref(false);

  const validationMode = options.validationMode || 'eager';

  const getFieldSchema = (name: keyof T): z.ZodType | null => {
    if (!schema.value) {
      return null;
    }

    const rawSchema = toRaw(schema.value);

    if (rawSchema instanceof z.ZodObject) {
      return rawSchema.shape[name as string] || null;
    }

    return null;
  };

  const updateFormValidity = () => {
    valid.value = Object.keys(errors.value).length === 0;
  };

  const clearFieldError = (name: keyof T) => {
    delete errors.value[name];
    updateFormValidity();
  };    

  const setFieldError = (name: keyof T, error: TErrorKeys) => {
    errors.value[name] = i18nErrorMapper.getI18nKey(error);
    updateFormValidity();
  };

  const validateField = (name: keyof T): boolean => {
    if (!schema.value) return true;

    try {
      const fieldSchema = getFieldSchema(name);

      if (fieldSchema) {
        fieldSchema.parse(values.value[name]);
        clearFieldError(name);
        return true;
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const [error] = err.issues;

        setFieldError(name, error.message as TErrorKeys);

        return false;
      }

      log.error(`FAILED_TO_VALIDATE_FIELD`, {
        field: name
      });
      valid.value = false;

      return false;
    }

    return true;
  };

  const validateForm = (): boolean => {
    if (!schema.value) return true;

    try {
      schema.value.parse(values.value);

      errors.value = {};
      valid.value = true;

      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const formErrors: FormErrors<T, TI18nKeys> = {};

        err.issues.forEach((issue) => {
          const path = issue.path[0] as keyof T;

          const mapped = i18nErrorMapper.getI18nKey(issue.message as TErrorKeys);

          formErrors[path] = mapped;
        });

        errors.value = formErrors;
        valid.value = false;
        return false;
      }

      log.error('FAILED_TO_VALIDATE_FORM', err);
      valid.value = false;

      return false;
    }
  };

  const setValue = (name: keyof T, value: unknown) => {
    values.value[name] = value as T[keyof T];
    dirty.value[name] = true;

    if (validationMode === 'eager') {
      validateField(name);

      return;
    }

    if (validationMode === 'lazy' && Boolean(touched.value[name])) {
      validateField(name);
    }
  };

  const setTouched = (name: keyof T, isTouched: boolean = true) => {
    touched.value[name] = isTouched;

    if (validationMode === 'lazy' && isTouched) {
      validateField(name);
    }
  };

  const getFieldState = (name: keyof T): FieldState<FieldValue, TI18nKeys> => {
    return {
      value: values.value[name],
      errors: (errors.value[name] as TI18nKeys) || '',
      meta: {
        touched: Boolean(touched.value[name]),
        dirty: Boolean(dirty.value[name]),
        valid: !errors.value[name],
      },
    };
  };

  const handleSubmit = (submitCallback: (values: T) => void | Promise<void>) => {
    return async (e?: Event) => {
      e?.preventDefault();

      submitting.value = true;

      const isValid = validateForm();

      if (isValid) {
        await submitCallback(values.value as T);
      }

      submitting.value = false;

      return isValid;
    };
  };

  const resetForm = (resetOptions?: Partial<FormState<Partial<T>, TErrorKeys>>) => {
    values.value = (resetOptions?.values || options.initialValues || {}) as T;
    errors.value = resetOptions?.errors || {};
    touched.value = resetOptions?.meta?.touched || {};
    dirty.value = resetOptions?.meta?.dirty || {};
    valid.value = resetOptions?.meta?.valid ?? true;
    submitting.value = resetOptions?.meta?.submitting ?? false;
  };

  const setValues = (newValues: Partial<T>) => {
    values.value = { ...values.value, ...newValues };
  };

  function defineField<K extends keyof T>(name: K) {
    const value = computed<T[K]>({
      get: () => values.value[name],
      set: (value) => {
        setValue(name, value);
      },
    });

    const error = computed<TI18nKeys | ''>(() => (errors.value[name] as TI18nKeys) || '');

    const listeners = {
      onBlur: () => {
        setTouched(name, true);
      },
    };

    return [value, error, listeners] as const;
  }

  const isValid = computed(() => valid.value);
  const isSubmitting = computed(() => submitting.value);
  const isDirty = computed(() => Object.values(dirty.value).some(Boolean));
  const isTouched = computed(() => Object.values(touched.value).some(Boolean));

  if (options.validateOnMount) {
    validateForm();
  }

  return {
    values,
    errors,
    touched,
    dirty,
    valid,
    submitting,

    isValid,
    isSubmitting,
    isDirty,
    isTouched,

    setValue,
    setTouched,
    setFieldError,
    clearFieldError,
    validateField,
    validateForm,
    handleSubmit,
    resetForm,
    setValues,
    getFieldState,
    defineField,
  };
}
