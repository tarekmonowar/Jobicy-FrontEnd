'use client';

// Inline note editor for a saved job card.

import { useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUpdateSavedNote } from '@/hooks/useSavedJobs';
import type { SavedJobDto } from '@/types/job';

type SavedNoteEditorProps = {
  saved: SavedJobDto;
};

/**
 * View or edit the personal note on a saved job.
 */
export function SavedNoteEditor({ saved }: SavedNoteEditorProps) {
  const [editing, setEditing] = useState(false);
  const [note, setNote] = useState(saved.note ?? '');
  const updateMutation = useUpdateSavedNote();

  const save = () => {
    updateMutation.mutate(
      { jobId: saved.job.id, note },
      { onSuccess: () => setEditing(false) },
    );
  };

  const cancel = () => {
    setNote(saved.note ?? '');
    setEditing(false);
  };

  if (!editing) {
    return (
      <div className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
        <p className="flex-1 italic">
          {saved.note ? saved.note : 'No note — add one to remember why you saved this.'}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7 shrink-0"
          onClick={() => setEditing(true)}
          aria-label="Edit note"
        >
          <Pencil className="size-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-2 space-y-2">
      <textarea
        className="min-h-[72px] w-full rounded-md border bg-background px-3 py-2 text-sm"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Your note…"
      />
      <div className="flex gap-2">
        <Button type="button" size="sm" onClick={save} disabled={updateMutation.isPending}>
          <Check className="size-3.5" />
          Save
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={cancel}>
          <X className="size-3.5" />
          Cancel
        </Button>
      </div>
    </div>
  );
}
