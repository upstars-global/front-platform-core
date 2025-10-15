import { ref, computed, toRaw } from 'vue';
import { ZodError, ZodObject, ZodType } from 'zod';

type FieldValue = string | number | boolean | undefined;
type FormErrors<T> = Partial<Record<keyof T, string>>;

interface FieldMeta {
  touched: boolean;
  dirty: boolean;
  valid: boolean;
}

interface FieldState<T = FieldValue> {
  value: T;
  errors: string;
  meta: FieldMeta;
}

interface FormState<T extends Record<string, unknown>> {
  values: T;
  errors: FormErrors<T>;
  meta: {
    touched: Partial<Record<keyof T, boolean>>;
    dirty: Partial<Record<keyof T, boolean>>;
    valid: boolean;
    submitting: boolean;
  };
}

type ValidationMode = 'eager' | 'lazy' | 'passive';

interface FormOptions<T extends Record<string, unknown>> {
  validationSchema?: ZodType<T>;
  initialValues?: Partial<T>;
  validateOnMount?: boolean;
  validationMode?: ValidationMode;
  onSubmit?: (values: T) => void | Promise<void>;
}

export function useFormValidation<T extends Record<string, FieldValue>>(options: FormOptions<T> = {}) {
  const schema = ref<ZodType<T> | undefined>(options.validationSchema);
  
  const values = ref<T>((options.initialValues || {}) as T);
  const errors = ref<FormErrors<T>>({});
  const touched = ref<Partial<Record<keyof T, boolean>>>({});
  const dirty = ref<Partial<Record<keyof T, boolean>>>({});
  const valid = ref(true);
  const submitting = ref(false);

  const validationMode = options.validationMode || 'eager'

  const getFieldSchema = (name: keyof T): ZodType | null => {
    if (!schema.value) {
      return null;
    }

    const rawSchema = toRaw(schema.value)

    if (rawSchema instanceof ZodObject) {
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

  const setFieldError = (name: keyof T, error: string) => {
    errors.value[name] = error;
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
      if (err instanceof ZodError) {
        const [error] = err.issues;

        setFieldError(name, error.message);

        return false;
      }
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
      if (err instanceof ZodError) {
        const formErrors: FormErrors<T> = {};

        err.issues.forEach((error) => {
          const path = error.path[0] as keyof T;

          formErrors[path] = error.message;
        });

        errors.value = formErrors;
        valid.value = false;
        return false;
      }
    }
    return false;
  };

  const setValue = (name: keyof T, value: unknown) => {
    values.value[name] = value as T[keyof T];
    dirty.value[name] = true;

    if (validationMode === 'eager') {
      validateField(name);

      return
    }

     if (validationMode === 'lazy' && touched.value[name]) {
      validateField(name);
    }
  };

  const setTouched = (name: keyof T, isTouched: boolean = true) => {
    touched.value[name] = isTouched;

    if (validationMode === 'lazy' && isTouched) {
      validateField(name);
    }
  };

  const getFieldState = (name: keyof T): FieldState => {
    return {
      value: values.value[name],
      errors: errors.value[name],
      meta: {
        touched: touched.value[name] || false,
        dirty: dirty.value[name] || false,
        valid: !errors.value[name]?.length,
      },
    };
  };

  const handleSubmit = async (e?: Event) => {
    e?.preventDefault();

    submitting.value = true;

    const isValid = validateForm();

    if (isValid && options.onSubmit) {
      try {
        await options.onSubmit(values.value);
      } catch (err) {
        console.error('Submit error:', err);
      }
    }

    submitting.value = false;

    return isValid;
  };

  const resetForm = (resetOptions?: Partial<FormState<T>>) => {
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

  function defineFieldValidation<K extends keyof T>(name: K) {
    const value = computed<T[K]>({
      get: () => values.value[name],
      set: (value) => {
        setValue(name, value);
      },
    });

    const error = computed(() => errors.value[name]);

    const listeners = {
      onBlur: () => {
        setTouched(name, true);
      },
    };

    return [value, listeners, error] as const;
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
    defineFieldValidation,
  };
}