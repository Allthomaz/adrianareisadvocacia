# Three.js Parallax do Sobre — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar um retrato institucional 2.5D na abertura da seção Sobre, ativado dentro da viewport, com rolagem + ponteiro no desktop e somente rolagem no mobile.

**Architecture:** A fotografia HTML atual permanece como fallback. Um controller leve observa proximidade/visibilidade e importa tardiamente uma cena Three.js de três planos; a cena expõe uma API pequena de atualização, renderização e descarte. GSAP continua responsável pela entrada editorial, mas deixa de transformar a fotografia e o monograma usados pela cena.

**Tech Stack:** Astro 7, TypeScript estrito, Three.js local, GSAP 3.15, Node Test Runner, Chrome headless, Sharp.

**Spec:** `docs/superpowers/specs/2026-08-30-threejs-parallax-sobre-design.md`

## Global Constraints

- Ler `START-HERE.md`, a spec acima e `$threejs-parallax` antes de executar.
- Antes da primeira edição, rodar `git status --short`, `pnpm check` e `pnpm build`.
- Preservar as mudanças locais existentes em `src/components/AboutProfile.astro`, `src/styles/global.css` e `tests/desktop-section-layout.test.mjs`; elas pertencem ao ajuste desktop anterior e não podem ser descartadas ou absorvidas silenciosamente.
- Antes da Task 1, revisar e commitar essas mudanças anteriores separadamente, ou trabalhar em worktree criada a partir de um commit que já as contenha.
- Não alterar rosto, corpo, roupa, proporções, cor de pele ou identidade da cliente.
- Usar somente `assets/references/foto-adriana-atual.jpeg` como fonte do retrato do Sobre; preservar o original.
- O mobile usa somente a rolagem: sem giroscópio, sensores, permissões ou arraste.
- O desktop usa rolagem e ponteiro somente quando o ponteiro estiver sobre a moldura.
- `prefers-reduced-motion` não inicia RAF contínuo nem listeners de movimento.
- Sem WebGL, sem JavaScript ou em falha de textura, a fotografia HTML permanece visível.
- Three.js deve ser dependência local; não usar CDN ou `esm.sh`.
- Canvas decorativo com `aria-hidden="true"`; nenhum texto essencial dentro do canvas.
- RAF ativo somente enquanto a moldura estiver visível.
- Pixel ratio máximo: `2` no desktop e `1.5` no mobile.
- Manter `renderer.outputColorSpace` e todas as texturas em `THREE.SRGBColorSpace`.
- Validar visualmente em 390 × 844 e 1440 px.
- Finalizar com `pnpm test:site`, `pnpm check`, `pnpm build` e `pnpm format:check` verdes.

## File Map

- `src/assets/images/about-parallax/background.png` — plano institucional de fundo, 1024 × 1536.
- `src/assets/images/about-parallax/adriana-subject.png` — retrato recortado com transparência, 1024 × 1536.
- `src/assets/images/about-parallax/foreground.png` — monograma/fios/moldura transparentes, 1024 × 1536.
- `src/scripts/about-parallax-motion.ts` — funções puras, perfis desktop/mobile e cálculo de progresso.
- `src/scripts/about-parallax-config.ts` — ordem nominal das camadas e constantes independentes de DOM/Vite.
- `src/scripts/about-parallax-scene.ts` — Three.js, texturas, planos e API de renderização/descarte.
- `src/scripts/about-parallax-controller.ts` — observers, import tardio, RAF, ponteiro, fallback e estados.
- `src/components/AboutProfile.astro` — markup semântico e inicialização do controller.
- `src/styles/global.css` — empilhamento do fallback/canvas e transições por estado.
- `tests/about-parallax-assets.test.mjs` — dimensões, alpha e integridade dos ativos.
- `tests/about-parallax-motion.test.mjs` — contratos das funções puras.
- `tests/sobre-motion.test.mjs` — integração no Chrome headless.

---

### Task 1: Produzir e validar os três ativos da cena

**Files:**
- Create: `src/assets/images/about-parallax/background.png`
- Create: `src/assets/images/about-parallax/adriana-subject.png`
- Create: `src/assets/images/about-parallax/foreground.png`
- Create: `tests/about-parallax-assets.test.mjs`

