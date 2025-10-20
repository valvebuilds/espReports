import { ApiResponse } from "./api";
export function handleError(error: unknown): ApiResponse {
  if (typeof error === "object" && error !== null && "success" in error) {
    const e = error as ApiResponse;
    console.error("[API ERROR]", e);
    return e;
  }

  console.error("[UNEXPECTED ERROR]", error);
  return {
    success: false,
    message: "Ocurrió un error inesperado.",
    timestamp: new Date().toISOString(),
  };
}