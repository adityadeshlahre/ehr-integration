"use client";

import { useMutation } from "@tanstack/react-query";
import type { inferProcedureInput } from "@trpc/server";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/utils/trpc";
import type { AppRouter } from "../../../../../server/src/routers";

type CreatePatientInput = inferProcedureInput<
  AppRouter["patient"]["createPatient"]
>;

export default function CreatePatientForm() {
  const createPatient = useMutation(
    trpc.patient.createPatient.mutationOptions({
      onSuccess: (data) => {
        toast.success("Patient created successfully!");
        console.log("Created patient:", data);
      },
      onError: (error) => {
        toast.error(`Error: ${error.message}`);
      },
    }),
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const patientData: CreatePatientInput = {
      resourceType: "Patient" as const,
      name: [
        {
          family: formData.get("family") as string,
          given: [formData.get("given") as string],
        },
      ],
      gender: formData.get("gender") as "male" | "female" | "other" | "unknown",
      birthDate: formData.get("birthDate") as string,
      telecom: [
        {
          system: "email" as const,
          value: formData.get("email") as string,
          use: "home" as const,
        },
      ],
      address: [
        {
          line: [formData.get("address") as string],
          city: formData.get("city") as string,
          state: formData.get("state") as string,
          postalCode: formData.get("postalCode") as string,
        },
      ],
    };

    try {
      await createPatient.mutateAsync(patientData);
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create New Patient</CardTitle>
        <p className="text-muted-foreground text-sm">
          ✨ Types are automatically inferred from your server schema - no
          duplicate type definitions needed!
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="given">First Name</Label>
              <Input id="given" name="given" required placeholder="John" />
            </div>
            <div>
              <Label htmlFor="family">Last Name</Label>
              <Input id="family" name="family" required placeholder="Doe" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                name="gender"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
            <div>
              <Label htmlFor="birthDate">Birth Date</Label>
              <Input id="birthDate" name="birthDate" type="date" required />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="john.doe@example.com"
            />
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              required
              placeholder="123 Main St"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" required placeholder="New York" />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input id="state" name="state" required placeholder="NY" />
            </div>
            <div>
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                name="postalCode"
                required
                placeholder="10001"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={createPatient.isPending}
            className="w-full"
          >
            {createPatient.isPending ? "Creating Patient..." : "Create Patient"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
