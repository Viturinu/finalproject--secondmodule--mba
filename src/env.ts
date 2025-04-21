import * as z from "zod";

const envSchema = z.object({
    NEXT_PUBLIC_API_BASE_URL: z.string().url()
})

const parsedEnv = envSchema.safeParse({ NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL }); // ✅ Correto


if (!parsedEnv.success) {
    const errors = parsedEnv.error.flatten().fieldErrors;
    console.error(" Erros nas variáveis de ambiente:", errors);
    throw new Error(" Variáveis de ambiente inválidas. Corrija e tente novamente.");
}

export const env = parsedEnv.data;

