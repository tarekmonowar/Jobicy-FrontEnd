// Auth types — mirror plan/02-api-contracts.md §1 and §7.

export type Role = 'USER' | 'ADMIN';

/** Safe user shape — never includes password. */
export type UserDto = {
  id: string;
  name: string;
  email: string;
  role: Role;
  emailVerified: boolean;
  createdAt: string;
};

export type ProfileDto = {
  skills: string[];
  experienceYears: number;
  currentRole: string | null;
  targetRole: string | null;
  preferredLocation: string | null;
};

export type UserWithProfileDto = UserDto & {
  profile: ProfileDto | null;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: UserDto;
  accessToken: string;
};

export type RefreshResponse = {
  accessToken: string;
};

export type AuthTokens = {
  accessToken: string;
};

/** Client-side auth session state (access token lives in memory only). */
export type AuthState = {
  accessToken: string | null;
  user: UserDto | null;
  status: 'idle' | 'authed' | 'guest';
};

export type UpdateProfilePayload = Partial<ProfileDto>;
