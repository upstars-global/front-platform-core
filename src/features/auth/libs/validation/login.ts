import * as z from "zod";

import {
  createEmailSchema,
  createFormSchema,
  createPasswordSchema,
} from '../../../../shared/libs/validation/schemas/common';
import { PASSWORD_REQUIRED_LENGTH } from '../../../../shared/libs/validation/config/keys';

const emailSchema = createEmailSchema();
const passwordSchema = createPasswordSchema({
  passwordMinLength: PASSWORD_REQUIRED_LENGTH
});

export const LoginFormSchema = createFormSchema({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginFormSchemaType = z.infer<typeof LoginFormSchema>
