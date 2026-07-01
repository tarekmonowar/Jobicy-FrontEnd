// Users/profile API — me, profile update, match score, recommendations.

import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type {
  ProfileDto,
  UpdateProfilePayload,
  UserWithProfileDto,
} from '@/types/auth';
import type { JobCardDto } from '@/types/job';

/** Fetch the authenticated user with profile. */
export async function getMe(): Promise<UserWithProfileDto> {
  const res = await api.get<ApiResponse<UserWithProfileDto>>('/users/me');
  return res.data.data;
}

/** Update career profile fields. */
export async function updateProfile(dto: UpdateProfilePayload): Promise<ProfileDto> {
  const res = await api.patch<ApiResponse<ProfileDto>>('/users/me/profile', dto);
  return res.data.data;
}

/** Percentage of active jobs matching the user's profile skills. */
export async function getMatchScore(): Promise<{ score: number }> {
  const res = await api.get<ApiResponse<{ score: number }>>('/users/me/match-score');
  return res.data.data;
}

/** Jobs ranked by skill overlap with the user's profile. */
export async function getRecommendations(limit = 10): Promise<JobCardDto[]> {
  const res = await api.get<ApiResponse<JobCardDto[]>>('/users/me/recommendations', {
    params: { limit },
  });
  return res.data.data;
}
