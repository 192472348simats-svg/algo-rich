/**
 * Animation Engine for DSA Visualizations
 * Inspired by 3Blue1Brown's Manim - scene management, object primitives, timeline control
 */

export interface AnimationStep {
  id: string;
  description: string;
  duration: number; // ms
  action: () => void;
  codeLine?: number; // sync with code display
}

export interface SceneConfig {
  id: string;
  title: string;
  steps: AnimationStep[];
  width?: number;
  height?: number;
}

export interface TimelineState {
  currentStep: number;
  isPlaying: boolean;
  speed: number; // 0.5, 1, 1.5, 2
  totalSteps: number;
}

/**
 * Create a scene configuration for visualization playback.
 */
export function createScene(config: SceneConfig): SceneConfig {
  return {
    width: 800,
    height: 400,
    ...config,
  };
}

/**
 * Interpolate between two values.
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Ease-out-expo easing function.
 */
export function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/**
 * Generate array visualization box positions.
 */
export function getArrayBoxPositions(
  count: number,
  boxWidth: number,
  boxHeight: number,
  startX: number,
  startY: number,
  gap: number
): { x: number; y: number; width: number; height: number }[] {
  return Array.from({ length: count }, (_, i) => ({
    x: startX + i * (boxWidth + gap),
    y: startY,
    width: boxWidth,
    height: boxHeight,
  }));
}
