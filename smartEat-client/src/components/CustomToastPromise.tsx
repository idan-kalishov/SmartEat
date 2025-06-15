import { toast } from "sonner";
import React from "react";

export function CustomToastPromise<T>(
  promise: Promise<T>,
  {
    loadingMessage = "Loading...",
    successMessage = "Success!",
    errorMessage = "Something went wrong.",
  }: {
    loadingMessage?: string | React.ReactNode;
    successMessage?: string | ((data: T) => string);
    errorMessage?: string | ((err: any) => string);
  }
) {
  return toast.promise(promise, {
    loading: (
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <img
          src="/gifs/mascot-jumping.gif"
          alt="Loading"
          style={{ width: "40px", height: "40px" }}
        />
        <span>{loadingMessage}</span>
      </div>
    ),
    icon: null,
    success:
      typeof successMessage === "function"
        ? (data) => successMessage(data)
        : successMessage,
    error:
      typeof errorMessage === "function"
        ? (err) => errorMessage(err)
        : (err) => errorMessage || err?.message,
    className: "[&>div]:justify-start",
  });
}
