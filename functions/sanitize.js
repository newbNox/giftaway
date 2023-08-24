export async function sanitize(string, maxLength = 50){
    const sanitized = string.replace(/[^\w\s]/gi, '');
    const trimmed = sanitized.trim();
    const normalized = trimmed.normalize('NFKD');
    const safeStr = normalized.slice(0, maxLength);

    const escaped = safeStr.replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#x27;')
                    .replace(/\//g, '&#x2F;');

    return escaped;

}