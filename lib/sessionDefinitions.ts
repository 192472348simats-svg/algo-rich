// ──────────────────────────────────────────────────────
// Session Definitions — type system + registry
// ──────────────────────────────────────────────────────

/* ---- Stage configs ---- */

export interface HookConfig {
  headline: string;
  subtext: string;
  backgroundEmoji?: string;
}

export interface WatchAutoPlayStep {
  action: "insert" | "delete" | "search" | "traverse" | "lookup" | "push" | "pop" | "enqueue" | "dequeue";
  value?: number | string;
  narration: string;
  delayAfterMs: number;
}

// Phase 1 beginner visualizer step types
export interface TextFlowStep {
  text: string;
  label: string;
}
export interface BoxAnimationStep {
  action: "create" | "fill" | "read" | "update";
  label: string;
  value?: string | null;
  oldValue?: string;
  newValue?: string;
  output?: string;
}
export interface CounterAnimationStep {
  code: string;
  counter: number | string | null;
  output?: string;
  narration?: string;
}
export interface MachineAnimationStep {
  action: "show" | "run" | "code" | "compare";
  name?: string;
  inputs?: (string | number)[];
  output?: number | string;
  code?: string;
  print_ver?: string;
  return_ver?: string;
  narration?: string;
}

export interface WatchConfig {
  visualizerType:
    | "tree" | "array" | "linked-list" | "stack-queue" | "graph"
    | "text-flow" | "box-animation" | "counter-animation" | "machine-animation" | "hashmap";
  // Legacy tree/array steps
  autoPlaySteps?: WatchAutoPlayStep[];
  // Phase 1 beginner steps (typed loosely, each visualizer handles its own step shape)
  steps?: (TextFlowStep | BoxAnimationStep | CounterAnimationStep | MachineAnimationStep)[];
  narration?: string;
}

export interface PredictConfig {
  questions: {
    id: string;
    question: string;
    visualState?: unknown;
    answerType:
      | "click-node"
      | "click-direction"
      | "drag-order"
      | "multiple-choice"
      | "type-number";
    options?: string[];
    correctAnswer: string | number | number[];
    feedbackCorrect: string;
    feedbackWrong: string;
    xp: number;
  }[];
}

export interface LearnCard {
  title: string;
  content: string;
  example?: string;
}

export interface LearnConfig {
  title?: string;
  content?: string; // short markdown — MAX ~500 words
  keyRule?: {
    text: string;
    emoji: string;
  };
  codeSnippet?: {
    language: string;
    code: string;
    caption: string;
  };
  // Phase 1: multi-card format
  cards?: LearnCard[];
}

export interface GuidedBuildStep {
  instruction: string;
  hint?: string;
  celebration?: string | boolean;
  expectedOutput?: string | null;
}

export interface GuidedBuildConfig {
  // Legacy tree visualizer fields
  visualizerType?: "tree" | "array" | "linked-list";
  instructions?: string;
  valuesToInsert?: number[];
  validationMessages?: Record<number, string>;
  completionMessage?: string;
  bonusChallenge?: {
    instruction: string;
    values: number[];
    insightMessage: string;
  };
  // Phase 1: simple step-by-step code wizard
  steps?: GuidedBuildStep[];
}

export interface CodeConfig {
  problemSlug: string;
  contextHint?: string;
  hintAfterMinutes?: number;
  approachAfterMinutes?: number;
}

export interface ReflectConfig {
  questions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

// Summary config — computed from stage results; optional metadata for Phase 1
export interface SummaryConfig {
  xpEarned?: number;
  title?: string;
  message?: string;
  nextSession?: string;
}

/* ---- Discriminated stage union ---- */

export type StageConfig =
  | HookConfig
  | WatchConfig
  | PredictConfig
  | LearnConfig
  | GuidedBuildConfig
  | CodeConfig
  | ReflectConfig
  | SummaryConfig;

export type StageType =
  | "hook"
  | "watch"
  | "predict"
  | "learn"
  | "guided-build"
  | "code"
  | "reflect"
  | "summary";

export interface SessionStage {
  id: string;
  type: StageType;
  config: StageConfig;
}

/* ---- Full session definition ---- */

export interface SessionDefinition {
  id: string;
  slug: string;
  title: string;
  topic: string;
  description: string;
  estimatedMinutes: number;
  prerequisiteSessionSlug?: string;
  stages: SessionStage[];
  nextSessionSlug?: string;
  xpTotal: number;
}

/* ---- Registry ---- */

const sessionRegistry = new Map<string, SessionDefinition>();

export function registerSession(session: SessionDefinition) {
  if (sessionRegistry.has(session.slug)) {
    throw new Error(`Duplicate session slug registered: ${session.slug}`);
  }
  sessionRegistry.set(session.slug, session);
}

export function getSessionDefinition(
  slug: string
): SessionDefinition | undefined {
  return sessionRegistry.get(slug);
}

export function getAllSessionDefinitions(): SessionDefinition[] {
  return Array.from(sessionRegistry.values());
}

export function getSessionsByTopic(topic: string): SessionDefinition[] {
  return Array.from(sessionRegistry.values()).filter(
    (s) => s.topic === topic
  );
}

// ──────────────────────────────────────────────────────

// Topic-specific session imports
import { sessions as treesSessions } from "./sessions/trees";
import { sessions as arraysSessions } from "./sessions/arrays";
import { sessions as pythonfoundationsSessions } from "./sessions/python-foundations";
import { sessions as logicbuildingSessions } from "./sessions/logic-building";
import { sessions as linkedlistsSessions } from "./sessions/linked-lists";
import { sessions as stacksqueuesSessions } from "./sessions/stacks-queues";
import { sessions as hashmapsSessions } from "./sessions/hashmaps";
import { sessions as recursionSessions } from "./sessions/recursion";
import { sessions as sortingSessions } from "./sessions/sorting";
import { sessions as twopointersSessions } from "./sessions/two-pointers";
import { sessions as slidingwindowSessions } from "./sessions/sliding-window";
import { sessions as binarysearchSessions } from "./sessions/binary-search";

// Register all sessions
const allSessions: SessionDefinition[] = [
  ...treesSessions,
  ...arraysSessions,
  ...pythonfoundationsSessions,
  ...logicbuildingSessions,
  ...linkedlistsSessions,
  ...stacksqueuesSessions,
  ...hashmapsSessions,
  ...recursionSessions,
  ...sortingSessions,
  ...twopointersSessions,
  ...slidingwindowSessions,
  ...binarysearchSessions,
];

allSessions.forEach(registerSession);
