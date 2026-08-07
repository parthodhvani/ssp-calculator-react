/**
 * InfoDialog.jsx — Calculate page
 * ---------------------------------------------------------------------------
 * Shared "shell" for the small centered popups used on this page (the email
 * confirmation dialog in CalculatorForm, and the "locked" notice used for the
 * full report button). Pulled out into one component so every popup on this
 * page looks and behaves identically — same backdrop, same card, same close
 * button.
 * ---------------------------------------------------------------------------
 */
import { X } from "lucide-react";

export function InfoDialog({ open, onClose, titleId, title, children }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-foreground"
        style={{ boxShadow: "var(--shadow-elegant, 0 20px 40px rgba(0,0,0,0.2))" }}
      >
        <div className="flex items-start justify-between gap-4">
          <h3 id={titleId} className="font-serif text-xl text-foreground">
            {title}
          </h3>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}

export default InfoDialog;