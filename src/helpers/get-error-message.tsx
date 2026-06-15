import { ApiReject } from "@/types";
import axios from "axios";

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiReject>(error)) {
    const message = error.response?.data?.message;

    if (Array.isArray(message)) {
      // Validation errors — join into a readable list
      return message.join("\n");
    }

    if (typeof message === "string") {
      return message;
    }

    // Fallback to axios's own message (e.g. "Network Error")
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}