**Interfaces:**
- Consumes: `assets/references/foto-adriana-atual.jpeg` (1023 × 1537).
- Produces: três imagens 1024 × 1536 alinhadas pelo mesmo canvas; `adriana-subject.png` e `foreground.png` possuem alpha real.

- [ ] **Step 1: Escrever o teste de ativos ausentes**

Criar `tests/about-parallax-assets.test.mjs`:

```js
import assert from "node:assert/strict";
import { access, stat } from "node:fs/promises";
import test from "node:test";
import sharp from "sharp";

const assets = {
  background: new URL(
    "../src/assets/images/about-parallax/background.png",
    import.meta.url,
  ),
  subject: new URL(
    "../src/assets/images/about-parallax/adriana-subject.png",
    import.meta.url,
  ),
  foreground: new URL(
    "../src/assets/images/about-parallax/foreground.png",
    import.meta.url,
  ),
};

test("publica três camadas 2.5D alinhadas em 1024 por 1536", async () => {
  for (const url of Object.values(assets)) {
    await access(url);
    const metadata = await sharp(url).metadata();
    assert.equal(metadata.width, 1024);
    assert.equal(metadata.height, 1536);
    assert.equal(metadata.format, "png");
    assert.ok((await stat(url)).size < 4 * 1024 * 1024);
  }
});

test("retrato e primeiro plano preservam transparência real", async () => {
  assert.equal((await sharp(assets.subject).metadata()).hasAlpha, true);
  assert.equal((await sharp(assets.foreground).metadata()).hasAlpha, true);
});
```

- [ ] **Step 2: Confirmar RED**

Run: `node --test tests/about-parallax-assets.test.mjs`  
Expected: FAIL com `ENOENT` para `about-parallax/background.png`.

- [ ] **Step 3: Criar o recorte da cliente sem retoque**

Usar a skill `imagegen` em modo de edição, referenciando
`assets/references/foto-adriana-atual.jpeg`, com esta instrução literal:

```text
Remova apenas o fundo e entregue a pessoa em fundo totalmente transparente.
Preserve exatamente rosto, expressão, cabelo, corpo, roupa, mãos, proporções,
cor de pele, iluminação e identidade. Não embeleze, não retoque, não regenere
partes do corpo e não altere o enquadramento. Complete somente a transparência
da máscara nas bordas. Canvas vertical 1024 × 1536.
```

Salvar como `src/assets/images/about-parallax/adriana-subject.png`. Inspecionar
visualmente o original e o recorte lado a lado; rejeitar o resultado se qualquer
traço da cliente mudar.

- [ ] **Step 4: Criar o fundo institucional**

Usar `imagegen` para gerar `background.png`, sem pessoa, texto legível, símbolos
religiosos, martelo, balança ou colunas literais:

```text
Plano de fundo editorial vertical 1024 × 1536 para retrato de uma advogada.
Paleta exclusiva: vinho #762638 e #5f1c2c, marfim #f7f2e9 e dourado queimado
#b78a55. Composição abstrata inspirada em portada arquitetônica e papel jurídico:
um arco amplo, planos geométricos discretos e textura finíssima. Centro limpo
para receber o retrato. Sem pessoas, sem palavras, sem logotipos, sem balança,
sem martelo e sem coluna grega literal. Aparência sóbria, sofisticada e plana.
```

Redimensionar/exportar exatamente em 1024 × 1536, sRGB, até 4 MiB.

- [ ] **Step 5: Criar o primeiro plano transparente**

Usar `imagegen` para gerar `foreground.png`:

```text
Overlay editorial transparente vertical 1024 × 1536. Somente fios dourados
#b78a55, dois cantos documentais muito finos e um monograma abstrato AR de baixa
densidade nas bordas. Centro e área do rosto totalmente livres. Fundo alpha
transparente real. Sem pessoa, sem textura opaca e sem texto adicional.
```

- [ ] **Step 6: Normalizar sem alterar conteúdo**

Usar Sharp somente para dimensões, perfil sRGB e compressão; não aplicar filtros,
correção facial ou recorte adicional. Confirmar com:

