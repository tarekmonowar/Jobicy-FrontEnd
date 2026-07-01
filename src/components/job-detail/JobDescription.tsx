// Markdown job description renderer.

import ReactMarkdown from 'react-markdown';

type JobDescriptionProps = {
  markdown: string;
};

/**
 * Renders the full job description as markdown (no raw HTML for safety).
 */
export function JobDescription({ markdown }: JobDescriptionProps) {
  return (
    <article className="job-markdown space-y-3 text-sm leading-relaxed text-muted-foreground [&_h1]:text-xl [&_h1]:font-semibold [&_h1]:text-foreground [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:font-medium [&_h3]:text-foreground [&_li]:ml-4 [&_li]:list-disc [&_p]:mb-2 [&_strong]:text-foreground [&_ul]:mb-3 [&_ul]:space-y-1">
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </article>
  );
}
