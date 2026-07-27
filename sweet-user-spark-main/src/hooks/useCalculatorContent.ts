/**
 * useCalculatorContent.ts
 * ---------------------------------------------------------------------------
 * Fetches the ACF-driven content from WordPress and merges it on top of
 * DEFAULT_CALCULATOR_CONTENT, so the page never breaks if WordPress is
 * unreachable or a field hasn't been filled in yet.
 *
 * WP SIDE SETUP (see /wp-acf/ACF-INTEGRATION.md for full detail):
 *   1. Install "ACF to REST API" plugin (or ACF Pro 6.1+, which has it built in).
 *   2. Create the field group from /wp-acf/acf-field-group.json
 *      (ACF > Field Groups > Tools > Import Field Groups).
 *   3. Attach it to an Options Page ("Calculator Settings") — recommended,
 *      since this content isn't tied to a specific post.
 *   4. That exposes the fields at:
 *        GET {WP_URL}/wp-json/acf/v3/options/options
 *      returning { acf: { hero_badge: "...", stats_0_stat_value: "...", ... } }
 *
 * If you'd rather attach the field group to a normal Page instead of an
 * Options Page, change ACF_ENDPOINT below to:
 *        {WP_URL}/wp-json/acf/v3/pages/{PAGE_ID}
 *
 * Set the WordPress base URL once via env var:
 *        VITE_WP_API_URL=https://cms.example.com
 * ---------------------------------------------------------------------------
 */

import { useEffect, useState } from "react";
import {
  CalculatorContent,
  DEFAULT_CALCULATOR_CONTENT,
} from "@/config/calculatorContent";

const WP_API_URL = import.meta.env.VITE_WP_API_URL as string | undefined;
const ACF_ENDPOINT = WP_API_URL
  ? `${WP_API_URL.replace(/\/$/, "")}/wp-json/acf/v3/options/options`
  : null;

/**
 * Converts the raw ACF JSON (flat field names, repeater rows as arrays of
 * objects) into the strongly-typed CalculatorContent shape used by the UI.
 * Keeping this mapping in one place means a renamed ACF field only needs to
 * be updated here, never inside the component itself.
 */
