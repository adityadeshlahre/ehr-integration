import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col justify-center text-center">
      <p className="text-fd-muted-foreground">
        You can open{" "}
        <Link
          href="/docs"
          className="font-semibold text-fd-foreground underline"
        >
          /docs
        </Link>{" "}
        and see the openEPIC EHR Integration documentation.
      </p>
    </main>
  );
}
