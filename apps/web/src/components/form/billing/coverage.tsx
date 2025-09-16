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

type SearchCoverageInput = inferProcedureInput<
  AppRouter["billing"]["coverage"]["searchCoverage"]
>;

export default function SearchCoverageForm() {
  const [searchParams, setSearchParams] = useState<SearchCoverageInput | null>(
    null,
  );

  const { data: coverages, isFetching } = useQuery(
    trpc.billing.coverage.searchCoverage.queryOptions(searchParams || {}, {
      enabled: !!searchParams,
    }),
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const params: SearchCoverageInput = {
      beneficiary: (formData.get("beneficiaryId") as string) || undefined,
    };

    setSearchParams(params);
  };

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Search Coverage</CardTitle>
        <p className="text-muted-foreground text-sm">
          Search for coverage using beneficiary or patient ID.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="beneficiaryId">Beneficiary/Patient ID</Label>
            <Input
              id="beneficiaryId"
              name="beneficiaryId"
              required
              placeholder="ID"
            />
          </div>
          <Button type="submit" disabled={isFetching} className="w-full">
            {isFetching ? "Searching..." : "Search Coverage"}
          </Button>
        </form>

        {coverages?.data && coverages.data.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-lg">Search Results</h3>
            <ul className="space-y-2">
              {coverages.data.map((coverage: any, index: number) => (
                <li key={index} className="rounded border p-2">
                  <p>
                    <strong>ID:</strong> {coverage.id}
                  </p>
                  <p>
                    <strong>Status:</strong> {coverage.status}
                  </p>
                  <p>
                    <strong>Beneficiary:</strong> {coverage.beneficiary}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {coverages?.data && coverages.data.length === 0 && !isFetching && (
          <p className="mt-4 text-muted-foreground">No coverage found.</p>
        )}
      </CardContent>
    </Card>
  );
}