```bash
file src/assets/images/about-parallax/*.png
node --test tests/about-parallax-assets.test.mjs
```

Expected: 2 tests PASS; todos os arquivos 1024 × 1536, PNG; subject e foreground
com alpha.

- [ ] **Step 7: Commit**

```bash
git add tests/about-parallax-assets.test.mjs src/assets/images/about-parallax
git commit -m "feat: preparar camadas institucionais do parallax do Sobre"
```

---

### Task 2: Definir o modelo de movimento desktop/mobile

**Files:**
- Create: `src/scripts/about-parallax-motion.ts`
- Create: `tests/about-parallax-motion.test.mjs`

**Interfaces:**
- Produces: `MotionProfile`, `clamp()`, `calculateScrollProgress()` e `selectMotionProfile()`.
- Consumed by: `about-parallax-scene.ts` e `about-parallax-controller.ts`.

- [ ] **Step 1: Escrever o teste do contrato de movimento**

Criar `tests/about-parallax-motion.test.mjs` usando `tsx` para importar TypeScript.
Primeiro adicionar `tsx` como dev dependency: `pnpm add -D tsx`.

```js
import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateScrollProgress,
  selectMotionProfile,
} from "../src/scripts/about-parallax-motion.ts";

test("calcula zero quando o centro da moldura coincide com o viewport", () => {
  assert.equal(calculateScrollProgress({ top: 300, height: 400 }, 1000), 0);
});

test("limita o progresso da rolagem a menos/mais 1.4", () => {
  assert.equal(calculateScrollProgress({ top: 2000, height: 400 }, 1000), -1.4);
  assert.equal(calculateScrollProgress({ top: -2000, height: 400 }, 1000), 1.4);
});

test("mobile desativa ponteiro e limita DPR a 1.5", () => {
  const profile = selectMotionProfile(true, 3);
  assert.equal(profile.pointerEnabled, false);
  assert.equal(profile.pixelRatio, 1.5);
  assert.deepEqual(profile.scroll, [0.02, 0.06, 0.1]);
});

test("desktop ativa ponteiro local e limita DPR a 2", () => {
  const profile = selectMotionProfile(false, 3);
  assert.equal(profile.pointerEnabled, true);
  assert.equal(profile.pixelRatio, 2);
  assert.deepEqual(profile.pointer, [0.035, 0.09, 0.16]);
});
```

Alterar o script de teste para executar TypeScript:

```json
"test:site": "astro build && node --import tsx --test tests/*.test.mjs"
```

- [ ] **Step 2: Confirmar RED**

Run: `node --import tsx --test tests/about-parallax-motion.test.mjs`  
Expected: FAIL com `ERR_MODULE_NOT_FOUND` para `about-parallax-motion.ts`.

- [ ] **Step 3: Implementar as funções puras**

Criar `src/scripts/about-parallax-motion.ts`:

```ts
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
        pointer: [0, 0, 0],
        scroll: [0.02, 0.06, 0.1],
      }
    : {
        pixelRatio: Math.min(devicePixelRatio, 2),
        pointerEnabled: true,
        lerp: 0.06,
        camera: [0.008, 0.006],
        pointer: [0.035, 0.09, 0.16],
        scroll: [0.035, 0.1, 0.18],
      };
```

- [ ] **Step 4: Confirmar GREEN**

Run: `node --import tsx --test tests/about-parallax-motion.test.mjs`  
Expected: 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml src/scripts/about-parallax-motion.ts tests/about-parallax-motion.test.mjs
git commit -m "test: definir perfis de movimento do parallax 2.5D"
```

---

### Task 3: Construir a cena Three.js e sua API de descarte

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Create: `src/scripts/about-parallax-config.ts`
- Create: `src/scripts/about-parallax-scene.ts`
- Modify: `tests/about-parallax-motion.test.mjs`

**Interfaces:**
- Consumes: `MotionProfile` de `about-parallax-motion.ts` e os três PNGs da Task 1.
- Produces:

```ts
export type AboutParallaxScene = {
  setScrollProgress(progress: number): void;
  setPointer(x: number, y: number): void;
  resize(): void;
  render(): void;
  dispose(): void;
};

