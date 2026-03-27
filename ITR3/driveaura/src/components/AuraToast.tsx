"use client";

import { useEffect, useRef, useState } from "react";
import {
  AURA_POINTS_UPDATED_EVENT,
  type AuraPointsEventDetail,
} from "@/lib/auraPoints";

type ToastState = {
  earned: number;
  total: number;
  key: number;
};

export default function AuraToast() {
  const [toast, setToast] = useState<ToastState | null>(null);
  const [visible, setVisible] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const removeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleAuraUpdate(e: Event) {
      const detail = (e as CustomEvent<AuraPointsEventDetail>).detail;
      if (!detail || detail.earned <= 0) return;

      if (hideTimer.current) clearTimeout(hideTimer.current);
      if (removeTimer.current) clearTimeout(removeTimer.current);

      setToast({ earned: detail.earned, total: detail.total, key: Date.now() });
      setVisible(true);

      hideTimer.current = setTimeout(() => setVisible(false), 3500);
      removeTimer.current = setTimeout(() => setToast(null), 4000);
    }

    window.addEventListener(AURA_POINTS_UPDATED_EVENT, handleAuraUpdate);
    return () => {
      window.removeEventListener(AURA_POINTS_UPDATED_EVENT, handleAuraUpdate);
      if (hideTimer.current) clearTimeout(hideTimer.current);
      if (removeTimer.current) clearTimeout(removeTimer.current);
    };
  }, []);

  if (!toast) return null;

  return (
    <div
      key={toast.key}
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-4 shadow-2xl transition-all duration-500"
      style={{
        backgroundColor: "#1C1132",
        border: "1px solid rgba(0,245,255,0.35)",
        boxShadow: "0 0 24px rgba(0,245,255,0.15)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      {/* Glowing star icon */}
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg"
        style={{
          background: "linear-gradient(135deg, #00F5FF22 0%, #7B4FFF22 100%)",
          border: "1px solid rgba(0,245,255,0.4)",
        }}
        aria-hidden
      >
        ✦
      </span>

      <div className="flex flex-col">
        <p className="text-sm font-bold" style={{ color: "#00F5FF" }}>
          +{toast.earned} Aura Points earned!
        </p>
        <p className="text-xs" style={{ color: "#B8B0D3" }}>
          Total:{" "}
          <span className="font-semibold" style={{ color: "#F5F5F7" }}>
            {toast.total} pts
          </span>
        </p>
      </div>
    </div>
  );
}
