"use client";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import CreatePatientForm from "@/components/form/patient/create";
import { getAccessToken } from "@repo/axios";

getAccessToken()
  .then((token) => {
    console.log("Initial token fetched:", token);
  })
  .catch((err) => {
    console.error("Error fetching initial token:", err);
  });

const TITLE_TEXT = `
 ██████╗ ███████╗████████╗████████╗███████╗██████╗
 ██╔══██╗██╔════╝╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗
 ██████╔╝█████╗     ██║      ██║   █████╗  ██████╔╝
 ██╔══██╗██╔══╝     ██║      ██║   ██╔══╝  ██╔══██╗
 ██████╔╝███████╗   ██║      ██║   ███████╗██║  ██║
 ╚═════╝ ╚══════╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝

 ████████╗    ███████╗████████╗ █████╗  ██████╗██╗  ██╗
 ╚══██╔══╝    ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
    ██║       ███████╗   ██║   ███████║██║     █████╔╝
    ██║       ╚════██║   ██║   ██╔══██║██║     ██╔═██╗
    ██║       ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
    ╚═╝       ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
 `;

export default function Home() {
  const healthCheck = useQuery(trpc.healthCheck.queryOptions());

  return (
    <div className="container mx-auto max-w-3xl px-4 py-2 space-y-8">
      <pre className="overflow-x-auto font-mono text-sm">{TITLE_TEXT}</pre>
      <div className="grid gap-6">
        <section className="rounded-lg border p-4">
          <h2 className="mb-2 font-medium">API Status</h2>
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                healthCheck.data ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-sm text-muted-foreground">
              {healthCheck.isLoading
                ? "Checking..."
                : healthCheck.data
                ? "Connected"
                : "Disconnected"}
            </span>
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-lg border p-4 bg-blue-50 dark:bg-blue-950">
            <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              🎉 Type Safety in Action!
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              The form below demonstrates automatic type inference from your
              server schema. You define the Zod schema once in your tRPC
              procedure, and TypeScript automatically infers all the types for
              your frontend - no duplicate type definitions needed!
            </p>
          </div>

          <CreatePatientForm />
        </section>
      </div>
    </div>
  );
}
