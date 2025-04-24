import { parseFromBRL } from "@/utils/unformat-brl-price";
import { api } from "../lib/api";
import { CreateProductFormType } from "../(dashboard)/create-product/page";

interface UploadResponse {
    data: {
        attachments: [
            {
                id: string;
                url: string;
            }
        ];
    };
}

export async function createProduct({
    title,
    description,
    priceInCents,
    category,
    files
}: CreateProductFormType,
) {
    try {
        let photoId; //só pra atribuir dentro da condicional, senão não enxergo ela no response;

        if (files) {
            const formData = new FormData();
            formData.append("files", files[0]);

            const uploadResponse: UploadResponse = await api.post("/attachments", formData);
            const { id } = uploadResponse.data.attachments[0]; //esse array vem do backend assim que subimos um novo arquivo (attachment)
            photoId = id;
        }
        await api.post("/products", {
            title,
            categoryId: category,
            description,
            priceInCents: parseFromBRL(priceInCents),
            attachmentsIds: [files ? photoId : null],
        });

    } catch (err: unknown) {
        console.error("Erro ao criar produto:", err);
        throw err;
    }
}
