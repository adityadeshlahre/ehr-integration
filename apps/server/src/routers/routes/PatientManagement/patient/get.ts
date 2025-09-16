import { epic } from "@repo/axios";
import { z } from "zod";
import { publicProcedure } from "@/lib/trpc";

export const getPatientsProcedure = publicProcedure
  .input(
    z.object({
      address: z.string().optional(),
      addressCity: z.string().optional(),
      addressPostalcode: z.string().optional(),
      addressState: z.string().optional(),
      birthdate: z.string().optional(), // YYYY-MM-DD format
      family: z.string().optional(),
      gender: z.string().optional(),
      given: z.string().optional(),
      identifier: z.string().optional(),
      ownName: z.string().optional(),
      ownPrefix: z.string().optional(),
      partnerName: z.string().optional(),
      partnerPrefix: z.string().optional(),
      telecom: z.string().optional(),
      legalSex: z.string().optional(),
    }),
  )
  .query(async ({ input }) => {
    try {
      const params: Record<string, string> = {};

      if (input.address) params.address = input.address;
      if (input.addressCity) params["address-city"] = input.addressCity;
      if (input.addressPostalcode)
        params["address-postalcode"] = input.addressPostalcode;
      if (input.addressState) params["address-state"] = input.addressState;
      if (input.birthdate) params.birthdate = input.birthdate;
      if (input.family) params.family = input.family;
      if (input.gender) params.gender = input.gender;
      if (input.given) params.given = input.given;
      if (input.identifier) params.identifier = input.identifier;
      if (input.ownName) params["own-name"] = input.ownName;
      if (input.ownPrefix) params["own-prefix"] = input.ownPrefix;
      if (input.partnerName) params["partner-name"] = input.partnerName;
      if (input.partnerPrefix) params["partner-prefix"] = input.partnerPrefix;
      if (input.telecom) params.telecom = input.telecom;
      if (input.legalSex) params["legal-sex"] = input.legalSex;

      const response = await epic.get("/Patient", {
        params,
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
      console.error("Error searching patients:", error);

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

export const getPatientByIdProcedure = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input }) => {
    try {
      const response = await epic.get(`/Patient/${input.id}`, {
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
      console.error("Error fetching patient by ID:", error);

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
