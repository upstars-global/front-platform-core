import { boolean, object, string, z } from 'zod';
import {
  createAcceptTermsSchema,
  createCountrySchema,
  createCurrencySchema,
  createEmailSchema,
  createPasswordSchema,
  PASSWORD_REQUIRED_LENGTH,
} from '../../../../shared';

const emailSchema = createEmailSchema();
const passwordSchema = createPasswordSchema({
  passwordMinLength: PASSWORD_REQUIRED_LENGTH
});
const countrySchema = createCountrySchema();
const currencySchema = createCurrencySchema();
const acceptTerms = createAcceptTermsSchema();

export const RegistrationFormSchema = object({
  login: emailSchema,
  password: passwordSchema,
  country: countrySchema,
  currency: currencySchema,

  acceptTerms: acceptTerms,

  promoCode: string().optional(),
  acceptNotifications: boolean().optional(),
});

export type RegistrationFormSchemaType = z.infer<typeof RegistrationFormSchema>
