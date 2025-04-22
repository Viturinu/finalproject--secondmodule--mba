import { ProductFormType } from "../(dashboard)/edit-product/[id]/page";
import { api } from "../lib/api";

interface ProductFormTypeBranch extends ProductFormType{
    files:FileList|undefined;
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
    category,
    files
}: ProductFormTypeBranch,
 ) {
    try {
        let finalAttachmentId = attachmentsId; //aqui ele já fica com o antigo, caso entrar no if posterior, ele vai ser atribuido pra nova imagem

        if (files) {
            const formData = new FormData();
            formData.append("files", files[0]); //files é só o nome por conta do schema, mas na verdade ele é um file já; recuperamos o files?.[0] lá atras, logo não tem mais array FileList, agora é um só file, mas com nome files do schema; aqui já está result.data.file[0]

            const uploadResponse = await api.post("/attachments", formData);
            const { id : photoId } = uploadResponse.data.attachments[0]; //esse array vem do backend assim que subimos um novo arquivo (attachment)

            finalAttachmentId = photoId; //com o novo id
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
