import { log } from '../../../../shared/helpers';
import { ref, computed, toRaw, type ComputedRef, type Ref } from 'vue';
import * as z from 'zod';
import type { I18nErrorMapper } from '../helpers';

const GLOBAL_ERROR_KEY = 'global';

type FieldValue = string | number | boolean | undefined;
type FormErrors<T extends Record<string, unknown>, U extends string> =
  Partial<Record<keyof T, U>>;

interface FieldMeta {
  touched: boolean;
  dirty: boolean;
  valid: boolean;
}

export interface FieldState<T = FieldValue, U extends string = string> {
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

export type FormValidationMode = 'eager' | 'lazy' | 'passive';

interface FormOptions<
  T extends Record<string, unknown>,
  TErrorKeys extends string = string,
  TI18nKeys extends string = TErrorKeys
> {
  validationSchema?: z.ZodType<T>;
  initialValues?: Partial<T>;
  validateOnMount?: boolean;
  validationMode?: FormValidationMode;
  i18nErrorMapper: I18nErrorMapper<TErrorKeys, TI18nKeys>;
}

interface UseFormValidationReturn<
  T extends Record<string, FieldValue>,
  TErrorKeys extends string = string,
  TI18nKeys extends string = TErrorKeys
> {
  values: Ref<Partial<T>>;
  errors: Ref<FormErrors<T, TI18nKeys>>;
  touched: Ref<Partial<Record<keyof T, boolean>>>;
  dirty: Ref<Partial<Record<keyof T, boolean>>>;
  valid: Ref<boolean>;
  submitting: Ref<boolean>;
  submitCount: Ref<number>;
  formValidated: Ref<boolean>;
  fieldsFromSchema: ComputedRef<(keyof T)[]>;
  
  isValid: ComputedRef<boolean>;
  isSubmitting: ComputedRef<boolean>;
  isDirty: ComputedRef<boolean>;
  isTouched: ComputedRef<boolean>;
  
  setValue: (name: keyof T, value: unknown) => void;
  setTouched: (name: keyof T, isTouched?: boolean) => void;
  setFieldError: (name: keyof T, error: TErrorKeys, lock?: boolean) => void;
  clearFieldError: (name: keyof T) => void;
  clearGlobalError: () => void;
  getFieldSchema: (name: keyof T) => z.ZodType | null;
  validateField: (name: keyof T) => boolean;
  validateForm: () => boolean;
  handleSubmit: (submitCallback: (values: T) => void | Promise<void>) => (e?: Event) => Promise<boolean>;
  resetForm: (resetOptions?: Partial<FormState<Partial<T>, TErrorKeys>>) => void;
  setValues: (newValues: Partial<T>) => void;
  getFieldState: (name: keyof T) => FieldState<FieldValue, TI18nKeys>;
  defineField: <K extends keyof T>(name: K) => readonly [ComputedRef<T[K] | undefined>, ComputedRef<TI18nKeys | ''>, { onBlur: () => void }];
}

export function useFormValidation<
  T extends Record<string, FieldValue>,
  TErrorKeys extends string = string,
  TI18nKeys extends string = TErrorKeys
>(options: FormOptions<T, TErrorKeys, TI18nKeys>): UseFormValidationReturn<T, TErrorKeys, TI18nKeys> {
  const schema = ref<z.ZodType<T> | undefined>(options.validationSchema);
  const i18nErrorMapper = options.i18nErrorMapper;

  const values = ref((options.initialValues || {}) as Partial<T>) as Ref<Partial<T>>;
  const errors = ref({}) as Ref<FormErrors<T, TI18nKeys>>;
  const lockedFields = new Set<keyof T>();
  const touched = ref({}) as Ref<Partial<Record<keyof T, boolean>>>;
  const dirty = ref({}) as Ref<Partial<Record<keyof T, boolean>>>;
  const valid = ref(false);
  const submitting = ref(false);
  const submitCount = ref(0);
  const formValidated = ref(false);

  const validationMode = options.validationMode || 'eager';

  const fieldsFromSchema = computed<(keyof T)[]>(() => {
    if (!schema.value) {
      return [];
    }

    const rawSchema = toRaw(schema.value);

    if (rawSchema instanceof z.ZodObject) {
      return Object.keys(rawSchema.shape) as (keyof T)[];
    }

    return [];
  });

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
    const fieldErrors = Object.keys(errors.value).filter(key => key !== GLOBAL_ERROR_KEY);

    valid.value = fieldErrors.length === 0;
  };

