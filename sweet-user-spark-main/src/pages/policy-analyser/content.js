/**
 * content.js — Policy Analyser page
 * ---------------------------------------------------------------------------
 * `demoFindings` stands in for the real analysis result. Wire the analysis
 * itself up in useAnalysis.js (or directly in PolicyAnalyserPage) by
 * replacing the setTimeout with a call to your AI/analysis endpoint.
 * ---------------------------------------------------------------------------
 */

export const DEFAULT_CONTENT = {
  kicker: "Tool · Beta",
  title: "Policy analyser",
  description:
    "Upload your sick-leave policy, contract or CAO excerpt. We compare every clause against Dutch statutory rules and flag anything that falls below the floor.",
  demoFindings: [
    {
      status: "pass",
      clause: "Year 1 continued pay set at 100% of gross salary",
      detail: "Well above the statutory floor of 70% (Art. 7:629).",
    },
    {
      status: "pass",
      clause: "Year 2 continued pay set at 80%",
      detail: "Above the 70% minimum.",
    },
    {
      status: "warn",
      clause: "2 waiting days per illness",
      detail: "Legally allowed, but many CAOs waive this. Worth negotiating.",
    },
    {
      status: "fail",
      clause: "Pay suspended after 5 late notifications in 12 months",
      detail:
        "Blanket suspension is not enforceable — pay may only be suspended after a formal reintegration warning.",
    },
  ],
};
