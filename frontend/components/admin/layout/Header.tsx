"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { UserRole, roleTabs, roleTitles } from "@/utils/roleConfig";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  role: UserRole;
}

export default function Header({ activeTab, onTabChange, role }: HeaderProps) {
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
    }

    // remove client UI-only flags
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("userRole");

    // OPTIONAL: remove non-HttpOnly cookie for accessToken (if present)
    document.cookie = "accessToken=; Path=/; Max-Age=0;";

    // redirect user to login page
    router.push("/login");
  }

  const tabs = roleTabs[role] ?? [];
  const title = roleTitles[role] ?? "Dashboard";

  return (
    <header className="bg-primary text-primary-foreground shadow-lg sticky top-0 z-40">
      {/* Title + Logout */}
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="font-serif text-2xl">{title}</h1>

        <button
          onClick={handleLogout} // ⭐ LOGOUT HANDLED HERE
          className="flex items-center gap-2 bg-primary-foreground text-primary px-4 py-2 rounded-md hover:bg-primary-foreground/90"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="border-t border-primary-foreground/20">
        <div className="flex gap-1 overflow-x-auto px-4 py-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`capitalize px-6 py-3 font-medium ${
                activeTab === tab
                  ? "bg-primary-foreground text-primary border-b-2 border-primary"
                  : "text-primary-foreground/70 hover:text-primary-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
