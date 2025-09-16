"use client";

import { useQuery } from "@tanstack/react-query";
import type { inferProcedureInput } from "@trpc/server";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/utils/trpc";
import type { AppRouter } from "../../../../../server/src/routers";

type GetPatientsInput = inferProcedureInput<
  AppRouter["patient"]["getPatients"]
>;

export default function SearchPatientForm() {
  const [searchParams, setSearchParams] = useState<GetPatientsInput | null>(
    null,
  );

  const { data: patients, isLoading: isFetching } = useQuery(
    trpc.patient.getPatients.queryOptions(searchParams || {}, {
      enabled: !!searchParams,
    }),
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const params: Partial<GetPatientsInput> = {
      family: (formData.get("family") as string) || undefined,
      given: (formData.get("given") as string) || undefined,
      gender:
        (formData.get("gender") as "male" | "female" | "other" | "unknown") ||
        undefined,
      birthdate: (formData.get("birthdate") as string) || undefined,
      address: (formData.get("address") as string) || undefined,
      telecom: (formData.get("telecom") as string) || undefined,
      identifier: (formData.get("identifier") as string) || undefined,
    };

    setSearchParams(params);
  };

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Search Patients</CardTitle>
        <p className="text-muted-foreground text-sm">
          Search for patients using various criteria.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="given">First Name</Label>
              <Input id="given" name="given" placeholder="John" />
            </div>
            <div>
              <Label htmlFor="family">Last Name</Label>
              <Input id="family" name="family" placeholder="Doe" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                name="gender"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Any</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
            <div>
              <Label htmlFor="birthdate">Birth Date</Label>
              <Input id="birthdate" name="birthdate" type="date" />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" placeholder="123 Main St" />
          </div>

          <div>
            <Label htmlFor="telecom">Telecom</Label>
            <Input id="telecom" name="telecom" placeholder="email or phone" />
          </div>

          <div>
            <Label htmlFor="identifier">Identifier</Label>
            <Input id="identifier" name="identifier" placeholder="Patient ID" />
          </div>

          <Button type="submit" disabled={isFetching} className="w-full">
            {isFetching ? "Searching..." : "Search Patients"}
          </Button>
        </form>

        {patients?.data && patients.data.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-lg">Search Results</h3>
            <ul className="space-y-2">
              {patients.data.map((patient: any, index: number) => (
                <li key={index} className="rounded border p-2">
                  <p>
                    <strong>Name:</strong> {patient.name?.[0]?.given?.[0]}{" "}
                    {patient.name?.[0]?.family}
                  </p>
                  <p>
                    <strong>Gender:</strong> {patient.gender}
                  </p>
                  <p>
                    <strong>Birth Date:</strong> {patient.birthDate}
                  </p>
                  <p>
                    <strong>ID:</strong> {patient.id}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {patients?.data && patients.data.length === 0 && !isFetching && (
          <p className="mt-4 text-muted-foreground">No patients found.</p>
        )}
      </CardContent>
    </Card>
  );
}
