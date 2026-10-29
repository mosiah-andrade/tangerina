import assert from "node:assert/strict";
import test from "node:test";
import { formatMoneyFromCents } from "../lib/format-money.ts";

test("formats positive cents as Brazilian Real", () => {
  assert.equal(formatMoneyFromCents(425000), "R$\u00a04.250,00");
});

test("formats zero cents", () => {
  assert.equal(formatMoneyFromCents(0), "R$\u00a00,00");
});

test("formats negative cents", () => {
  assert.equal(formatMoneyFromCents(-125), "-R$ 1,25");
});

test("rejects non-integer cents", () => {
  assert.throws(() => formatMoneyFromCents(12.5), TypeError);
});

test("rejects unsafe integer cents", () => {
  assert.throws(() => formatMoneyFromCents(Number.MAX_SAFE_INTEGER + 1), TypeError);
});
