// Skill tag chips for job cards and detail views.

import { Badge } from '@/components/ui/badge';

type SkillTagsProps = {
  skills: string[];
  max?: number;
};

/** Renders normalized skill tags, optionally truncated. */
export function SkillTags({ skills, max = 5 }: SkillTagsProps) {
  const visible = skills.slice(0, max);
  const extra = skills.length - visible.length;

  if (skills.length === 0) {
    return <span className="text-xs text-muted-foreground">No skills listed</span>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {visible.map((skill) => (
        <Badge key={skill} variant="outline" className="text-[11px] font-normal">
          {skill}
        </Badge>
      ))}
      {extra > 0 && (
        <Badge variant="ghost" className="text-[11px] text-muted-foreground">
          +{extra}
        </Badge>
      )}
    </div>
  );
}