  const clearFieldError = (name: keyof T) => {
    delete errors.value[name];
    lockedFields.delete(name);
    updateFormValidity();
  };    

  const clearGlobalError = () => {
    if (GLOBAL_ERROR_KEY in errors.value) {
      delete errors.value[GLOBAL_ERROR_KEY as keyof T];
      updateFormValidity();
    }
  };

  const setFieldError = (name: keyof T, error: TErrorKeys, lock: boolean = false) => {
    errors.value[name] = i18nErrorMapper.getI18nKey(error);

    if (lock) {
      lockedFields.add(name);
    }

    updateFormValidity();
  };

  const validateField = (name: keyof T): boolean => {
    if (!schema.value) return true;

    if (lockedFields.has(name)) {
      return false;
    }

    try {
      schema.value.parse(values.value);
      
      clearFieldError(name);
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldError = err.issues.find(
          (issue) => issue.path[0] === name
        );
        
        if (fieldError) {
          setFieldError(name, fieldError.message as TErrorKeys, false);
          return false;
        }
        
        clearFieldError(name);
        
        return true;
      }
  
      log.error(`FAILED_TO_VALIDATE_FIELD`, { field: name });
      valid.value = false;

      return false;
    }
  };
  

  const validateForm = (): boolean => {
    if (!schema.value) return true;

    for (const key of Object.keys(errors.value)) {
      if (!lockedFields.has(key as keyof T)) {
        delete errors.value[key as keyof T];
      }
    }

    try {
      schema.value.parse(values.value);

      updateFormValidity();

      return valid.value;
    } catch (err) {
      if (err instanceof z.ZodError) {
        err.issues.forEach((issue) => {
          const path = issue.path[0] as keyof T;

          if (!errors.value[path]) {
            errors.value[path] = i18nErrorMapper.getI18nKey(issue.message as TErrorKeys);
          }
        });

        valid.value = false;
        return false;
      }

      log.error('FAILED_TO_VALIDATE_FORM', err);
      valid.value = false;

      return false;
    } finally {
      formValidated.value = true;
    }
  };

  const setValue = (name: keyof T, value: unknown) => {
    values.value[name] = value as T[keyof T];
    dirty.value[name] = true;

    lockedFields.delete(name);

    clearGlobalError();

    if (validationMode === 'eager') {
      validateField(name);
      return;
    }

    if (validationMode === 'lazy' && Boolean(touched.value[name])) {
      validateField(name);
      return;
    }

    if (validationMode === 'passive' && formValidated.value) {
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
      submitCount.value++;
      formValidated.value = true;

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
    errors.value = (resetOptions?.errors || {}) as FormErrors<T, TI18nKeys>;
    lockedFields.clear();
    touched.value = resetOptions?.meta?.touched || {};
    dirty.value = resetOptions?.meta?.dirty || {};
    valid.value = resetOptions?.meta?.valid ?? true;
    submitting.value = resetOptions?.meta?.submitting ?? false;
    submitCount.value = 0;
    formValidated.value = false;
  };

  const setValues = (newValues: Partial<T>) => {
    values.value = { ...values.value, ...newValues };
  };

  function defineField<K extends keyof T>(name: K) {
    const value = computed<T[K] | undefined>({
      get: () => values.value[name],
      set: (value: T[K] | undefined) => {
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
    submitCount,
    formValidated,
    fieldsFromSchema,
    isValid,
    isSubmitting,
    isDirty,
    isTouched,

    setValue,
    setTouched,
    setFieldError,
    clearFieldError,
    clearGlobalError,
    getFieldSchema,
    validateField,
    validateForm,
    handleSubmit,
    resetForm,
    setValues,
    getFieldState,
    defineField,
  };
}