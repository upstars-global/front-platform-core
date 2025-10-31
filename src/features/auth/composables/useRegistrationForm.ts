import { useMultiLangStore } from "../../../entities/multilang";
import { useFormValidation, RegistrationType, mapErrorFields, type BaseClientErrorKey, type I18nErrorMapper} from "../../../shared";
import { ref } from "vue";
import { RegistrationFormSchema, type AuthBackendErrorKey, VerifyEmailStatus, type RegistrationFormSchemaType } from "../libs";
import { useEmailVerify } from "./useEmailVerify";
import { useRegister, RegistrationFailureError } from "./useRegister";
import { fingerprintHelper } from "../../../entities/covery";
import type { IbizaErrorKey } from "../../../entities/auth";

export type RegistrationErrorKey = BaseClientErrorKey | AuthBackendErrorKey | IbizaErrorKey

export function useRegistrationForm<T extends string>(i18nErrorMapper: I18nErrorMapper<RegistrationErrorKey, T>) {
    const { verifyEmail, isVerified: isEmailVerified, isVerifying: isEmailVerifying } = useEmailVerify();

    const form = useFormValidation<RegistrationFormSchemaType, RegistrationErrorKey, T>({
        validationSchema: RegistrationFormSchema,
        i18nErrorMapper,
    });

    const {
        values: formValues,
        setFieldError,
        validateField,
        errors,
        isSubmitting,
        handleSubmit,
        defineField,
        dirty,
        touched,
        valid,
    } = form;

    const loginField = defineField("login");
    const passwordField = defineField("password");
    const countryField = defineField("country");
    const currencyField = defineField("currency");
    const promoCodeField = defineField("promoCode");
    const acceptTermsField = defineField("acceptTerms");
    const acceptNotificationsField = defineField("acceptNotifications");

    const { register } = useRegister();
    const multiLangStore = useMultiLangStore();

    const isSuccess = ref(false);

    const onSubmit = handleSubmit(async (values) => {
        const {
            login,
            currency,
            password,
            acceptTerms: accept_terms,
            acceptNotifications: accept_notification,
            country: chosen_country,
            promoCode,
        } = values;

        const registrationData = fingerprintHelper({
            login,
            currency,
            password,
            auth_type: RegistrationType.EMAIL,
            localization: multiLangStore.userLocale || "",
            chosen_country,
            accept_notification,
            accept_terms,
            promo_code: promoCode || "",
        });

        try {
            await register(registrationData);

            isSuccess.value = true;
        } catch (error) {
            function isObject(data: unknown): data is Record<string, unknown> {
                return typeof data === "object" && data !== null;
            }

            let registrationError: unknown = undefined;
            if (error instanceof RegistrationFailureError) {
                registrationError = error.errorData;
            } else {
                registrationError = error;
            }

            let requestErrors: undefined | Partial<Record<string, AuthBackendErrorKey[]>> = undefined;
            let forbiddenError: undefined | string = undefined;
            let fraud: undefined | string = undefined;

            if (isObject(registrationError)) {
                if ("errors" in registrationError) {
                    requestErrors = registrationError.errors as Partial<Record<string, AuthBackendErrorKey[]>>;
                }
                if ("message" in registrationError) {
                    forbiddenError = registrationError.message as string;
                }
                if (
                    "error" in registrationError &&
                    isObject(registrationError.error) &&
                    "data" in registrationError.error &&
                    isObject(registrationError.error.data) &&
                    "message" in registrationError.error.data
                ) {
                    fraud = registrationError?.error?.data?.message as string;
                }
            }

            let message = "";
            let messageKey = "";

            const SERVER_VALIDATION_LOCALIZE_PREFIX = "VALIDATION_BACK";

            if (fraud) {
                message = `${SERVER_VALIDATION_LOCALIZE_PREFIX}.${fraud}`;
                messageKey = fraud;
            } else if (forbiddenError) {
                message = forbiddenError;
                messageKey = forbiddenError;
            }

            if (message && messageKey) {
                requestErrors = {
                    login: [ message as AuthBackendErrorKey ],
                };
            }
            if (requestErrors) {
                const mappedErrors = mapErrorFields({
                    errors: requestErrors,
                    fieldMap: {
                        chosen_country: "country",
                        promo_code: "promoCode",
                        accept_notifications: "acceptNotifications",
                    },
                });

                mappedErrors.forEach(({ field, key }) => {
                    // @ts-expect-error Lack of response type definition
                    setFieldError(field, key);
                });
            }
        }
    })

    const handleEmailChange = async (email?: string) => {
        const LOGIN_FIELD_KEY = "login";

        const isLoginValid = validateField(LOGIN_FIELD_KEY);

        if (!isLoginValid || !email) {
            return;
        }

        const response = await verifyEmail(email);

        if (response?.status === VerifyEmailStatus.INVALID && response.invalidCode) {
            const [ { field, key } ] = mapErrorFields({
                errors: {
                    [LOGIN_FIELD_KEY]: [ response.invalidCode ],
                },
            });

            setFieldError(field, key);
        }
    };

    return {
        isEmailVerified,
        isEmailVerifying,
        formValues,
        errors,
        isSubmitting,
        loginField,
        passwordField,
        countryField,
        currencyField,
        promoCodeField,
        acceptNotificationsField,
        acceptTermsField,
        isSuccess,
        dirty,
        touched,
        valid,
        setFieldError,
        onSubmit,
        handleSubmit,
        handleEmailChange,
    };
}
