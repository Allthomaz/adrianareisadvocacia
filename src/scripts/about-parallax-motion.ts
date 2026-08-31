export type MotionProfile = {
  pixelRatio: number;
  pointerEnabled: boolean;
  lerp: number;
  camera: readonly [number, number];
  pointer: readonly [number, number, number];
  scroll: readonly [number, number, number];
};

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const calculateScrollProgress = (
  rect: Pick<DOMRectReadOnly, "top" | "height">,
  viewportHeight: number,
) => {
  const midpoint = rect.top + rect.height * 0.5;
  const range = viewportHeight * 0.5 + rect.height * 0.5;
  return clamp((viewportHeight * 0.5 - midpoint) / range, -1.4, 1.4);
};

export const selectMotionProfile = (
  mobile: boolean,
  devicePixelRatio: number,
): MotionProfile =>
  mobile
    ? {
        pixelRatio: Math.min(devicePixelRatio, 1.5),
        pointerEnabled: false,
        lerp: 0.055,
        camera: [0, 0],
        pointer: [0, 0.025, 0.05],
        scroll: [0, 0.08, 0.14],
      }
    : {
        pixelRatio: Math.min(devicePixelRatio, 2),
        pointerEnabled: true,
        lerp: 0.06,
        camera: [0, 0],
        pointer: [0, 0.09, 0.16],
        scroll: [0, 0.1, 0.18],
      };
