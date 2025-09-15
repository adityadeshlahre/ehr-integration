import { router } from "@/lib/trpc";
import { binaryRoutes } from "./notes";

export const clinicalOperationsRoutes = router({
  binary: binaryRoutes,
});
