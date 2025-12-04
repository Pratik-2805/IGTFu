export type UserRole = "admin" | "manager" | "sales";

export const roleTabs = {
  admin: [
    "exhibitors",
    "visitors",
    "events",
    "categories",
    "gallery",
    "manage-team",
    "account",
    "settings",
  ],
  manager: ["exhibitors", "visitors", "events", "gallery", "account"],
  sales: ["exhibitors", "visitors", "account"],
};

// Dashboard title for each role
export const roleTitles: Record<UserRole, string> = {
  admin: "Admin Dashboard",
  manager: "Manager Dashboard",
  sales: "Sales Dashboard",
};
