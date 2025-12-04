"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";

// Layout
import Header from "./layout/Header";

// Tabs
import ExhibitorsTab from "@/components/admin/ExhibitorsTab";
import VisitorsTab from "@/components/admin/VisitorsTab";
import EventsTab from "@/components/admin/EventsTab";
import CategoriesTab from "@/components/admin/CategoriesTab";
import GalleryTab from "@/components/admin/GalleryTab";
import ManageTeamTab from "@/components/admin/ManageTeamTab";
import AccountTab from "./AccountTab";
import SettingsTab from "./SettingsTab";

// Hooks (ENABLED flags ONLY)
import { useExhibitors } from "@/hooks/useExhibitors";
import { useVisitors } from "@/hooks/useVisitors";
import { useEvents } from "@/hooks/useEvents";
import { useCategories } from "@/hooks/useCategories";
import { useGallery } from "@/hooks/useGallery";
import { useTeam } from "@/hooks/useTeam";
import { useAccount } from "@/hooks/useAccount";

// Role config
import { UserRole, roleTabs } from "@/utils/roleConfig";

interface DecodedToken {
  id?: number;
  email?: string;
  role?: UserRole;
  exp?: number;
}

export default function DashboardClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  /* ------------------------------------------
   * AUTH STATE
   * ----------------------------------------*/
  const [role, setRole] = useState<UserRole | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  /* ------------------------------------------
   * CHECK AUTH (RUN ONCE)
   * ----------------------------------------*/
  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";")[0];
    };

    const token = getCookie("access");
    if (!token) {
      setAuthChecked(true);
      router.replace("/login");
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);

      if (
        !decoded?.role ||
        !["admin", "manager", "sales"].includes(decoded.role)
      ) {
        setAuthChecked(true);
        router.replace("/login");
        return;
      }

      setRole(decoded.role);
      setAuthChecked(true);
    } catch {
      setAuthChecked(true);
      router.replace("/login");
    }
  }, [router]);

  /* ------------------------------------------
   * ALLOWED TABS BASED ON ROLE
   * ----------------------------------------*/
  const allowedTabs = useMemo(() => {
    if (!role) return [];
    return roleTabs[role];
  }, [role]);

  /* ------------------------------------------
   * DETERMINE ACTIVE TAB
   * ----------------------------------------*/
  const tabFromUrl = searchParams?.get("tab") ?? "";
  const activeTab = allowedTabs.includes(tabFromUrl)
    ? tabFromUrl
    : allowedTabs[0] ?? "";

  /* ------------------------------------------
   * FIX INVALID URL TAB (RUNS ONLY WHEN NEEDED)
   * ----------------------------------------*/
  useEffect(() => {
    if (!authChecked || !role) return;

    const currentTab = searchParams?.get("tab");
    if (!currentTab || !allowedTabs.includes(currentTab)) {
      const params = new URLSearchParams();
      params.set("tab", allowedTabs[0]);
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [authChecked, role, searchParams, allowedTabs, pathname, router]);

  /* ------------------------------------------
   * DATA HOOKS — ONLY ENABLED FOR ACTIVE TAB
   * ----------------------------------------*/
  const exhibitors = useExhibitors(activeTab === "exhibitors");
  const visitors = useVisitors(activeTab === "visitors");
  const events = useEvents(activeTab === "events");
  const categories = useCategories(activeTab === "categories");
  const galleryHook = useGallery({ enabled: activeTab === "gallery" });
  const gallery = useMemo(
    () => ({
      ...galleryHook,
      addGalleryImage: (data: Record<string, FormDataEntryValue>) =>
        galleryHook.addGalleryImage(
          Object.fromEntries(
            Object.entries(data).map(([key, value]) => [
              key,
              value instanceof File ? value.name : String(value),
            ])
          )
        ),
    }),
    [galleryHook]
  );
  const team = useTeam(activeTab === "manage-team" && role === "admin");

  const accountHook = useAccount(); // always allowed

  /* ------------------------------------------
   * LOGOUT
   * ----------------------------------------*/
  const handleLogout = () => {
    document.cookie = "access=; Max-Age=0; path=/";
    document.cookie = "refresh=; Max-Age=0; path=/";
    router.push("/login");
  };

  /* ------------------------------------------
   * LOADING WHILE AUTH CHECKS
   * ----------------------------------------*/
  if (!authChecked || !role) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking authentication...
      </div>
    );
  }

  /* ------------------------------------------
   * RENDER UI
   * ----------------------------------------*/
  return (
    <div className="min-h-screen bg-background">
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (allowedTabs.includes(tab)) {
            const params = new URLSearchParams();
            params.set("tab", tab);
            router.replace(`${pathname}?${params.toString()}`);
          }
        }}
        onLogout={handleLogout}
        role={role}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "exhibitors" && <ExhibitorsTab {...exhibitors} />}
        {activeTab === "visitors" && <VisitorsTab {...visitors} />}
        {activeTab === "events" && <EventsTab {...events} />}
        {activeTab === "categories" && <CategoriesTab {...categories} />}
        {activeTab === "gallery" && <GalleryTab {...gallery} />}
        {activeTab === "manage-team" && <ManageTeamTab {...team} />}
        {activeTab === "settings" && <SettingsTab />}
        {activeTab === "account" && <AccountTab />}
      </div>
    </div>
  );
}
