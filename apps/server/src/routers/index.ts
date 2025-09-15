import { publicProcedure, router } from "../lib/trpc";
import { patientManagementRoutes } from "./routes/PatientManagement";
import { appointmentSchedulingRoutes } from "./routes/AppointmentScheduling";
import { clinicalOperationsRoutes } from "./routes/ClinicalOperations";
import { billingAndAdministrativeRoutes } from "./routes/BillingAndAdministrative";

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
