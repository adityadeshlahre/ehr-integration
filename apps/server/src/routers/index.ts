import { publicProcedure, router } from "../lib/trpc";
import { patientRoutes } from "./routes/patient";

export const appRouter = router({
	healthCheck: publicProcedure.query(() => {
		return "OK";
	}),
	patient: patientRoutes,
});

export type AppRouter = typeof appRouter;
