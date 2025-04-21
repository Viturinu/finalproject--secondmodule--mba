import { api } from "../lib/api";
import { toast } from "sonner";

export interface SignInBody {
    email: string;
    password: string;
}

interface signUpBody {
    name: string;
    phone: string;
    avatarId: string;
    email: string;
    password: string;
    passwordConfirmation: string;
}

export async function signUp({ name, phone, avatarId, email, password, passwordConfirmation }: signUpBody) {

    try {
        const response = await api.post("/sellers", {
            name,
            phone,
            avatarId,
            email,
            password,
            passwordConfirmation
        });

        return response; // status 201 ou outro de sucesso
    } catch (err: unknown) {
        toast.error("Erro ao criar usuário, favor tentar novamente.");
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
