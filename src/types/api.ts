// Shared API envelope types — mirror plan/02-api-contracts.md §0.

export type ApiResponse<T> = {
  success: true;
  data: T;
};

export type PaginatedMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
};

export type PaginatedResponse<T> = {
  success: true;
  data: T[];
  meta: PaginatedMeta;
};

export type ApiError = {
  success: false;
  error: {
    code: string;
    message: string;
    statusCode: number;
    details?: unknown;
  };
};
