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

type SearchBinaryInput = inferProcedureInput<
  AppRouter["clinical"]["binary"]["searchBinary"]
>;

export default function SearchBinaryForm() {
  const [searchParams, setSearchParams] = useState<SearchBinaryInput | null>(
    null,
  );

  const { data: binaries, isFetching } = useQuery(
    trpc.clinical.binary.searchBinary.queryOptions(
      searchParams || { _id: "" },
      {
        enabled: !!searchParams,
      },
    ),
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const params: SearchBinaryInput = {
      _id: (formData.get("binaryId") as string) || "",
    };

    setSearchParams(params);
  };

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Search Binary Resources</CardTitle>
        <p className="text-muted-foreground text-sm">
          Search for binary resources using resource ID.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="binaryId">Binary Resource ID</Label>
            <Input
              id="binaryId"
              name="binaryId"
              required
              placeholder="Binary ID"
            />
          </div>
          <Button type="submit" disabled={isFetching} className="w-full">
            {isFetching ? "Searching..." : "Search Binary"}
          </Button>
        </form>

        {binaries?.data && binaries.data.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-lg">Search Results</h3>
            <ul className="space-y-2">
              {binaries.data.map((binary: any, index: number) => (
                <li key={index} className="rounded border p-2">
                  <p>
                    <strong>ID:</strong> {binary.id}
                  </p>
                  <p>
                    <strong>Content Type:</strong> {binary.contentType}
                  </p>
                  <p>
                    <strong>Size:</strong> {binary.size}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {binaries?.data && binaries.data.length === 0 && !isFetching && (
          <p className="mt-4 text-muted-foreground">
            No binary resources found.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