export async function createAboutParallaxScene(options: {
  host: HTMLElement;
  profile: MotionProfile;
  staticMode: boolean;
}): Promise<AboutParallaxScene>;
```

- [ ] **Step 1: Instalar Three.js localmente**

Run: `pnpm add three && pnpm add -D @types/three`  
Expected: `three` em dependencies, `@types/three` em devDependencies e lockfile atualizado.

- [ ] **Step 2: Estender o teste com configuração pura da cena**

Acrescentar a `tests/about-parallax-motion.test.mjs`:

```js
import { LAYER_ORDER } from "../src/scripts/about-parallax-config.ts";

test("a cena fixa a ordem dos três planos", () => {
  assert.deepEqual(LAYER_ORDER, ["background", "subject", "foreground"]);
});
```

- [ ] **Step 3: Confirmar RED**

Run: `node --import tsx --test tests/about-parallax-motion.test.mjs`  
Expected: FAIL porque `about-parallax-config.ts` não existe.

- [ ] **Step 4: Implementar a cena**

Criar primeiro `src/scripts/about-parallax-config.ts`:

```ts
export const LAYER_ORDER = ["background", "subject", "foreground"] as const;
export type LayerName = (typeof LAYER_ORDER)[number];
```

Depois criar `src/scripts/about-parallax-scene.ts`. A implementação deve:

```ts
import * as THREE from "three";
import backgroundUrl from "../assets/images/about-parallax/background.png?url";
import subjectUrl from "../assets/images/about-parallax/adriana-subject.png?url";
import foregroundUrl from "../assets/images/about-parallax/foreground.png?url";
import { LAYER_ORDER } from "./about-parallax-config";
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
```

Dentro de `createAboutParallaxScene()`:

1. criar canvas decorativo, aplicar `aria-hidden="true"` e anexar ao `host`;
2. criar `PerspectiveCamera(55, aspect, 0.1, 100)` em `z = 5`;
3. criar `WebGLRenderer({ canvas, alpha: true, antialias: !mobile })`;
4. aplicar `renderer.setPixelRatio(profile.pixelRatio)`, clear alpha zero e
   `renderer.outputColorSpace = THREE.SRGBColorSpace`;
5. carregar as três texturas com Promise; em cada textura aplicar
   `texture.colorSpace = THREE.SRGBColorSpace`;
6. criar planos com `transparent: true`, `depthWrite: false`,
   `depthTest: false` e `renderOrder` 0/1/2;
7. usar o mesmo canvas 2:3 para os três planos e escala de cover com 8% de
   overscan;
8. aplicar offsets interpolados:

```ts
layer.position.x = baseX + currentPointerX * pointerFactor;
layer.position.y =
  baseY + currentPointerY * pointerFactor + currentScroll * scrollFactor;
camera.rotation.y = currentPointerX * profile.camera[0];
camera.rotation.x = currentPointerY * profile.camera[1];
```

9. em `staticMode`, `setPointer` e `setScrollProgress` mantêm zero;
10. `dispose()` remove canvas, chama `geometry.dispose()`, `material.dispose()`,
    `texture.dispose()`, `renderer.dispose()` e `renderer.forceContextLoss()`.

- [ ] **Step 5: Confirmar tipos e testes**

Run:

```bash
node --import tsx --test tests/about-parallax-motion.test.mjs
pnpm check
pnpm build
```

Expected: testes PASS, Astro 0 erros e build concluído; o chunk de Three.js é
gerado separadamente por causa do import tardio que será conectado na Task 4.

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-lock.yaml src/scripts/about-parallax-config.ts src/scripts/about-parallax-scene.ts tests/about-parallax-motion.test.mjs
git commit -m "feat: criar cena Three.js do retrato institucional"
```

---

### Task 4: Implementar ativação por viewport e pausa fora da seção

**Files:**
- Create: `src/scripts/about-parallax-controller.ts`
- Modify: `src/components/AboutProfile.astro`
- Modify: `src/styles/global.css`
- Modify: `tests/site-content.test.mjs`

**Interfaces:**
- Consumes: `calculateScrollProgress()`, `selectMotionProfile()` e import tardio de `createAboutParallaxScene()`.
- Produces:

```ts
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
}): () => void;
```

