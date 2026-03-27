import type { Metadata } from "next";
import ReadinessCheckClient from "./ReadinessCheckClient";

export const metadata: Metadata = {
  title: "Drive Readiness Check • DriveAura",
  description:
    "Assess your mental and physical readiness before driving. Get a readiness score and step-by-step strategies to reset focus and calm.",
};

export default function ReadinessCheckPage() {
  return <ReadinessCheckClient />;
}

