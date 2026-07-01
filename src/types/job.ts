// Job DTOs and filter types — mirror plan/02-api-contracts.md §2.

export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';

export type LocationType = 'REMOTE' | 'ONSITE' | 'HYBRID';

export type JobSource =
  | 'LINKEDIN'
  | 'INDEED'
  | 'GLASSDOOR'
  | 'BDJOBS'
  | 'OTHER';

export type JobCategory =
  | 'FULLSTACK'
  | 'BACKEND'
  | 'FRONTEND'
  | 'SOFTWARE_ENGINEER'
  | 'MOBILE'
  | 'DEVOPS'
  | 'QA'
  | 'OTHER';

export type SalaryCurrency = 'BDT' | 'USD';

export type JobSort = 'latest' | 'most_viewed' | 'salary_desc';

export type DatePostedFilter = 'today' | 'week' | 'month';

export type RegionFilter = 'bangladesh' | 'worldwide';

/** Query params for GET /api/jobs — serialized to the URL by useJobFilters. */
export type JobFilters = {
  q?: string;
  skills?: string[];
  location?: string;
  jobType?: JobType[];
  category?: JobCategory[];
  locationType?: LocationType[];
  remoteOnly?: boolean;
  region?: RegionFilter;
  salaryMin?: number;
  salaryMax?: number;
  experienceMax?: number;
  source?: JobSource[];
  datePosted?: DatePostedFilter;
  sort?: JobSort;
  page?: number;
  limit?: number;
};

/** Job card shape returned by list, trending, similar, and search endpoints. */
export type JobCardDto = {
  id: string;
  title: string;
  company: string;
  companyLogo: string | null;
  location: string;
  locationType: LocationType;
  isBangladesh: boolean;
  jobType: JobType;
  category: JobCategory;
  skills: string[];
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: SalaryCurrency | null;
  salaryNegotiable: boolean;
  experienceMin: number | null;
  experienceMax: number | null;
  source: JobSource;
  sourceUrl: string;
  postedAt: string;
  isActive: boolean;
  applicationDeadline: string | null;
  viewCount: number;
  isSaved: boolean;
  isApplied: boolean;
};

/** Full job detail — extends the card with description and market insight. */
export type JobDetailDto = JobCardDto & {
  description: string;
  requirements: string[];
  benefits: string[];
  sourceName: string | null;
  scrapedAt: string;
  marketInsight: {
    similarActiveCount: number;
    demandLabel: 'Low' | 'Medium' | 'High';
  };
};

/** Saved job row from GET /api/jobs/saved. */
export type SavedJobDto = {
  savedAt: string;
  note: string | null;
  job: JobCardDto;
};
