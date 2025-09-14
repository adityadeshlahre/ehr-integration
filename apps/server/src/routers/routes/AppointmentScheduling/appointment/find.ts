import { epic } from "@repo/axios";
import { z } from "zod";
import { publicProcedure } from "@/lib/trpc";

export const findAppointmentProcedure = publicProcedure
  .input(
    z.object({
      resourceType: z.literal("Parameters"),
      parameter: z.array(
        z.union([
          z.object({
            name: z.literal("patient"),
            resource: z.object({
              resourceType: z.literal("Patient"),
              extension: z
                .array(
                  z.object({
                    url: z.string(),
                    valueCode: z.string().optional(),
                    extension: z
                      .array(
                        z.object({
                          url: z.string(),
                          valueCoding: z
                            .object({
                              system: z.string(),
                              code: z.string(),
                              display: z.string(),
                            })
                            .optional(),
                          valueString: z.string().optional(),
                        }),
                      )
                      .optional(),
                  }),
                )
                .optional(),
              identifier: z
                .array(
                  z.object({
                    use: z.string().optional(),
                    type: z
                      .object({
                        text: z.string(),
                      })
                      .optional(),
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
                    text: z.string().optional(),
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
                    use: z
                      .enum(["home", "work", "temp", "old", "mobile"])
                      .optional(),
                  }),
                )
                .optional(),
              gender: z.enum(["male", "female", "other", "unknown"]).optional(),
              birthDate: z.string().optional(),
              deceasedBoolean: z.boolean().optional(),
              address: z
                .array(
                  z.object({
                    use: z.string().optional(),
                    line: z.array(z.string()).optional(),
                    city: z.string().optional(),
                    district: z.string().optional(),
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
              communication: z
                .array(
                  z.object({
                    language: z.object({
                      coding: z.array(
                        z.object({
                          system: z.string(),
                          code: z.string(),
                          display: z.string(),
                        }),
                      ),
                      text: z.string(),
                    }),
                    preferred: z.boolean(),
                  }),
                )
                .optional(),
              generalPractitioner: z
                .array(
                  z.object({
                    reference: z.string(),
                    display: z.string().optional(),
                  }),
                )
                .optional(),
              managingOrganization: z
                .object({
                  reference: z.string(),
                  display: z.string().optional(),
                })
                .optional(),
            }),
          }),
          z.object({
            name: z.literal("startTime"),
            valueDateTime: z.string(),
          }),
          z.object({
            name: z.literal("endTime"),
            valueDateTime: z.string(),
          }),
          z.object({
            name: z.literal("serviceType"),
            valueCodeableConcept: z.object({
              coding: z.array(
                z.object({
                  system: z.string(),
                  code: z.string(),
                  display: z.string(),
                }),
              ),
            }),
          }),
          z.object({
            name: z.literal("indications"),
            valueCodeableConcept: z.object({
              coding: z.array(
                z.object({
                  system: z.string(),
                  code: z.string(),
                  display: z.string(),
                }),
              ),
              text: z.string().optional(),
            }),
          }),
          z.object({
            name: z.literal("location-reference"),
            valueReference: z.object({
              reference: z.string(),
            }),
          }),
        ]),
      ),
    }),
  )
  .mutation(async ({ input }) => {
    try {
      const response = await epic.post("/STU3/Appointment/$find", input, {
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
      console.error("Error finding appointments:", error);

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
