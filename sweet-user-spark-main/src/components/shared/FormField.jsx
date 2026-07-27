/**
 * FormField.jsx
 * ---------------------------------------------------------------------------
 * Small layout wrapper used by every form on the site (label + input + hint).
 * Was previously duplicated/inlined inside each page file — pulled out here
 * so it's a single, reusable component.
 * ---------------------------------------------------------------------------
 */
import { Label } from "@/components/ui/label";

export function FormField({ label, hint, className = "", children }) {
  return (
    <div className={`grid gap-1.5 ${className}`}>
      <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export default FormField;
