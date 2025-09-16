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

type SearchAppointmentInput = inferProcedureInput<
  AppRouter["appointment"]["searchAppointment"]
>;

export default function SearchAppointmentForm() {
  const [searchParams, setSearchParams] =
    useState<SearchAppointmentInput | null>(null);

  const { data: appointments, isFetching } = useQuery(
    trpc.appointment.searchAppointment.queryOptions(
      searchParams || { patient: "" },
      {
        enabled: !!searchParams,
      },
    ),
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const params: SearchAppointmentInput = {
      patient: (formData.get("patientId") as string) || "",
      date: (formData.get("date") as string) || undefined,
      identifier: (formData.get("identifier") as string) || undefined,
      status:
        (formData.get("status") as
          | "booked"
          | "fulfilled"
          | "cancelled"
          | "noshow"
          | "arrived"
          | "proposed") || undefined,
    };

    setSearchParams(params);
  };

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Search Appointments</CardTitle>
        <p className="text-muted-foreground text-sm">
          Search for appointments using various criteria.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="patientId">Patient ID</Label>
            <Input id="patientId" name="patientId" placeholder="Patient ID" />
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input id="date" name="date" type="date" />
          </div>
          <div>
            <Label htmlFor="identifier">Identifier</Label>
            <Input
              id="identifier"
              name="identifier"
              placeholder="Appointment Identifier"
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Input id="status" name="status" placeholder="Status" />
          </div>
          <Button type="submit" disabled={isFetching} className="w-full">
            {isFetching ? "Searching..." : "Search Appointments"}
          </Button>
        </form>

        {appointments?.data && appointments.data.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-lg">Search Results</h3>
            <ul className="space-y-2">
              {appointments.data.map((appointment: any, index: number) => (
                <li key={index} className="rounded border p-2">
                  <p>
                    <strong>ID:</strong> {appointment.id}
                  </p>
                  <p>
                    <strong>Status:</strong> {appointment.status}
                  </p>
                  <p>
                    <strong>Date:</strong> {appointment.start}
                  </p>
                  <p>
                    <strong>Patient ID:</strong>{" "}
                    {appointment.participant?.[0]?.actor?.reference}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {appointments?.data &&
          appointments.data.length === 0 &&
          !isFetching && (
            <p className="mt-4 text-muted-foreground">No appointments found.</p>
          )}
      </CardContent>
    </Card>
  );
}
