/**
 * CalculatorForm.jsx — Calculate page
 * Fully controlled form. Every label, placeholder, hint, default constraint,
 * and button string comes from `content` (ACF). No hardcoded copy.
 */
import { CalendarDays, Info, ArrowRight } from "lucide-react";
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
import { formatTemplate } from "../content";

export function CalculatorForm({ content, form }) {
  const {
    status,
    setStatus,
    linked,
    setLinked,
    linkedLastDay,
    setLinkedLastDay,
    salary,
    setSalary,
    hours,
    setHours,
    firstDay,
    setFirstDay,
    lastDay,
    setLastDay,
    linkedAbsenceFlag,
  } = form;

  const calc = content.calculator;
  const rules = content.rules;

  const linkedDescription = formatTemplate(calc.linkedDescription, {
    weeks: Math.round(rules.linkedAbsenceWindowDays / 7),
    maxWeeks: rules.maxWeeks,
  });

  const linkedFlagMessage = formatTemplate(calc.linkedFlagMessage, {
    maxWeeks: rules.maxWeeks,
  });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="rounded-2xl border border-border bg-card p-6 sm:p-8"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label={calc.nameLabel}>
          <Input placeholder={calc.namePlaceholder} />
        </FormField>
        <FormField label={calc.companyLabel} hint={calc.companyHint}>
          <Input placeholder={calc.companyPlaceholder} />
        </FormField>

        <FormField
          label={calc.industryLabel}
          hint={calc.industryHint}
          className="sm:col-span-2"
        >
          <Select>
            <SelectTrigger>
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
        </FormField>

        <FormField label={calc.statusLabel} className="sm:col-span-2">
          <RadioGroup
            value={status}
            onValueChange={(v) => setStatus(v)}
            className="grid grid-cols-2 gap-2"
          >
            {calc.statusOptions.map((o) => (
              <label
                key={o.value}
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium transition-colors ${
                  status === o.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:bg-secondary"
                }`}
              >
                <RadioGroupItem value={o.value} className="sr-only" />
                {o.label}
              </label>
            ))}
          </RadioGroup>
        </FormField>

        <FormField label={calc.salaryLabel}>
          <Input
            type="number"
            inputMode="numeric"
            placeholder={calc.salaryPlaceholder}
            value={salary}
            min={calc.salaryMin}
            max={calc.salaryMax}
            step={calc.salaryStep}
            onChange={(e) => setSalary(e.target.value.replace(/[^\d.]/g, ""))}
          />
        </FormField>
        <FormField label={calc.hoursLabel}>
          <Input
            type="number"
            inputMode="numeric"
            placeholder={calc.hoursPlaceholder}
            value={hours}
            min={calc.hoursMin}
            max={calc.hoursMax}
            step={calc.hoursStep}
            onChange={(e) => setHours(e.target.value)}
          />
        </FormField>

        <FormField label={calc.firstDayLabel} hint={calc.firstDayHint}>
          <div className="relative">
            <Input
              type="date"
              value={firstDay}
              onChange={(e) => setFirstDay(e.target.value)}
            />
            <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </FormField>
        <FormField label={calc.lastDayLabel}>
          <Input
            type="date"
            value={lastDay}
            onChange={(e) => setLastDay(e.target.value)}
          />
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
            <div className="mt-4">
              <FormField label={calc.linkedLastDayLabel}>
                <Input
                  type="date"
                  value={linkedLastDay}
                  onChange={(e) => setLinkedLastDay(e.target.value)}
                />
              </FormField>
              {linkedAbsenceFlag && (
                <p className="mt-2 text-xs font-medium text-accent">{linkedFlagMessage}</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Info className="h-3.5 w-3.5" />
          {content.disclaimer}
        </p>
        <Button type="submit" size="lg" className="gap-2">
          {calc.submitLabel}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}

export default CalculatorForm;
