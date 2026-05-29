import { env } from "../config/env.js";
import { normalizePhone } from "./phone.js";
import type { UserRole } from "../repositories/users.js";

export function isAdminPhone(phone: string): boolean {
  if (!env.adminPhones.length) return false;
  try {
    const normalized = normalizePhone(phone);
    return env.adminPhones.some((p) => {
      try {
        return normalizePhone(p) === normalized;
      } catch {
        return false;
      }
    });
  } catch {
    return false;
  }
}

export function resolveUserRole(
  dbRole: UserRole,
  phone: string,
): UserRole {
  if (dbRole === "admin" || isAdminPhone(phone)) return "admin";
  return "user";
}
