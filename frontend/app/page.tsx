import ServerDown from "@/components/ServerDown";
import HomePage from "@/components/UserPage";
import MaintenancePage from "@/components/Maintenance";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();

  const backendHealthy =
    cookieStore.get("backend_healthy")?.value !== "false";

  const underMaintenance =
    cookieStore.get("under_maintenance")?.value === "true";

  if (!backendHealthy) return <ServerDown />;

  if (underMaintenance) return <MaintenancePage />;

  return <HomePage />;
}
