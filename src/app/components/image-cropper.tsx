// components/ImageCropper.tsx
"use client";
import Cropper from "react-easy-crop";
import { useCallback, useState } from "react";
import getCroppedImg from "./cropImage";

interface Props {
    image: string;
    onCancel: () => void;
    onCrop: (cropped: Blob) => void;
}

export function ImageCropper({ image, onCancel, onCrop }: Props) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedPixels, setCroppedPixels] = useState<any>();

    const handleCropComplete = useCallback((_area: any, areaPixels: any) => {
        setCroppedPixels(areaPixels);
    }, []);

    const handleFinish = async () => {
        const croppedBlob = await getCroppedImg(image, croppedPixels); //aqui ele manda a imagem e as cordenadas para corte que ele pegou no na seleção, e tem seu Blob retornado
        onCrop(croppedBlob); //no corte ele manda isso aqui
    };

    return (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black/70 z-50 flex flex-col justify-center items-center">
            <div className="relative w-[90vw] h-[70vh] bg-white rounded-lg overflow-hidden">
                <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={handleCropComplete}
                />
            </div>
            <div className="flex gap-4 mt-4">
                <button onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded">Cancelar</button>
                <button onClick={handleFinish} className="bg-orange-500 text-white px-4 py-2 rounded">Cortar</button>
            </div>
        </div>
    );
}
