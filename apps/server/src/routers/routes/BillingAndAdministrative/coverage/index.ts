import { router } from "@/lib/trpc";
import { readCoverageProcedure } from "./read";
import { searchCoverageProcedure } from "./search";

export const coverageRoutes = router({
  readCoverage: readCoverageProcedure,
  searchCoverage: searchCoverageProcedure,
});
