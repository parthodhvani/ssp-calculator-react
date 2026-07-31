/**
 * CalculatorForm.jsx — Calculate page
 * Two-column field grid inside the shared outer card:
 *   Name | Company
 *   Email (mandatory, full)
 *   Industry (full)
 *   Status (full)           // ← removed: status field is now hidden and defaulted
 *   Salary (full)
 *   First day | Last day
 *   Linked absence (full)
 *
 * Mandatory fields (validated on submit, each shows an inline error if
 * missing): Name, Company name, Email, Industry/sector, Employment status,
 * Gross monthly salary, First day of sick leave.
 * Last day + linked-absence fields remain optional.
 *
 * On submit: validates all required fields above, then shows a confirmation
 * popup asking permission to email the results (to the visitor AND the site
 * admin) before anything is sent.
 */
import { useState, useEffect } from "react";
import { CalendarDays, Info, ArrowRight, Mail, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/shared/FormField";
import { formatTemplate, resolveHref } from "../content";
import { buildEntitlementPayload, sendEntitlementEmail } from "../submitCalculation";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CalculatorForm({ content, form, estimate }) {
  const {
    name,
    setName,
    email,
    setEmail,
    company,
    setCompany,
    industry,
    setIndustry,
    status,
    setStatus,
    linked,
    setLinked,
    linkedFirstDay,
    setLinkedFirstDay,
    linkedLastDay,
    setLinkedLastDay,
    salary,
    setSalary,
    firstDay,
    setFirstDay,
    lastDay,
    setLastDay,
    linkedAbsenceFlag,
  } = form;

  // New state for employment type toggle
  const [employmentType, setEmploymentType] = useState("employee");

  const calc = content.calculator;
  const rules = content.rules;

  const linkedDescription = formatTemplate(calc.linkedDescription, {
    weeks: Math.round(rules.linkedAbsenceWindowDays / 7),
    maxWeeks: rules.maxWeeks,
  });

  const linkedFlagMessage = formatTemplate(calc.linkedFlagMessage, {
    maxWeeks: rules.maxWeeks,
  });

  const [errors, setErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [sendState, setSendState] = useState("idle"); // idle | sending | success | error
  const [sendMessage, setSendMessage] = useState("");

  // Set a default status when component mounts (or when status is empty)
  // so that the backend payload receives a valid value.
  useEffect(() => {
    if (!status && calc.statusOptions && calc.statusOptions.length > 0) {
      setStatus(calc.statusOptions[0].value);
    }
  }, [status, setStatus, calc.statusOptions]);

  function runOriginalSubmitBehavior() {
    const link = resolveHref(calc.submitLink, "");
    if (link) {
      if (link.startsWith("#")) {
        document.querySelector(link)?.scrollIntoView({ behavior: "smooth" });
      } else if (/^https?:\/\//i.test(link)) {
        window.open(link, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = link;
      }
    }
  }

  function validate() {
    const nextErrors = {};

    if (!name || !name.trim()) {
      nextErrors.name = "Please enter your name.";
    }
    if (!company || !company.trim()) {
      nextErrors.company = "Please enter your company name.";
    }
    if (!email || !email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!EMAIL_RE.test(email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }
    if (!industry || !industry.trim()) {
      nextErrors.industry = "Please select your industry / sector.";
    }
    // Status is now hidden and automatically set – we no longer validate it.
    if (!salary || Number(salary) <= 0) {
      nextErrors.salary = "Please enter your gross monthly salary.";
    }
    if (!firstDay || !firstDay.trim()) {
      nextErrors.firstDay = "Please enter the first day of sick leave.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSendState("idle");
    setSendMessage("");
    setShowConfirm(true);
  }

  function handleCancelConfirm() {
    setShowConfirm(false);
    // Preserve prior behaviour (scroll / navigate) even if the user opts
    // out of receiving the email.
    runOriginalSubmitBehavior();
  }

  async function handleConfirmSend() {
    setSendState("sending");
    setSendMessage("");
    try {
      const payload = buildEntitlementPayload({
        form: {
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
        },
        estimate,
      });
      await sendEntitlementEmail(payload);
      setSendState("success");
      setSendMessage("Sent! Check your inbox for a copy of your results.");
    } catch (err) {
      setSendState("error");
      setSendMessage(err?.message || "Something went wrong sending the email.");
    }
  }

  function handleCloseAfterSend() {
    setShowConfirm(false);
    setSendState("idle");
    setSendMessage("");
    runOriginalSubmitBehavior();
  }

  return (
    <form onSubmit={handleSubmit} className="min-w-0" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label={`${calc.nameLabel || "Your name"} *`}>
          <Input
            placeholder={calc.namePlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name && (
            <p className="mt-1 text-xs font-medium text-destructive">{errors.name}</p>
          )}
        </FormField>
        <FormField label={`${calc.companyLabel || "Company name"} *`} hint={calc.companyHint}>
          <Input
            placeholder={calc.companyPlaceholder}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
            aria-invalid={Boolean(errors.company)}
          />
          {errors.company && (
            <p className="mt-1 text-xs font-medium text-destructive">{errors.company}</p>
          )}
        </FormField>

        <FormField
          label={`${calc.emailLabel || "Email address"} *`}
          hint={calc.emailHint || "We'll send your entitlement estimate here."}
          className="sm:col-span-2"
        >
          <div className="relative">
            <Input
              type="email"
              placeholder={calc.emailPlaceholder || "you@example.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-invalid={Boolean(errors.email)}
              className="pl-9"
            />
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs font-medium text-destructive">{errors.email}</p>
          )}
        </FormField>

        <FormField
          label={`${calc.industryLabel || "Industry / sector"} *`}
          hint={calc.industryHint}
          className="sm:col-span-2"
        >
          <Select
            value={industry || undefined}
            onValueChange={(v) => setIndustry(v)}
          >
            <SelectTrigger aria-invalid={Boolean(errors.industry)}>
              <SelectValue placeholder={calc.industryPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {content.industries.map((i) => (
                <SelectItem key={i} value={i}>
                  {i}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.industry && (
            <p className="mt-1 text-xs font-medium text-destructive">{errors.industry}</p>
          )}
        </FormField>

        {/* Employment Type toggle – kept */}
        <FormField label="Employment Type" className="sm:col-span-2">
          <RadioGroup
            value={employmentType}
            onValueChange={(v) => setEmploymentType(v)}
            className="grid grid-cols-2 gap-2"
          >
            <label
              className={`flex cursor-pointer items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium transition-colors ${employmentType === "employee"
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background hover:bg-secondary"
                }`}
            >
              <RadioGroupItem value="employee" className="sr-only" />
              Employee
            </label>
            <label
              className={`flex cursor-pointer items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium transition-colors ${employmentType === "zzp"
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background hover:bg-secondary"
                }`}
            >
              <RadioGroupItem value="zzp" className="sr-only" />
              Self-employed (ZZP)
            </label>
          </RadioGroup>
        </FormField>

        {/* Employee-specific fields – status group removed */}
        {employmentType === "employee" && (
          <>
            {/* Status radio group has been removed entirely */}

            <FormField
              label={`${calc.salaryLabel || "Gross monthly salary (€)"} *`}
              className="sm:col-span-2"
            >
              <Input
                type="number"
                inputMode="numeric"
                placeholder={calc.salaryPlaceholder}
                value={salary}
                min={calc.salaryMin}
                max={calc.salaryMax}
                step={calc.salaryStep}
                onChange={(e) => setSalary(e.target.value.replace(/[^\d.]/g, ""))}
                required
                aria-invalid={Boolean(errors.salary)}
              />
              {errors.salary && (
                <p className="mt-1 text-xs font-medium text-destructive">{errors.salary}</p>
              )}
            </FormField>

            <FormField label={`${calc.firstDayLabel || "First day of sick leave"} *`} hint={calc.firstDayHint}>
              <div className="relative">
                <Input
                  type="date"
                  value={firstDay}
                  onChange={(e) => setFirstDay(e.target.value)}
                  required
                  aria-invalid={Boolean(errors.firstDay)}
                />
                <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
              {errors.firstDay && (
                <p className="mt-1 text-xs font-medium text-destructive">{errors.firstDay}</p>
              )}
            </FormField>
            <FormField label={calc.lastDayLabel}>
              <div className="relative">
                <Input
                  type="date"
                  value={lastDay}
                  onChange={(e) => setLastDay(e.target.value)}
                />
                <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </FormField>

            <div className="sm:col-span-2">
              <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-secondary/40 p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{calc.linkedLabel}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{linkedDescription}</p>
                </div>
                <Switch checked={linked} onCheckedChange={setLinked} />
              </div>
              {linked && (
                <div className="mt-4 grid gap-5 sm:grid-cols-2">
                  <FormField label={calc.linkedFirstDayLabel}>
                    <div className="relative">
                      <Input
                        type="date"
                        value={linkedFirstDay}
                        onChange={(e) => setLinkedFirstDay(e.target.value)}
                      />
                      <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </FormField>
                  <FormField label={calc.linkedLastDayLabel}>
                    <div className="relative">
                      <Input
                        type="date"
                        value={linkedLastDay}
                        onChange={(e) => setLinkedLastDay(e.target.value)}
                      />
                      <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </FormField>
                  {linkedAbsenceFlag && (
                    <p className="sm:col-span-2 text-xs font-medium text-accent">
                      {linkedFlagMessage}
                    </p>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* ZZP informational block */}
        {employmentType === "zzp" && (
          <div className="sm:col-span-2 rounded-lg border border-border bg-secondary/40 p-4">
            <h4 className="text-sm font-medium text-foreground">
              Self-employed (ZZP) workers in the Netherlands are generally not entitled to employer-paid sick leave.
            </h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Your income during illness usually depends on disability insurance (AOV), a broodfonds, private insurance, or personal savings.
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-3"
              onClick={() => {
                window.open("https://www.uwv.nl/en/individuals/sickness-benefit", "_blank", "noopener,noreferrer");
              }}
            >
              Learn about support for self-employed workers
            </Button>
          </div>
        )}
      </div>

      {/* Disclaimer and submit – only shown for employees */}
      {employmentType === "employee" && (
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Info className="h-3.5 w-3.5 shrink-0" />
            {content.disclaimer}
          </p>
          <Button type="submit" size="lg" className="gap-2">
            {calc.submitLabel}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="send-confirm-title"
        >
          <div
            className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-foreground"
            style={{ boxShadow: "var(--shadow-elegant, 0 20px 40px rgba(0,0,0,0.2))" }}
          >
            <div className="flex items-start justify-between gap-4">
              <h3 id="send-confirm-title" className="font-serif text-xl text-foreground">
                Email your entitlement estimate?
              </h3>
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {sendState === "idle" && (
              <>
                <p className="mt-3 text-sm text-muted-foreground">
                  We'll send a copy of this estimate to{" "}
                  <span className="font-medium text-foreground">{email}</span> and to
                  our team, so we can follow up if you'd like help. Do we have your
                  permission to send these emails?
                </p>
                <div className="mt-6 flex flex-wrap justify-end gap-3">
                  <Button type="button" variant="outline" onClick={handleCancelConfirm}>
                    No, don't send
                  </Button>
                  <Button type="button" onClick={handleConfirmSend} className="gap-2">
                    Yes, send it
                  </Button>
                </div>
              </>
            )}

            {sendState === "sending" && (
              <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending your results…
              </div>
            )}

            {sendState === "success" && (
              <div className="mt-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  {sendMessage}
                </div>
                <div className="mt-6 flex justify-end">
                  <Button type="button" onClick={handleCloseAfterSend}>
                    Done
                  </Button>
                </div>
              </div>
            )}

            {sendState === "error" && (
              <div className="mt-4">
                <div className="flex items-start gap-2 text-sm font-medium text-destructive">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  {sendMessage}
                </div>
                <div className="mt-6 flex flex-wrap justify-end gap-3">
                  <Button type="button" variant="outline" onClick={handleCloseAfterSend}>
                    Skip
                  </Button>
                  <Button type="button" onClick={handleConfirmSend}>
                    Try again
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </form>
  );
}

export default CalculatorForm;