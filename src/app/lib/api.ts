// import { env } from "@/env";

// export function api(path: string, init?: RequestInit) { //isso aqui é feito para substituir a URL base que temos quando usamos axios; aqui na web fetch api, utilizada pelo Next e aprimorada com recursos de caching, etc, nós não temos essa url base, portanto
//     const baseUrl = env.NEXT_PUBLIC_API_BASE_URL; //pega da variavbel de ambiente que foi tratada no src/env.ts
//     console.log(path)
//     const url = new URL(path, baseUrl); //aparentemente concatena o segundo parametro + o primeiro e cria a URL
//     console.log("URL ", url)
//     return fetch(url, init)
// }

// api("/category");
import axios from 'axios'

import { env } from '@/env'

export const api = axios.create({
    baseURL: env.NEXT_PUBLIC_API_BASE_URL,
    withCredentials: true,
});