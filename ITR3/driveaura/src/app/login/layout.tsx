import React from "react";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <section
      className="min-h-[calc(100svh-56px)] bg-[#0F051D] text-[#F5F5F7]"
      style={{
        backgroundImage:
          "radial-gradient(900px 500px at 20% 10%, rgba(0,245,255,0.10), transparent 55%), radial-gradient(700px 420px at 80% 0%, rgba(255,59,63,0.10), transparent 60%)",
      }}
    >
      <div className="mx-auto flex min-h-[calc(100svh-56px)] max-w-6xl items-center justify-center px-4 py-10">
        {children}
      </div>
    </section>
  );
}

