"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setAuthTokens } from "@/lib/api";
import { useAuth } from "@/components/providers/AuthContext";
import { Loader2 } from "lucide-react";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get("token");
      const refresh = searchParams.get("refresh");
      const errorParam = searchParams.get("error");

      if (errorParam) {
        setError(errorParam);
        setTimeout(() => router.push("/login"), 3000);
        return;
      }

      if (token && refresh) {
        setAuthTokens(token, refresh);
        await refreshUser();
        router.push("/dashboard");
      } else {
        setError("Token tidak ditemukan");
        setTimeout(() => router.push("/login"), 3000);
      }
    };

    handleCallback();
  }, [searchParams, router, refreshUser]);

  return (
    <div className="text-center">
      {error ? (
        <>
          <div className="text-red-500 mb-4 text-lg">{error}</div>
          <p className="text-zinc-400">Mengalihkan ke halaman login...</p>
        </>
      ) : (
        <>
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-zinc-300 text-lg">Memproses autentikasi...</p>
        </>
      )}
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-blue-950/20 flex items-center justify-center">
      <Suspense fallback={
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-zinc-300 text-lg">Memuat...</p>
        </div>
      }>
        <AuthCallbackContent />
      </Suspense>
    </div>
  );
}
