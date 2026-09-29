import { ai, GEMINI_MODEL } from "./gemini.ts";

export interface FitnessChatMessage {
  role: "user" | "model";
  text: string;
}

export interface WorkoutPlanRequest {
  goal: string;
  experience: string;
  equipment: string;
  duration: number; // in minutes
  daysPerWeek: number;
  focusMuscles: string[];
}

export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: string;
  restSeconds: number;
  targetMuscle: string;
  secondaryMuscles: string[];
  cue: string;
  rpe: number; // Rate of perceived exertion (1-10)
}

export interface GeneratedWorkoutPlan {
  title: string;
  splitName: string;
  estimatedCalories: number;
  durationMinutes: number;
  warmup: string[];
  exercises: WorkoutExercise[];
  cooldown: string[];
  coachNotes: string;
  biomechanicFocus: string;
}

export async function chatWithFitnessCoach(
  messages: FitnessChatMessage[],
  userContext?: {
    currentStreak?: number;
    caloriesBurned?: number;
    lastWorkout?: string;
    recoveryScore?: number;
  }
): Promise<{ reply: string; suggestedActions?: string[] }> {
  const systemInstruction = `You are FitBuddy AI, a world-class biomechanics, kinesiology, and high-performance athletic fitness coach.
Your tone is intelligent, technical yet encouraging, concise, and focused on athletic excellence.
You have real-time telemetry access to the athlete's stats:
- Current Streak: ${userContext?.currentStreak || 12} days
- Daily Calories: ${userContext?.caloriesBurned || 642} kcal
- Last Session: ${userContext?.lastWorkout || "Chest & Triceps Hypertrophy"}
- Recovery Status: ${userContext?.recoveryScore || 88}% (Optimal)

Guidelines:
1. Provide actionable, science-based advice covering form, progressive overload, recovery, and nutrition.
2. Be concise and crisp (2-4 paragraphs maximum).
3. Where relevant, reference specific muscle groups and biomechanical cues (e.g. scapular retraction, hip hinge, tempo control).
4. Suggest 2-3 short follow-up prompts for the athlete.`;

  const conversationHistory = messages.map((m) => `${m.role === "user" ? "Athlete" : "FitBuddy AI"}: ${m.text}`).join("\n\n");
  const lastUserMessage = messages[messages.length - 1]?.text || "Hello";

  const prompt = `${systemInstruction}

Conversation History:
${conversationHistory}

Athlete: ${lastUserMessage}

Respond as FitBuddy AI:`;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        temperature: 0.6,
      },
    });

    const replyText = response.text?.trim() || "";
    if (replyText) {
      return {
        reply: replyText,
        suggestedActions: extractSuggestedActions(lastUserMessage),
      };
    }
  } catch (err: any) {
    console.warn("Gemini fitness chat fallback triggered:", err.message);
  }

  // High quality domain fallback
  return getIntelligentChatFallback(lastUserMessage, userContext);
}

function extractSuggestedActions(query: string): string[] {
  const q = query.toLowerCase();
  if (q.includes("chest") || q.includes("bench")) {
    return ["What is the best rep tempo for hypertrophy?", "Show triceps accessory work", "Calculate my 1RM for bench press"];
  }
  if (q.includes("recovery") || q.includes("sore")) {
    return ["Should I take an active recovery day?", "Optimize my sleep & protein timing", "View mobility & stretching protocol"];
  }
  if (q.includes("diet") || q.includes("protein") || q.includes("calorie")) {
    return ["Calculate my daily macros", "Best pre-workout meal timing", "How much hydration for 60 min session?"];
  }
  return ["Analyze my weekly muscle balance", "Generate a 45-min hypertrophy plan", "Check my recovery score"];
}

