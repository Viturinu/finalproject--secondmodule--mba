import { CreateProductFormType } from "../(dashboard)/create-product/page";
import { api } from "../lib/api";

interface CreateProductFormTypeBranch extends CreateProductFormType {
    files: FileList | undefined;
}

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
}: CreateProductFormTypeBranch,
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

        const response = await api.post(`/products`, {
            title,
            categoryId: category,
            description,
            priceInCents,
            attachmentsIds: [files ? photoId : null],
        });

        if (response.status !== 200) {
            throw new Error(response.data);
        }
    } catch (err: unknown) {
        console.error("Erro ao editar produto:", err);
        throw err;
    }
}
