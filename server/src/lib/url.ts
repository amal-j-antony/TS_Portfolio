export function deriveHostname(url: string): string | null {
    try {
        const hostname = new URL(url).hostname.toLowerCase().replace(/^www\./, '')
        return hostname || null
    } catch {
        return null
    }
}

export function normalizeOptionalText(value: string | null | undefined): string | null {
    if (value === null || value === undefined) return null
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : null
}
