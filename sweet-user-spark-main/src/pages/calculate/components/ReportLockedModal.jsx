/**
 * ReportLockedModal.jsx — Calculate page
 * ---------------------------------------------------------------------------
 * NOTE: The "Full report" button itself was not part of the files you gave
 * me — it isn't in this folder, and neither is the ReportContext provider it
 * reads from. This component is the popup that button should show when the
 * user clicks it before a report exists yet. See the bottom of this file for
 * the exact wiring snippet to drop into whatever component renders that
 * button.
 * ---------------------------------------------------------------------------
 * Same visual style as the "Email your entitlement estimate?" popup (both
 * use <InfoDialog>), so the two feel like one consistent gating pattern
 * rather than two different popups.
 */
import { Button } from "@/components/ui/button";
import { InfoDialog } from "./InfoDialog";

export function ReportLockedModal({ open, onClose }) {
  function handleGoToCalculator() {
    document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" });
    onClose?.();
  }

  return (
    <InfoDialog
      open={open}
      onClose={onClose}
      titleId="report-locked-title"
      title="Your full report isn't ready yet"
    >
      <p className="mt-3 text-sm text-muted-foreground">
        To unlock it, fill in every required field in the calculator above,
        click <span className="font-medium text-foreground">"Calculate my
        entitlement,"</span> and confirm that we can email you the estimate.
        The moment that email is sent, your full report becomes available.
      </p>
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <Button type="button" variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button type="button" onClick={handleGoToCalculator} className="gap-2">
          Go to calculator
        </Button>
      </div>
    </InfoDialog>
  );
}

export default ReportLockedModal;

/**
 * ---------------------------------------------------------------------------
 * WIRING SNIPPET — paste into whatever component renders the "Full report"
 * button (not included in the files you uploaded). It reads the same
 * ReportContext that CalculatePage.jsx writes to, so it stays in sync
 * automatically: the button only unlocks once CalculatePage calls
 * setReport(), which now only happens after the entitlement email is
 * actually sent.
 * ---------------------------------------------------------------------------
 *
 *   import { useState } from "react";
 *   import { useReport } from "@/context/ReportContext";
 *   import { ReportLockedModal } from "@/pages/calculate/components/ReportLockedModal";
 *   // ^ adjust the import path to wherever this file ends up living
 *
 *   function FullReportButton() {
 *     const { report } = useReport();
 *     const [showLocked, setShowLocked] = useState(false);
 *     const isReady = Boolean(report);
 *
 *     return (
 *       <>
 *         <button
 *           type="button"
 *           onClick={() => {
 *             if (isReady) {
 *               // existing navigation to the full report goes here
 *             } else {
 *               setShowLocked(true);
 *             }
 *           }}
 *           aria-disabled={!isReady}
 *           className={!isReady ? "cursor-not-allowed opacity-60" : ""}
 *         >
 *           View full report
 *         </button>
 *         <ReportLockedModal open={showLocked} onClose={() => setShowLocked(false)} />
 *       </>
 *     );
 *   }
 * ---------------------------------------------------------------------------
 */