export function unmaskPhone(masked: string) {
    return masked.replace(/\D/g, '');
}