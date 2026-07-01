// Alert types — mirror plan/02-api-contracts.md §5.

import type { JobType } from '@/types/job';

export type AlertFrequency = 'INSTANT' | 'DAILY' | 'WEEKLY';

export type AlertDto = {
  id: string;
  keywords: string[];
  skills: string[];
  location: string | null;
  jobType: JobType | null;
  salaryMin: number | null;
  frequency: AlertFrequency;
  isActive: boolean;
  createdAt: string;
};

export type CreateAlertDto = Omit<AlertDto, 'id' | 'createdAt'>;

export type UpdateAlertDto = Partial<CreateAlertDto>;
