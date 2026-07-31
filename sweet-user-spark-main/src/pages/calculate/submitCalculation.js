/**
 * submitCalculation.js
 * ---------------------------------------------------------------------------
 * Sends the calculator inputs + computed estimate to the WordPress REST route
 * `recura/v1/calculate-entitlement` (see wp hook below), which emails BOTH:
 *   - the site admin (get_option('admin_email'))
 *   - the visitor's own email address (entered in the form)
 *
 * Uses the same VITE_WP_API_URL that useCalculatorContent.js already reads,
 * so no extra env config is required.
 * ---------------------------------------------------------------------------
 */

const WP_API_URL = import.meta.env.VITE_WP_API_URL;

function buildEndpoint() {
    if (!WP_API_URL) return null;
    const base = WP_API_URL.replace(/\/$/, "");
    return `${base}/wp-json/recura/v1/calculate-entitlement`;
}

export const CALCULATE_ENDPOINT = buildEndpoint();

/**
 * Shapes the payload sent to the backend. Kept separate from the fetch call
 * so it's easy to unit test / log without hitting the network.
 *
 * IMPORTANT: the `estimate` object here must include every field that
 * recura_handle_calculate_entitlement() reads on the PHP side, or the
 * emailed summary will silently fall back to PHP's defaults and no longer
 * match what the on-screen report shows. PHP currently reads:
 *   maxWeeks, weeksElapsed, weeksRemaining, effectiveLinked, absenceWeeks,
 *   year1Weeks, currentYear, year2Monthly, totalOverMaxTerm, waitingDays
 */
export function buildEntitlementPayload({ form, estimate }) {
    const {
        name,
        email,
        company,
        industry,
        status,
        salary,
        firstDay,
        lastDay,
        linked,
        linkedFirstDay,
        linkedLastDay,
    } = form;

    return {
        name: name || "",
        email: email || "",
        company: company || "",
        industry: industry || "",
        status: status || "",
        grossMonthlySalary: Number(salary) || 0,
        firstDay: firstDay || "",
        lastDay: lastDay || "",
        linked: Boolean(linked),
        linkedFirstDay: linked ? linkedFirstDay || "" : "",
        linkedLastDay: linked ? linkedLastDay || "" : "",
        estimate: estimate
            ? {
                // Payment figures
                currentMonthly: estimate.currentMonthly,
                currentPercent: estimate.currentPercent,
                currentYear: estimate.currentYear,
                year1Monthly: estimate.year1Monthly,
                year2Monthly: estimate.year2Monthly,
                totalOverMaxTerm: estimate.totalOverMaxTerm,

                // Timeline fields - these were previously missing, which is
                // why the emailed "Previous/Current sickness period" and
                // "Previous sickness linked" rows didn't match the report.
                maxWeeks: estimate.maxWeeks,
                weeksElapsed: estimate.weeksElapsed,
                weeksRemaining: estimate.weeksRemaining,
                year1Weeks: estimate.year1Weeks,
                effectiveLinked: estimate.effectiveLinked,
                absenceWeeks: estimate.absenceWeeks,

                // Rules
                waitingDays: estimate.waitingDays,
                minWageMonthly: estimate.minWageMonthly,
                belowMinWage: estimate.belowMinWage,
            }
            : null,
    };
}

/**
 * POSTs the payload to WordPress. Throws with a readable message on failure
 * so callers can show it in the confirmation popup.
 */
export async function sendEntitlementEmail(payload) {
    const endpoint = CALCULATE_ENDPOINT;
    if (!endpoint) {
        throw new Error(
            "Missing VITE_WP_API_URL - cannot reach the WordPress API to send the email.",
        );
    }

    let response;
    try {
        response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
    } catch (networkErr) {
        throw new Error("Network error - could not reach the server.");
    }

    let data = null;
    try {
        data = await response.json();
    } catch (_) {
        // response had no / invalid JSON body - fall through to status check
    }

    if (!response.ok) {
        const message =
            data?.message || data?.code || `Request failed (${response.status})`;
        throw new Error(message);
    }

    return data;
}

export default sendEntitlementEmail;