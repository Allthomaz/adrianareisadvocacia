import {
  calculateScrollProgress,
  selectMotionProfile,
} from "./about-parallax-motion";
import type { AboutParallaxScene } from "./about-parallax-scene";

export type ParallaxState =
  | "fallback"
  | "loading"
  | "ready"
  | "active"
  | "paused"
  | "reduced"
  | "unsupported";

export function mountAboutParallax(options: {
  frame: HTMLElement;
  host: HTMLElement;
  fallback: HTMLElement;
  profileRoot: HTMLElement;
}): () => void {
  const { frame, host } = options;
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = matchMedia("(max-width: 47.999rem)").matches;
  const profile = selectMotionProfile(mobile, devicePixelRatio || 1);
  let scene: AboutParallaxScene | undefined;
  let loading: Promise<void> | undefined;
  let visible = false;
  let destroyed = false;
  let rafId = 0;
  let initialCheckId = 0;
  let targetScroll = 0;
  let targetPointerX = 0;
  let targetPointerY = 0;

  const setState = (state: ParallaxState) => {
    frame.dataset.parallaxState = state;
  };

  frame.dataset.parallaxInput = profile.pointerEnabled
    ? "scroll-pointer"
    : "scroll";

  if (reduceMotion) {
    setState("reduced");
    return () => setState("fallback");
  }

  if (
    !("IntersectionObserver" in window) ||
    !("WebGLRenderingContext" in window)
  ) {
    setState("unsupported");
    return () => setState("fallback");
  }

  const updateScroll = () => {
    targetScroll = calculateScrollProgress(
      frame.getBoundingClientRect(),
      innerHeight,
    );
  };

  const renderFrame = () => {
    if (!scene || !visible || destroyed) return;
    scene.setScrollProgress(targetScroll);
    scene.setPointer(targetPointerX, targetPointerY);
    scene.render();
    rafId = requestAnimationFrame(renderFrame);
  };

  const start = () => {
    if (!scene || !visible || rafId) return;
    updateScroll();
    scene.setScrollProgress(targetScroll);
    scene.setPointer(targetPointerX, targetPointerY);
    scene.render();
    setState("active");
    rafId = requestAnimationFrame(renderFrame);
  };

  const pause = () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
    if (scene) setState("paused");
  };

  const resizeObserver = new ResizeObserver(() => scene?.resize());

  const load = () => {
    if (loading || scene || destroyed) return;
    setState("loading");
    loading = import("./about-parallax-scene")
      .then(({ createAboutParallaxScene }) =>
        createAboutParallaxScene({ host, profile, staticMode: false }),
      )
      .then((createdScene) => {
        if (destroyed) {
          createdScene.dispose();
          return;
        }
        scene = createdScene;
        resizeObserver.observe(frame);
        setState("ready");
        if (visible) start();
      })
      .catch(() => {
        if (!destroyed) setState("unsupported");
      });
  };

  const preloadObserver = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        load();
        preloadObserver.disconnect();
      }
    },
    { rootMargin: "100% 0px", threshold: 0 },
  );

  const activityObserver = new IntersectionObserver(
    ([entry]) => {
      visible = Boolean(
        entry?.isIntersecting && entry.intersectionRatio >= 0.1,
      );
      if (visible) start();
      else pause();
    },
    { rootMargin: "0px", threshold: [0, 0.1] },
  );

  const onPointerMove = (event: PointerEvent) => {
    const rect = frame.getBoundingClientRect();
    targetPointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    targetPointerY = -((event.clientY - rect.top) / rect.height - 0.5) * 2;
  };
  const onPointerLeave = () => {
    targetPointerX = 0;
    targetPointerY = 0;
  };

  preloadObserver.observe(frame);
  activityObserver.observe(frame);
  initialCheckId = requestAnimationFrame(() => {
    const rect = frame.getBoundingClientRect();
    const overlap = Math.max(
      0,
      Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 0),
    );
    visible = overlap / Math.max(rect.height, 1) >= 0.1;
    if (rect.top < innerHeight * 2 && rect.bottom > -innerHeight) load();
    if (visible) start();
  });
  addEventListener("scroll", updateScroll, { passive: true });
  if (profile.pointerEnabled) {
    frame.addEventListener("pointermove", onPointerMove, { passive: true });
    frame.addEventListener("pointerleave", onPointerLeave);
  }

  return () => {
    destroyed = true;
    cancelAnimationFrame(initialCheckId);
    pause();
    preloadObserver.disconnect();
    activityObserver.disconnect();
    resizeObserver.disconnect();
    removeEventListener("scroll", updateScroll);
    if (profile.pointerEnabled) {
      frame.removeEventListener("pointermove", onPointerMove);
      frame.removeEventListener("pointerleave", onPointerLeave);
    }
    scene?.dispose();
    scene = undefined;
    host.replaceChildren();
    delete frame.dataset.parallaxInput;
    setState("fallback");
  };
}
