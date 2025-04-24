// components/cropImage.ts
export default function getCroppedImg(imageSrc: string, crop: any): Promise<Blob> {
    return new Promise((resolve) => {
        const image = new Image(); //cria uma nova imagem
        image.src = imageSrc; //define a a source dessa imagem com o imaSrc passado via parametro, que no caso é a imagem cortada

        image.onload = () => { //no carregamento dessa imagem, ele define as medidas do canvas
            const canvas = document.createElement("canvas"); //cria um elemento <canvas>
            canvas.width = crop.width;
            canvas.height = crop.height;
            const ctx = canvas.getContext("2d"); //pega o contexto deste canvas

            ctx?.drawImage( //aqui é onde ele está recortando a imagem (desenhando ela de novo com draw()) e criando uma nova com o recorte (coordenadas dentro do drawImage)
                image,
                crop.x,
                crop.y,
                crop.width,
                crop.height,
                0,
                0,
                crop.width,
                crop.height
            );

            canvas.toBlob((blob) => { //transformando essa imagem em um Blob e enviando via resolve dentro da função
                if (blob) resolve(blob);
            }, "image/jpeg"); //sempre uma imagem/jpeg
        };
    });
}
