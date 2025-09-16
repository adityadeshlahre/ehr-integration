import { epic } from "@repo/axios";
import { z } from "zod";
import { publicProcedure } from "@/lib/trpc";

export const searchCoverageProcedure = publicProcedure
  .input(
    z.object({
      beneficiary: z.string().optional(),
      patient: z.string().optional(),
    }),
  )
  .query(async ({ input }) => {
    try {
      const params = new URLSearchParams();
      if (input.beneficiary) params.append("beneficiary", input.beneficiary);
      if (input.patient) params.append("patient", input.patient);

      const response = await epic.get(`/Coverage?${params.toString()}`, {
        headers: {
          Accept: "application/fhir+json",
        },
      });
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.error("Error searching coverage:", error);

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
