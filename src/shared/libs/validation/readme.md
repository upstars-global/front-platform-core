# Form Validation System

A comprehensive, type-safe form validation system for Vue 3 applications with Zod schema validation and internationalization support.

## Table of Contents

- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
- [Setup Guide](#setup-guide)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Best Practices](#best-practices)

## Quick Start

```typescript
// 1. Define your validation configuration
import * as z from 'zod';
import { createI18nErrorMapper } from '@/helpers';

const ERROR_KEY = {
  EMAIL_INVALID: 'EMAIL.INVALID',
  PASSWORD_TOO_SHORT: 'PASSWORD.TOO_SHORT',
} as const;

const errorMapper = createI18nErrorMapper(
  {
    [ERROR_KEY.EMAIL_INVALID]: 'VALIDATION.EMAIL.INVALID',
    [ERROR_KEY.PASSWORD_TOO_SHORT]: 'VALIDATION.PASSWORD.TOO_SHORT',
  },
  { fallback: () => 'VALIDATION.COMMON.UNKNOWN_ERROR' }
);

const loginSchema = z.object({
  email: z.string().email({ message: ERROR_KEY.EMAIL_INVALID }),
  password: z.string().min(6, { message: ERROR_KEY.PASSWORD_TOO_SHORT }),
});

// 2. Use in your component
import { useFormValidation } from '@/composables/useFormValidation';

const form = useFormValidation({
  validationSchema: loginSchema,
  i18nErrorMapper: errorMapper,
  initialValues: { email: '', password: '' },
  validationMode: 'lazy',
});

const [email, emailError, emailListeners] = form.defineField('email');
const [password, passwordError] = form.defineField('password');

const onSubmit = form.handleSubmit(async (values) => {
  console.log('Valid form data:', values);
});
```

```vue
<template>
  <form @submit="onSubmit">
    <input v-model="email" v-bind="emailListeners" />
    <span v-if="emailError">{{ $t(emailError) }}</span>
    
    <input v-model="password" type="password" />
    <span v-if="passwordError">{{ $t(passwordError) }}</span>
    
    <button :disabled="!form.isValid">Submit</button>
  </form>
</template>
```

## Core Concepts

### Error Keys vs I18n Keys

The system uses a two-layer approach for error handling:

- **Error Keys** - Internal identifiers used in validation logic (e.g., `EMAIL.INVALID`)
- **I18n Keys** - Translation keys for user-facing messages (e.g., `VALIDATION.EMAIL.INVALID`)

This separation allows you to:
- Keep validation logic independent of translations
- Share validation rules across different languages
- Refactor translations without touching validation code

### Validation Modes

| Mode | Behavior | Use Case |
|------|----------|----------|
| `eager` | Validates on every value change | Real-time feedback, short forms |
| `lazy` | Validates after first blur, then on change | Balanced UX, most forms |
| `passive` | Only validates on submit | Long forms, minimal interruption |

### Form State Management

The composable tracks comprehensive form state:

```typescript
{
  values: { email: 'user@example.com', password: '123456' },
  errors: { email: 'VALIDATION.EMAIL.INVALID' },
  meta: {
    touched: { email: true, password: false },
    dirty: { email: true, password: false },
    valid: false,
    submitting: false
  }
}
```

## Setup Guide

### Step 1: Define Error Keys

Create a constants file for your error identifiers:

```typescript
// constants/validation-errors.ts
export const VALIDATION_ERROR_KEY = {
  // Email errors
  EMAIL_INVALID: 'EMAIL.INVALID',
  EMAIL_REQUIRED: 'EMAIL.REQUIRED',
  EMAIL_ALREADY_EXISTS: 'EMAIL.ALREADY_EXISTS',
  
  // Password errors
  PASSWORD_TOO_SHORT: 'PASSWORD.TOO_SHORT',
  PASSWORD_TOO_LONG: 'PASSWORD.TOO_LONG',
  PASSWORD_WEAK: 'PASSWORD.WEAK',
  PASSWORD_REQUIRED: 'PASSWORD.REQUIRED',
  PASSWORD_NOT_MATCH: 'PASSWORD.NOT_MATCH',
  
  // General errors
  REQUIRED: 'COMMON.REQUIRED',
  UNKNOWN_ERROR: 'COMMON.UNKNOWN_ERROR',
} as const;

export type ValidationErrorKey = typeof VALIDATION_ERROR_KEY[keyof typeof VALIDATION_ERROR_KEY];
```

### Step 2: Create I18n Mappings

Map error keys to translation keys:

```typescript
// mappings/validation-i18n-mappings.ts
import { VALIDATION_ERROR_KEY } from '../constants/validation-errors';

export const validationI18nMappings = {
  [VALIDATION_ERROR_KEY.EMAIL_INVALID]: 'VALIDATION.EMAIL.INVALID',
  [VALIDATION_ERROR_KEY.EMAIL_REQUIRED]: 'VALIDATION.EMAIL.REQUIRED',
  [VALIDATION_ERROR_KEY.EMAIL_ALREADY_EXISTS]: 'VALIDATION.EMAIL.ALREADY_EXISTS',
  
  [VALIDATION_ERROR_KEY.PASSWORD_TOO_SHORT]: 'VALIDATION.PASSWORD.TOO_SHORT',
  [VALIDATION_ERROR_KEY.PASSWORD_TOO_LONG]: 'VALIDATION.PASSWORD.TOO_LONG',
  [VALIDATION_ERROR_KEY.PASSWORD_WEAK]: 'VALIDATION.PASSWORD.WEAK',
  [VALIDATION_ERROR_KEY.PASSWORD_REQUIRED]: 'VALIDATION.PASSWORD.REQUIRED',
  [VALIDATION_ERROR_KEY.PASSWORD_NOT_MATCH]: 'VALIDATION.PASSWORD.NOT_MATCH',
  
  [VALIDATION_ERROR_KEY.REQUIRED]: 'VALIDATION.COMMON.REQUIRED',
  [VALIDATION_ERROR_KEY.UNKNOWN_ERROR]: 'VALIDATION.COMMON.UNKNOWN_ERROR',
} as const;

export type ValidationI18nKey = typeof validationI18nMappings[keyof typeof validationI18nMappings];
```

### Step 3: Initialize Error Mapper

Create the error mapper instance:

```typescript
// helpers/error-mapper.ts
import { createI18nErrorMapper } from '../helpers';
import { validationI18nMappings } from '../mappings/validation-i18n-mappings';
import { VALIDATION_ERROR_KEY, type ValidationErrorKey } from '../constants/validation-errors';

export const validationErrorMapper = createI18nErrorMapper(
  validationI18nMappings,
  {
    fallback: (errorKey: ValidationErrorKey) => {
      console.warn(`No i18n mapping found for error key: ${errorKey}`);
      return 'VALIDATION.COMMON.UNKNOWN_ERROR';
    }
  }
);
```

### Step 4: Define Zod Schemas

Create validation schemas using your error keys:

```typescript
// schemas/auth-schemas.ts
import * as z from 'zod';
import { VALIDATION_ERROR_KEY } from '../constants/validation-errors';

export const loginSchema = z.object({
  email: z
    .string({ required_error: VALIDATION_ERROR_KEY.EMAIL_REQUIRED })
    .email({ message: VALIDATION_ERROR_KEY.EMAIL_INVALID }),
  
  password: z
    .string({ required_error: VALIDATION_ERROR_KEY.PASSWORD_REQUIRED })
    .min(6, { message: VALIDATION_ERROR_KEY.PASSWORD_TOO_SHORT }),
});

export const registrationSchema = z.object({
  email: z
    .string({ required_error: VALIDATION_ERROR_KEY.EMAIL_REQUIRED })
    .email({ message: VALIDATION_ERROR_KEY.EMAIL_INVALID }),
  
  password: z
    .string({ required_error: VALIDATION_ERROR_KEY.PASSWORD_REQUIRED })
    .min(6, { message: VALIDATION_ERROR_KEY.PASSWORD_TOO_SHORT })
    .max(128, { message: VALIDATION_ERROR_KEY.PASSWORD_TOO_LONG }),
  
  confirmPassword: z
    .string({ required_error: VALIDATION_ERROR_KEY.PASSWORD_REQUIRED }),
}).refine((data) => data.password === data.confirmPassword, {
  message: VALIDATION_ERROR_KEY.PASSWORD_NOT_MATCH,
  path: ['confirmPassword'],
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegistrationFormValues = z.infer<typeof registrationSchema>;
```

### Step 5: Use in Components

Implement the form validation in your Vue components:

```vue
<script setup lang="ts">
import { useFormValidation } from '@/composables/useFormValidation';
import { validationErrorMapper } from '@/helpers/error-mapper';
import { loginSchema, type LoginFormValues } from '@/schemas/auth-schemas';

const form = useFormValidation<LoginFormValues>({
  validationSchema: loginSchema,
  i18nErrorMapper: validationErrorMapper,
  initialValues: {
    email: '',
    password: '',
  },
  validationMode: 'lazy',
  validateOnMount: false,
});

const [email, emailError, emailListeners] = form.defineField('email');
const [password, passwordError, passwordListeners] = form.defineField('password');

const onSubmit = form.handleSubmit(async (values) => {
  try {
    await loginUser(values);
    router.push('/dashboard');
  } catch (error) {
    console.error('Login failed:', error);
  }
});
</script>

<template>
  <form @submit="onSubmit" novalidate>
    <div class="form-field">
      <label for="email">Email</label>
      <input
        id="email"
        v-model="email"
        v-bind="emailListeners"
        type="email"
        :class="{ error: emailError }"
      />
      <span v-if="emailError" class="error-message">
        {{ $t(emailError) }}
      </span>
    </div>

    <div class="form-field">
      <label for="password">Password</label>
      <input
        id="password"
        v-model="password"
        v-bind="passwordListeners"
        type="password"
        :class="{ error: passwordError }"
      />
      <span v-if="passwordError" class="error-message">
        {{ $t(passwordError) }}
      </span>
    </div>

    <button 
      type="submit" 
      :disabled="!form.isValid || form.isSubmitting"
    >
      {{ form.isSubmitting ? 'Logging in...' : 'Login' }}
    </button>
  </form>
</template>
```

## API Reference

### `useFormValidation<T>(options)`

Creates a form validation instance.

#### Options

```typescript
interface FormOptions<T, TErrorKeys, TI18nKeys> {
  validationSchema?: z.ZodType<T>;      // Zod validation schema
  initialValues?: Partial<T>;            // Initial form values
  validateOnMount?: boolean;             // Validate immediately (default: false)
  validationMode?: ValidationMode;       // 'eager' | 'lazy' | 'passive' (default: 'eager')
  i18nErrorMapper: I18nErrorMapper;      // Error mapper instance
}
```

#### Return Value

```typescript
{
  // State
  values: Ref<Partial<T>>;
  errors: Ref<FormErrors<T>>;
  touched: Ref<Record<keyof T, boolean>>;
  dirty: Ref<Record<keyof T, boolean>>;
  valid: Ref<boolean>;
  submitting: Ref<boolean>;

  // Computed
  isValid: ComputedRef<boolean>;
  isSubmitting: ComputedRef<boolean>;
  isDirty: ComputedRef<boolean>;
  isTouched: ComputedRef<boolean>;

  // Methods
  setValue(name: keyof T, value: unknown): void;
  setTouched(name: keyof T, touched?: boolean): void;
  setFieldError(name: keyof T, error: TErrorKeys): void;
  clearFieldError(name: keyof T): void;
  validateField(name: keyof T): boolean;
  validateForm(): boolean;
  handleSubmit(callback: (values: T) => void | Promise<void>): (e?: Event) => Promise<boolean>;
  resetForm(options?: Partial<FormState<T>>): void;
  setValues(values: Partial<T>): void;
  getFieldState(name: keyof T): FieldState;
  defineField<K extends keyof T>(name: K): [
    ComputedRef<T[K]>,           // value
    ComputedRef<string>,         // error
    { onBlur: () => void }       // listeners
  ];
}
```

### `createI18nErrorMapper(mappings, options)`

Creates an error mapper for translating error keys to i18n keys.

#### Parameters

```typescript
createI18nErrorMapper<TErrorKeys, TReturn>(
  mappings: { [K in TErrorKeys]: TReturn },
  options: {
    fallback: (errorKey: TErrorKeys) => TReturn;
  }
): I18nErrorMapper<TErrorKeys, TReturn>
```

#### Return Value

```typescript
{
  getI18nKey: (errorKey: TErrorKeys) => TReturn;
}
```

### `mapErrorFields({ errors, fieldMap })`

Maps backend validation errors to form fields.

#### Parameters

```typescript
mapErrorFields<TErrors, TFieldMap>({
  errors: TErrors,                          // Backend errors object
  fieldMap?: TFieldMap                      // Field name mapping (optional)
}): Array<{ field: string; key: string }>
```

#### Example

```typescript
const backendErrors = {
  email_address: ['EMAIL.INVALID'],
  user_password: ['PASSWORD.TOO_SHORT'],
};

const mapped = mapErrorFields({
  errors: backendErrors,
  fieldMap: {
    email_address: 'email',
    user_password: 'password',
  }
});

// Result: [
//   { field: 'email', key: 'EMAIL.INVALID' },
//   { field: 'password', key: 'PASSWORD.TOO_SHORT' }
// ]
```

## Examples

### Example 1: Basic Login Form

```typescript
import { useFormValidation } from '@/composables/useFormValidation';
import * as z from 'zod';

const ERROR_KEY = {
  EMAIL_INVALID: 'EMAIL.INVALID',
  REQUIRED: 'REQUIRED',
} as const;

const errorMapper = createI18nErrorMapper(
  {
    [ERROR_KEY.EMAIL_INVALID]: 'VALIDATION.EMAIL.INVALID',
    [ERROR_KEY.REQUIRED]: 'VALIDATION.REQUIRED',
  },
  { fallback: () => 'VALIDATION.UNKNOWN_ERROR' }
);

const loginSchema = z.object({
  email: z.string().email({ message: ERROR_KEY.EMAIL_INVALID }),
  password: z.string().min(1, { message: ERROR_KEY.REQUIRED }),
});

const form = useFormValidation({
  validationSchema: loginSchema,
  i18nErrorMapper: errorMapper,
  initialValues: { email: '', password: '' },
  validationMode: 'lazy',
});

const onSubmit = form.handleSubmit(async (values) => {
  await api.login(values);
});
```

### Example 2: Registration with Confirmation

```typescript
const registrationSchema = z.object({
  email: z.string().email({ message: ERROR_KEY.EMAIL_INVALID }),
  password: z.string().min(8, { message: ERROR_KEY.PASSWORD_TOO_SHORT }),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: ERROR_KEY.TERMS_REQUIRED,
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: ERROR_KEY.PASSWORD_NOT_MATCH,
  path: ['confirmPassword'],
});

const form = useFormValidation({
  validationSchema: registrationSchema,
  i18nErrorMapper: errorMapper,
  initialValues: {
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  },
  validationMode: 'lazy',
});
```

### Example 3: Backend Error Handling

```typescript
import { mapErrorFields } from '@/helpers';

const onSubmit = form.handleSubmit(async (values) => {
  try {
    await api.register(values);
    router.push('/success');
  } catch (error) {
    if (error.response?.data?.errors) {
      const backendErrors = error.response.data.errors;
      
      // Map backend field names to form field names
      const mappedErrors = mapErrorFields({
        errors: backendErrors,
        fieldMap: {
          email_address: 'email',
          user_password: 'password',
          password_confirmation: 'confirmPassword',
        }
      });
      
      // Apply errors to form
      mappedErrors.forEach(({ field, key }) => {
        form.setFieldError(field, key);
      });
    }
  }
});
```

### Example 4: Manual Field Control

```typescript
// Programmatically set values
form.setValue('email', 'user@example.com');
form.setValues({
  email: 'user@example.com',
  password: 'secure123',
});

// Manual validation
const isEmailValid = form.validateField('email');
const isFormValid = form.validateForm();

// Custom error handling
if (serverSaysEmailTaken) {
  form.setFieldError('email', ERROR_KEY.EMAIL_ALREADY_EXISTS);
}

// Clear errors
form.clearFieldError('email');

// Get field state
const emailState = form.getFieldState('email');
console.log(emailState);
// {
//   value: 'user@example.com',
//   errors: '',
//   meta: { touched: true, dirty: true, valid: true }
// }
```

### Example 5: Dynamic Schema Updates

```typescript
import { ref, watch } from 'vue';

const accountType = ref<'personal' | 'business'>('personal');

const getSchema = (type: string) => {
  const baseSchema = {
    email: z.string().email(),
    password: z.string().min(8),
  };

  if (type === 'business') {
    return z.object({
      ...baseSchema,
      companyName: z.string().min(1, { message: ERROR_KEY.REQUIRED }),
      taxId: z.string().min(1, { message: ERROR_KEY.REQUIRED }),
    });
  }

  return z.object(baseSchema);
};

const schema = ref(getSchema(accountType.value));

const form = useFormValidation({
  validationSchema: schema.value,
  i18nErrorMapper: errorMapper,
  initialValues: {},
});

watch(accountType, (newType) => {
  schema.value = getSchema(newType);
  form.validateForm();
});
```

### Example 6: Form Reset Patterns

```typescript
// Reset to initial values
form.resetForm();

// Reset with new values
form.resetForm({
  values: { email: 'new@example.com', password: '' }
});

// Reset after successful submission
const onSubmit = form.handleSubmit(async (values) => {
  await api.submit(values);
  form.resetForm(); // Clear form
});

// Reset with specific state
form.resetForm({
  values: form.values.value,
  errors: {},
  meta: {
    touched: {},
    dirty: {},
    valid: true,
    submitting: false,
  }
});
```

### Example 7: Conditional Validation

```typescript
const requireBillingAddress = ref(false);

const checkoutSchema = computed(() => 
  z.object({
    email: emailField,
    shippingAddress: addressSchema,
    billingAddress: requireBillingAddress.value 
      ? addressSchema 
      : z.object({}).optional(),
  })
);

const form = useFormValidation({
  validationSchema: checkoutSchema.value,
  i18nErrorMapper: errorMapper,
  initialValues: {},
});

watch(checkoutSchema, () => {
  form.validateForm();
});
```

## Best Practices

### 1. Leverage TypeScript

Always use TypeScript for type safety:

```typescript
// ✅ Good - Type-safe
const form = useFormValidation<LoginFormValues>({...});

// ❌ Bad - No type safety
const form = useFormValidation({...});
```

### 3. Consistent Naming Conventions

Use consistent patterns for error keys and i18n keys:

```typescript
// Error keys: CATEGORY.SPECIFIC_ERROR
ERROR_KEY.EMAIL_INVALID
ERROR_KEY.PASSWORD_TOO_SHORT

// I18n keys: VALIDATION.CATEGORY.SPECIFIC_ERROR
'VALIDATION.EMAIL.INVALID'
'VALIDATION.PASSWORD.TOO_SHORT'
```

### 4. Reuse Common Validations

Create reusable field validators:

```typescript
// schemas/common-fields.ts
export const emailField = z
  .string({ required_error: ERROR_KEY.EMAIL_REQUIRED })
  .email({ message: ERROR_KEY.EMAIL_INVALID });

export const phoneField = z
  .string({ required_error: ERROR_KEY.PHONE_REQUIRED })
  .regex(/^\+?[1-9]\d{1,14}$/, { message: ERROR_KEY.PHONE_INVALID });

// Use in multiple schemas
export const loginSchema = z.object({
  email: emailField,
  // ...
});

export const registrationSchema = z.object({
  email: emailField,
  phone: phoneField,
  // ...
});
```

### 5. Handle Backend Errors Gracefully

Always map backend errors to form fields:

```typescript
try {
  await api.submit(values);
} catch (error) {
  if (error.response?.data?.errors) {
    const mapped = mapErrorFields({
      errors: error.response.data.errors,
      fieldMap: backendToFormFieldMap,
    });
    
    mapped.forEach(({ field, key }) => {
      form.setFieldError(field, key);
    });
  } else {
    // Handle unexpected errors
    toast.error('An unexpected error occurred');
  }
}
```

### 6. Provide Meaningful Fallbacks

Always define a fallback for unmapped errors:

```typescript
export const errorMapper = createI18nErrorMapper(
  mappings,
  {
    fallback: (errorKey) => {
      // Log for debugging
      console.warn(`Unmapped error key: ${errorKey}`);
      
      // Return user-friendly fallback
      return 'VALIDATION.COMMON.UNKNOWN_ERROR';
    }
  }
);
```

## Troubleshooting

### Common Issues

**Q: Validation doesn't trigger on field change**

A: Check your `validationMode` setting. Use `'eager'` for instant validation or ensure fields are touched with `'lazy'` mode.

**Q: Backend errors not showing in form**

A: Verify your field mapping in `mapErrorFields` matches your form field names exactly.

**Q: TypeScript errors with error keys**

A: Ensure your error keys use `as const` assertion and types are properly exported.

**Q: Form stays invalid after clearing errors**

A: Call `form.validateForm()` after programmatically clearing errors to update form state.