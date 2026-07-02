'use client';

// Profile, match score, and job recommendations for the authenticated user.

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import * as usersApi from '@/lib/api/usersApi';
import { queryKeys } from '@/lib/queryClient';
import { getApiErrorMessage } from '@/hooks/useAuth';
import type { UpdateProfilePayload } from '@/types/auth';

/** Fetch the current user with career profile. */
export function useMe() {
  return useQuery({
    queryKey: queryKeys.me(),
    queryFn: () => usersApi.getMe(),
  });
}

/** Patch profile fields (skills, experience, roles, location). */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateProfilePayload) => usersApi.updateProfile(dto),
    onSuccess: () => {
      toast.success('Profile saved');
      void queryClient.invalidateQueries({ queryKey: queryKeys.me() });
      void queryClient.invalidateQueries({ queryKey: queryKeys.matchScore() });
      void queryClient.invalidateQueries({ queryKey: queryKeys.recommendations() });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Could not save profile'));
    },
  });
}

/** Percentage of active jobs matching the user's skills. */
export function useMatchScore() {
  return useQuery({
    queryKey: queryKeys.matchScore(),
    queryFn: () => usersApi.getMatchScore(),
    staleTime: 5 * 60_000,
  });
}

/** Jobs ranked by skill overlap with the user's profile. */
export function useRecommendations(limit = 6) {
  return useQuery({
    queryKey: [...queryKeys.recommendations(), limit] as const,
    queryFn: () => usersApi.getRecommendations(limit),
    staleTime: 5 * 60_000,
  });
}
