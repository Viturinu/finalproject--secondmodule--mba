import { api } from "../lib/api";
import { toast } from "sonner";
import axios from "axios";

export interface SignInBody {
    email: string;
    password: string;
}

export async function signIn({ email, password }: SignInBody) {
    try {
        const response = await api.post("/sellers/sessions", {
            email,
            password,
        });

        return response; // status 201 ou outro de sucesso
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
            if (err.response?.status === 403) {
                toast.error("Usuário/Senha incorretos.");
            } else {
                toast.error(`Erro inesperado: ${err.response?.status}`);
            }
        } else {
            toast.error("Erro desconhecido ao tentar logar.");
        }

        console.error("Erro ao tentar logar:", err);
        throw err; // opcional: relançar se quiser que o erro continue sendo tratado fora
    }
}
// try {
//     const response = await api("/sellers/sessions", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//         credentials: "include",
//     });

//     if (!response.ok) {
//         throw new Error("Erro no login");
//     }

//     const token = await response.json();
//     console.log(email + " - " + password + " = " + JSON.stringify(token));
// } catch (err) {
//     console.error("Erro ao fazer login - tente novamente mais tarde.", err);
// }
