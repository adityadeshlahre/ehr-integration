import { router } from "@/lib/trpc";
import { createPatientProcedure } from "./patient/create";
import { getPatientsProcedure } from "./patient/get";

export const patientManagementRoutes = router({
  createPatient: createPatientProcedure,
  getPatients: getPatientsProcedure,
  getPatient: getPatientsProcedure,
});
