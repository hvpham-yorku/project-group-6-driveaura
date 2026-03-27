const trainingVideoConfigs = [
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

const trainingVideo = document.getElementById("trainingVideo");
const videoTitle = document.getElementById("videoTitle");
const modeBadge = document.getElementById("modeBadge");
const modeHint = document.getElementById("modeHint");
const feedback = document.getElementById("feedback");
const directionButtonsContainer = document.getElementById("directionButtons");
const directionButtons = Array.from(directionButtonsContainer.querySelectorAll("button"));
const nextBtn = document.getElementById("nextBtn");

let currentConfig = null;
let hasSubmittedAttempt = false;
let isProgrammaticPause = false;
let lastRandomId = null;

function pickRandomConfig() {
  if (trainingVideoConfigs.length === 1) return trainingVideoConfigs[0];

  // Avoid repeating the same clip back-to-back when possible.
  let candidate = null;
  for (let i = 0; i < 10; i += 1) {
    candidate =
      trainingVideoConfigs[Math.floor(Math.random() * trainingVideoConfigs.length)];
    if (candidate.id !== lastRandomId) break;
  }
  lastRandomId = candidate.id;
  return candidate;
}

function setFeedback(message, tone = "") {
  feedback.textContent = message;
  feedback.className = "feedback";
  if (tone) feedback.classList.add(tone);
}

function clearDirectionButtons() {
  directionButtonsContainer.classList.add("hidden");
  directionButtons.forEach((btn) => {
    btn.disabled = false;
  });
}

function loadRandomVideo() {
  currentConfig = pickRandomConfig();

  hasSubmittedAttempt = false;
  clearDirectionButtons();
  setFeedback("");
  nextBtn.disabled = false;

  trainingVideo.src = currentConfig.src;
  trainingVideo.load();

  videoTitle.textContent = currentConfig.title;
  modeBadge.textContent =
    currentConfig.mode === "reaction" ? "Mode: Reaction Timing" : "Mode: Direction Choice";

  if (currentConfig.mode === "reaction") {
    trainingVideo.controls = true;
    modeHint.textContent = "Press SPACE BAR once to pause before the crash.";
  } else {
    trainingVideo.controls = true;
    modeHint.textContent = "Watch to the end, then choose the safest action.";
  }
}

function lockReactionPlayback() {
  trainingVideo.controls = false;
  trainingVideo.pause();
}

function handleReactionAttempt() {
  if (!currentConfig || currentConfig.mode !== "reaction") return;
  if (hasSubmittedAttempt) return;

  hasSubmittedAttempt = true;
  const pausedTime = trainingVideo.currentTime;

  // EDIT THIS FOR VIDEO TIMING
  // CHANGE EARLY / PERFECT / LATE THRESHOLDS HERE
  // You can adjust currentConfig.earlyThreshold, perfectThresholdStart, perfectThresholdEnd per video object.
  if (pausedTime < currentConfig.earlyThreshold) {
    setFeedback(
      "You braked hard too early, which can cause an accident behind you",
      "warning"
    );
  } else if (
    pausedTime >= currentConfig.perfectThresholdStart &&
    pausedTime <= currentConfig.perfectThresholdEnd
  ) {
    setFeedback("Perfect Timing! You dodged the accident.", "success");
  } else {
    // Anything after the perfect window counts as late.
    setFeedback("Oops you ran into an accident", "error");
  }

  lockReactionPlayback();
  modeHint.textContent = "Attempt recorded — playback stays paused (no replay).";
}

function handleDirectionChoice(selectedDirection) {
  if (!currentConfig || currentConfig.mode !== "direction") return;
  if (hasSubmittedAttempt) return;

  hasSubmittedAttempt = true;

  // EDIT CORRECT DIRECTION HERE
  // Change currentConfig.correctDirection in the config object for each direction mode video.
  const isCorrect = selectedDirection === currentConfig.correctDirection;
  if (isCorrect) {
    setFeedback(`Correct! ${selectedDirection} was the safest option.`, "success");
  } else {
    setFeedback(
      `Incorrect. You chose ${selectedDirection}. Safest action: ${currentConfig.correctDirection}.`,
      "error"
    );
  }

  directionButtons.forEach((btn) => {
    btn.disabled = true;
  });
}

nextBtn.addEventListener("click", () => {
  loadRandomVideo();
});

trainingVideo.addEventListener("play", () => {
  if (currentConfig?.mode === "reaction" && hasSubmittedAttempt) {
    trainingVideo.pause();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.code !== "Space") return;
  if (!currentConfig || currentConfig.mode !== "reaction") return;
  if (hasSubmittedAttempt) return;
  if (trainingVideo.paused || trainingVideo.ended) return;

  event.preventDefault();
  isProgrammaticPause = true;
  trainingVideo.pause();
  handleReactionAttempt();
});

trainingVideo.addEventListener("pause", () => {
  if (isProgrammaticPause) {
    isProgrammaticPause = false;
  }
});

trainingVideo.addEventListener("ended", () => {
  if (!currentConfig) return;

  if (currentConfig.mode === "reaction" && !hasSubmittedAttempt) {
    hasSubmittedAttempt = true;
    setFeedback("Oops you ran into an accident", "error");
    lockReactionPlayback();
    modeHint.textContent = "Attempt recorded — playback stays paused (no replay).";
    return;
  }

  if (currentConfig.mode === "direction" && !hasSubmittedAttempt) {
    directionButtonsContainer.classList.remove("hidden");
    setFeedback("Choose the safest action below.");
  }
});

directionButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    handleDirectionChoice(btn.dataset.direction);
  });
});

loadRandomVideo();
