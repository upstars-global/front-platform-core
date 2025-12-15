import * as z from "zod";

import {
  createFormSchema,
  createPasswordSchema,
  PASSWORD_REQUIRED_LENGTH,
  BASE_CLIENT_ERROR_KEY,
} from '../../../../shared';

export const RestorePasswordFormSchema = createFormSchema({
  password: z.string().default(''),
  confirmPassword: z.string().default(''),
}).superRefine((data, ctx) => {
  const password = data.password || '';
  const confirmPassword = data.confirmPassword || '';
  
  if (password !== confirmPassword) {
    ctx.addIssue({
      code: 'custom',
      message: BASE_CLIENT_ERROR_KEY.PASSWORD_NOT_MATCH,
      path: ['confirmPassword'],
    });
    
    return z.NEVER;
  }
  
  const passwordSchema = createPasswordSchema({
    passwordMinLength: PASSWORD_REQUIRED_LENGTH,
  });
  
  const passwordResult = passwordSchema.safeParse(password);
  if (!passwordResult.success) {
    passwordResult.error.issues.forEach((issue) => {
      ctx.addIssue({
        ...issue,
        path: ['password'],
      });
    });
  }
  
  const confirmPasswordResult = passwordSchema.safeParse(confirmPassword);
  if (!confirmPasswordResult.success) {
    confirmPasswordResult.error.issues.forEach((issue) => {
      ctx.addIssue({
        ...issue,
        path: ['confirmPassword'],
      });
    });
  }
});

export type RestorePasswordFormSchemaType = z.infer<typeof RestorePasswordFormSchema>
