import { isServer } from "src/shared/helpers";

declare global {
    interface Window {
        antifrodScriptsPath?: string;
        dfpObj?: {
            getDFP: () => string;
        };
    }
}

export function addCoveryScript() {
    if (typeof window !== "object" || typeof document !== "object") {
        return;
    }

    const antifrodScriptsPath = window.antifrodScriptsPath || "/svc/af/assets/js";

    const coveryScript = document.createElement("script");
    
    coveryScript.lang = "javascript";
    coveryScript.type = "text/javascript";
    coveryScript.async = true;
    coveryScript.src = `${antifrodScriptsPath}/c-dfp.js`;

    document.head.appendChild(coveryScript);
}

export function deviceFingerprint() {
    if (isServer || typeof window.dfpObj !== "object") {
        return "";
    }

    return window.dfpObj.getDFP() || "";
}
