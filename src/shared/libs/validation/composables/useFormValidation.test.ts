import { describe, it, expect, vi } from 'vitest';
import * as z from 'zod';
import { nextTick } from 'vue';
import { useFormValidation } from './useFormValidation';
import { createI18nErrorMapper } from '../helpers';

enum RawErrorKey {
  EMAIL_INVALID = 'EMAIL_INVALID',
  PASSWORD_LENGTH = 'PASSWORD_LENGTH',
  REQUIRED = 'REQUIRED',
}

enum I18nKey {
  EMAIL_INVALID = 'VALIDATION.EMAIL_INVALID',
  PASSWORD_LENGTH = 'VALIDATION.PASSWORD_LENGTH',
  REQUIRED = 'VALIDATION.REQUIRED',
  UNKNOWN = 'VALIDATION.UNKNOWN',
}

vi.mock('../../../../shared/helpers', () => {
  return {
    log: {
      error: vi.fn(),
    },
  };
});

const i18nMapper = createI18nErrorMapper<RawErrorKey, I18nKey>(
  {
    [RawErrorKey.EMAIL_INVALID]: I18nKey.EMAIL_INVALID,
    [RawErrorKey.PASSWORD_LENGTH]: I18nKey.PASSWORD_LENGTH,
    [RawErrorKey.REQUIRED]: I18nKey.REQUIRED,
  },
  {
    fallback: () => I18nKey.UNKNOWN,
  },
);

const schema = z.object({
  email: z.email(RawErrorKey.EMAIL_INVALID),
  password: z.string().min(6, RawErrorKey.PASSWORD_LENGTH),
  country: z.string().min(1, RawErrorKey.REQUIRED),
});

type Form = z.infer<typeof schema>;

