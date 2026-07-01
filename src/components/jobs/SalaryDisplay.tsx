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
}: SalaryDisplayProps) {
  const displayCurrency = useUiStore((s) => s.currency);
  const text = formatSalary(min, max, currency, negotiable, displayCurrency);

  return (
    <span className={className ?? 'text-sm font-medium text-foreground'}>
      {text}
    </span>
  );
}
