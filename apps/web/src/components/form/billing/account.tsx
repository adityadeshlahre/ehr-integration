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

type SearchAccountInput = inferProcedureInput<
  AppRouter["billing"]["billing"]["searchAccount"]
>;

export default function SearchAccountForm() {
  const [searchParams, setSearchParams] = useState<SearchAccountInput | null>(
    null,
  );

  const { data: accounts, isFetching } = useQuery(
    trpc.billing.billing.searchAccount.queryOptions(
      searchParams || { _id: "" },
      {
        enabled: !!searchParams,
      },
    ),
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const params: SearchAccountInput = {
      _id: (formData.get("accountId") as string) || "",
    };

    setSearchParams(params);
  };

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Search Accounts</CardTitle>
        <p className="text-muted-foreground text-sm">
          Search for billing accounts.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="accountId">Account ID</Label>
            <Input
              id="accountId"
              name="accountId"
              required
              placeholder="Account ID"
            />
          </div>
          <Button type="submit" disabled={isFetching} className="w-full">
            {isFetching ? "Searching..." : "Search Accounts"}
          </Button>
        </form>

        {accounts?.data && accounts.data.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-lg">Search Results</h3>
            <ul className="space-y-2">
              {accounts.data.map((account: any, index: number) => (
                <li key={index} className="rounded border p-2">
                  <p>
                    <strong>ID:</strong> {account.id}
                  </p>
                  <p>
                    <strong>Status:</strong> {account.status}
                  </p>
                  <p>
                    <strong>Balance:</strong>{" "}
                    {account.balance?.[0]?.amount?.value}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {accounts?.data && accounts.data.length === 0 && !isFetching && (
          <p className="mt-4 text-muted-foreground">No accounts found.</p>
        )}
      </CardContent>
    </Card>
  );
}