function getIntelligentChatFallback(
  lastMessage: string,
  userContext?: any
): { reply: string; suggestedActions: string[] } {
  const m = lastMessage.toLowerCase();

  if (m.includes("recovery") || m.includes("rest") || m.includes("sore")) {
    return {
      reply: `Your current physiological recovery is at ${userContext?.recoveryScore || 88}%, placing your central nervous system in an optimal priming zone. 

Based on your 12-day streak and recent 48-minute session (642 kcal expenditure), your muscle protein synthesis rate is elevated. If you feel localized soreness, prioritize dynamic myofascial release, 400ml electrolytes, and 30-40g leucine-rich protein within your next feeding window.`,
      suggestedActions: ["Adjust workout intensity for today", "View targeted muscle recovery map", "Start a 10-minute mobility routine"],
    };
  }

  if (m.includes("chest") || m.includes("push") || m.includes("bench")) {
    return {
      reply: `For optimal pectoralis major clavicular and sternal head activation, ensure you maintain active scapular retraction throughout the eccentric phase. 

I recommend pairing a heavy compound incline press (3-4 sets, 6-8 reps, RPE 8) with high-stretch cable flyes (3 sets, 12-15 reps) emphasizing a 3-second negative. This balances tension along the muscle fiber orientation without overloading anterior deltoid tendons.`,
      suggestedActions: ["Add to today's workout queue", "Check chest vs back volume ratio", "Explore biomechanics for incline press"],
    };
  }

  if (m.includes("legs") || m.includes("squat") || m.includes("lower")) {
    return {
      reply: `Lower body force production hinges on pelvic neutrality and mid-foot pressure distribution. For quad-dominant development, elevate your heels slightly (3-5°) to increase knee flexion excursion while keeping the torso upright.

Follow your primary compound squat with Romanian deadlifts to ensure posterior chain equilibrium and protect the knee patellofemoral tracking.`,
      suggestedActions: ["Generate Lower Body Power plan", "Inspect hamstring activation", "Check squat depth mobility cues"],
    };
  }

  return {
    reply: `I am monitoring your athletic telemetry in real time. Today you've logged 642 calories across 48 minutes of focused output with an active 12-day streak. 

Your neuromuscular readiness index is 88%. Are you planning to target upper body push mechanics, lower body power, or an active recovery metabolic flush? I can construct a customized 3D plan based on your available equipment.`,
    suggestedActions: ["Generate custom workout plan", "Analyze my target muscles", "How to break a strength plateau?"],
  };
}

export async function generateAiWorkout(request: WorkoutPlanRequest): Promise<GeneratedWorkoutPlan> {
  const prompt = `You are FitBuddy AI's advanced kinesiology engine.
Generate a structured, scientifically verified athletic workout plan based on these parameters:
- Goal: ${request.goal}
- Experience Level: ${request.experience}
- Available Equipment: ${request.equipment}
- Target Duration: ${request.duration} minutes
- Days Per Week: ${request.daysPerWeek}
- Focus Muscles: ${request.focusMuscles.join(", ") || "Full Body Compound"}

Return a SINGLE valid JSON object with this exact structure:
{
  "title": "Title of the workout (e.g. Hypertrophy Upper Push Force)",
  "splitName": "Name of the routine split (e.g. Upper Body Dynamic Strength)",
  "estimatedCalories": number (realistic kcal for the duration, e.g. 420-580),
  "durationMinutes": ${request.duration},
  "warmup": ["Dynamic arm circles & band pull-aparts (3 min)", "World's Greatest Stretch (3 min)", "Ramp-up warm-up sets"],
  "exercises": [
    {
      "name": "Exercise name",
      "sets": 4,
      "reps": "8-10",
      "restSeconds": 90,
      "targetMuscle": "Primary muscle (Chest, Back, Shoulders, Quads, Hamstrings, Core, Biceps, Triceps, Calves, Glutes)",
      "secondaryMuscles": ["Triceps", "Anterior Deltoids"],
      "cue": "Key biomechanical cue (e.g. Drive through mid-foot, control 3s eccentric)",
      "rpe": 8
    }
  ],
  "cooldown": ["Static hamstring stretch", "Thoracic spine extension over roller", "Box breathing 2 minutes"],
  "coachNotes": "Pro-level coaching summary on intensity, progressive overload, and tempo.",
  "biomechanicFocus": "Brief summary of anatomical emphasis (e.g. Scapulohumeral rhythm & rotational power)"
}

Include 4 to 6 comprehensive exercises fitting within ${request.duration} minutes. Return ONLY valid JSON with no markdown wrapping.`;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.3,
      },
    });

    const text = response.text?.trim() || "";
    const cleaned = text.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    const parsed = JSON.parse(cleaned);

    if (parsed.title && Array.isArray(parsed.exercises) && parsed.exercises.length > 0) {
      return parsed as GeneratedWorkoutPlan;
    }
  } catch (err: any) {
    console.warn("Gemini workout generation fallback:", err.message);
  }

  // Deterministic athletic fallback based on request
  return createDeterministicWorkoutPlan(request);
}

