import * as THREE from "three";
import backgroundUrl from "../assets/images/about-parallax/background.png?url";
import subjectUrl from "../assets/images/about-parallax/adriana-subject.png?url";
import foregroundUrl from "../assets/images/about-parallax/foreground.png?url";
import { LAYER_ORDER, type LayerName } from "./about-parallax-config";
import type { MotionProfile } from "./about-parallax-motion";

export type AboutParallaxScene = {
  setScrollProgress(progress: number): void;
  setPointer(x: number, y: number): void;
  resize(): void;
  render(): void;
  dispose(): void;
};

type Layer = THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial> & {
  userData: {
    baseX: number;
    baseY: number;
    pointerFactor: number;
    scrollFactor: number;
  };
};

const textureUrls: Record<LayerName, string> = {
  background: backgroundUrl,
  subject: subjectUrl,
  foreground: foregroundUrl,
};

export async function createAboutParallaxScene(options: {
  host: HTMLElement;
  profile: MotionProfile;
  staticMode: boolean;
}): Promise<AboutParallaxScene> {
  const { host, profile, staticMode } = options;
  const canvas = document.createElement("canvas");
  canvas.className = "about-profile__parallax-canvas";
  canvas.setAttribute("aria-hidden", "true");
  host.append(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.z = 5;
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: profile.pointerEnabled,
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(profile.pixelRatio);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const loader = new THREE.TextureLoader();
  const textures = await Promise.all(
    LAYER_ORDER.map(
      (name) =>
        new Promise<THREE.Texture>((resolve, reject) => {
          loader.load(
            textureUrls[name],
            (texture) => {
              texture.colorSpace = THREE.SRGBColorSpace;
              resolve(texture);
            },
            undefined,
            reject,
          );
        }),
    ),
  );

  const layers = LAYER_ORDER.map((name, index) => {
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({
      map: textures[index]!,
      transparent: name !== "background",
      depthWrite: false,
      depthTest: false,
    });
    const mesh = new THREE.Mesh(geometry, material) as Layer;
    mesh.position.z = -1 + index * 0.5;
    mesh.renderOrder = index;
    mesh.userData = {
      baseX: 0,
      baseY: 0,
      pointerFactor: profile.pointer[index]!,
      scrollFactor: profile.scroll[index]!,
    };
    scene.add(mesh);
    return mesh;
  });

  let targetPointerX = 0;
  let targetPointerY = 0;
  let currentPointerX = 0;
  let currentPointerY = 0;
  let targetScroll = 0;
  let currentScroll = 0;
  let disposed = false;

  const resize = () => {
    const width = Math.max(host.clientWidth, 1);
    const height = Math.max(host.clientHeight, 1);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);

    const visibleHeight = 2 * Math.tan(THREE.MathUtils.degToRad(27.5)) * 5;
    const visibleWidth = visibleHeight * camera.aspect;
    const imageAspect = 2 / 3;
    const planeWidth =
      camera.aspect > imageAspect
        ? visibleWidth * 1.08
        : visibleHeight * imageAspect * 1.08;
    const planeHeight = planeWidth / imageAspect;
    layers.forEach((layer) => layer.scale.set(planeWidth, planeHeight, 1));
  };

  const setScrollProgress = (progress: number) => {
    targetScroll = staticMode ? 0 : progress;
  };
  const setPointer = (x: number, y: number) => {
    targetPointerX = staticMode ? 0 : x;
    targetPointerY = staticMode ? 0 : y;
  };
  const render = () => {
    if (disposed) return;
    currentPointerX += (targetPointerX - currentPointerX) * profile.lerp;
    currentPointerY += (targetPointerY - currentPointerY) * profile.lerp;
    currentScroll += (targetScroll - currentScroll) * profile.lerp;

    layers.forEach((layer) => {
      layer.position.x =
        layer.userData.baseX + currentPointerX * layer.userData.pointerFactor;
      layer.position.y =
        layer.userData.baseY +
        currentPointerY * layer.userData.pointerFactor +
        currentScroll * layer.userData.scrollFactor;
    });
    camera.rotation.y = currentPointerX * profile.camera[0];
    camera.rotation.x = currentPointerY * profile.camera[1];
    renderer.render(scene, camera);
  };
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    layers.forEach((layer) => {
      layer.geometry.dispose();
      layer.material.dispose();
    });
    textures.forEach((texture) => texture.dispose());
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  };

  resize();
  render();
  return { setScrollProgress, setPointer, resize, render, dispose };
}
