"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type QuizOption = {
  id: string;
  text: string;
};

type QuizQuestion = {
  id: string;
  prompt: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
};

type WeatherModule = {
  id: string;
  condition: string;
  title: string;
  summary: string;
  lessons: string[];
  quiz: QuizQuestion[];
};

const weatherModules: WeatherModule[] = [
  {
    id: "glare",
    condition: "Glare",
    title: "Glare Management Mini Module",
    summary:
      "Reduce visual fatigue and keep lane control when sunlight or headlight glare affects vision.",
    lessons: [
      "Glare can happen on sunny and cloudy days depending on light angle and surroundings.",
      "At night, glare also comes from oncoming headlights and rear-view mirror reflections.",
      "When meeting bright oncoming lights, look slightly to the right edge of your lane.",
      "Keep your windshield clean inside and out to reduce light scatter and haze.",
      "Use your sun visor in daytime glare and remove sunglasses when entering tunnels.",
      "At night, switch to low beams near other vehicles to reduce glare for everyone.",
      "Stay patient and lower speed when eye strain is reducing your awareness.",
    ],
    quiz: [
      {
        id: "glare-q1",
        prompt: "What is the safest eye focus when oncoming headlights are too bright?",
        options: [
          { id: "a", text: "Look directly at the headlights to judge distance." },
          { id: "b", text: "Look slightly to the right edge of your lane while scanning ahead." },
          { id: "c", text: "Close one eye until the vehicle passes." },
        ],
        correctOptionId: "b",
        explanation:
          "Looking to the right lane edge reduces glare impact while preserving directional control.",
      },
      {
        id: "glare-q2",
        prompt: "Which action helps most with daytime glare entering a tunnel?",
        options: [
          { id: "a", text: "Increase speed to get through quickly." },
          { id: "b", text: "Slow down, remove sunglasses, and turn headlights on." },
          { id: "c", text: "Keep sunglasses on and use hazard lights." },
        ],
        correctOptionId: "b",
        explanation:
          "Your eyes need time to adapt. Slowing and restoring visibility is the safer transition.",
      },
      {
        id: "glare-q3",
        prompt: "Why is a clean windshield important in glare conditions?",
        options: [
          { id: "a", text: "It makes speed feel slower." },
          { id: "b", text: "It reduces light scatter and improves visual clarity." },
          { id: "c", text: "It helps fuel efficiency more than visibility." },
        ],
        correctOptionId: "b",
        explanation:
          "Dirt and streaks spread light, making glare harsher and reducing contrast.",
      },
    ],
  },
  {
    id: "fog",
    condition: "Fog",
    title: "Fog Driving Mini Module",
    summary:
      "Use low-visibility driving techniques and safe pull-off decisions in dense fog.",
    lessons: [
      "If a fog warning exists before your trip, delay travel when possible.",
      "Slow down gradually and drive at a speed appropriate for your visible distance.",
      "Turn on full vehicle lighting and use low beams; high beams reflect moisture.",
      "If available, use fog lights together with low beams.",
      "Use pavement markings and the right edge as guidance references.",
      "Increase following distance and avoid passing, lane weaving, and sudden speed changes.",
      "If visibility becomes near zero, pull fully off the roadway into a safe area.",
      "Never stop on the travelled portion of the road during fog.",
    ],
    quiz: [
      {
        id: "fog-q1",
        prompt: "In dense fog, which headlights should be used?",
        options: [
          { id: "a", text: "High beams only." },
          { id: "b", text: "Low beams (plus fog lights if equipped)." },
          { id: "c", text: "Parking lights only." },
        ],
        correctOptionId: "b",
        explanation:
          "High beams reflect off fog droplets and reduce visibility; low beams cut less glare.",
      },
      {
        id: "fog-q2",
        prompt: "What is the correct response if visibility is rapidly dropping to near zero?",
        options: [
          { id: "a", text: "Stop in your lane with hazards on." },
          { id: "b", text: "Pull completely off the road into a safe parking area." },
          { id: "c", text: "Speed up to leave the fog quickly." },
        ],
        correctOptionId: "b",
        explanation:
          "Stopping on the travelled lane can trigger chain collisions in low visibility.",
      },
      {
        id: "fog-q3",
        prompt: "Which behavior is unsafe in fog?",
        options: [
          { id: "a", text: "Increasing following distance." },
          { id: "b", text: "Using lane markings as guidance." },
          { id: "c", text: "Passing slower vehicles when visibility is limited." },
        ],
        correctOptionId: "c",
        explanation:
          "Passing in fog increases conflict risk because sightlines and reaction windows are reduced.",
      },
    ],
  },
  {
    id: "rain",
    condition: "Rain",
    title: "Rain Safety Mini Module",
    summary:
      "Manage wet-road traction, hydroplaning risk, and reduced visibility in rain.",
    lessons: [
      "Roads become especially slippery when rain first starts.",
      "Hydroplaning can occur when tires lose contact with pavement due to water buildup.",
      "Reduce speed and avoid abrupt steering, hard braking, or sudden acceleration.",
      "Use low beams and keep wipers and defrosters in good working condition.",
      "Drive in clearer tire tracks where possible and look far ahead.",
      "Increase following distance to improve reaction time and reduce spray exposure.",
      "Avoid puddles that may hide potholes or reduce brake effectiveness.",
      "Maintain tire condition and tread depth to improve wet grip.",
    ],
    quiz: [
      {
        id: "rain-q1",
        prompt: "What best reduces hydroplaning risk?",
        options: [
          { id: "a", text: "Increase speed to cut through water." },
          { id: "b", text: "Lower speed and use smooth control inputs." },
          { id: "c", text: "Follow close behind large vehicles." },
        ],
        correctOptionId: "b",
        explanation:
          "Lower speed and gentle inputs help tires keep contact with the road surface.",
      },
      {
        id: "rain-q2",
        prompt: "In heavy rain, which lighting setup is safest?",
        options: [
          { id: "a", text: "High beams to see farther." },
          { id: "b", text: "Low beams with clear windshield and reduced speed." },
          { id: "c", text: "No lights in daytime rain." },
        ],
        correctOptionId: "b",
        explanation:
          "Low beams improve visibility in rain and avoid reflective glare from water droplets.",
      },
      {
        id: "rain-q3",
        prompt: "Why should drivers avoid deep puddles when possible?",
        options: [
          { id: "a", text: "They can hide hazards and reduce brake effectiveness." },
          { id: "b", text: "They always improve tire cooling." },
          { id: "c", text: "They guarantee better traction." },
        ],
        correctOptionId: "a",
        explanation:
          "Standing water can hide road damage and interfere with steering/braking response.",
      },
    ],
  },
  {
    id: "flooded-roads",
    condition: "Flooded Roads",
    title: "Flooded Road Response Mini Module",
    summary:
      "Make safer decisions around water-covered roads and post-water brake checks.",
    lessons: [
      "Avoid flooded roads whenever possible; water can impair braking.",
      "If you must pass through water, proceed slowly and steadily.",
      "After leaving water, test your brakes safely to dry and assess response.",
      "A safe brake check includes firm stopping and confirming straight-line behavior.",
      "If brake pedal feel remains spongy or vehicle pulls, seek immediate repair.",
      "Do not assume normal braking returns instantly after water exposure.",
      "Keep extra spacing from vehicles ahead where spray and standing water persist.",
      "Plan alternate routes during heavy rain alerts to avoid known flood zones.",
    ],
    quiz: [
      {
        id: "flood-q1",
        prompt: "What is the best first choice when you see a flooded section ahead?",
        options: [
          { id: "a", text: "Drive through at normal speed." },
          { id: "b", text: "Avoid it and choose a safer route if possible." },
          { id: "c", text: "Speed up so less water enters wheel wells." },
        ],
        correctOptionId: "b",
        explanation:
          "Avoidance is safest because flood depth, road damage, and brake impact are uncertain.",
      },
      {
        id: "flood-q2",
        prompt: "After driving through water, what should be checked when safe?",
        options: [
          { id: "a", text: "Only tire pressure." },
          { id: "b", text: "Brake response, pedal feel, and straight stopping." },
          { id: "c", text: "Radio signal strength." },
        ],
        correctOptionId: "b",
        explanation:
          "Water can reduce braking performance, so function and stability must be confirmed.",
      },
      {
        id: "flood-q3",
        prompt: "Which symptom after water exposure indicates immediate service is needed?",
        options: [
          { id: "a", text: "Pedal remains spongy or car pulls when braking." },
          { id: "b", text: "Engine fan noise changes briefly." },
          { id: "c", text: "Defroster warms slowly." },
        ],
        correctOptionId: "a",
        explanation:
          "Persistent spongy feel or pulling indicates potentially unsafe brake condition.",
      },
    ],
  },
  {
    id: "skids",
    condition: "Skids",
    title: "Skid Prevention & Recovery Mini Module",
    summary:
      "Prevent skids through smooth control, and apply recovery basics without panic.",
    lessons: [
      "Skids are common on slippery surfaces like wet, icy, snowy, or loose roads.",
      "Excess speed for conditions is a major skid trigger.",
      "Hard braking, sharp turning, and abrupt acceleration can break tire grip.",
      "Reduce speed and keep all control inputs smooth and measured.",
      "If a skid starts, ease off pedals and steer where you want the vehicle to go.",
      "Avoid oversteering corrections that can create secondary loss of control.",
      "Regain control first, then brake gently and progressively.",
      "Practice emergency techniques with a qualified instructor when possible.",
    ],
    quiz: [
      {
        id: "skid-q1",
        prompt: "What is the most common cause of skids?",
        options: [
          { id: "a", text: "Driving too fast for road conditions." },
          { id: "b", text: "Using windshield wipers." },
          { id: "c", text: "Maintaining extra distance." },
        ],
        correctOptionId: "a",
        explanation:
          "Speed that exceeds traction conditions significantly increases loss-of-grip events.",
      },
      {
        id: "skid-q2",
        prompt: "If your vehicle begins to skid, what should you do first?",
        options: [
          { id: "a", text: "Panic brake and countersteer rapidly." },
          { id: "b", text: "Ease off controls and steer in intended direction." },
          { id: "c", text: "Shift to park immediately." },
        ],
        correctOptionId: "b",
        explanation:
          "Calm, smooth steering and reduced force help tires re-establish traction.",
      },
      {
        id: "skid-q3",
        prompt: "Which action increases skid risk during a turn?",
        options: [
          { id: "a", text: "Gentle steering and steady speed." },
          { id: "b", text: "Heavy braking while turning aggressively." },
          { id: "c", text: "Reducing speed before the curve." },
        ],
        correctOptionId: "b",
        explanation:
          "Combining high steering and braking force can overload tire grip limits.",
      },
    ],
  },
  {
    id: "snow",
    condition: "Snow",
    title: "Snow Driving Mini Module",
    summary:
      "Apply slower-speed, longer-distance, and low-traction control habits in snow.",
    lessons: [
      "Snow can be hard-packed, rutted, soft, or icy, each with different traction behavior.",
      "Slow down early and anticipate longer stopping distance.",
      "Avoid sudden steering, aggressive throttle, and hard braking.",
      "Look ahead for surface clues and changing track depth.",
      "Increase following distance to create a larger safety buffer.",
      "Keep lights, windows, and mirrors clear to maximize vision.",
      "Do not use cruise control in snow or other inclement weather.",
      "Carry winter essentials for delays or unexpected stoppages.",
    ],
    quiz: [
      {
        id: "snow-q1",
        prompt: "What is the safest braking approach on snowy roads?",
        options: [
          { id: "a", text: "Brake late and firmly like dry pavement." },
          { id: "b", text: "Brake earlier with smooth, gradual pressure." },
          { id: "c", text: "Avoid braking entirely and downshift only." },
        ],
        correctOptionId: "b",
        explanation:
          "Earlier, smoother braking helps prevent wheel slip and control loss.",
      },
      {
        id: "snow-q2",
        prompt: "Which driving aid should be avoided in snowy conditions?",
        options: [
          { id: "a", text: "Defroster." },
          { id: "b", text: "Cruise control." },
          { id: "c", text: "Low-beam headlights." },
        ],
        correctOptionId: "b",
        explanation:
          "Cruise control can react poorly to changing traction and delay driver response.",
      },
      {
        id: "snow-q3",
        prompt: "Why is extra following distance critical in snow?",
        options: [
          { id: "a", text: "It gives longer braking and hazard reaction time." },
          { id: "b", text: "It improves fuel economy only." },
          { id: "c", text: "It keeps heaters working better." },
        ],
        correctOptionId: "a",
        explanation:
          "Reduced traction increases stopping distance, so spacing is a key safety margin.",
      },
    ],
  },
  {
    id: "whiteouts",
    condition: "Whiteouts",
    title: "Whiteout Survival Mini Module",
    summary:
      "Handle near-zero visibility in blowing snow with disciplined, low-risk decisions.",
    lessons: [
      "If whiteout conditions are forecast, delay non-essential travel.",
      "Use low beams (and fog lights if available), not high beams.",
      "Slow down gradually and avoid abrupt lane changes or passing.",
      "Increase following distance and monitor for warning signs and changing visibility.",
      "Reduce in-car distractions and keep full attention on road cues.",
      "If visibility nears zero, pull off into a safe area rather than stopping in-lane.",
      "If stranded, remain with your vehicle for safety and warmth.",
      "Use emergency flashers and ventilate vehicle when running engine sparingly.",
    ],
    quiz: [
      {
        id: "whiteout-q1",
        prompt: "In whiteout conditions, which light setting is preferred?",
        options: [
          { id: "a", text: "High beams to cut through snow." },
          { id: "b", text: "Low beams (plus fog lights if available)." },
          { id: "c", text: "No headlights to reduce reflections." },
        ],
        correctOptionId: "b",
        explanation:
          "High beams reflect off snow particles and worsen visibility.",
      },
      {
        id: "whiteout-q2",
        prompt: "What should you do if visibility drops close to zero?",
        options: [
          { id: "a", text: "Stop in your lane immediately." },
          { id: "b", text: "Pull into a safe off-road area and wait if needed." },
          { id: "c", text: "Pass slower traffic to reach clear air." },
        ],
        correctOptionId: "b",
        explanation:
          "Stopping in travel lanes can trigger multi-vehicle collisions in severe visibility loss.",
      },
      {
        id: "whiteout-q3",
        prompt: "If you become stranded in severe winter weather, safest guidance is to:",
        options: [
          { id: "a", text: "Leave the vehicle and walk for help immediately." },
          { id: "b", text: "Stay with the vehicle, use flashers, and ventilate if engine runs." },
          { id: "c", text: "Turn all lights off to save battery only." },
        ],
        correctOptionId: "b",
        explanation:
          "Your vehicle provides shelter and visibility for rescue, with ventilation needed for safety.",
      },
    ],
  },
  {
    id: "ice",
    condition: "Ice",
    title: "Ice & Black Ice Mini Module",
    summary:
      "Identify freezing risk zones and adjust speed/inputs before traction is lost.",
    lessons: [
      "As temperatures drop below freezing, wet roads can quickly become icy.",
      "Shaded areas, bridges, and overpasses often freeze before surrounding roads.",
      "Dark, shiny winter pavement may indicate black ice; treat it cautiously.",
      "Reduce speed before suspected ice zones rather than reacting on top of them.",
      "Increase following distance to compensate for reduced tire grip.",
      "Use gentle steering and braking; avoid sudden lane changes.",
      "Assume less traction than expected and prioritize smooth vehicle balance.",
      "Be especially cautious at dawn, dusk, and in persistent shadow corridors.",
    ],
    quiz: [
      {
        id: "ice-q1",
        prompt: "Which road area typically freezes first?",
        options: [
          { id: "a", text: "Bridges and overpasses." },
          { id: "b", text: "Only city intersections." },
          { id: "c", text: "Roads with heavy truck traffic only." },
        ],
        correctOptionId: "a",
        explanation:
          "Exposed bridge structures lose heat faster and develop ice earlier.",
      },
      {
        id: "ice-q2",
        prompt: "You suspect black ice ahead. What is safest?",
        options: [
          { id: "a", text: "Brake hard as soon as you reach it." },
          { id: "b", text: "Slow gradually before it and keep inputs smooth." },
          { id: "c", text: "Accelerate to minimize contact time." },
        ],
        correctOptionId: "b",
        explanation:
          "Speed reduction before the hazard and smooth controls help preserve traction.",
      },
      {
        id: "ice-q3",
        prompt: "Which visual clue can indicate black ice in winter?",
        options: [
          { id: "a", text: "Road surface looks dark and glossy." },
          { id: "b", text: "Road appears dry and matte gray-white." },
          { id: "c", text: "No shadows on the roadway." },
        ],
        correctOptionId: "a",
        explanation:
          "A shiny dark surface in freezing conditions is a common black-ice warning sign.",
      },
    ],
  },
  {
    id: "snow-plows",
    condition: "Snow Plows",
    title: "Snow Plow Safety Mini Module",
    summary:
      "Share the road safely with slow, wide, and staggered snow-removal equipment.",
    lessons: [
      "Snow-removal vehicles use flashing blue lights visible from distance.",
      "Plows may be wider than expected, including right-side wing extensions.",
      "On freeways, multiple plows may run staggered to clear all lanes together.",
      "Never attempt to pass between staggered plows.",
      "Maintain a large following distance to avoid spray and sudden snow ridges.",
      "Expect sudden speed variation and reduced visibility around plows.",
      "Be patient and wait for clear, legal, and safe passing opportunities.",
      "Treat plow zones as active work/safety spaces requiring defensive driving.",
    ],
    quiz: [
      {
        id: "plow-q1",
        prompt: "What do flashing blue lights on winter maintenance vehicles indicate?",
        options: [
          { id: "a", text: "Police escort only." },
          { id: "b", text: "Wide, slow-moving snow-removal operations ahead." },
          { id: "c", text: "Road fully closed to all traffic." },
        ],
        correctOptionId: "b",
        explanation:
          "Blue lights warn drivers of active snow-removal vehicles and unusual operating width/speed.",
      },
      {
        id: "plow-q2",
        prompt: "What is the safest choice when plows are staggered across lanes?",
        options: [
          { id: "a", text: "Pass between plows before gaps close." },
          { id: "b", text: "Stay back and wait; do not pass between them." },
          { id: "c", text: "Tailgate the lead plow for visibility." },
        ],
        correctOptionId: "b",
        explanation:
          "Passing between plows is extremely dangerous due to narrow space and unstable snow.",
      },
      {
        id: "plow-q3",
        prompt: "Why should you keep extra distance behind a snow plow?",
        options: [
          { id: "a", text: "To avoid spray, low visibility, and sudden snow ridges." },
          { id: "b", text: "To increase the plow's speed." },
          { id: "c", text: "It is only for fuel savings." },
        ],
        correctOptionId: "a",
        explanation:
          "Following too closely reduces visibility and reaction time in unstable winter surfaces.",
      },
    ],
  },
];

