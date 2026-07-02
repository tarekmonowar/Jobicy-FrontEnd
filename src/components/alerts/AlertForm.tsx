'use client';

// Create or edit a job alert — RHF + Zod, keywords/skills tag inputs.

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCreateAlert, useUpdateAlert } from '@/hooks/useAlerts';
import { toastFormErrors } from '@/hooks/useAuth';
import type { AlertDto, AlertFrequency } from '@/types/alert';
import type { JobType, LocationType } from '@/types/job';

const alertSchema = z.object({
  keywords: z.array(z.string()),
  skills: z.array(z.string()),
  location: z.string().optional(),
  jobType: z
    .enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'])
    .optional()
    .nullable(),
  locationType: z.enum(['REMOTE', 'ONSITE', 'HYBRID']).optional().nullable(),
  frequency: z.enum(['INSTANT', 'DAILY', 'WEEKLY']),
});

type AlertFormValues = z.infer<typeof alertSchema>;

type AlertFormProps = {
  /** When set, the form edits this alert instead of creating a new one. */
  editAlert?: AlertDto | null;
  onEditDone?: () => void;
  /** Skip outer Card wrapper (e.g. when rendered inside a Dialog). */
  embedded?: boolean;
};

const FREQUENCY_OPTIONS: { value: AlertFrequency; label: string }[] = [
  { value: 'INSTANT', label: 'Instant' },
  { value: 'DAILY', label: 'Daily digest' },
  { value: 'WEEKLY', label: 'Weekly digest' },
];

const JOB_TYPE_OPTIONS: { value: JobType; label: string }[] = [
  { value: 'FULL_TIME', label: 'Full-time' },
  { value: 'PART_TIME', label: 'Part-time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'INTERNSHIP', label: 'Internship' },
];

const LOCATION_TYPE_OPTIONS: { value: LocationType; label: string }[] = [
  { value: 'REMOTE', label: 'Remote' },
  { value: 'ONSITE', label: 'Onsite' },
  { value: 'HYBRID', label: 'Hybrid' },
];

/** Tag input helper — add/remove string chips. */
function TagInput({
  label,
  placeholder,
  values,
  onChange,
}: {
  label: string;
  placeholder: string;
  values: string[];
  onChange: (next: string[]) => void;
}) {
  const [draft, setDraft] = useState('');

  const add = () => {
    const tag = draft.trim();
    if (!tag || values.includes(tag)) return;
    onChange([...values, tag]);
    setDraft('');
  };

  const remove = (tag: string) => onChange(values.filter((v) => v !== tag));

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
        />
        <Button type="button" variant="secondary" size="sm" onClick={add}>
          Add
        </Button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {values.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1 pr-1">
              {tag}
              <button
                type="button"
                className="rounded-full p-0.5 hover:bg-muted"
                onClick={() => remove(tag)}
                aria-label={`Remove ${tag}`}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Form to create a new alert or update an existing one.
 */
export function AlertForm({ editAlert, onEditDone, embedded = false }: AlertFormProps) {
  const isEdit = Boolean(editAlert);
  const createMutation = useCreateAlert();
  const updateMutation = useUpdateAlert();
  const pending = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
  } = useForm<AlertFormValues>({
    resolver: zodResolver(alertSchema),
    defaultValues: {
      keywords: [],
      skills: [],
      location: '',
      jobType: null,
      locationType: null,
      frequency: 'INSTANT',
    },
  });

  const keywords = watch('keywords');
  const skills = watch('skills');

  useEffect(() => {
    if (editAlert) {
      reset({
        keywords: editAlert.keywords,
        skills: editAlert.skills,
        location: editAlert.location ?? '',
        jobType: editAlert.jobType,
        locationType: editAlert.locationType,
        frequency: editAlert.frequency,
      });
    } else {
      reset({
        keywords: [],
        skills: [],
        location: '',
        jobType: null,
        locationType: null,
        frequency: 'INSTANT',
      });
    }
  }, [editAlert, reset]);

  const onSubmit = async (values: AlertFormValues) => {
    const payload = {
      keywords: values.keywords,
      skills: values.skills,
      location: values.location?.trim() || null,
      jobType: values.jobType ?? null,
      locationType: values.locationType ?? null,
      frequency: values.frequency,
      isActive: editAlert?.isActive ?? true,
    };

    if (isEdit && editAlert) {
      await updateMutation.mutateAsync({ id: editAlert.id, dto: payload });
      onEditDone?.();
      reset();
    } else {
      await createMutation.mutateAsync(payload);
      reset({
        keywords: [],
        skills: [],
        location: '',
        jobType: null,
        locationType: null,
        frequency: 'INSTANT',
      });
    }
  };

  const formBody = (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit(onSubmit, toastFormErrors)(e);
      }}
      noValidate
    >
      <TagInput
        label="Keywords"
        placeholder="e.g. React, senior"
        values={keywords}
        onChange={(next) => setValue('keywords', next)}
      />

      <TagInput
        label="Skills"
        placeholder="e.g. Node.js, TypeScript"
        values={skills}
        onChange={(next) => setValue('skills', next)}
      />

      <div className="space-y-2">
        <Label htmlFor="alert-location">Location (optional)</Label>
        <Input
          id="alert-location"
          placeholder="e.g. Dhaka"
          disabled={pending}
          {...register('location')}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Job type (optional)</Label>
          <Controller
            name="jobType"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value ?? 'any'}
                onValueChange={(v) => field.onChange(v === 'any' ? null : v)}
                disabled={pending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any type</SelectItem>
                  {JOB_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label>Work mode (optional)</Label>
          <Controller
            name="locationType"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value ?? 'any'}
                onValueChange={(v) => field.onChange(v === 'any' ? null : v)}
                disabled={pending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any mode</SelectItem>
                  {LOCATION_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      {/* Create (left) · frequency (right) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
        <div className="flex gap-2">
          <Button type="submit" disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving…
              </>
            ) : isEdit ? (
              'Update alert'
            ) : (
              'Create alert'
            )}
          </Button>
          {isEdit && (
            <Button type="button" variant="ghost" onClick={onEditDone} disabled={pending}>
              Cancel
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="alert-frequency" className="shrink-0 text-sm text-muted-foreground">
            Email frequency
          </Label>
          <Controller
            name="frequency"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange} disabled={pending}>
                <SelectTrigger id="alert-frequency" className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FREQUENCY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
    </form>
  );

  if (embedded) {
    return formBody;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {isEdit ? 'Edit alert' : 'Create new alert'}
        </CardTitle>
      </CardHeader>
      <CardContent>{formBody}</CardContent>
    </Card>
  );
}
