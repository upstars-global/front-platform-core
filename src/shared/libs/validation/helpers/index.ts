import { BACKEND_PREFIX, type ValidationError } from '../config/keys';
import { ZodSchema } from 'zod';

export function validateData<T>(schema: ZodSchema<T>, data: unknown): ValidationError[] | null {
  const result = schema.safeParse(data);

  if (result.success) return null;

  return result.error.issues.map((issue) => ({
    key: issue.message,
    field: issue.path.join('.'),
    zodIssue: issue,
  }));
}

export function mapBackendErrors({
  errors,
  fieldMap,
}: {
  errors: Record<string, string[]>;
  fieldMap?: Record<string, string>;
}): ValidationError[] {
  const mappedErrors: ValidationError[] = [];

  for (const fieldKey in errors) {
    const [errorCode] = errors[fieldKey];

    const localizationKey = `${BACKEND_PREFIX}.${errorCode}`;

    const mappedFieldKey = fieldMap?.[fieldKey] || fieldKey;

    mappedErrors.push({
      key: localizationKey,
      field: mappedFieldKey,
    });
  }

  return mappedErrors;
}
