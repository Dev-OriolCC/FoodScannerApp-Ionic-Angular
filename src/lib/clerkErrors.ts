import { isClerkAPIResponseError } from "@clerk/expo";

export type AuthErrorField = "email" | "password" | "code" | "general";

export type AuthError = {
    field: AuthErrorField;
    message: string;
};

// Clerk codes look like "form_identifier_not_found", "form_password_incorrect",
// "form_code_incorrect"; the middle word tells us which input to blame.
export function parseClerkError(error: unknown): AuthError {
    if (isClerkAPIResponseError(error)) {
        const first = error.errors[0];
        const code = first?.code ?? "";
        const message = first?.longMessage ?? first?.message ?? "Something went wrong.";

        if (code.startsWith("form_identifier")) return { field: "email", message };
        if (code.startsWith("form_password")) return { field: "password", message };
        if (code.startsWith("form_code")) return { field: "code", message };
        return { field: "general", message };
    }

    const message = error instanceof Error ? error.message : "Something went wrong.";
    return { field: "general", message };
}
