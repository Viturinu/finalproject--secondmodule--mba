export function formatPhone(value: string) {

    return value
        .replace(/\D/g, '') // remove tudo que não é número
        .replace(/^(\d{2})(\d)/, '($1)$2') // adiciona os parênteses do DDD
        .replace(/(\d{5})(\d)/, '$1-$2') // adiciona o hífen depois dos 5 dígitos
        .slice(0, 14); // limita a 14 caracteres (ex: (38)98818-2871)
}