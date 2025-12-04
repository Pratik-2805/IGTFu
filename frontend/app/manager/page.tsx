import DashboardClient from "@/components/admin/DashboardClient";
import { Suspense } from "react";




export default function Page() {
  return (
    <Suspense>
      <DashboardClient />
    </Suspense>
  );
}
