interface CompressOptions {
    type?: 'png' | 'jpeg' | 'webp';

    /**
     * appropriate: jepg | webp
     * default: 0.92
     */
    q?: number;
}

function getImg(blob: Blob): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = URL.createObjectURL(blob);
        image.onload = () => resolve(image);
        image.onerror = () =>
            reject('compressing error: MIME TYPE IS NOT IMAGE');
    });
}

export async function compressImg(file: File, options: CompressOptions = {}): Promise<File> {
    options.type = options.type || 'webp';
    options.q = (options.q && options.q >= 0 && options.q <= 1) ? options.q : 0.92;
    const image = await getImg(file);
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    canvas.getContext('2d')?.drawImage(image, 0, 0);
    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(blob as File);
        }, `image/${options.type}`, options.q);
    });
}
