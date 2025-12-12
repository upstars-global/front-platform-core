import * as z from "zod";

import {
  createFormSchema,
  createPasswordMatchSchema,
  createPasswordSchema,
  PASSWORD_REQUIRED_LENGTH,
} from '../../../../shared';

export const RestorePasswordFormSchema = createPasswordMatchSchema(createFormSchema({
  password: createPasswordSchema({
    passwordMinLength: PASSWORD_REQUIRED_LENGTH,
  }),
  confirmPassword: createPasswordSchema({
    passwordMinLength: PASSWORD_REQUIRED_LENGTH,
  }),
}));

export type RestorePasswordFormSchemaType = z.infer<typeof RestorePasswordFormSchema>
