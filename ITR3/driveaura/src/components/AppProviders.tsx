"use client";

import { usePathname } from "next/navigation";
import { AuthProvider } from "@/components/auth/AuthProvider";
import RouteAccessGate from "@/components/auth/RouteAccessGate";
import Navbar from "@/components/layout/Navbar";
import AuraToast from "@/components/AuraToast";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbar = Boolean(pathname?.startsWith("/quizzes/") && pathname !== "/quizzes");

  return (
    <AuthProvider>
      <RouteAccessGate />
      {!hideNavbar ? <Navbar /> : null}
      {children}
      <AuraToast />
    </AuthProvider>
  );
}
