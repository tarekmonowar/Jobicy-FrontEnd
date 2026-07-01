import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';

type EmptyStateProps = {
  title: string;
  message: string;
  action?: ReactNode;
};

/**
 * Illustration + message for lists with no data.
 * Optional action slot (e.g. a CTA button).
 */
export function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-muted">
        <Inbox className="size-8 text-muted-foreground" aria-hidden />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
      </div>
      {action}
    </div>
  );
}

/** Convenience wrapper when the action is a single button. */
export function EmptyStateButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <Button onClick={onClick} variant="outline">
      {label}
    </Button>
  );
}
