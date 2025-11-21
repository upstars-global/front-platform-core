import type z from "zod";

export function validateData<T>(schema: z.ZodType<T>, data: unknown) {
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