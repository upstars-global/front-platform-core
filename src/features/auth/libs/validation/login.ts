import * as z from "zod";

import {
  BASE_CLIENT_ERROR_KEY,
  createEmailSchema,
  createFormSchema,
  createPasswordSchema,
  PASSWORD_REQUIRED_LENGTH,
} from '../../../../shared';

const emailSchema = createEmailSchema();
const passwordSchema = createPasswordSchema({
  lengthMessage: BASE_CLIENT_ERROR_KEY.PASSWORD_ENTER_LENGTH,
  passwordMinLength: PASSWORD_REQUIRED_LENGTH
});

export const LoginFormSchema = createFormSchema({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginFormSchemaType = z.infer<typeof LoginFormSchema>
