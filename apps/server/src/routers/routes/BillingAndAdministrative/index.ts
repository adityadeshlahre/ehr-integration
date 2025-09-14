import { router } from "@/lib/trpc";
import { billingRoutes } from "./billing";
import { coverageRoutes } from "./coverage";

export const billingAndAdministrativeRoutes = router({
  billing: billingRoutes,
  coverage: coverageRoutes,
});
