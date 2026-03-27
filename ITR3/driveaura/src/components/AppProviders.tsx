"use client";

import { AuthProvider } from "@/components/auth/AuthProvider";
import RouteAccessGate from "@/components/auth/RouteAccessGate";
import Navbar from "@/components/layout/Navbar";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <RouteAccessGate />
      <Navbar />
      {children}
    </AuthProvider>
  );
}
