/**
 * useARTracking — MediaPipe landmark detection stub.
 *
 * In production this integrates with @mediapipe/tasks-vision for hand/face/pose
 * detection and positions the 3D model over the correct anatomy.
 *
 * ⚠️ AR requires a physical device (ARKit 6+ / ARCore 1.40+).
 *    It will NOT work in the Expo Go simulator.
 */

export type ARTrackingTarget = 'ring' | 'necklace' | 'earring' | 'bracelet';

export interface LandmarkPoint {
  x: number; // 0–1 normalised
  y: number; // 0–1 normalised
  z: number; // depth estimate
  confidence: number; // 0–1
}

export interface ARTrackingState {
  isTracking: boolean;
  target: ARTrackingTarget | null;
  landmarks: LandmarkPoint[];
  fps: number;
}

/**
 * Returns live AR landmark tracking state.
 * Swap the stub implementation below for a real MediaPipe integration.
 */
export function useARTracking(
  target: ARTrackingTarget,
): ARTrackingState {
  // Stub — real implementation would use camera frames + MediaPipe WASM
  return {
    isTracking: false,
    target,
    landmarks: [],
    fps: 0,
  };
}
