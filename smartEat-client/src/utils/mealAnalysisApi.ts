import axios, { AxiosError } from "axios";

// Base URL for the API
const BASE_URL = "https://192.168.1.145:3000";

// Define the shape of the food recognition response
export interface FoodRecognitionResponse {
  foodName: string;
  quantity: number;
  weight: number;
  nutrition: {
    per100g: {
      calories: number;
      totalFat: number;
      sugars: number;
      protein: number;
      iron: number;
    };
  };
}

/**
 * Sends an image to the backend for food recognition.
 * @param {File} imageFile - The image file to send.
 * @returns {Promise<FoodRecognitionResponse[]>} - The response data from the backend.
 */
export const analyzeFoodImage = async (
  imageFile: File
): Promise<FoodRecognitionResponse[]> => {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await axios.post<FoodRecognitionResponse[]>(
      `${BASE_URL}/food-recognition/analyze`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000, // Optional: Increase timeout if needed
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    const axiosError = error as AxiosError;
    console.error(
      "Error analyzing image:",
      axiosError.response?.data || axiosError.message
    );
    throw new Error(
      `Failed to analyze the image. Please try again. ${JSON.stringify(
        axiosError
      )}`
    );
  }
};
