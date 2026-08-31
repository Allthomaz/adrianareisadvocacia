import assert from "node:assert/strict";
import test from "node:test";
import { LAYER_ORDER } from "../src/scripts/about-parallax-config.ts";
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
  assert.deepEqual(profile.scroll, [0, 0.08, 0.14]);
});

test("desktop ativa ponteiro local e limita DPR a 2", () => {
  const profile = selectMotionProfile(false, 3);
  assert.equal(profile.pointerEnabled, true);
  assert.equal(profile.pixelRatio, 2);
  assert.deepEqual(profile.pointer, [0, 0.09, 0.16]);
});

test("a cena fixa a ordem dos três planos", () => {
  assert.deepEqual(LAYER_ORDER, ["background", "subject", "foreground"]);
});