- [ ] **Step 1: Escrever o contrato de HTML progressivo**

Acrescentar ao teste “a seção Sobre usa fotografia responsiva” em
`tests/site-content.test.mjs`:

```js
assert.match(html, /data-about-parallax-frame/);
assert.match(html, /data-about-parallax-host[^>]*aria-hidden="true"/);
assert.match(html, /data-about-parallax-fallback/);
assert.match(html, /data-parallax-state="fallback"/);
```

- [ ] **Step 2: Confirmar RED**

Run: `pnpm build && node --test tests/site-content.test.mjs`  
Expected: FAIL porque os hooks de parallax ainda não estão no HTML.

- [ ] **Step 3: Alterar o markup sem remover o fallback**

Em `AboutProfile.astro`, transformar a moldura em:

```astro
<div
  class="about-profile__photo-frame"
  data-about-photo-frame
  data-about-parallax-frame
  data-parallax-state="fallback"
>
  <div
    class="about-profile__parallax-host"
    data-about-parallax-host
    aria-hidden="true"
  ></div>
  <div
    class="about-profile__photo"
    data-about-photo
    data-about-parallax-fallback
  >
    <!-- manter o Picture atual, alt, formats, widths, sizes e fetchpriority -->
  </div>
</div>
```

- [ ] **Step 4: Implementar o controller**

Criar `src/scripts/about-parallax-controller.ts` com estes comportamentos
exatos:

- `matchMedia("(prefers-reduced-motion: reduce)")` define `reduced` e não importa
  a cena animada;
- observer de pré-carga: `rootMargin: "100% 0px"`, `threshold: 0`;
- observer de atividade: `rootMargin: "0px"`, `threshold: [0, 0.1]`;
- ao pré-carregar, definir `loading`, importar `./about-parallax-scene` e criar a
  cena;
- quando pronta fora da viewport, definir `ready` ou `paused`;
- quando `intersectionRatio >= 0.1`, definir `active`, calcular progresso atual e
  iniciar RAF;
- quando sair, cancelar RAF e definir `paused`;
- scroll listener passivo atualiza somente `targetScroll` por
  `calculateScrollProgress(frame.getBoundingClientRect(), innerHeight)`;
- pointer listeners existem apenas se `profile.pointerEnabled`; converter
  coordenadas locais para intervalo `[-1, 1]` e zerar no `pointerleave`;
- mobile não registra `pointermove`, `touchmove`, orientação ou sensores;
- falha de import, WebGL ou textura define `unsupported` e mantém fallback;
- cleanup desconecta observers, remove listeners, cancela RAF, chama
  `scene.dispose()` e restaura `fallback`.

No RAF, fazer somente:

```ts
scene.setScrollProgress(targetScroll);
scene.setPointer(targetPointerX, targetPointerY);
scene.render();
rafId = requestAnimationFrame(renderFrame);
```

- [ ] **Step 5: Conectar o controller ao script do componente**

No script de `AboutProfile.astro`:

```ts
import { mountAboutParallax } from "../scripts/about-parallax-controller";
```

Depois de localizar `profile`, `photoFrame` e `photo`, localizar o host e montar:

```ts
const parallaxHost = profile.querySelector<HTMLElement>(
  "[data-about-parallax-host]",
);
const disposeParallax =
  photoFrame && photo && parallaxHost
    ? mountAboutParallax({
        frame: photoFrame,
        host: parallaxHost,
        fallback: photo,
        profileRoot: profile,
      })
    : () => {};
```

Remover o timeline `parallax` que transforma `photo` e o `fromTo` do monograma.
Manter a timeline de entrada e os reveals. No cleanup, chamar
`disposeParallax()` e não chamar `parallax.kill()`.

- [ ] **Step 6: Adicionar CSS de empilhamento e estados**

Adicionar a `global.css`:

