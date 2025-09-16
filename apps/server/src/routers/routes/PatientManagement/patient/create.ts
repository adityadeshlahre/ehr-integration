import { epic } from "@repo/axios";
import { z } from "zod";
import { publicProcedure } from "@/lib/trpc";

export const createPatientProcedure = publicProcedure
  .input(
    z.object({
      resourceType: z.literal("Patient"),
      identifier: z
        .array(
          z.object({
            use: z.string().optional(),
            system: z.string().optional(),
            value: z.string(),
          }),
        )
        .optional(),
      active: z.union([z.boolean(), z.string()]).optional(),
      name: z
        .array(
          z.object({
            use: z.string().optional(),
            family: z.string(),
            given: z.array(z.string()),
          }),
        )
        .optional(),
      telecom: z
        .array(
          z.object({
            system: z.enum([
              "phone",
              "fax",
              "email",
              "pager",
              "url",
              "sms",
              "other",
            ]),
            value: z.string(),
            use: z.enum(["home", "work", "temp", "old", "mobile"]).optional(),
          }),
        )
        .optional(),
      gender: z.enum(["male", "female", "other", "unknown"]).optional(),
      birthDate: z.string().optional(), // YYYY-MM-DD format
      address: z
        .array(
          z.object({
            use: z.string().optional(),
            line: z.array(z.string()).optional(),
            city: z.string().optional(),
            state: z.string().optional(),
            postalCode: z.string().optional(),
            country: z.string().optional(),
          }),
        )
        .optional(),
      maritalStatus: z
        .object({
          text: z.string(),
        })
        .optional(),
      generalPractitioner: z
        .array(
          z.object({
            display: z.string().optional(),
            reference: z.string(),
          }),
        )
        .optional(),
      extension: z
        .array(
          z.object({
            url: z.string(),
            valueCodeableConcept: z
              .object({
                coding: z
                  .array(
                    z.object({
                      system: z.string().optional(),
                      code: z.string(),
                    }),
                  )
                  .optional(),
                text: z.string().optional(),
              })
              .optional(),
            valueCode: z.string().optional(),
          }),
        )
        .optional(),
    }),
  )
  .mutation(async ({ input }) => {
    try {
      const response = await epic.post("/Patient", input, {
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
      console.error("Error creating patient:", error);

      if (error instanceof z.ZodError) {
        throw new Error(
          `Validation error: ${error.issues.map((e: any) => e.message).join(", ")}`,
        );
      }

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as any;
        console.error("Full API response:", axiosError.response?.data);
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