export default function WeatherTrainingPage() {
  const [activeModuleId, setActiveModuleId] = useState(weatherModules[0].id);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const activeModule = useMemo(
    () => weatherModules.find((module) => module.id === activeModuleId) ?? weatherModules[0],
    [activeModuleId],
  );
  const answeredCount = activeModule.quiz.filter((q) => answers[q.id]).length;
  const score = activeModule.quiz.filter(
    (q) => answers[q.id] === q.correctOptionId,
  ).length;
  const allAnswered = answeredCount === activeModule.quiz.length;

  const handleOptionSelect = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const resetModuleQuiz = () => {
    const nextAnswers = { ...answers };
    for (const question of activeModule.quiz) {
      delete nextAnswers[question.id];
    }
    setAnswers(nextAnswers);
  };

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: "var(--void-purple)" }}
    >
      <div className="mx-auto max-w-3xl px-4 py-10">
      <header
        className="mb-8 border-b pb-6"
        style={{ borderColor: "var(--midnight-indigo)" }}
      >
        <h1 className="text-2xl font-semibold" style={{ color: "var(--ghost-white)" }}>
          Weather & Seasonal Hazard Training
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--lavender-mist)" }}>
          Nine mini-modules (Glare, Fog, Rain, Flooded Roads, Skids, Snow,
          Whiteouts, Ice, and Snow Plows), each paired with a quiz for
          immediate practice and feedback.
        </p>
        <p className="mt-2 text-xs" style={{ color: "var(--lavender-mist)" }}>
          Content expanded from Ontario MTO guidance for night and bad-weather
          driving.
        </p>
        <p
          className="mt-3 text-xs font-medium uppercase tracking-wide"
          style={{ color: "var(--lavender-mist)" }}
        >
          {weatherModules.length} modules · {activeModule.quiz.length} quiz
          questions in this module
        </p>
        <a
          href="https://www.ontario.ca/document/official-mto-drivers-handbook/driving-night-and-bad-weather"
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block text-xs underline"
          style={{ color: "var(--electric-cyan)" }}
        >
          Source: Ontario MTO Driver's Handbook (Night and Bad Weather)
        </a>
      </header>

      <section
        className="mb-6 rounded-xl border-2 p-4"
        style={{
          borderColor: "var(--midnight-indigo)",
          backgroundColor: "var(--midnight-indigo)",
        }}
      >
        <h2 className="mb-3 text-lg font-semibold" style={{ color: "var(--ghost-white)" }}>
          Modules
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {weatherModules.map((module) => {
            const active = module.id === activeModule.id;
            return (
              <button
                key={module.id}
                type="button"
                onClick={() => setActiveModuleId(module.id)}
                className="rounded-lg border-2 p-3 text-left transition-opacity hover:opacity-95"
                style={{
                  borderColor: active ? "var(--electric-cyan)" : "var(--void-purple)",
                  backgroundColor: "rgba(15, 5, 29, 0.7)",
                }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-wide"
                  style={{ color: "var(--electric-cyan)" }}
                >
                  {module.condition}
                </p>
                <p className="mt-1 text-sm font-semibold" style={{ color: "var(--ghost-white)" }}>
                  {module.title}
                </p>
                <p className="mt-1 text-xs" style={{ color: "var(--lavender-mist)" }}>
                  {module.quiz.length} quiz question{module.quiz.length > 1 ? "s" : ""}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      <section
        className="rounded-xl border-2 p-5"
        style={{
          borderColor: "var(--midnight-indigo)",
          backgroundColor: "var(--midnight-indigo)",
        }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: "var(--electric-cyan)" }}
        >
          {activeModule.condition}
        </p>
        <h2 className="mt-2 text-xl font-semibold" style={{ color: "var(--ghost-white)" }}>
          {activeModule.title}
        </h2>
        <p className="mt-2 text-sm" style={{ color: "var(--lavender-mist)" }}>
          {activeModule.summary}
        </p>

        <div
          className="mt-4 rounded-lg border-2 p-4"
          style={{
            borderColor: "var(--void-purple)",
            backgroundColor: "rgba(15, 5, 29, 0.7)",
          }}
        >
          <p className="text-sm font-semibold" style={{ color: "var(--ghost-white)" }}>
            Module content
          </p>
          <ul
            className="mt-2 list-disc space-y-2 pl-5 text-sm"
            style={{ color: "var(--lavender-mist)" }}
          >
            {activeModule.lessons.map((lesson) => (
              <li key={lesson}>{lesson}</li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <p className="text-base font-semibold" style={{ color: "var(--ghost-white)" }}>
            Quiz
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--lavender-mist)" }}>
            Answered {answeredCount}/{activeModule.quiz.length} · Score {score}/
            {activeModule.quiz.length}
          </p>

          <div className="mt-4 space-y-4">
            {activeModule.quiz.map((question) => {
              const selectedOptionId = answers[question.id];
              const hasAnsweredQuestion = Boolean(selectedOptionId);
              const isCorrect = selectedOptionId === question.correctOptionId;

              return (
                <article
                  key={question.id}
                  className="rounded-lg border-2 p-4"
                  style={{
                    borderColor: "var(--void-purple)",
                    backgroundColor: "rgba(15, 5, 29, 0.7)",
                  }}
                >
                  <p className="text-sm font-semibold" style={{ color: "var(--ghost-white)" }}>
                    {question.prompt}
                  </p>
                  <div className="mt-3 grid gap-2">
                    {question.options.map((option) => {
                      const isSelected = selectedOptionId === option.id;
                      const isCorrectOption = question.correctOptionId === option.id;

                      const style = hasAnsweredQuestion
                        ? isCorrectOption
                          ? {
                              borderColor: "var(--neon-mint)",
                              backgroundColor: "rgba(57, 255, 20, 0.10)",
                              color: "var(--ghost-white)",
                            }
                          : isSelected
                            ? {
                                borderColor: "var(--crimson-spark)",
                                backgroundColor: "rgba(255, 59, 63, 0.14)",
                                color: "var(--ghost-white)",
                              }
                            : {
                                borderColor: "var(--void-purple)",
                                backgroundColor: "rgba(15, 5, 29, 0.7)",
                                color: "var(--lavender-mist)",
                              }
                        : {
                            borderColor: "var(--void-purple)",
                            backgroundColor: "rgba(15, 5, 29, 0.7)",
                            color: "var(--ghost-white)",
                          };

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => handleOptionSelect(question.id, option.id)}
                          className="rounded border-2 px-3 py-2 text-left text-sm transition-opacity hover:opacity-95"
                          style={style}
                        >
                          {option.text}
                        </button>
                      );
                    })}
                  </div>

                  {hasAnsweredQuestion ? (
                    <p
                      className="mt-3 text-sm"
                      style={{
                        color: isCorrect ? "var(--neon-mint)" : "var(--crimson-spark)",
                      }}
                    >
                      {isCorrect ? "Correct." : "Needs improvement."} {question.explanation}
                    </p>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={resetModuleQuiz}
          disabled={!allAnswered}
          className="mt-6 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
          style={{ backgroundColor: "var(--crimson-spark)" }}
        >
          Retake this module quiz
        </button>
      </section>

      <Link
        href="/"
        className="mt-6 inline-block text-sm underline"
        style={{ color: "var(--lavender-mist)" }}
      >
        ← Back to Home
      </Link>
      </div>
    </main>
  );
}