```css
.about-profile__parallax-host {
  position: absolute;
  z-index: 2;
  inset: 0;
  opacity: 0;
  pointer-events: none;
  transition: opacity 420ms ease;
}

.about-profile__parallax-host canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.about-profile__photo-frame[data-parallax-state="active"]
  .about-profile__parallax-host,
.about-profile__photo-frame[data-parallax-state="paused"]
  .about-profile__parallax-host,
.about-profile__photo-frame[data-parallax-state="ready"]
  .about-profile__parallax-host {
  opacity: 1;
}

.about-profile__photo-frame[data-parallax-state="active"]
  .about-profile__photo,
.about-profile__photo-frame[data-parallax-state="paused"]
  .about-profile__photo,
.about-profile__photo-frame[data-parallax-state="ready"]
  .about-profile__photo {
  opacity: 0;
}

.about-profile__photo {
  transition: opacity 420ms ease;
}

@media (prefers-reduced-motion: reduce) {
  .about-profile__parallax-host,
  .about-profile__photo {
    transition: none;
  }
}
```

O host permanece com `pointer-events: none`; o controller escuta ponteiro na
moldura, não no canvas.

- [ ] **Step 7: Confirmar GREEN**

Run:

```bash
pnpm build
node --test tests/site-content.test.mjs
pnpm check
```

Expected: contrato HTML PASS, Astro 0 erros e build completo.

- [ ] **Step 8: Commit**

```bash
git add src/scripts/about-parallax-controller.ts src/components/AboutProfile.astro src/styles/global.css tests/site-content.test.mjs
git commit -m "feat: ativar parallax do Sobre somente dentro da viewport"
```

---

### Task 5: Testar desktop, mobile, reduced motion e fallback

**Files:**
- Modify: `tests/sobre-motion.test.mjs`
- Modify: `src/scripts/about-parallax-controller.ts`
- Modify: `src/scripts/about-parallax-scene.ts`

**Interfaces:**
- Consumes: atributos `data-parallax-state` e canvas da Task 4.
- Produces: suíte de integração que prova ativação visível, mobile sem sensores e reduced motion sem canvas animado.

- [ ] **Step 1: Substituir os testes do parallax plano**

Manter o setup/teardown de preview. Substituir as asserções que procuram
`transform` inline na fotografia por um helper Chrome que abre diretamente
`/#sobre`; a navegação por hash posiciona a seção antes do orçamento de tempo
virtual e permite que os observers ativem a moldura:

```js
const dumpParallaxDom = async (extraFlags = []) => {
  const { stdout } = await execFileAsync(
    "/usr/bin/google-chrome",
    [
      "--headless=new",
      "--disable-gpu=false",
      "--no-sandbox",
      "--virtual-time-budget=5000",
      ...extraFlags,
      "--dump-dom",
      `${previewUrl}#sobre`,
    ],
    { maxBuffer: 10 * 1024 * 1024 },
  );
  return stdout;
};
```

- [ ] **Step 2: Escrever os testes de integração antes de ajustar código**

```js
test("ativa o canvas 2.5D quando a moldura entra na viewport desktop", async () => {
  const html = await dumpParallaxDom(["--window-size=1440,1000"]);
  assert.match(html, /data-parallax-state="active"/);
  assert.match(html, /data-parallax-input="scroll-pointer"/);
  assert.match(html, /<canvas[^>]*aria-hidden="true"/);
});

test("ativa no mobile somente pela rolagem e sem overflow", async () => {
  const html = await dumpParallaxDom(["--window-size=390,844"]);
  assert.match(html, /data-parallax-state="active"/);
  assert.match(html, /data-parallax-input="scroll"/);
  assert.match(html, /<canvas[^>]*aria-hidden="true"/);
});

