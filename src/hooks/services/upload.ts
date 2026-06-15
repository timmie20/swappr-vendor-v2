import { api } from "@/lib/api/client";

export interface UploadImageResponse {
  message: string;
  images: {
    url: string;
    public_id: string;
  }[];
}

/**
 * Upload image to Cloudinary via backend
 */
export const uploadImage = async (
  files: File[],
  onProgress?: (progress: number) => void,
): Promise<UploadImageResponse> => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  const { data } = await api.post<UploadImageResponse>(
    `/upload/images/products`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          onProgress(percentCompleted);
        }
      },
    },
  );

  return data;
};
