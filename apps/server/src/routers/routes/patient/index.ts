import { router } from "@/lib/trpc";
import { createPatientProcedure } from "./create";

export const patientRoutes = router({
    createPatient: createPatientProcedure,
});
