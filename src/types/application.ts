// Application tracker types — mirror plan/02-api-contracts.md §4.

import type { JobCardDto } from '@/types/job';

export type AppliedJobDto = {
  appliedAt: string;
  job: JobCardDto;
};

export type ApplyResponse = {
  applied: true;
  appliedAt: string;
};

export type UnapplyResponse = {
  applied: false;
};
