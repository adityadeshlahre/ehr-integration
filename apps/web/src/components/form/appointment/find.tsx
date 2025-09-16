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

type FindAppointmentInput = inferProcedureInput<
  AppRouter["appointment"]["findAppointment"]
>;

export default function FindAppointmentForm() {
  const findAppointment = useMutation(
    trpc.appointment.findAppointment.mutationOptions({
      onSuccess: (data) => {
        toast.success("Appointment found!");
        console.log("Found appointment:", data);
      },
      onError: (error) => {
        toast.error(`Error: ${error.message}`);
      },
    }),
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const searchData: FindAppointmentInput = {
      resourceType: "Parameters",
      parameter: [
        {
          name: "patient",
          resource: {
            resourceType: "Patient",
            name: [
              {
                family: formData.get("family") as string,
                given: [formData.get("given") as string],
              },
            ],
          },
        },
        {
          name: "startTime",
          valueDateTime: formData.get("startTime") as string,
        },
        {
          name: "endTime",
          valueDateTime: formData.get("endTime") as string,
        },
        {
          name: "serviceType",
          valueCodeableConcept: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: formData.get("serviceType") as string,
                display: formData.get("serviceType") as string,
              },
            ],
          },
        },
        {
          name: "indications",
          valueCodeableConcept: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: formData.get("indications") as string,
                display: formData.get("indications") as string,
              },
            ],
            text: formData.get("indications") as string,
          },
        },
        {
          name: "location-reference",
          valueReference: {
            reference: formData.get("location") as string,
          },
        },
      ],
    };

    try {
      await findAppointment.mutateAsync(searchData);
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Find Appointment</CardTitle>
        <p className="text-muted-foreground text-sm">
          Find an appointment using patient details and criteria.
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
              <Label htmlFor="startTime">Start Time</Label>
              <Input id="startTime" name="startTime" type="datetime-local" />
            </div>
            <div>
              <Label htmlFor="endTime">End Time</Label>
              <Input id="endTime" name="endTime" type="datetime-local" />
            </div>
          </div>
          <div>
            <Label htmlFor="serviceType">Service Type</Label>
            <Input
              id="serviceType"
              name="serviceType"
              placeholder="Service Type"
            />
          </div>
          <div>
            <Label htmlFor="indications">Indications</Label>
            <Input
              id="indications"
              name="indications"
              placeholder="Indications"
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" placeholder="Location" />
          </div>
          <Button
            type="submit"
            disabled={findAppointment.isPending}
            className="w-full"
          >
            {findAppointment.isPending ? "Finding..." : "Find Appointment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
