interface CompressOptions {

    /**
     * 图片类型
     */
    type?: 'png' | 'jpeg' | 'webp' | 'bmp';

    /**
     * appropriate: jepg | webp
     * default: 0.92
     */
    q?: number;

    /**
     * 图片宽度
     */
    width?: number;

    /**
     * 图片高度
     */
    height?: number;
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

export async function compressImg(
    file: File,
    options: CompressOptions = {}
): Promise<File> {
    options.type = options.type || 'webp';
    options.q =
        options.q && options.q >= 0 && options.q <= 1 ? options.q : 0.92;
    const image = await getImg(file);
    const canvas = document.createElement('canvas');
    const ratio = image.width / image.height;

    if (options.width && !options.height) {
        canvas.width = options.width;
        canvas.height = Math.floor(options.width / ratio);
    } else if (!options.width && options.height) {
        canvas.width = Math.floor(options.height * ratio);
        canvas.height = options.height;
    } else if (options.width && options.height) {
        canvas.width = options.width;
        canvas.height = options.height;
    } else {
        canvas.width = image.width;
        canvas.height = image.height;
    }

    (canvas.getContext('2d') as CanvasRenderingContext2D).drawImage(
        image,
        0,
        0,
        canvas.width,
        canvas.height
    );

    return new Promise((resolve) => {
        canvas.toBlob(
            (blob) => resolve(blob as File),
            `image/${options.type}`,
            options.q
        );
    });
}
