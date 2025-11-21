export function mapErrorFields<
  TErrors extends Record<string, readonly string[] | undefined>,
  TFieldMap extends Partial<{ [K in keyof TErrors]: string }> = object
>({
  errors,
  fieldMap,
}: {
  errors: TErrors;
  fieldMap?: TFieldMap;
}) {
  type ResultField = TFieldMap extends object 
    ? { [K in keyof TErrors]: K extends keyof TFieldMap ? TFieldMap[K] : K }[keyof TErrors]
    : keyof TErrors;

  type ErrorKey<T> = T extends readonly (infer K)[] ? K : never;
  type ResultKey = ErrorKey<TErrors[keyof TErrors]>;

  const mappedErrors: Array<{
    field: ResultField;
    key: ResultKey;
  }> = [];

  for (const fieldKey of Object.keys(errors) as Array<keyof TErrors>) {
    const fieldErrors = errors[fieldKey];

    if (!fieldErrors || !fieldErrors.length) {
      continue;
    }

    const [errorCode] = fieldErrors;
    const mappedFieldKey = (fieldMap?.[fieldKey] || fieldKey) as ResultField;
    
    mappedErrors.push({
      key: errorCode as ResultKey,
      field: mappedFieldKey,
    });
  }

  return mappedErrors;
}