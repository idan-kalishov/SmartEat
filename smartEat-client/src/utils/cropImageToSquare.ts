export const cropImageToSquare = (imageSrc: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = imageSrc;

        img.onload = () => {
            try {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                if (!ctx) {
                    reject(new Error("Canvas context not available"));
                    return;
                }

                // Dimensions of the white square in the viewport
                const squareTop = 0.18 * window.innerHeight; // 18% of viewport height
                const squareLeft = 0.1 * window.innerWidth; // 10% of viewport width
                const squareWidth = 0.8 * window.innerWidth; // 80% of viewport width
                const squareHeight = 0.4 * window.innerHeight; // 40% of viewport height

                // Scale the square dimensions to match the webcam resolution
                const scale = img.width / window.innerWidth;
                const scaledSquareTop = squareTop * scale;
                const scaledSquareLeft = squareLeft * scale;
                const scaledSquareWidth = squareWidth * scale;
                const scaledSquareHeight = squareHeight * scale;

                // Set canvas dimensions to match the cropped area
                canvas.width = scaledSquareWidth;
                canvas.height = scaledSquareHeight;

                // Draw the cropped region onto the canvas
                ctx.drawImage(
                    img,
                    scaledSquareLeft,
                    scaledSquareTop,
                    scaledSquareWidth,
                    scaledSquareHeight,
                    0,
                    0,
                    scaledSquareWidth,
                    scaledSquareHeight
                );

                // Convert the canvas content back to a Base64 image
                resolve(canvas.toDataURL("image/jpeg"));
            } catch (error) {
                reject(error);
            }
        };

        img.onerror = () => {
            reject(new Error("Failed to load image."));
        };
    });
};
