import { BACKEND_PREFIX, BackendErrorKey, UNKNOWN_VALIDATION_ERROR_KEY, type ValidationError } from '../config/keys';
import type { ZodType } from 'zod';

export function validateData<T>(schema: ZodType<T>, data: unknown) {
  const result = schema.safeParse(data);

  if (result.success) return { success: true, errors: null, data: result.data } as const;
  
  return { 
    success: false, 
    errors: result.error.issues.map((issue) => ({
      key: issue.message,
      field: issue.path.join('.'),
      zodIssue: issue,
    }))
  } as const;
}

export function mapBackendErrors<T extends string>({
  errors,
  fieldMap,
}: {
  errors: Record<T, string[]>;
  fieldMap?: Record<string, T>;
}) {
  const mappedErrors: ValidationError<T>[] = [];

  for (const fieldKey in errors) {
    const [errorCode] = errors[fieldKey];

    const keyWithPrefix = `${BACKEND_PREFIX}.${errorCode}`

    const isKnownError = Object.values(BackendErrorKey).includes(keyWithPrefix as BackendErrorKey);

    const localizationKey = isKnownError 
      ? keyWithPrefix
      : UNKNOWN_VALIDATION_ERROR_KEY;

    const mappedFieldKey = fieldMap?.[fieldKey] || fieldKey;

    mappedErrors.push({
      key: localizationKey,
      field: mappedFieldKey,
      originalError: !isKnownError ? errorCode : undefined,
    });
  }

  return mappedErrors;
}
