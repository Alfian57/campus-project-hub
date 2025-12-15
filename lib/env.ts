export {};

declare global {
  interface Window {
    __ENV__: {
      NEXT_PUBLIC_API_URL?: string;
    };
  }
}

export function getApiUrl(): string {
  // Check if we are in the browser and have the injected env
  if (typeof window !== "undefined" && window.__ENV__?.NEXT_PUBLIC_API_URL) {
    return window.__ENV__.NEXT_PUBLIC_API_URL;
  }

  // Fallback to process.env (works on server and during build)
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
}
