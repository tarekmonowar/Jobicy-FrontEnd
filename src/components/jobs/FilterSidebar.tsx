'use client';

// Filter sidebar — Region + work type + all list filters; updates shareable URL.

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';
import type {
  DatePostedFilter,
  JobCategory,
  JobFilters,
  JobSource,
  JobType,
  LocationType,
  RegionFilter,
} from '@/types/job';

type FilterSidebarProps = {
  filters: JobFilters;
  onChange: (partial: Partial<JobFilters>) => void;
  onReset: () => void;
  className?: string;
};

const PRIMARY_CATEGORIES: { value: JobCategory; label: string }[] = [
  { value: 'FULLSTACK', label: 'Fullstack' },
  { value: 'BACKEND', label: 'Backend' },
  { value: 'FRONTEND', label: 'Frontend' },
  { value: 'SOFTWARE_ENGINEER', label: 'Software Engineer' },
  { value: 'MOBILE', label: 'Mobile' },
  { value: 'DEVOPS', label: 'DevOps' },
  { value: 'QA', label: 'QA' },
];

const JOB_TYPES: { value: JobType; label: string }[] = [
  { value: 'FULL_TIME', label: 'Full-time' },
  { value: 'PART_TIME', label: 'Part-time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'INTERNSHIP', label: 'Internship' },
];

const WORK_TYPES: { value: LocationType; label: string }[] = [
  { value: 'ONSITE', label: 'Onsite' },
  { value: 'REMOTE', label: 'Remote' },
  { value: 'HYBRID', label: 'Hybrid' },
];

const SOURCES: { value: JobSource; label: string }[] = [
  { value: 'LINKEDIN', label: 'LinkedIn' },
  { value: 'INDEED', label: 'Indeed' },
  { value: 'GLASSDOOR', label: 'Glassdoor' },
  { value: 'BDJOBS', label: 'BDJobs' },
  { value: 'OTHER', label: 'Other' },
];

/** Toggle a value in a multi-select filter array. */
function toggleInArray<T>(current: T[] | undefined, value: T): T[] {
  const set = new Set(current ?? []);
  if (set.has(value)) set.delete(value);
  else set.add(value);
  return Array.from(set);
}

/** Debounced keyword field — remounts when URL `q` changes (browser back/forward). */
function KeywordFilter({
  urlQ,
  onDebouncedChange,
}: {
  urlQ?: string;
  onDebouncedChange: (q: string | undefined) => void;
}) {
  const [draft, setDraft] = useState(urlQ ?? '');
  const debounced = useDebounce(draft, 400);

  useEffect(() => {
    const next = debounced.trim() || undefined;
    if (next !== urlQ) {
      onDebouncedChange(next);
    }
  }, [debounced, urlQ, onDebouncedChange]);

  return (
    <Input
      id="filter-q"
      placeholder="Title, company, skills…"
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
    />
  );
}

/**
 * All job board filters — keyword is debounced before hitting the URL.
 */
export function FilterSidebar({ filters, onChange, onReset, className }: FilterSidebarProps) {
  const [skillInput, setSkillInput] = useState('');
  const setRegion = (region: RegionFilter | undefined) => onChange({ region });

  const setWorkTypes = (locationType: LocationType[]) => {
    onChange({
      locationType: locationType.length ? locationType : undefined,
      remoteOnly: locationType.length === 1 && locationType[0] === 'REMOTE' ? true : undefined,
    });
  };

  const addSkill = () => {
    const skill = skillInput.trim();
    if (!skill) return;
    const skills = [...(filters.skills ?? [])];
    if (!skills.includes(skill)) skills.push(skill);
    onChange({ skills });
    setSkillInput('');
  };

  const removeSkill = (skill: string) => {
    onChange({ skills: filters.skills?.filter((s) => s !== skill) });
  };

  const expMax = filters.experienceMax ?? 15;
  const salaryMin = filters.salaryMin ?? 0;
  const salaryMax = filters.salaryMax ?? 500000;

  return (
    <aside
      className={cn(
        'space-y-6 rounded-xl border bg-card p-4 text-sm',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Filters</h2>
        <Button variant="ghost" size="sm" onClick={onReset}>
          Reset
        </Button>
      </div>

      {/* Region toggle */}
      <div className="space-y-2">
        <p className="font-medium">Region</p>
        <div className="flex gap-2">
          {(
            [
              { value: undefined, label: 'All' },
              { value: 'bangladesh' as RegionFilter, label: 'Bangladesh' },
              { value: 'worldwide' as RegionFilter, label: 'Worldwide' },
            ] as const
          ).map((opt) => (
            <Button
              key={opt.label}
              type="button"
              size="sm"
              variant={filters.region === opt.value ? 'default' : 'outline'}
              onClick={() => setRegion(opt.value)}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Work type */}
      <div className="space-y-2">
        <p className="font-medium">Work type</p>
        <div className="space-y-2">
          {WORK_TYPES.map((wt) => (
            <label key={wt.value} className="flex items-center gap-2">
              <Checkbox
                checked={filters.locationType?.includes(wt.value) ?? false}
                onCheckedChange={() =>
                  setWorkTypes(toggleInArray(filters.locationType, wt.value))
                }
              />
              <span>{wt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Keyword — key remounts input when URL q changes via browser navigation */}
      <div className="space-y-2">
        <Label htmlFor="filter-q">Keywords</Label>
        <KeywordFilter
          key={filters.q ?? '__empty__'}
          urlQ={filters.q}
          onDebouncedChange={(q) => onChange({ q })}
        />
      </div>

      {/* Skills tags */}
      <div className="space-y-2">
        <Label htmlFor="filter-skills">Skills</Label>
        <div className="flex gap-2">
          <Input
            id="filter-skills"
            placeholder="e.g. React"
            value={skillInput}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            onChange={(e) => setSkillInput(e.target.value)}
          />
          <Button type="button" size="sm" variant="secondary" onClick={addSkill}>
            Add
          </Button>
        </div>
        {filters.skills && filters.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {filters.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  aria-label={`Remove ${skill}`}
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="filter-location">Location</Label>
        <Input
          id="filter-location"
          placeholder="City or area"
          value={filters.location ?? ''}
          onChange={(e) => onChange({ location: e.target.value || undefined })}
        />
      </div>

      {/* Category — primary developer roles */}
      <div className="space-y-2">
        <p className="font-medium">Role category</p>
        <div className="max-h-40 space-y-2 overflow-y-auto">
          {PRIMARY_CATEGORIES.map((cat) => (
            <label key={cat.value} className="flex items-center gap-2">
              <Checkbox
                checked={filters.category?.includes(cat.value) ?? false}
                onCheckedChange={() =>
                  onChange({ category: toggleInArray(filters.category, cat.value) })
                }
              />
              <span>{cat.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Job type */}
      <div className="space-y-2">
        <p className="font-medium">Job type</p>
        <div className="space-y-2">
          {JOB_TYPES.map((jt) => (
            <label key={jt.value} className="flex items-center gap-2">
              <Checkbox
                checked={filters.jobType?.includes(jt.value) ?? false}
                onCheckedChange={() =>
                  onChange({ jobType: toggleInArray(filters.jobType, jt.value) })
                }
              />
              <span>{jt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience max */}
      <div className="space-y-2">
        <p className="font-medium">Max experience: {expMax} yrs</p>
        <Slider
          min={0}
          max={15}
          step={1}
          value={[expMax]}
          onValueChange={([v]) =>
            onChange({ experienceMax: v === 15 ? undefined : v })
          }
        />
      </div>

      {/* Salary range */}
      <div className="space-y-2">
        <p className="font-medium">
          Salary (BDT): {salaryMin.toLocaleString()} – {salaryMax.toLocaleString()}
        </p>
        <Slider
          min={0}
          max={500000}
          step={10000}
          value={[salaryMin, salaryMax]}
          onValueChange={([lo, hi]) =>
            onChange({
              salaryMin: lo === 0 ? undefined : lo,
              salaryMax: hi === 500000 ? undefined : hi,
            })
          }
        />
      </div>

      {/* Date posted */}
      <div className="space-y-2">
        <Label>Posted</Label>
        <Select
          value={filters.datePosted ?? 'any'}
          onValueChange={(v) =>
            onChange({
              datePosted:
                v === 'any' ? undefined : (v as DatePostedFilter),
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Any time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This week</SelectItem>
            <SelectItem value="month">This month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Source */}
      <div className="space-y-2">
        <p className="font-medium">Source</p>
        <div className="space-y-2">
          {SOURCES.map((src) => (
            <label key={src.value} className="flex items-center gap-2">
              <Checkbox
                checked={filters.source?.includes(src.value) ?? false}
                onCheckedChange={() =>
                  onChange({ source: toggleInArray(filters.source, src.value) })
                }
              />
              <span>{src.label}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
