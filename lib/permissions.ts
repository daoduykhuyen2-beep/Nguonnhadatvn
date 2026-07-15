import type { Profile } from "./types";

export function canEditPost(profile: Profile | null, ownerId: string | null): boolean {
  if (!profile) return false;
  if (profile.role === "admin" || profile.is_admin) return true;
  return profile.id === ownerId;
}

export function canAccessAdmin(profile: Profile | null): boolean {
  if (!profile) return false;
  return profile.role === "admin" || profile.role === "pho_cong_dong" || !!profile.is_admin;
}

export function canManageMembers(profile: Profile | null): boolean {
  if (!profile) return false;
  return profile.role === "admin" || !!profile.is_admin;
}
