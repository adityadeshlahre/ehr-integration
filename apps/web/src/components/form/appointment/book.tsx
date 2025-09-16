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

type BookAppointmentInput = inferProcedureInput<
  AppRouter["appointment"]["bookAppointment"]
>;

export default function BookAppointmentForm() {
  const bookAppointment = useMutation(
    trpc.appointment.bookAppointment.mutationOptions({
      onSuccess: (data) => {
        toast.success("Appointment booked successfully!");
        console.log("Booked appointment:", data);
      },
      onError: (error) => {
        toast.error(`Error: ${error.message}`);
      },
    }),
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const appointmentData: BookAppointmentInput = {
      resourceType: "Parameters",
      parameter: [
        {
          name: "patient",
          valueIdentifier: {
            value: formData.get("patientId") as string,
          },
        },
        {
          name: "appointment",
          valueIdentifier: {
            value: formData.get("appointmentId") as string,
          },
        },
        {
          name: "appointmentNote",
          valueString: formData.get("note") as string,
        },
      ],
    };

    try {
      await bookAppointment.mutateAsync(appointmentData);
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Book Appointment</CardTitle>
        <p className="text-muted-foreground text-sm">
          Book an appointment for a patient.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="patientId">Patient ID</Label>
            <Input
              id="patientId"
              name="patientId"
              required
              placeholder="Patient ID"
            />
          </div>
          <div>
            <Label htmlFor="appointmentId">Appointment ID</Label>
            <Input
              id="appointmentId"
              name="appointmentId"
              required
              placeholder="Appointment ID"
            />
          </div>
          <div>
            <Label htmlFor="note">Appointment Note</Label>
            <Input id="note" name="note" placeholder="Optional note" />
          </div>
          <Button
            type="submit"
            disabled={bookAppointment.isPending}
            className="w-full"
          >
            {bookAppointment.isPending ? "Booking..." : "Book Appointment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
