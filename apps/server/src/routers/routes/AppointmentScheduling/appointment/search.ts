import { epic } from "@repo/axios";
import { z } from "zod";
import { publicProcedure } from "@/lib/trpc";

export const searchAppointmentProcedure = publicProcedure
  .input(
    z.object({
      patient: z.string(),
      date: z.string().optional(),
      identifier: z.string().optional(),
      status: z
        .enum([
          "booked",
          "fulfilled",
          "cancelled",
          "noshow",
          "arrived",
          "proposed",
        ])
        .optional(),
    }),
  )
  .query(async ({ input }) => {
    try {
      const params = new URLSearchParams();
      params.append("patient", input.patient);
      if (input.date) params.append("date", input.date);
      if (input.identifier) params.append("identifier", input.identifier);
      if (input.status) params.append("status", input.status);

      const response = await epic.get(
        `/STU3/Appointment?${params.toString()}`,
        {
          headers: {
            Accept: "application/fhir+json",
          },
        },
      );
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.error("Error searching appointments:", error);

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
