"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type TrainingMode = "reaction" | "direction";
type DirectionChoice = "Left" | "Right" | "Brake" | "Stay";

type BaseVideoConfig = {
  id: string;
  title: string;
  mode: TrainingMode;
  src: string;
};

type ReactionVideoConfig = BaseVideoConfig & {
  mode: "reaction";
  earlyThreshold: number;
  perfectThresholdStart: number;
  perfectThresholdEnd: number;
};

type DirectionVideoConfig = BaseVideoConfig & {
  mode: "direction";
  correctDirection: DirectionChoice;
};

type TrainingVideoConfig = ReactionVideoConfig | DirectionVideoConfig;

const trainingVideoConfigs: TrainingVideoConfig[] = [
  {
    id: "reaction-1",
    title: "Reaction Timing 1",
    mode: "reaction",
    src: "/hazard-perception-training/videos/ReactionTime1.mov",
    earlyThreshold: 3.5,
    perfectThresholdStart: 3.5,
    perfectThresholdEnd: 4.0,
  },
  {
    id: "reaction-2",
    title: "Reaction Timing 2",
    mode: "reaction",
    src: "/hazard-perception-training/videos/ReactionTime2.mov",
    earlyThreshold: 3.5,
    perfectThresholdStart: 3.5,
    perfectThresholdEnd: 4.0,
  },
  {
    id: "reaction-3",
    title: "Reaction Timing 3",
    mode: "reaction",
    src: "/hazard-perception-training/videos/ReactionTime3.mov",
    earlyThreshold: 2.75,
    perfectThresholdStart: 2.75,
    perfectThresholdEnd: 3.25,
  },
  {
    id: "direction-1",
    title: "Direction Choice 1",
    mode: "direction",
    src: "/hazard-perception-training/videos/changeDirection1.mov",
    correctDirection: "Right",
  },
  {
    id: "direction-2",
    title: "Direction Choice 2",
    mode: "direction",
    // NOTE: file currently spelled "chnageDirection2.mov" in videos folder.
    src: "/hazard-perception-training/videos/changeDirection2.mov",
    correctDirection: "Right",
  },
  {
    id: "direction-3",
    title: "Direction Choice 3",
    mode: "direction",
    src: "/hazard-perception-training/videos/changeDirection3.mov",
    correctDirection: "Brake",
  },
];

const allDirections: DirectionChoice[] = ["Left", "Right", "Brake", "Stay"];

function randomConfig(excludeId: string | null): TrainingVideoConfig {
  if (trainingVideoConfigs.length === 1) return trainingVideoConfigs[0];
  let picked = trainingVideoConfigs[Math.floor(Math.random() * trainingVideoConfigs.length)];
  let guard = 0;
  while (picked.id === excludeId && guard < 10) {
    picked = trainingVideoConfigs[Math.floor(Math.random() * trainingVideoConfigs.length)];
    guard += 1;
  }
  return picked;
}

export default function HazardPerceptionTrainingPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastIdRef = useRef<string | null>(null);

  const [currentConfig, setCurrentConfig] = useState<TrainingVideoConfig | null>(null);
  const [feedback, setFeedback] = useState("");
  const [feedbackTone, setFeedbackTone] = useState<"" | "success" | "warning" | "error">("");
  const [hasSubmittedAttempt, setHasSubmittedAttempt] = useState(false);
  const [showDirectionButtons, setShowDirectionButtons] = useState(false);

  const modeLabel = useMemo(() => {
    if (!currentConfig) return "Mode: -";
    return currentConfig.mode === "reaction"
      ? "Mode: Reaction Timing"
      : "Mode: Direction Choice";
  }, [currentConfig]);

  const modeHint = useMemo(() => {
    if (!currentConfig) return "";
    if (currentConfig.mode === "reaction") {
      return hasSubmittedAttempt
        ? "Attempt recorded - playback stays paused (no replay)."
        : "Press SPACE BAR once to pause before the crash.";
    }
    return "Watch to the end, then choose the safest action.";
  }, [currentConfig, hasSubmittedAttempt]);

  const setFeedbackState = useCallback(
    (message: string, tone: "" | "success" | "warning" | "error" = "") => {
      setFeedback(message);
      setFeedbackTone(tone);
    },
    []
  );

  const lockReactionPlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.controls = false;
    video.pause();
  }, []);

  const loadRandomVideo = useCallback(() => {
    const next = randomConfig(lastIdRef.current);
    lastIdRef.current = next.id;
    setCurrentConfig(next);
    setFeedbackState("");
    setFeedbackTone("");
    setHasSubmittedAttempt(false);
    setShowDirectionButtons(false);

    const video = videoRef.current;
    if (!video) return;
    video.controls = true;
    video.src = next.src;
    video.load();
  }, [setFeedbackState]);

  const handleReactionAttempt = useCallback(() => {
    if (!currentConfig || currentConfig.mode !== "reaction") return;
    if (hasSubmittedAttempt) return;
    const video = videoRef.current;
    if (!video) return;

    setHasSubmittedAttempt(true);
    const pausedTime = video.currentTime;

    // EDIT THIS FOR VIDEO TIMING
    // CHANGE EARLY / PERFECT / LATE THRESHOLDS HERE
    if (pausedTime < currentConfig.earlyThreshold) {
      setFeedbackState(
        "You braked hard too early, which can cause an accident behind you",
        "warning"
      );
    } else if (
      pausedTime >= currentConfig.perfectThresholdStart &&
      pausedTime <= currentConfig.perfectThresholdEnd
    ) {
      setFeedbackState("Perfect Timing! You dodged the accident.", "success");
    } else {
      setFeedbackState("Oops you ran into an accident", "error");
    }

    lockReactionPlayback();
  }, [currentConfig, hasSubmittedAttempt, lockReactionPlayback, setFeedbackState]);

  const handleDirectionChoice = useCallback(
    (direction: DirectionChoice) => {
      if (!currentConfig || currentConfig.mode !== "direction") return;
      if (hasSubmittedAttempt) return;

      setHasSubmittedAttempt(true);

      // EDIT CORRECT DIRECTION HERE
      const isCorrect = direction === currentConfig.correctDirection;
      if (isCorrect) {
        setFeedbackState(`Correct! ${direction} was the safest option.`, "success");
      } else {
        setFeedbackState(
          `Incorrect. You chose ${direction}. Safest action: ${currentConfig.correctDirection}.`,
          "error"
        );
      }
    },
    [currentConfig, hasSubmittedAttempt, setFeedbackState]
  );

  useEffect(() => {
    loadRandomVideo();
  }, [loadRandomVideo]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const video = videoRef.current;
      if (!video || !currentConfig || currentConfig.mode !== "reaction") return;
      if (event.code !== "Space") return;
      if (hasSubmittedAttempt) return;
      if (video.paused || video.ended) return;

      event.preventDefault();
      video.pause();
      handleReactionAttempt();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [currentConfig, handleReactionAttempt, hasSubmittedAttempt]);

  return (
    <main className="min-h-screen bg-[#0F051D] text-[#F5F5F7]">
      <div className="mx-auto max-w-5xl px-4 pb-10 pt-6">
        <header className="border-b border-[#00F5FF]/10 pb-4">
          <h1 className="text-3xl font-semibold">Hazard Perception Training</h1>
          <p className="mt-1 text-[#B8B0D3]">
            Train reaction timing and hazard choices with dashcam scenarios.
          </p>
        </header>

        <section className="mt-4 rounded-xl border border-[#00F5FF]/15 bg-[#1C1132]/80 p-4">
          <h2 className="text-lg font-semibold">Rules</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-[#B8B0D3]">
            <li>
              <span className="font-semibold text-[#F5F5F7]">Reaction Timing:</span> press SPACE
              once to pause before the crash. After pausing, you cannot resume.
            </li>
            <li>
              <span className="font-semibold text-[#F5F5F7]">Direction Choice:</span> watch to the
              end, then choose the safest action.
            </li>
            <li>Use Next to load a new random clip at any time.</li>
          </ul>
        </section>

        <section className="relative mt-4 rounded-xl border border-[#00F5FF]/15 bg-[#1C1132]/80 p-4 pb-16">
          <h2 className="text-2xl font-semibold">
            {currentConfig?.title ?? "Loading a random clip..."}
          </h2>
          <p className="mt-2 inline-block rounded-full bg-[#00F5FF]/10 px-2 py-1 text-xs text-[#00F5FF]">
            {modeLabel}
          </p>

          <video
            ref={videoRef}
            className="mt-3 w-full rounded-lg border border-[#00F5FF]/15 bg-black"
            controls
            preload="metadata"
            onPlay={() => {
              if (currentConfig?.mode === "reaction" && hasSubmittedAttempt) {
                videoRef.current?.pause();
              }
            }}
            onEnded={() => {
              if (!currentConfig) return;

              if (currentConfig.mode === "reaction" && !hasSubmittedAttempt) {
                setHasSubmittedAttempt(true);
                setFeedbackState("Oops you ran into an accident", "error");
                lockReactionPlayback();
                return;
              }

              if (currentConfig.mode === "direction" && !hasSubmittedAttempt) {
                setShowDirectionButtons(true);
                setFeedbackState("Choose the safest action below.");
              }
            }}
          />

          <p className="mt-3 text-sm text-[#B8B0D3]">{modeHint}</p>
          <p
            className={`mt-2 min-h-[1.5rem] text-base font-bold ${
              feedbackTone === "success"
                ? "text-[#00F5FF]"
                : feedbackTone === "warning"
                  ? "text-amber-500"
                  : feedbackTone === "error"
                    ? "text-[#FF3B3F]"
                    : ""
            }`}
          >
            {feedback}
          </p>

          {showDirectionButtons ? (
            <div className="mt-3 grid grid-cols-2 gap-2 sm:max-w-sm">
              {allDirections.map((direction) => (
                <button
                  key={direction}
                  type="button"
                  onClick={() => handleDirectionChoice(direction)}
                  disabled={hasSubmittedAttempt}
                  className="rounded-md border border-[#00F5FF]/20 bg-[#1C1132]/80 px-3 py-2 text-sm font-semibold transition hover:border-[#00F5FF]/50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {direction}
                </button>
              ))}
            </div>
          ) : null}

          <button
            type="button"
            onClick={loadRandomVideo}
            className="absolute bottom-4 right-4 rounded-full bg-[#FF3B3F] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#e23337]"
          >
            Next
          </button>
        </section>
      </div>
    </main>
  );
}
