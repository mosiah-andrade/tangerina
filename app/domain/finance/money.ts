/**
 * Monetary domain utilities.
 *
 * Domain values are represented as safe integer cents. Parsing is exact,
 * and percentage calculations use BigInt intermediates.
 */

const MAX_SAFE_CENTS = BigInt(Number.MAX_SAFE_INTEGER);
const BASIS_POINTS_DENOMINATOR = 10_000n;

export function assertValidCents(value: number): void {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new TypeError("The amount must be a finite number of cents.");
  }

  if (!Number.isInteger(value)) {
    throw new TypeError("The amount must be an integer number of cents.");
  }

  if (!Number.isSafeInteger(value)) {
    throw new RangeError("The amount exceeds the safe integer range.");
  }
}

function toSafeCents(value: bigint): number {
  if (value > MAX_SAFE_CENTS || value < -MAX_SAFE_CENTS) {
    throw new RangeError("The result exceeds the safe integer range.");
  }

  return Number(value);
}

/**
 * Parses a Brazilian monetary string without floating-point conversion.
 * Accepts ungrouped digits or correctly grouped thousands, with up to
 * two decimal places.
 */
export function parseMoneyToCents(value: string): number {
  if (typeof value !== "string" || value.length === 0) {
    throw new TypeError("The monetary value must be a non-empty string.");
  }

  const match = /^(-?)(?:(\d+)|(\d{1,3}(?:\.\d{3})+))(?:,(\d{1,2}))?$/.exec(
    value,
  );

  if (!match) {
    throw new TypeError("The monetary value has an invalid Brazilian format.");
  }

  const [, sign, ungrouped, grouped, decimal = ""] = match;
  const integerPart = (ungrouped ?? grouped).replaceAll(".", "");
  const centsText = decimal.padEnd(2, "0");
  const absoluteCents = BigInt(integerPart) * 100n + BigInt(centsText || "0");
  const signedCents = sign === "-" ? -absoluteCents : absoluteCents;

  return toSafeCents(signedCents);
}

export function addCents(a: number, b: number): number {
  assertValidCents(a);
  assertValidCents(b);
  return toSafeCents(BigInt(a) + BigInt(b));
}

export function subtractCents(a: number, b: number): number {
  assertValidCents(a);
  assertValidCents(b);
  return toSafeCents(BigInt(a) - BigInt(b));
}

export function compareCents(a: number, b: number): -1 | 0 | 1 {
  assertValidCents(a);
  assertValidCents(b);

  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

/**
 * Multiplies cents by a non-negative integer number of basis points.
 * Half-cent ties are rounded away from zero.
 */
export function multiplyAndRoundCents(
  value: number,
  multiplierBps: number,
): number {
  assertValidCents(value);

  if (
    typeof multiplierBps !== "number" ||
    !Number.isSafeInteger(multiplierBps) ||
    multiplierBps < 0
  ) {
    throw new RangeError("Basis points must be a non-negative safe integer.");
  }

  const numerator = BigInt(value) * BigInt(multiplierBps);
  const quotient = numerator / BASIS_POINTS_DENOMINATOR;
  const remainder = numerator % BASIS_POINTS_DENOMINATOR;
  const absoluteRemainder = remainder < 0n ? -remainder : remainder;
  const rounded =
    absoluteRemainder * 2n >= BASIS_POINTS_DENOMINATOR
      ? quotient + (numerator < 0n ? -1n : 1n)
      : quotient;

  return toSafeCents(rounded);
}