describe('useFormValidation', () => {
  it('initializes with defaults and computed flags', () => {
    const { values, errors, isValid, isDirty, isTouched, isSubmitting } = useFormValidation<Form, RawErrorKey, I18nKey>(
      {
        validationSchema: schema,
        initialValues: { email: '', password: '', country: '' },
        i18nErrorMapper: i18nMapper,
      },
    );

    expect(values.value).toEqual({ email: '', password: '', country: '' });
    expect(errors.value).toEqual({});
    expect(isValid.value).toBe(false);
    expect(isDirty.value).toBe(false);
    expect(isTouched.value).toBe(false);
    expect(isSubmitting.value).toBe(false);
  });

  it('validateOnMount triggers validation & populates mapped i18n errors', () => {
    const { errors, isValid } = useFormValidation<Form, RawErrorKey, I18nKey>({
      validationSchema: schema,
      initialValues: { email: '', password: '', country: '' },
      validateOnMount: true,
      i18nErrorMapper: i18nMapper,
    });

    expect(isValid.value).toBe(false);
    expect(errors.value.email).toBe(I18nKey.EMAIL_INVALID);
    expect(errors.value.password).toBe(I18nKey.PASSWORD_LENGTH);
    expect(errors.value.country).toBe(I18nKey.REQUIRED);
  });

  it('validateForm returns true and clears errors on valid data', () => {
    const { setValues, validateForm, errors, isValid } = useFormValidation<Form, RawErrorKey, I18nKey>({
      validationSchema: schema,
      initialValues: { email: '', password: '', country: '' },
      i18nErrorMapper: i18nMapper,
    });

    setValues({
      email: 'john@doe.com',
      password: '123456',
      country: 'DE',
    });

    const ok = validateForm();
    expect(ok).toBe(true);
    expect(errors.value).toEqual({});
    expect(isValid.value).toBe(true);
  });

  it('validateForm maps zod issues -> i18n keys when invalid', () => {
    const { validateForm, errors, isValid } = useFormValidation<Form, RawErrorKey, I18nKey>({
      validationSchema: schema,
      initialValues: { email: 'not-an-email', password: '123', country: '' },
      i18nErrorMapper: i18nMapper,
    });

    const ok = validateForm();
    expect(ok).toBe(false);
    expect(isValid.value).toBe(false);
    expect(errors.value.email).toBe(I18nKey.EMAIL_INVALID);
    expect(errors.value.password).toBe(I18nKey.PASSWORD_LENGTH);
    expect(errors.value.country).toBe(I18nKey.REQUIRED);
  });

  it('validateField clears the error on success and sets it on failure', () => {
    const { setValue, validateField, errors } = useFormValidation<Form, RawErrorKey, I18nKey>({
      validationSchema: schema,
      initialValues: { email: '', password: '', country: '' },
      i18nErrorMapper: i18nMapper,
    });

    setValue('email', 'wrong');
    const ok1 = validateField('email');
    expect(ok1).toBe(false);
    expect(errors.value.email).toBe(I18nKey.EMAIL_INVALID);

    setValue('email', 'valid@mail.com');
    const ok2 = validateField('email');
    expect(ok2).toBe(true);
    expect(errors.value.email).toBeUndefined();
  });

  it('setFieldError & clearFieldError work with mapper + validity update', () => {
    const { setFieldError, clearFieldError, errors, isValid } = useFormValidation<Form, RawErrorKey, I18nKey>({
      validationSchema: schema,
      initialValues: { email: '', password: '', country: '' },
      i18nErrorMapper: i18nMapper,
    });

    setFieldError('password', RawErrorKey.PASSWORD_LENGTH);
    expect(errors.value.password).toBe(I18nKey.PASSWORD_LENGTH);
    expect(isValid.value).toBe(false);

    clearFieldError('password');
    expect(errors.value.password).toBeUndefined();
    expect(isValid.value).toBe(true);
  });

  it('locked field error prevents validation from clearing it', () => {
    const { setFieldError, validateField, errors } = useFormValidation<Form, RawErrorKey, I18nKey>({
      validationSchema: schema,
      initialValues: { email: 'test@example.com', password: '123456', country: 'UA' },
      i18nErrorMapper: i18nMapper,
    });

    setFieldError('email', RawErrorKey.EMAIL_INVALID, true);
    
    const result = validateField('email');
    expect(result).toBe(false);
    expect(errors.value.email).toBe(I18nKey.EMAIL_INVALID);
  });

  it('validateForm preserves locked errors', () => {
    const { setFieldError, validateForm, errors } = useFormValidation<Form, RawErrorKey, I18nKey>({
      validationSchema: schema,
      initialValues: { email: 'test@example.com', password: '123456', country: 'UA' },
      i18nErrorMapper: i18nMapper,
    });

    setFieldError('email', RawErrorKey.EMAIL_INVALID, true);

    const result = validateForm();
    expect(result).toBe(false);
    expect(errors.value.email).toBe(I18nKey.EMAIL_INVALID);
  });

  it('setValue unlocks field - clears error on valid value, shows new error on invalid', async () => {
    const { setFieldError, setValue, errors, isValid } = useFormValidation<Form, RawErrorKey, I18nKey>({
      validationSchema: schema,
      initialValues: { email: 'test@example.com', password: '123456', country: 'UA' },
      validationMode: 'eager',
      i18nErrorMapper: i18nMapper,
    });

    setFieldError('email', RawErrorKey.EMAIL_INVALID, true);
    expect(errors.value.email).toBe(I18nKey.EMAIL_INVALID);

    setValue('email', 'valid@example.com');
    await nextTick();
    expect(errors.value.email).toBeUndefined();
    expect(isValid.value).toBe(true);

    setFieldError('email', RawErrorKey.EMAIL_INVALID, true);
    setValue('email', 'invalid-email');
    await nextTick();
    expect(errors.value.email).toBe(I18nKey.EMAIL_INVALID);
  });

  it('handleSubmit blocks submission when locked error exists', async () => {
    const onSubmit = vi.fn();
    const { setFieldError, setValues, handleSubmit } = useFormValidation<Form, RawErrorKey, I18nKey>({
      validationSchema: schema,
      initialValues: { email: '', password: '', country: '' },
      i18nErrorMapper: i18nMapper,
    });

    setValues({ email: 'john@doe.com', password: '123456', country: 'DE' });
    setFieldError('email', RawErrorKey.EMAIL_INVALID, true);

    const result = await handleSubmit(onSubmit)();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it('clearFieldError removes error and unlocks field', () => {
    const { setFieldError, clearFieldError, errors } = useFormValidation<Form, RawErrorKey, I18nKey>({
      validationSchema: schema,
      initialValues: { email: 'test@example.com', password: '123456', country: 'UA' },
      i18nErrorMapper: i18nMapper,
    });

    setFieldError('email', RawErrorKey.EMAIL_INVALID, true);
    clearFieldError('email');
    expect(errors.value.email).toBeUndefined();
  });

  it('resetForm clears locked fields', () => {
    const { setFieldError, resetForm, errors } = useFormValidation<Form, RawErrorKey, I18nKey>({
      validationSchema: schema,
      initialValues: { email: 'test@example.com', password: '123456', country: 'UA' },
      i18nErrorMapper: i18nMapper,
    });

    setFieldError('email', RawErrorKey.EMAIL_INVALID, true);
    resetForm();
    expect(errors.value.email).toBeUndefined();
  });

  it('validateForm clears non-locked errors, preserves locked ones', () => {
    const { setFieldError, validateForm, errors } = useFormValidation<Form, RawErrorKey, I18nKey>({
      validationSchema: schema,
      initialValues: { email: 'test@example.com', password: '123456', country: 'UA' },
      i18nErrorMapper: i18nMapper,
    });

    setFieldError('email', RawErrorKey.EMAIL_INVALID, true);
    setFieldError('password', RawErrorKey.PASSWORD_LENGTH, false);
    validateForm();

    expect(errors.value.email).toBe(I18nKey.EMAIL_INVALID);
    expect(errors.value.password).toBeUndefined();
  });

  it('eager mode: setValue validates immediately', () => {
    const { setValue, errors } = useFormValidation<Form, RawErrorKey, I18nKey>({
      validationSchema: schema,
      initialValues: { email: '', password: '', country: '' },
      validationMode: 'eager',
      i18nErrorMapper: i18nMapper,
    });

    setValue('email', 'bad');
    expect(errors.value.email).toBe(I18nKey.EMAIL_INVALID);

    setValue('email', 'good@mail.io');
    expect(errors.value.email).toBeUndefined();
  });

  it('lazy mode: validates on blur/touch after change, not on change alone', async () => {
    const { setValue, setTouched, errors } = useFormValidation<Form, RawErrorKey, I18nKey>({
      validationSchema: schema,
      initialValues: { email: '', password: '', country: '' },
      validationMode: 'lazy',
      i18nErrorMapper: i18nMapper,
    });

    setValue('password', '123');
    expect(errors.value.password).toBeUndefined();

    setTouched('password', true);
    await nextTick();
    expect(errors.value.password).toBe(I18nKey.PASSWORD_LENGTH);
  });

  it('passive mode: no auto-validation on change/touch, only validateForm', () => {
    const { setValue, setTouched, errors, validateForm } = useFormValidation<Form, RawErrorKey, I18nKey>({
      validationSchema: schema,
      initialValues: { email: '', password: '', country: '' },
      validationMode: 'passive',
      i18nErrorMapper: i18nMapper,
    });

    setValue('country', '');
    setTouched('country', true);
    expect(errors.value.country).toBeUndefined();

    const ok = validateForm();
    expect(ok).toBe(false);
    expect(errors.value.country).toBe(I18nKey.REQUIRED);
  });

  it('defineField returns a v-model style computed + error + listeners', async () => {
    const { defineField } = useFormValidation<Form, RawErrorKey, I18nKey>({
      validationSchema: schema,
      initialValues: { email: 'bad', password: '123', country: '' },
      validationMode: 'lazy',
      i18nErrorMapper: i18nMapper,
    });

    const [emailModel, emailError, emailListeners] = defineField('email');
    expect(emailModel.value).toBe('bad');
    expect(emailError.value === I18nKey.EMAIL_INVALID || emailError.value === '').toBe(true);

    emailModel.value = 'still-bad';
    await nextTick();
    expect(emailError.value === I18nKey.EMAIL_INVALID || emailError.value === '').toBe(true);

    emailListeners.onBlur();
    await nextTick();
    expect([I18nKey.EMAIL_INVALID, '']).toContain(emailError.value);

    emailModel.value = 'ok@mail.com';
    emailListeners.onBlur();
    await nextTick();
    expect(emailError.value).toBe('');
  });

  it('handleSubmit: calls callback when valid and returns true/false', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    const { setValues, handleSubmit, isSubmitting } = useFormValidation<Form, RawErrorKey, I18nKey>({
      validationSchema: schema,
      initialValues: { email: '', password: '', country: '' },
      i18nErrorMapper: i18nMapper,
    });

    setValues({ email: 'john@doe.com', password: '123456', country: 'DE' });

    const submit = handleSubmit(onSubmit);
    const event = { preventDefault: vi.fn() } as unknown as Event;

    const result = await submit(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(isSubmitting.value).toBe(false);
    expect(result).toBe(true);
  });

  it('handleSubmit: does not call callback when invalid and returns false', async () => {
    const onSubmit = vi.fn();

    const { setValues, handleSubmit } = useFormValidation<Form, RawErrorKey, I18nKey>({
      validationSchema: schema,
      initialValues: { email: 'bad', password: '123', country: '' },
      i18nErrorMapper: i18nMapper,
    });

    setValues({ email: 'bad', password: '123', country: '' });

    const submit = handleSubmit(onSubmit);
    const result = await submit();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it('resetForm restores provided state (including meta)', () => {
    const { setValues, validateForm, resetForm, values, errors, isValid, isDirty, isTouched, isSubmitting } =
      useFormValidation<Form, RawErrorKey, I18nKey>({
        validationSchema: schema,
        initialValues: { email: '', password: '', country: '' },
        i18nErrorMapper: i18nMapper,
      });

    setValues({ email: 'bad', password: '123', country: '' });
    validateForm();

    resetForm({
      values: { email: 'ok@mail.com', password: '123456', country: 'DE' },
      errors: {},
      meta: {
        touched: { email: true },
        dirty: { email: true },
        valid: true,
        submitting: false,
      },
    });

    expect(values.value).toEqual({ email: 'ok@mail.com', password: '123456', country: 'DE' });
    expect(errors.value).toEqual({});
    expect(isValid.value).toBe(true);
    expect(isDirty.value).toBe(true);
    expect(isTouched.value).toBe(true);
    expect(isSubmitting.value).toBe(false);
  });

  it('setValues merges partials without dropping existing values', () => {
    const { values, setValues } = useFormValidation<Form, RawErrorKey, I18nKey>({
      validationSchema: schema,
      initialValues: { email: 'a@a.com', password: '123456', country: 'UA' },
      i18nErrorMapper: i18nMapper,
    });

    setValues({ country: 'DE' });
    expect(values.value).toEqual({ email: 'a@a.com', password: '123456', country: 'DE' });
  });

  it('unknown error keys map to fallback via I18nErrorMapper', () => {
    const customSchema = z.object({
      email: z.string().min(5, 'SOME_NEW_BACKEND_CODE' as RawErrorKey),
    });

    const { validateForm, errors } = useFormValidation<{ email: string }, RawErrorKey, I18nKey>({
      validationSchema: customSchema,
      initialValues: { email: 'x@x' },
      i18nErrorMapper: i18nMapper,
    });

    const ok = validateForm();
    expect(ok).toBe(false);
    expect(errors.value.email).toBe(I18nKey.UNKNOWN);
  });
});
