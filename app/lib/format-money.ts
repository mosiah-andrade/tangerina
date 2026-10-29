/**
 * Formats an integer amount of cents as Brazilian Real.
 * This is presentation-only: financial calculations remain in the domain layer.
 */
const brlFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatMoneyFromCents(cents: number): string {
  if (!Number.isSafeInteger(cents)) {
    throw new TypeError("The amount must be a safe integer number of cents.");
  }

  return brlFormatter.format(cents / 100);
}
