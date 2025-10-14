import { BACKEND_PREFIX, UNKNOWN_VALIDATION_ERROR_KEY, type ValidationError } from '../config/keys';
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
    })),
  } as const;
}

export function mapBackendErrors<
  T extends string,
  U extends Record<string, string>
>({
  errors,
  backendKeys,
  fieldMap,
}: {
  errors: Record<string, string[]>;
  backendKeys: U;
  fieldMap?: Record<string, T>;
}) {
  const mappedErrors: ValidationError<T, U[keyof U]>[] = [];

  for (const fieldKey in errors) {
    const [errorCode] = errors[fieldKey];
    const keyWithPrefix = `${BACKEND_PREFIX}.${errorCode}` as U[keyof U];

    const isKnownError = Object.values(backendKeys).includes(keyWithPrefix);

    const localizationKey = (isKnownError
      ? keyWithPrefix
      : UNKNOWN_VALIDATION_ERROR_KEY) as U[keyof U] | typeof UNKNOWN_VALIDATION_ERROR_KEY;

    const mappedFieldKey = fieldMap?.[fieldKey] || fieldKey;

    mappedErrors.push({
      key: localizationKey,
      field: mappedFieldKey as T,
      originalError: !isKnownError ? errorCode : undefined,
    });
  }

  return mappedErrors;
}
