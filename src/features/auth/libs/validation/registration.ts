import { boolean, object, string } from 'zod';
import { createCountrySchema, createCurrencySchema, createEmailSchema, createPasswordSchema } from '../../../../shared';

const emailSchema = createEmailSchema();
const passwordSchema = createPasswordSchema();
const countrySchema = createCountrySchema();
const currencySchema = createCurrencySchema();

export const RegistrationFormSchema = object({
  login: emailSchema,
  password: passwordSchema,
  chosen_country: countrySchema,
  currency: currencySchema,

  accept_terms: boolean().refine((value) => value, {
    message: 'REGISTRATION.ACCEPT_TERMS_MUST_BE_CHECKED',
  }),

  promo_code: string().optional(),
  accept_notifications: boolean().optional(),
  localization: string().optional(),
  auth_type: string().optional(),
  captcha_key: string().optional(),
  client_id: string().optional(),
});
