import type { PaymentMethodResource } from "../../../../entities/cashbox";
import { useUserProfileStore } from "../../../../entities/user";

export function filterPayments(payments: PaymentMethodResource[]): PaymentMethodResource[] {
    const userProfileStore = useUserProfileStore();
    const { isVerified, isAntiFraudVerified } = userProfileStore.userInfo.verification;

    return payments.filter((payment: PaymentMethodResource) => {
        if (payment.kycVerificationRequired) {
            return isVerified || isAntiFraudVerified;
        }

        return true;
    });
}
