import assert from "node:assert/strict";
import test from "node:test";
import { formatMoneyFromCents } from "../lib/format-money.ts";

function normalizeWhitespace(value) {
  return value.split("\u00a0").join(" ").split("\u202f").join(" ");
}

test("formats positive cents as Brazilian Real", () => {
  assert.equal(
    normalizeWhitespace(formatMoneyFromCents(425000)),
    "R$ 4.250,00",
  );
});

test("formats zero cents", () => {
  assert.equal(normalizeWhitespace(formatMoneyFromCents(0)), "R$ 0,00");
});

test("formats negative cents", () => {
  assert.equal(
    normalizeWhitespace(formatMoneyFromCents(-125)),
    "-R$ 1,25",
  );
});

test("rejects non-integer cents", () => {
  assert.throws(() => formatMoneyFromCents(12.5), TypeError);
});

test("rejects unsafe integer cents", () => {
  assert.throws(
    () => formatMoneyFromCents(Number.MAX_SAFE_INTEGER + 1),
    TypeError,
  );
});
