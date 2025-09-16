import { epic } from "@repo/axios";
import { z } from "zod";
import { publicProcedure } from "@/lib/trpc";

export const bookAppointmentProcedure = publicProcedure
  .input(
    z.object({
      resourceType: z.literal("Parameters"),
      parameter: z.array(
        z.union([
          z.object({
            name: z.literal("patient"),
            valueIdentifier: z.object({
              value: z.string(),
            }),
          }),
          z.object({
            name: z.literal("appointment"),
            valueIdentifier: z.object({
              value: z.string(),
            }),
          }),
          z.object({
            name: z.literal("appointmentNote"),
            valueString: z.string(),
          }),
        ]),
      ),
    }),
  )
  .mutation(async ({ input }) => {
    try {
      const response = await epic.post("/Appointment/$book", input, {
        headers: {
          "Content-Type": "application/fhir+json",
          Accept: "application/fhir+json",
        },
      });
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.error("Error booking appointment:", error);

      if (error instanceof z.ZodError) {
        throw new Error(
          `Validation error: ${error.issues.map((e: any) => e.message).join(", ")}`,
        );
      }

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as any;
        throw new Error(
          `API Error: ${axiosError.response?.status} - ${axiosError.response?.data?.issue?.[0]?.details?.text || axiosError.response?.statusText}`,
        );
      }

      if (error && typeof error === "object" && "message" in error) {
        throw new Error(`Network error: ${(error as Error).message}`);
      }

      throw new Error("An unknown error occurred");
    }
  });
