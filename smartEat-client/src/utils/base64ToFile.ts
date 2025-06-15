export const base64ToFile = async (
    base64String: string,
    fileName: string,
    mimeType: string,
    maxWidth = 1024,
    maxHeight = 1024,
    quality = 0.7 // JPEG compression (1 = best quality, 0 = smallest file)
): Promise<File> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = base64String;
        img.onload = () => {
            const canvas = document.createElement("canvas");
            let {width, height} = img;

            // Resize image while maintaining aspect ratio
            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width = Math.round(width * ratio);
                height = Math.round(height * ratio);
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (!ctx) return reject(new Error("Failed to create canvas context"));

            ctx.drawImage(img, 0, 0, width, height);

            // Convert canvas to compressed blob
            canvas.toBlob(
                (blob) => {
                    if (!blob) return reject(new Error("Compression failed"));
                    resolve(new File([blob], fileName, {type: mimeType}));
                },
                mimeType,
                quality
            );
        };
        img.onerror = (error) => reject(error);
    });
};

/**
 * Converts a File object to a base64-encoded string.
 * @param {File} file - The file to convert.
 * @returns {Promise<string>} - A promise that resolves with the base64-encoded string.
 */
export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};
