import { boolean, object, string } from 'zod';
import {
  ClientErrorKey,
  createCountrySchema,
  createCurrencySchema,
  createEmailSchema,
  createPasswordSchema,
} from '../../../../shared';
import { authAPI } from 'src/entities/auth';
import { handleVerifyEmailResponse, VerifyEmailStatus } from '../handleVerifyEmailResponse';

const emailSchema = createEmailSchema();
const passwordSchema = createPasswordSchema();
const countrySchema = createCountrySchema();
const currencySchema = createCurrencySchema();

export const RegistrationFormSchema = object({
  login: emailSchema,
  password: passwordSchema,
  chosen_country: countrySchema,
  currency: currencySchema,

  accept_terms: boolean().parse(true),

  promo_code: string().optional(),
  accept_notifications: boolean().optional(),
});

interface ValidationOptions {
  verifyEmail?: (email: string) => Promise<ReturnType<typeof authAPI.verifyEmail>>;
}

export const API_VALIDATION_CODE = 'apiValidation';

export const createRegistrationFormSchemaWithEmailVerify = (options: ValidationOptions = {}) => {
  const verifyEmailFn = options.verifyEmail || authAPI.verifyEmail;
  
  return RegistrationFormSchema.superRefine(async ({ login }, ctx) => {
    const response = await verifyEmailFn(login);

    if (!response) {
      ctx.addIssue({
        code: 'custom',
        path: ['login'],
        message: ClientErrorKey.UnknownError,
        params: { code: API_VALIDATION_CODE },
      });

      return;
    }

    const { status, invalidCode } = handleVerifyEmailResponse(response);

    if ([VerifyEmailStatus.ERROR, VerifyEmailStatus.INVALID].includes(status)) {
      ctx.addIssue({
        code: 'custom',
        path: ['login'],
        message: invalidCode || ClientErrorKey.UnknownError,
        params: { code: API_VALIDATION_CODE },
      });

      return;
    }
  }) as typeof RegistrationFormSchema;
};
