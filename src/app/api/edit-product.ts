import { parseFromBRL } from "@/utils/unformat-brl-price";
import { ProductFormType } from "../(dashboard)/edit-product/[id]/page";
import { api } from "../lib/api";

interface ProductFormTypeBranch extends ProductFormType {
    isStatusChanged: boolean;
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

export async function editProduct({
    id,
    title,
    attachmentsId,
    description,
    priceInCents,
    status,
    isStatusChanged,
    category,
    files
}: ProductFormTypeBranch,
) {
    try {
        let finalAttachmentId = attachmentsId; //aqui ele já fica com o antigo, caso entrar no if posterior, ele vai ser atribuido pra nova imagem

        if (files) {
            const formData = new FormData();
            formData.append("files", files[0]);

            const uploadResponse: UploadResponse = await api.post("/attachments", formData);
            const { id: photoId } = uploadResponse.data.attachments[0]; //esse array vem do backend assim que subimos um novo arquivo (attachment)

            finalAttachmentId = photoId; //com o novo id
        }

        if (isStatusChanged) {
            await api.patch(`/products/${id}/${status}`); //Se status atual for diferente do status que estava, ele entra na condicional
        }

        await api.put(`/products/${id}`, {
            title,
            categoryId: category,
            description,
            priceInCents: parseFromBRL(priceInCents),
            attachmentsIds: [finalAttachmentId],
        });

    } catch (err: unknown) {
        console.error("Erro ao editar produto:", err);
        throw err;
    }
}
