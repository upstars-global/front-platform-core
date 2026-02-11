import * as z from "zod";

import {
  createAcceptTermsSchema,
  createCountrySchema,
  createCurrencySchema,
  createEmailSchema,
  createFormSchema,
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

export function RegistrationFormSchema(isAcceptTermsRequired: boolean = true) {
  return createFormSchema({
    email: emailSchema,
    password: passwordSchema,
    country: countrySchema,
    currency: currencySchema,
    promoCode: z.string().optional(),
    acceptNotifications: z.boolean().optional(),
    acceptTerms: isAcceptTermsRequired ? acceptTerms : z.boolean().optional(),
  });
}

export type RegistrationFormSchemaType = z.infer<ReturnType<typeof RegistrationFormSchema>>
