/**
 * CalculatorForm.jsx — Calculate page
 * The left-hand input form. Fully controlled: all values + setters are
 * passed down from CalculatePage so the parent can compute the live result.
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

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="rounded-2xl border border-border bg-card p-6 sm:p-8"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Your name">
          <Input placeholder="e.g. Jordan Vance" />
        </FormField>
        <FormField label="Company name" hint="Used to label your result.">
          <Input placeholder="e.g. Company B.V." />
        </FormField>

        <FormField
          label="Industry / sector"
          hint="Flags if your sector typically has a CAO above the statutory minimum."
          className="sm:col-span-2"
        >
          {/* Options come from the ACF "industries" repeater */}
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select your industry" />
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

        <FormField label="Employment status" className="sm:col-span-2">
          <RadioGroup
            value={status}
            onValueChange={(v) => setStatus(v)}
            className="grid grid-cols-2 gap-2"
          >
            {[
              { v: "employee", l: "Employee" },
              { v: "self", l: "Self-employed" },
            ].map((o) => (
              <label
                key={o.v}
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium transition-colors ${
                  status === o.v
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:bg-secondary"
                }`}
              >
                <RadioGroupItem value={o.v} className="sr-only" />
                {o.l}
              </label>
            ))}
          </RadioGroup>
        </FormField>

        <FormField label="Gross monthly salary (€)">
          <Input
            inputMode="numeric"
            placeholder="3200"
            value={salary}
            onChange={(e) => setSalary(e.target.value.replace(/\D/g, ""))}
          />
        </FormField>
        <FormField label="Contracted hours / week">
          <Input
            inputMode="numeric"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />
        </FormField>

        <FormField
          label="First day of sick leave"
          hint="We'll work out the week number for you."
        >
          <div className="relative">
            <Input
              type="date"
              value={firstDay}
              onChange={(e) => setFirstDay(e.target.value)}
            />
            <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </FormField>
        <FormField label="Last day (leave blank if still off)">
          <Input
            type="date"
            value={lastDay}
            onChange={(e) => setLastDay(e.target.value)}
          />
        </FormField>

        <div className="sm:col-span-2">
          <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-secondary/40 p-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                Linked earlier absence?
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                A new absence within{" "}
                {Math.round(content.rules.linkedAbsenceWindowDays / 7)} weeks of the
                last one is legally linked — it counts toward the same{" "}
                {content.rules.maxWeeks}-week limit.
              </p>
            </div>
            <Switch checked={linked} onCheckedChange={setLinked} />
          </div>
          {linked && (
            <div className="mt-4">
              <FormField label="Last day of that earlier sick leave">
                <Input
                  type="date"
                  value={linkedLastDay}
                  onChange={(e) => setLinkedLastDay(e.target.value)}
                />
              </FormField>
              {linkedAbsenceFlag && (
                <p className="mt-2 text-xs font-medium text-accent">
                  These absences are linked — they share one {content.rules.maxWeeks}
                  -week entitlement.
                </p>
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
          Calculate my entitlement
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}

export default CalculatorForm;
