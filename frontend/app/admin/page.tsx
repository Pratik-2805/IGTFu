import { Suspense } from "react";
import DashboardClient from "@/components/admin/DashboardClient";

export default function Page() {
  return (
    <Suspense>
      <DashboardClient />
    </Suspense>
  );
}
