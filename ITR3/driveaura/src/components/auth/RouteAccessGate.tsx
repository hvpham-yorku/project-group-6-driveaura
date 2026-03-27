"use client";

import { protectedRoutePrefixes } from "@/app/config/features";
import { useAuth } from "@/components/auth/AuthProvider";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

function isProtectedPath(pathname: string): boolean {
  return protectedRoutePrefixes.some((prefix) => pathname.startsWith(prefix));
}

export default function RouteAccessGate() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isProtected = useMemo(
    () => Boolean(pathname && isProtectedPath(pathname)),
    [pathname]
  );

  useEffect(() => {
    if (!pathname || loading || user || !isProtected) return;
    router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [isProtected, loading, pathname, router, user]);

  if (isProtected && loading) {
    return (
      <div className="border-b border-[#00F5FF]/15 bg-[#0F051D] px-4 py-2 text-center text-xs text-[#B8B0D3]">
        Checking access...
      </div>
    );
  }

  return null;
}
