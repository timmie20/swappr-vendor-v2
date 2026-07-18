import { ApiReject } from "@/types";
import axios from "axios";

function isApiRejectShape(value: unknown): value is ApiReject {
  if (typeof value !== "object" || value === null) return false;
  const message = (value as ApiReject).message;
  return typeof message === "string" || Array.isArray(message);
}

function formatApiMessage(message: string | string[]): string {
  return Array.isArray(message) ? message.join("\n") : message;
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiReject>(error)) {
    const message = error.response?.data?.message;
    if (message) return formatApiMessage(message);
    return error.message; // e.g. "Network Error"
  }

  // Handles the case where an interceptor already unwrapped
  // error.response.data before it reached here.
  if (isApiRejectShape(error)) {
    return formatApiMessage(error.message!);
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}