function mapAcfResponseToContent(acf: Record<string, any>): Partial<CalculatorContent> {
  const content: Partial<CalculatorContent> = {};

  if (acf.hero_badge || acf.hero_title_line1 || acf.hero_description) {
    content.hero = {
      badge: acf.hero_badge ?? DEFAULT_CALCULATOR_CONTENT.hero.badge,
      titleLine1: acf.hero_title_line1 ?? DEFAULT_CALCULATOR_CONTENT.hero.titleLine1,
      titleHighlight:
        acf.hero_title_highlight ?? DEFAULT_CALCULATOR_CONTENT.hero.titleHighlight,
      titleSuffix: acf.hero_title_suffix ?? DEFAULT_CALCULATOR_CONTENT.hero.titleSuffix,
      description: acf.hero_description ?? DEFAULT_CALCULATOR_CONTENT.hero.description,
      ctaLabel: acf.hero_cta_label ?? DEFAULT_CALCULATOR_CONTENT.hero.ctaLabel,
    };
  }

  // ACF repeater fields come back as an array of row objects: [{ stat_value, stat_label }, ...]
  if (Array.isArray(acf.stats) && acf.stats.length > 0) {
    content.stats = acf.stats.map((row: any) => ({
      value: row.stat_value ?? "",
      label: row.stat_label ?? "",
    }));
  }

  if (acf.sample_amount || acf.sample_period_label) {
    content.sampleResult = {
      amount: Number(acf.sample_amount) || DEFAULT_CALCULATOR_CONTENT.sampleResult.amount,
      periodLabel:
        acf.sample_period_label ?? DEFAULT_CALCULATOR_CONTENT.sampleResult.periodLabel,
      currentWeek:
        Number(acf.sample_current_week) ||
        DEFAULT_CALCULATOR_CONTENT.sampleResult.currentWeek,
    };
  }

  if (Array.isArray(acf.industries) && acf.industries.length > 0) {
    content.industries = acf.industries
      .map((row: any) => row.industry_name)
      .filter(Boolean);
  }

  if (acf.rules_year1_percent || acf.rules_min_wage_monthly) {
    content.rules = {
      year1Percent:
        Number(acf.rules_year1_percent) || DEFAULT_CALCULATOR_CONTENT.rules.year1Percent,
      year2Percent:
        Number(acf.rules_year2_percent) || DEFAULT_CALCULATOR_CONTENT.rules.year2Percent,
      maxWeeks: Number(acf.rules_max_weeks) || DEFAULT_CALCULATOR_CONTENT.rules.maxWeeks,
      waitingDays:
        Number(acf.rules_waiting_days) ?? DEFAULT_CALCULATOR_CONTENT.rules.waitingDays,
      minWageMonthly:
        Number(acf.rules_min_wage_monthly) ||
        DEFAULT_CALCULATOR_CONTENT.rules.minWageMonthly,
      linkedAbsenceWindowDays:
        Number(acf.rules_linked_absence_days) ||
        DEFAULT_CALCULATOR_CONTENT.rules.linkedAbsenceWindowDays,
    };
  }

  if (Array.isArray(acf.how_it_works) && acf.how_it_works.length > 0) {
    content.howItWorks = acf.how_it_works.map((row: any) => ({
      number: row.step_number ?? "",
      title: row.step_title ?? "",
      description: row.step_description ?? "",
    }));
  }

  if (acf.policy_cta_title || acf.policy_cta_description) {
    content.policyAnalyserCta = {
      title: acf.policy_cta_title ?? DEFAULT_CALCULATOR_CONTENT.policyAnalyserCta.title,
      description:
        acf.policy_cta_description ??
        DEFAULT_CALCULATOR_CONTENT.policyAnalyserCta.description,
    };
  }

  if (acf.disclaimer_text) {
    content.disclaimer = acf.disclaimer_text;
  }

  return content;
}

interface UseCalculatorContentResult {
  content: CalculatorContent;
  isLoading: boolean;
  /** true if we're showing hardcoded fallback data because WP wasn't reachable */
  isFallback: boolean;
  error: string | null;
}

export function useCalculatorContent(): UseCalculatorContentResult {
  const [content, setContent] = useState<CalculatorContent>(DEFAULT_CALCULATOR_CONTENT);
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(ACF_ENDPOINT));
  const [isFallback, setIsFallback] = useState<boolean>(!ACF_ENDPOINT);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ACF_ENDPOINT) {
      // No WP URL configured (e.g. local dev) — silently use defaults.
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(ACF_ENDPOINT!);
        if (!res.ok) throw new Error(`WP REST API responded ${res.status}`);
        const json = await res.json();
        const mapped = mapAcfResponseToContent(json.acf ?? {});

        if (!cancelled) {
          setContent({
            ...DEFAULT_CALCULATOR_CONTENT,
            ...mapped,
            hero: { ...DEFAULT_CALCULATOR_CONTENT.hero, ...mapped.hero },
            sampleResult: {
              ...DEFAULT_CALCULATOR_CONTENT.sampleResult,
              ...mapped.sampleResult,
            },
            rules: { ...DEFAULT_CALCULATOR_CONTENT.rules, ...mapped.rules },
            policyAnalyserCta: {
              ...DEFAULT_CALCULATOR_CONTENT.policyAnalyserCta,
              ...mapped.policyAnalyserCta,
            },
          });
          setIsFallback(false);
        }
      } catch (err) {
        if (!cancelled) {
          setIsFallback(true);
          setError(err instanceof Error ? err.message : "Failed to load WP content");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { content, isLoading, isFallback, error };
}
