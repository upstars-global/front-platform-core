import * as z from "zod";

import {
  createEmailSchema,
  createFormSchema,
} from '../../../../shared';
import { AUTH_BACKEND_ERROR_KEY } from "../../../../entities/auth";

const emailSchema = createEmailSchema({
  requiredMessage: AUTH_BACKEND_ERROR_KEY.VALUE_SHOULD_NOT_BE_BLANK,
  invalidMessage: AUTH_BACKEND_ERROR_KEY.EMAIL_INVALID_FORMAT,
});

export const RemindFormSchema = createFormSchema({
  login: emailSchema,
});

export type RemindFormSchemaType = z.infer<typeof RemindFormSchema>
