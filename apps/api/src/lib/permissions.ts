/**
 * RBAC Permission Checks
 */

import { eq, and } from "drizzle-orm";
import type { Database } from "@invoicing/storage/db";
import { member } from "@invoicing/storage/db/schema";
import { UnauthorizedError, ForbiddenError } from "./errors";

export type Role = "admin" | "manager" | "accountant" | "viewer";
export type Permission =
  | "invoices:create"
  | "invoices:read"
  | "invoices:update"
  | "invoices:delete"
  | "invoices:approve"
  | "clients:create"
  | "clients:read"
  | "clients:update"
  | "clients:delete"
  | "settings:read"
  | "settings:update";

const rolePermissions: Record<Role, Permission[]> = {
  admin: [
    "invoices:create",
    "invoices:read",
    "invoices:update",
    "invoices:delete",
    "invoices:approve",
    "clients:create",
    "clients:read",
    "clients:update",
    "clients:delete",
    "settings:read",
    "settings:update",
  ],
  manager: [
    "invoices:create",
    "invoices:read",
    "invoices:update",
    "invoices:approve",
    "clients:create",
    "clients:read",
    "clients:update",
    "settings:read",
  ],
  accountant: [
    "invoices:create",
    "invoices:read",
    "invoices:update",
    "clients:read",
  ],
  viewer: ["invoices:read", "clients:read"],
};

export async function getUserRole(
  db: Database,
  userId: string,
  organizationId: string
): Promise<Role> {
  const members = await db
    .select()
    .from(member)
    .where(and(eq(member.userId, userId), eq(member.organizationId, organizationId)))
    .limit(1);

  const userRole = members[0]?.role;
  
  // Validate role is one of our defined roles, default to 'viewer' if not found or invalid
  if (userRole && ["admin", "manager", "accountant", "viewer"].includes(userRole)) {
    return userRole as Role;
  }
  
  return "viewer"; // Default to least privileged role
}

export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
}

export async function requirePermission(
  db: Database,
  userId: string,
  organizationId: string,
  permission: Permission
): Promise<void> {
  if (!userId) {
    throw new UnauthorizedError("Authentication required");
  }
  const role = await getUserRole(db, userId, organizationId);
  if (!hasPermission(role, permission)) {
    throw new ForbiddenError(`You don't have permission to ${permission}`, "INSUFFICIENT_PERMISSIONS");
  }
}
