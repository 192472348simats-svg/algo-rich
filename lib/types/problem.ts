// Complete type definitions for problems, test cases, patterns, and submissions

export interface Problem {
  id: string;
  slug: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";

  // Content
  description: string;
  examples: Example[];
  constraints: string[];
  hints: string[];
  starterCode: string;

  // Categorization
  pattern: string;
  topics: string[];
  companies?: string[];
  category: string;

  // Test Cases
  testCases: TestCase[];
  hiddenTestCases: TestCase[];

  // Solution
  solutionApproach: string;
  solutionCode: string;
  timeComplexity: string;
  spaceComplexity: string;

  // Visualization
  visualizationType?: VisualizationType;

  // Metadata
  order: number;
  isActive: boolean;
}

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface TestCase {
  id?: string;
  input: Record<string, unknown>;
  expectedOutput: unknown;
  description?: string;
  isHidden?: boolean;
}

export interface TestResult {
  testCaseIndex: number;
  passed: boolean;
  input: Record<string, unknown>;
  expectedOutput: unknown;
  actualOutput: unknown;
  executionTime: number; // ms
  error?: string;
}

export interface SubmissionResult {
  success: boolean;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  results: TestResult[];
  executionTime: number;
  memoryUsed?: number;
}

export type VisualizationType =
  | "array"
  | "array_memory"
  | "linked_list"
  | "linked_list_memory"
  | "two_pointers"
  | "sliding_window"
  | "hash_map"
  | "hash_map_memory"
  | "stack"
  | "stack_memory"
  | "queue"
  | "tree"
  | "tree_memory"
  | "heap"
  | "graph"
  | "recursion"
  | "binary_search";

export type PatternType =
  | "two_pointers"
  | "sliding_window"
  | "fast_slow_pointers"
  | "merge_intervals"
  | "cyclic_sort"
  | "linked_list_reversal"
  | "tree_bfs"
  | "tree_dfs"
  | "two_heaps"
  | "subsets"
  | "binary_search"
  | "top_k_elements"
  | "k_way_merge"
  | "topological_sort"
  | "dynamic_programming"
  | "hash_map";

export interface PatternDefinition {
  id: string;
  slug: string;
  name: string;
  description: string;
  whenToUse: string[];
  template: string;
  timeComplexity: string;
  spaceComplexity: string;
  difficulty: number;
  order: number;
}

// Helper to parse JSON fields from Prisma (stored as strings in SQLite)
export function parseProblem(raw: Record<string, unknown>): Problem {
  return {
    ...raw,
    examples: parseJsonField<Example[]>(raw.examples, []),
    constraints: parseJsonField<string[]>(raw.constraints, []),
    hints: parseJsonField<string[]>(raw.hints, []),
    topics: parseJsonField<string[]>(raw.topics, []),
    companies: parseJsonField<string[] | undefined>(raw.companies, undefined),
    testCases: parseJsonField<TestCase[]>(raw.testCases, []),
    hiddenTestCases: parseJsonField<TestCase[]>(raw.hiddenTestCases, []),
  } as unknown as Problem;
}

export function parsePattern(raw: Record<string, unknown>): PatternDefinition {
  return {
    ...raw,
    whenToUse: parseJsonField<string[]>(raw.whenToUse, []),
  } as unknown as PatternDefinition;
}

function parseJsonField<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
}
