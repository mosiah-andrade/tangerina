import assert from "node:assert/strict";
import test from "node:test";
import {
  addCents,
  assertValidCents,
  compareCents,
  multiplyAndRoundCents,
  parseMoneyToCents,
  subtractCents,
} from "../domain/finance/money.ts";

test("parses Brazilian monetary strings exactly", () => {
  const cases = [
    ["10", 1000],
    ["10,5", 1050],
    ["10,50", 1050],
    ["1.234,56", 123456],
    ["0,01", 1],
    ["-10,50", -1050],
    ["0", 0],
  ];

  for (const [input, expected] of cases) {
    assert.equal(parseMoneyToCents(input), expected);
  }
});

test("rejects malformed, empty, and over-precise monetary strings", () => {
  for (const input of [
    "",
    " ",
    "10,123",
    "1.2.3",
    "10,50,30",
    "R$ abc",
    "1.23,45",
    "+10,00",
  ]) {
    assert.throws(() => parseMoneyToCents(input), TypeError, input);
  }

  assert.throws(() => parseMoneyToCents(null), TypeError);
  assert.throws(() => parseMoneyToCents(10), TypeError);
});

test("rejects parsed values outside the safe integer range", () => {
  assert.throws(
    () => parseMoneyToCents("90.071.992.547.409,92"),
    RangeError,
  );
});

test("validates cents and distinguishes type errors from range errors", () => {
  assert.equal(assertValidCents(0), undefined);
  assert.equal(assertValidCents(-100), undefined);
  assert.throws(() => assertValidCents(1.5), TypeError);
  assert.throws(() => assertValidCents(Number.NaN), TypeError);
  assert.throws(() => assertValidCents(Number.POSITIVE_INFINITY), TypeError);
  assert.throws(
    () => assertValidCents(Number.MAX_SAFE_INTEGER + 1),
    RangeError,
  );
  assert.throws(() => assertValidCents("100"), TypeError);
});

test("adds and subtracts cents without precision loss", () => {
  assert.equal(addCents(100, 25), 125);
  assert.equal(addCents(-100, 25), -75);
  assert.equal(addCents(0, 0), 0);
  assert.equal(subtractCents(100, 25), 75);
  assert.equal(subtractCents(100, 125), -25);
  assert.equal(subtractCents(-100, -25), -75);
});

test("rejects addition and subtraction that overflow safe cents", () => {
  assert.throws(
    () => addCents(Number.MAX_SAFE_INTEGER, 1),
    RangeError,
  );
  assert.throws(
    () => subtractCents(-Number.MAX_SAFE_INTEGER, 1),
    RangeError,
  );
});

test("compares cents", () => {
  assert.equal(compareCents(99, 100), -1);
  assert.equal(compareCents(100, 100), 0);
  assert.equal(compareCents(101, 100), 1);
  assert.equal(compareCents(-101, -100), -1);
});

test("multiplies by basis points using exact integer arithmetic", () => {
  assert.equal(multiplyAndRoundCents(100_000, 1000), 10_000);
  assert.equal(multiplyAndRoundCents(100_000, 500), 5_000);
  assert.equal(multiplyAndRoundCents(100_000, 10_000), 100_000);
  assert.equal(multiplyAndRoundCents(100_000, 0), 0);
});

test("rounds half cents away from zero", () => {
  assert.equal(multiplyAndRoundCents(1000, 10005), 1001);
  assert.equal(multiplyAndRoundCents(1000, 10004), 1000);
  assert.equal(multiplyAndRoundCents(1000, 10006), 1001);
  assert.equal(multiplyAndRoundCents(-1000, 10005), -1001);
});

test("rejects invalid basis points and unsafe calculation results", () => {
  for (const bps of [-1, 1.5, Number.NaN, Number.POSITIVE_INFINITY]) {
    assert.throws(() => multiplyAndRoundCents(100, bps), RangeError);
  }

  assert.throws(
    () => multiplyAndRoundCents(Number.MAX_SAFE_INTEGER, 10_001),
    RangeError,
  );
});

test("distribution rounding does not exceed the source in this allocation case", () => {
  const sourceCents = 10_001;
  const first = multiplyAndRoundCents(sourceCents, 3333);
  const second = multiplyAndRoundCents(sourceCents, 3333);
  const third = multiplyAndRoundCents(sourceCents, 3333);

  assert.ok(first + second + third <= sourceCents);
});
