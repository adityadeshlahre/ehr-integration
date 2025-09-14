import { router } from "@/lib/trpc";
import { readAccountProcedure } from "./read";
import { searchAccountProcedure } from "./search";

export const billingRoutes = router({
  readAccount: readAccountProcedure,
  searchAccount: searchAccountProcedure,
});
