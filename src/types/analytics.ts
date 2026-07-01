// Analytics chart data shapes — mirror plan/02-api-contracts.md §6.

export type AnalyticsRange = '7d' | '30d';

export type OverviewDto = {
  totalActiveJobs: number;
  newJobsToday: number;
  companiesHiringThisMonth: number;
  averageSalaryBdt: number;
  demandIndex: number;
  demandTrend: number;
};

export type SkillTrendsDto = {
  range: AnalyticsRange;
  series: {
    skill: string;
    points: { date: string; count: number }[];
  }[];
};

export type CompanyStatDto = {
  company: string;
  logo: string | null;
  count: number;
};

export type SalaryByRoleDto = {
  role: string;
  min: number;
  avg: number;
  max: number;
  currency: 'BDT' | 'USD';
};

export type LocationStatDto = {
  location: string;
  lat: number;
  lng: number;
  count: number;
};

export type TimelinePointDto = {
  date: string;
  total: number;
  bySource: Record<string, number>;
};

export type DemandIndexDto = {
  current: number;
  history: { date: string; value: number }[];
  risingSkills: { skill: string; growth: number }[];
  decliningSkills: { skill: string; growth: number }[];
};
