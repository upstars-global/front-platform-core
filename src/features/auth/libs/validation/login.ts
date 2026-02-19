import * as z from "zod";

import {
  createEmailSchema,
  createFormSchema,
  createPasswordSchema,
  PASSWORD_REQUIRED_LENGTH,
} from '../../../../shared';

const emailSchema = createEmailSchema();
const passwordSchema = createPasswordSchema({
  passwordMinLength: PASSWORD_REQUIRED_LENGTH
});

export const LoginFormSchema = createFormSchema({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginFormSchemaType = z.infer<typeof LoginFormSchema>
