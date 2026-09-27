/** 4.9 → "4.9", 4.91 → "4.91", 5 → "5.0" (Airbnb never shows a bare integer rating). */
export function formatRating(value: number): string {
  return Number.isInteger(value) ? value.toFixed(1) : String(value);
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export function formatPrice(amount: number): string {
  return inr.format(amount);
}
