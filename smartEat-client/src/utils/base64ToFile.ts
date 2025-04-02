/**
 * Converts a base64 string to a File object.
 * @param {string} base64String - The base64-encoded image string.
 * @param {string} fileName - The name of the file.
 * @param {string} mimeType - The MIME type of the file (e.g., "image/jpeg").
 * @returns {Promise<File>} - A File object.
 */
export const base64ToFile = async (
  base64String: string,
  fileName: string,
  mimeType: string
): Promise<File> => {
  const res = await fetch(base64String);
  const blob = await res.blob();
  return new File([blob], fileName, { type: mimeType });
};
