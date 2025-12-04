import { Suspense } from "react";
import CreatePasswordClient from "./CreatePasswordClient";

export default function Page() {
  return (
    <Suspense>
      <CreatePasswordClient />
    </Suspense>
  );
}