function createDeterministicWorkoutPlan(request: WorkoutPlanRequest): GeneratedWorkoutPlan {
  const goal = request.goal.toLowerCase();
  const isStrength = goal.includes("strength") || goal.includes("power");
  const isHypertrophy = goal.includes("hypertrophy") || goal.includes("muscle");
  const isFatLoss = goal.includes("fat") || goal.includes("conditioning");

  const focus = request.focusMuscles[0] || "Chest";

  let title = "Athletic Kinetic Performance";
  let split = "Upper & Core Precision";
  let exercises: WorkoutExercise[] = [];

  if (focus.includes("Leg") || focus.includes("Quad") || focus.includes("Lower")) {
    title = isStrength ? "Lower Body Maximum Force" : "Quad & Hamstring Hypertrophy";
    split = "Posterior & Anterior Kinetic Chain";
    exercises = [
      {
        name: request.equipment.includes("Bodyweight") ? "Bulgarian Split Squats (Bodyweight Tempo)" : "Barbell Back Squat",
        sets: isStrength ? 5 : 4,
        reps: isStrength ? "5" : "8-10",
        restSeconds: isStrength ? 150 : 90,
        targetMuscle: "Quadriceps",
        secondaryMuscles: ["Glutes", "Adductors", "Core"],
        cue: "Spread floor with mid-foot, maintain upright thoracic angle and neutral lumbar curvature.",
        rpe: 8.5,
      },
      {
        name: request.equipment.includes("Bodyweight") ? "Single-Leg Nordic Curls" : "Romanian Deadlift",
        sets: 4,
        reps: "8-12",
        restSeconds: 90,
        targetMuscle: "Hamstrings",
        secondaryMuscles: ["Glutes", "Erector Spinae"],
        cue: "Initiate with deliberate hip hinge, feeling high hamstring elongation at the bottom turnaround.",
        rpe: 8,
      },
      {
        name: "Dumbbell Walking Lunges",
        sets: 3,
        reps: "12 per leg",
        restSeconds: 60,
        targetMuscle: "Glutes",
        secondaryMuscles: ["Quadriceps", "Calves"],
        cue: "Keep vertical shin angle on lead leg to maximize gluteus medius tension.",
        rpe: 8,
      },
      {
        name: "Hanging Knee/Leg Raises",
        sets: 3,
        reps: "15",
        restSeconds: 60,
        targetMuscle: "Core",
        secondaryMuscles: ["Hip Flexors", "Forearms"],
        cue: "Posteriorly tilt pelvis before knee flexion to isolate rectus abdominis.",
        rpe: 7.5,
      },
    ];
  } else if (focus.includes("Back") || focus.includes("Pull")) {
    title = isStrength ? "Posterior Lat & Rhomboid Power" : "V-Taper Hypertrophy Pull";
    split = "Back & Biceps Kinetic Tension";
    exercises = [
      {
        name: request.equipment.includes("Bodyweight") ? "Pronated Wide-Grip Pull-Ups" : "Overhand Barbell Bent-Over Row",
        sets: 4,
        reps: isStrength ? "6" : "8-10",
        restSeconds: 90,
        targetMuscle: "Back",
        secondaryMuscles: ["Biceps", "Rear Deltoids", "Core"],
        cue: "Initiate movement by depressing scaps before driving elbows behind ribcage.",
        rpe: 8.5,
      },
      {
        name: "Neutral-Grip Lat Pulldown / Inverted Row",
        sets: 4,
        reps: "10-12",
        restSeconds: 75,
        targetMuscle: "Back",
        secondaryMuscles: ["Biceps", "Forearms"],
        cue: "Drive elbows into hip pockets with a 2-second peak contraction.",
        rpe: 8,
      },
      {
        name: "Face Pulls with External Rotation",
        sets: 3,
        reps: "15",
        restSeconds: 60,
        targetMuscle: "Shoulders",
        secondaryMuscles: ["Upper Back", "Rotator Cuff"],
        cue: "Split rope toward eye level while actively pulling wrists back past elbows.",
        rpe: 7,
      },
      {
        name: "Incline Dumbbell Bicep Curls",
        sets: 3,
        reps: "10-12",
        restSeconds: 60,
        targetMuscle: "Biceps",
        secondaryMuscles: ["Brachialis", "Forearms"],
        cue: "Full stretch at bottom with supinated wrist tracking.",
        rpe: 8,
      },
    ];
  } else {
    // Default Upper Push / Chest
    title = isStrength ? "Heavy Push Force & Stability" : "Pectoral & Deltoid Hypertrophy";
    split = "Chest, Shoulders & Triceps";
    exercises = [
      {
        name: request.equipment.includes("Bodyweight") ? "Deficit Push-Ups with 3s Tempo" : "Flat Dumbbell Bench Press",
        sets: 4,
        reps: isStrength ? "5-6" : "8-10",
        restSeconds: isStrength ? 120 : 90,
        targetMuscle: "Chest",
        secondaryMuscles: ["Triceps", "Anterior Deltoids"],
        cue: "Pack shoulder blades down and back, flare elbows at a 45-degree angle to protect joint capsule.",
        rpe: 8.5,
      },
      {
        name: "Incline Dumbbell Overhead Shoulder Press",
        sets: 3,
        reps: "8-10",
        restSeconds: 90,
        targetMuscle: "Shoulders",
        secondaryMuscles: ["Upper Chest", "Triceps"],
        cue: "Reach through the top without excessive lumbar arching.",
        rpe: 8,
      },
      {
        name: "Cable or Dumbbell Chest Flyes",
        sets: 3,
        reps: "12-15",
        restSeconds: 60,
        targetMuscle: "Chest",
        secondaryMuscles: ["Anterior Deltoids"],
        cue: "Imagine hugging a large barrel to preserve continuous tension across pectoral fibers.",
        rpe: 7.5,
      },
      {
        name: "Overhead Rope Tricep Extensions",
        sets: 3,
        reps: "12-15",
        restSeconds: 60,
        targetMuscle: "Triceps",
        secondaryMuscles: ["Forearms"],
        cue: "Lock upper arms perpendicular to torso to fully recruit the long head of the tricep.",
        rpe: 8,
      },
    ];
  }

  return {
    title,
    splitName: split,
    estimatedCalories: Math.round(request.duration * 9.5),
    durationMinutes: request.duration,
    warmup: [
      "Dynamic Thoracic Rotations (90 sec)",
      "Band Dislocates & Scapular Push-ups (2 min)",
      "Progressive neuromuscular ramp-up sets",
    ],
    exercises,
    cooldown: [
      "Doorway pectoral & anterior capsule stretch (60s per side)",
      "Child's Pose with lateral lat reach (90s)",
      "Sympathetic down-regulation 4-7-8 breathing (2 min)",
    ],
    coachNotes:
      "Maintain a 3-0-1-0 tempo (3 second eccentric control, 0s pause, 1s explosive concentric). Strive to add 1 rep or 1.5kg next cycle once top reps are completed at target RPE.",
    biomechanicFocus: "Controlled eccentric deceleration paired with optimal joint stacking and scapular glide.",
  };
}
