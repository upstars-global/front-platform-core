import { createEmailSchema } from "../../../../../shared/libs/validation/schemas/common";
import { AUTH_BACKEND_ERROR_KEY } from "../config/keys";

export const authEmailSchema = createEmailSchema({
  requiredMessage: AUTH_BACKEND_ERROR_KEY.VALUE_SHOULD_NOT_BE_BLANK,
  invalidMessage: AUTH_BACKEND_ERROR_KEY.EMAIL_INVALID_FORMAT,
});