import { publicProcedure, router } from "../lib/trpc";
import { appointmentSchedulingRoutes } from "./routes/AppointmentScheduling";
import { billingAndAdministrativeRoutes } from "./routes/BillingAndAdministrative";
import { clinicalOperationsRoutes } from "./routes/ClinicalOperations";
import { patientManagementRoutes } from "./routes/PatientManagement";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  patient: patientManagementRoutes,
  appointment: appointmentSchedulingRoutes,
  clinical: clinicalOperationsRoutes,
  billing: billingAndAdministrativeRoutes,
});

export type AppRouter = typeof appRouter;
