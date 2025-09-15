import { epic } from "@repo/axios";
import { z } from "zod";
import { publicProcedure } from "@/lib/trpc";

export const matchPatientProcedure = publicProcedure
    .input(
        z.object({
            resource: z.object({
                resourceType: z.literal("Patient"),
                name: z
                    .array(
                        z.object({
                            family: z.string(),
                            given: z.array(z.string()),
                        }),
                    )
                    .optional(),
                birthDate: z.string().optional(), // YYYY-MM-DD format
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
                address: z
                    .array(
                        z.object({
                            line: z.array(z.string()).optional(),
                            city: z.string().optional(),
                            district: z.string().optional(),
                            state: z.string().optional(),
                            postalCode: z.string().optional(),
                            country: z.string().optional(),
                        }),
                    )
                    .optional(),
            }),
            onlyCertainMatches: z.boolean().optional(),
        }),
    )
    .mutation(async ({ input }) => {
        try {
            // Build the Parameters resource for the request
            const parametersResource: any = {
                resourceType: "Parameters",
                parameter: [
                    {
                        name: "resource",
                        resource: input.resource,
                    },
                ],
            };

            // Add onlyCertainMatches if provided
            if (input.onlyCertainMatches !== undefined) {
                parametersResource.parameter.push({
                    name: "onlyCertainMatches",
                    valueBoolean: input.onlyCertainMatches,
                });
            }

            const response = await epic.post(
                "/R4/Patient/$match",
                parametersResource,
                {
                    headers: {
                        "Content-Type": "application/fhir+json",
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
            console.error("Error matching patient:", error);

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
