/**
 * StatRow.jsx
 * ---------------------------------------------------------------------------
 * Label/value row used inside result & summary cards (e.g. the entitlement
 * result card on the Calculate page).
 * ---------------------------------------------------------------------------
 */
export function StatRow({ label, children }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-primary-foreground/60">{label}</span>
      <span className="font-mono tabular-nums">{children}</span>
    </div>
  );
}

export default StatRow;
