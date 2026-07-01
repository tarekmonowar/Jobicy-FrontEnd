// Socket.io server → client event map — mirror plan/02-api-contracts.md §9.

import type { JobCardDto } from '@/types/job';

export type StatsUpdatePayload = {
  totalActiveJobs: number;
  newJobsToday: number;
};

export type JobNewPayload = {
  jobs: JobCardDto[];
};

/** Typed map of events the backend gateway emits. */
export type ServerToClientEvents = {
  'stats:update': (payload: StatsUpdatePayload) => void;
  'job:new': (payload: JobNewPayload) => void;
};
