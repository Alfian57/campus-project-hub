import { getAuthToken } from "@/lib/api";

import { getApiUrl } from "@/lib/env";

const API_BASE_URL = getApiUrl();

export interface UploadResponse {
  filename: string;
  url: string;
  size: number;
}

export interface UploadError {
  message: string;
}

/**
 * Upload a file to the server
 * @param file - File to upload
 * @returns Upload response with file URL
 */
export async function uploadFile(file: File): Promise<UploadResponse> {
  const token = getAuthToken();
  
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${getApiUrl()}/upload`, {
    method: "POST",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Gagal mengunggah file");
  }

  if (!data.success || !data.data) {
    throw new Error(data.message || "Gagal mengunggah file");
  }

  return data.data as UploadResponse;
}

/**
 * Upload multiple files to the server
 * @param files - Array of files to upload
 * @returns Array of upload responses
 */
export async function uploadMultipleFiles(files: File[]): Promise<UploadResponse[]> {
  const results = await Promise.all(files.map(uploadFile));
  return results;
}

/**
 * Delete an uploaded file from the server
 * @param filename - Filename to delete
 */
export async function deleteFile(filename: string): Promise<void> {
  const token = getAuthToken();
  
  const response = await fetch(`${getApiUrl()}/upload/${filename}`, {
    method: "DELETE",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Gagal menghapus file");
  }
}
