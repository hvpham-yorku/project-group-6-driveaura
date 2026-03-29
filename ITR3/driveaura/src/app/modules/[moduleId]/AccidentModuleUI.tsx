"use client";

import { useMemo, useState } from "react";

type Props = {
  title: string;
  description: string;
};

export default function AccidentModuleUI({ title, description }: Props) {
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const checklist = useMemo(
    () => [
      "Check yourself and passengers",
      "Check people in the other vehicle",
      "Call 911 immediately if someone is injured",
    ],
    [],
  );

  const toggle = (i: number) => {
    setChecked((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  const completed = Object.values(checked).filter(Boolean).length;
  const progress = Math.round((completed / checklist.length) * 100);

  return (
    <div
      style={{
        background: "#0F051D",
        color: "#E8E0FF",
        padding: "40px",
        borderRadius: "16px",
      }}
    >
      <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "10px" }}>
        {title}
      </h1>

      <p style={{ color: "#B8AACC", marginBottom: "20px" }}>{description}</p>

      <div style={{ marginBottom: "20px" }}>
        <div style={{ fontSize: "12px", marginBottom: "6px" }}>
          Progress: {completed} / {checklist.length}
        </div>
        <div style={{ height: "6px", background: "#ffffff10", borderRadius: "10px" }}>
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "#00F5FF",
              borderRadius: "10px",
              transition: "0.3s",
            }}
          />
        </div>
      </div>

      <div>
        {checklist.map((item, i) => (
          <div
            key={i}
            onClick={() => toggle(i)}
            style={{
              padding: "14px",
              marginBottom: "10px",
              borderRadius: "10px",
              background: checked[i]
                ? "rgba(0,245,255,0.15)"
                : "rgba(255,255,255,0.05)",
              border: checked[i]
                ? "1px solid rgba(0,245,255,0.4)"
                : "1px solid rgba(255,255,255,0.1)",
              cursor: "pointer",
              transition: "0.2s",
            }}
          >
            {item}
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "14px",
          borderLeft: "4px solid #FF3B3F",
          background: "rgba(255,59,63,0.08)",
          borderRadius: "8px",
        }}
      >
        🚨 Call 911 immediately if anyone is injured
      </div>
    </div>
  );
}