test("movimento reduzido mantém fallback e não cria canvas animado", async () => {
  const html = await dumpParallaxDom([
    "--window-size=1440,1000",
    "--force-prefers-reduced-motion",
  ]);
  assert.match(html, /data-parallax-state="reduced"/);
  assert.doesNotMatch(html, /<canvas/);
});
```

- [ ] **Step 3: Confirmar RED**

Run: `pnpm test:site`  
Expected: pelo menos um dos novos contratos falha antes dos últimos ajustes de
estado/Chrome.

- [ ] **Step 4: Ajustar somente o necessário**

Corrigir controller/cena até que:

- o estado `active` seja atribuído somente após o primeiro frame completo;
- o fallback só receba opacity zero depois desse estado;
- mobile não registre listeners de ponteiro;
- reduced motion não crie RAF contínuo;
- falha de WebGL defina `unsupported` sem ocultar fallback.

Adicionar uma flag diagnóstica não visual `data-parallax-input="scroll"` no
mobile e `data-parallax-input="scroll-pointer"` no desktop para o teste provar
o modo escolhido.

- [ ] **Step 5: Confirmar GREEN**

Run: `pnpm test:site`  
Expected: todos os testes, inclusive assets, motion puro, conteúdo e Chrome,
PASS.

- [ ] **Step 6: Commit**

```bash
git add tests/sobre-motion.test.mjs src/scripts/about-parallax-controller.ts src/scripts/about-parallax-scene.ts
git commit -m "test: validar parallax 2.5D no desktop e mobile"
```

---

### Task 6: Validação visual, desempenho e documentação

**Files:**
- Modify: `START-HERE.md`
- Modify: `docs/superpowers/specs/2026-08-30-threejs-parallax-sobre-design.md` somente se a implementação revelar uma decisão diferente aprovada pelo usuário.

**Interfaces:**
- Consumes: cena integrada e suíte verde.
- Produces: critérios de aceite comprovados, documentação de manutenção e entrega final.

- [ ] **Step 1: Validar visualmente em desktop 1440 px**

Abrir `/` em 1440 × 1000, rolar até `#sobre` sem redimensionar durante o efeito e
confirmar:

- fallback não pisca;
- cena só começa quando a fotografia entra;
- ponteiro responde somente sobre a moldura;
- fundo move menos, retrato moderadamente e primeiro plano mais;
- rosto permanece inteiro em todos os cantos;
- nenhum plano revela borda vazia;
- ao sair da seção, `data-parallax-state="paused"`;
- ao retornar, retoma na posição atual sem replay.

- [ ] **Step 2: Validar visualmente em mobile 390 × 844**

Recarregar diretamente em 390 × 844 e confirmar:

- não há movimento antes de a fotografia entrar;
- a rolagem é a única entrada;
- nenhum gesto é capturado pela moldura;
- movimento é menor que no desktop, mas a profundidade é perceptível;
- rosto, cabelo e roupa permanecem dentro da área segura;
- `scrollWidth === innerWidth`;
- rolagem continua fluida.

- [ ] **Step 3: Validar reduced motion e fallback**

Com `prefers-reduced-motion: reduce`, confirmar estado `reduced`, fotografia
visível e ausência de movimento. Depois, bloquear WebGL no navegador e confirmar
estado `unsupported` com a mesma fotografia visível.

- [ ] **Step 4: Verificar atividade e descarte**

No DevTools Performance:

- enquanto fora da seção, não deve haver callback RAF contínuo do parallax;
- dentro da seção, apenas um RAF da cena;
- ao disparar `astro:before-swap`, observers/listeners são removidos e o canvas
  desaparece;
- não há erros de contexto WebGL ou texturas no console.

- [ ] **Step 5: Atualizar `START-HERE.md`**

Documentar:

- arquivos das três camadas e origem autorizada;
- ativação: preload em uma viewport, active em 10%, pause fora;
- desktop: scroll + ponteiro local;
- mobile: somente scroll;
- estados `data-parallax-state`;
- fallback, reduced motion e limite de DPR;
- regra de não retocar a cliente e não adicionar camadas sem justificativa.

- [ ] **Step 6: Rodar a verificação final completa**

Run:

```bash
pnpm test:site
pnpm check
pnpm build
pnpm format:check
git diff --check
git status --short
```

Expected:

- todos os testes PASS;
- Astro 0 errors, 0 warnings, 0 hints;
- build completo;
- Prettier sem arquivos divergentes;
- `git diff --check` sem saída;
- status contém somente mudanças deliberadas desta Task antes do commit.

- [ ] **Step 7: Commit**

```bash
git add START-HERE.md
git commit -m "docs: registrar parallax institucional do Sobre"
```

- [ ] **Step 8: Revisar o conjunto de commits**

Run:

```bash
git log --oneline --max-count=8
git diff 60275a2..HEAD --stat
```

Expected: commits separados para ativos, modelo, cena, ativação, integração e
documentação; nenhuma alteração de conteúdo profissional, WhatsApp, áreas de
atuação ou outras animações.
