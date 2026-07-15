export type Role = "admin" | "pho_cong_dong" | "member";

export const ROLE_LABELS: Record<string, string> = {
  admin: "Quản trị viên",
  pho_cong_dong: "Phó cộng đồng",
  member: "Thành viên",
};

export function isAdmin(profile?: { role?: string | null; is_admin?: boolean | null } | null): boolean {
  if (!profile) return false;
  return profile.role === "admin" || profile.is_admin === true;
}

export function isStaff(profile?: { role?: string | null; is_admin?: boolean | null } | null): boolean {
  if (!profile) return false;
  return profile.role === "admin" || profile.role === "pho_cong_dong" || profile.is_admin === true;
}
