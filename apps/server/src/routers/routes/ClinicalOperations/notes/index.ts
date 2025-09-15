import { router } from "@/lib/trpc";
import { readBinaryProcedure } from "./read";
import { searchBinaryProcedure } from "./search";

export const binaryRoutes = router({
  readBinary: readBinaryProcedure,
  searchBinary: searchBinaryProcedure,
});
