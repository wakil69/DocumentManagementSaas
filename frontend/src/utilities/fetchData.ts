import { AxiosResponse } from "axios";

interface ApiResponse {
    message?: string;
    status?: number;
    [key: string]: any;
  }

export async function fetchData<T extends ApiResponse>(
  fetchFunction: Promise<AxiosResponse<T>>
): Promise<T | { message: string; status: number }> {
  try {
    const response = await fetchFunction;

    if (response.status === 200) {
      return response.data;
    }

    console.error("Error fetching data:", response);
    return {
      message: response.data?.message ?? "Unknown error",
      status: response.status,
    };
  } catch (error: any) {
    console.error("Fetch error:", error);

    const message =
      error?.response?.data?.message ?? error?.message ?? "Fetch failed";
    const status = error?.response?.status ?? 500;

    return {
      message,
      status,
    };
  }
}

export function hasMessage(
  obj: any
): obj is { message: string; status: number } {
  return obj && typeof obj === "object" && "message" in obj && "status" in obj;
}

export function isStatus500(
  obj: any
): obj is { message: string; status: number } {
  return hasMessage(obj) && obj.status === 500;
}

export function isStatus404(
  obj: any
): obj is { message: string; status: number } {
  return obj.status === 404;
}

export function isStatus403(
  obj: any
): obj is { message: string; status: number } {
  return hasMessage(obj) && obj.status === 403;
}

export function isStatus401(
  obj: any
): obj is { message: string; status: number } {
  return hasMessage(obj) && obj.status === 401;
}

export function isStatus400(
  obj: any
): obj is { message: string; status: number } {
  return hasMessage(obj) && obj.status === 400;
}

export function isStatus500Or404(
  obj: any
): obj is { message: string; status: number } {
  return hasMessage(obj) && (obj.status === 500 || obj.status === 404);
}
