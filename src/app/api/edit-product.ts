import { ProductFormType } from "../(dashboard)/edit-product/[id]/page";
import { api } from "../lib/api";

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
    category,
    files
}: ProductFormType) {
    try {
        let finalAttachmentId = attachmentsId;

        if (files && files.length > 0) {
            const formData = new FormData();
            formData.append("files", files[0]);

            const uploadResponse: UploadResponse = await api.post("/attachments", formData);
            const { id: photoId } = uploadResponse.data.attachments[0];
            finalAttachmentId = photoId;
            console.log("MERDA" + finalAttachmentId);
        }

        const response = await api.put(`/products/${id}`, {
            title,
            categoryId: category,
            description,
            priceInCents,
            attachmentsIds: [finalAttachmentId],
        });

        if (response.status !== 200) {
            throw new Error(response.data);
        }
    } catch (err: unknown) {
        console.error("Erro ao editar produto:", err);
        throw err;
    }
}
