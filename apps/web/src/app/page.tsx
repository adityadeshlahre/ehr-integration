"use client";
import { useQuery } from "@tanstack/react-query";
import BookAppointmentForm from "@/components/form/appointment/book";
import FindAppointmentForm from "@/components/form/appointment/find";
import SearchAppointmentForm from "@/components/form/appointment/search";
import SearchAccountForm from "@/components/form/billing/account";
import SearchCoverageForm from "@/components/form/billing/coverage";
import SearchBinaryForm from "@/components/form/clinical/binary";
import CreatePatientForm from "@/components/form/patient/create";
import SearchPatientForm from "@/components/form/patient/search";
import UpdatePatientForm from "@/components/form/patient/update";
import { trpc } from "@/utils/trpc";

export default function Home() {
  const healthCheck = useQuery(trpc.healthCheck.queryOptions());

  return (
    <div className="container mx-auto max-w-3xl space-y-8 px-4 py-2">
      <div className="grid gap-6">
        <section className="rounded-lg border p-4">
          <h2 className="mb-2 font-medium">API Status</h2>
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                healthCheck.data ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-muted-foreground text-sm">
              {healthCheck.isLoading
                ? "Checking..."
                : healthCheck.data
                  ? "Connected"
                  : "Disconnected"}
            </span>
          </div>
        </section>

        <section className="space-y-4">
          <CreatePatientForm />
          <SearchPatientForm />
          <UpdatePatientForm />
          <BookAppointmentForm />
          <FindAppointmentForm />
          <SearchAppointmentForm />
          <SearchAccountForm />
          <SearchCoverageForm />
          <SearchBinaryForm />
        </section>
      </div>
    </div>
  );
}
