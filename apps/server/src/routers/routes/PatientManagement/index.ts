import { router } from "@/lib/trpc";
import { createPatientProcedure } from "./patient/create";
import { getPatientsProcedure } from "./patient/get";
import { updatePatientProcedure } from "./patient/update";

export const patientManagementRoutes = router({
  createPatient: createPatientProcedure,
  updatePatient: updatePatientProcedure,
  getPatients: getPatientsProcedure,
  getPatient: getPatientsProcedure,
});
