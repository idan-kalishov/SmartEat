import { CustomeToastPromise } from "@/components/CustomeToastPromise";

export const logMealToBackend = async (
  name: string,
  servingSize: number,
  nutrition: Record<string, number>
) => {
  const mealData = { name, servingSize, nutrition };

  return CustomeToastPromise(
    fetch("https://saveToBackEndAdress/log-meal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mealData),
    }).then(async (res) => {
      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || "Failed to log meal.");
      }
      return res.json();
    }),
    {
      loadingMessage: "Logging meal...",
      successMessage: `${name} was successfully saved!`,
      errorMessage: "Failed to log meal, Please try Again",
    }
  );
};
