export function firstErrorMessage(errors: readonly unknown[]): string | undefined {
    for (const error of errors) {
        if (typeof error === "string") return error
        if (
            error !== null &&
            typeof error === "object" &&
            "message" in error &&
            typeof (error as { message?: unknown }).message === "string"
        ) {
            return (error as { message: string }).message
        }
    }
    return undefined
}
