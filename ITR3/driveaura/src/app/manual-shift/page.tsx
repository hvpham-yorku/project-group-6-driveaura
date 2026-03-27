import type { Metadata } from "next";
import ManualShiftClient from "./ManualShiftClient";

export const metadata: Metadata = {
  title: "Manual Shift Trainer • DriveAura",
  description:
    "Practice shifting a manual car at the right RPM. Use keyboard or touch controls to master clutch, gear timing, and earn Aura points.",
};

export default function ManualShiftPage() {
  return <ManualShiftClient />;
}
