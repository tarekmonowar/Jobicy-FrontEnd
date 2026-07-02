// Salary line — range, Negotiable, or Not specified; respects BDT/USD toggle.

import { formatSalary } from '@/lib/utils';
import { useUiStore } from '@/store/uiStore';
import type { SalaryCurrency } from '@/types/job';

type SalaryDisplayProps = {
  min: number | null;
  max: number | null;
  currency: SalaryCurrency | null;
  negotiable: boolean;
  className?: string;
  /** Prefix with "Salary:" label (job cards). */
  showLabel?: boolean;
  valueClassName?: string;
};

/**
 * Formats salary for cards and headers using the global currency preference.
 */
export function SalaryDisplay({
  min,
  max,
  currency,
  negotiable,
  className,
  showLabel = false,
  valueClassName,
}: SalaryDisplayProps) {
  const displayCurrency = useUiStore((s) => s.currency);
  const text = formatSalary(min, max, currency, negotiable, displayCurrency);

  if (showLabel) {
    return (
      <div className={className ?? 'text-sm text-right'}>
        <span className="font-normal text-muted-foreground">Salary: </span>
        <span className={valueClassName ?? 'font-semibold text-foreground'}>{text}</span>
      </div>
    );
  }

  return (
    <span className={className ?? 'text-sm font-medium text-foreground'}>
      {text}
    </span>
  );
}
