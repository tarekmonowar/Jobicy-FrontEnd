'use client';

// Single alert row — toggle active, preview count, test email, edit, delete.

import { useState } from 'react';
import { Bell, Mail, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertForm } from '@/components/alerts/AlertForm';
import {
  useAlertPreview,
  useDeleteAlert,
  useTestAlert,
  useUpdateAlert,
} from '@/hooks/useAlerts';
import type { AlertDto } from '@/types/alert';

type AlertCardProps = {
  alert: AlertDto;
};

const FREQUENCY_LABELS: Record<AlertDto['frequency'], string> = {
  INSTANT: 'Instant',
  DAILY: 'Daily',
  WEEKLY: 'Weekly',
};

const JOB_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship',
};

/**
 * Card for one job alert — owner actions: enable/disable, test, preview, edit, delete.
 */
export function AlertCard({ alert }: AlertCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const updateMutation = useUpdateAlert();
  const deleteMutation = useDeleteAlert();
  const testMutation = useTestAlert();
  const { data: preview, isLoading: previewLoading } = useAlertPreview(alert.id);

  const toggleActive = (checked: boolean) => {
    updateMutation.mutate({ id: alert.id, dto: { isActive: checked } });
  };

  const handleDelete = () => {
    deleteMutation.mutate(alert.id, {
      onSuccess: () => setConfirmDelete(false),
    });
  };

  return (
    <>
      <Card className={!alert.isActive ? 'opacity-75' : undefined}>
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <Bell className="size-4 text-primary" aria-hidden />
              <span className="font-medium">
                {alert.keywords.length > 0
                  ? alert.keywords.join(', ')
                  : alert.skills.length > 0
                    ? alert.skills.join(', ')
                    : 'Job alert'}
              </span>
              <Badge variant="outline">{FREQUENCY_LABELS[alert.frequency]}</Badge>
              {!alert.isActive && <Badge variant="secondary">Paused</Badge>}
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor={`active-${alert.id}`} className="text-xs text-muted-foreground">
                Active
              </Label>
              <Switch
                id={`active-${alert.id}`}
                checked={alert.isActive}
                onCheckedChange={toggleActive}
                disabled={updateMutation.isPending}
              />
            </div>
          </div>

          {/* Criteria summary */}
          <div className="flex flex-wrap gap-1.5 text-xs">
            {alert.skills.map((s) => (
              <Badge key={s} variant="secondary">
                {s}
              </Badge>
            ))}
            {alert.location && (
              <Badge variant="outline">📍 {alert.location}</Badge>
            )}
            {alert.jobType && (
              <Badge variant="outline">{JOB_TYPE_LABELS[alert.jobType]}</Badge>
            )}
            {alert.salaryMin != null && (
              <Badge variant="outline">Min {alert.salaryMin.toLocaleString()}</Badge>
            )}
          </div>

          {/* Preview count — jobs matched in the last 7 days */}
          <p className="text-sm text-muted-foreground">
            {previewLoading ? (
              'Loading preview…'
            ) : (
              <>
                <span className="font-medium text-foreground">
                  {preview?.matchedThisWeek ?? 0}
                </span>{' '}
                matching job(s) this week
              </>
            )}
          </p>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => testMutation.mutate(alert.id)}
              disabled={testMutation.isPending}
            >
              {testMutation.isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Mail className="size-3.5" />
              )}
              Send test
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEditOpen(true)}
            >
              <Pencil className="size-3.5" />
              Edit
            </Button>
            {!confirmDelete ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 className="size-3.5" />
                Delete
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Delete this alert?</span>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    'Confirm'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirmDelete(false)}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit alert</DialogTitle>
          </DialogHeader>
          <AlertForm
            embedded
            editAlert={alert}
            onEditDone={() => setEditOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
