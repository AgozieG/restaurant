import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Daisy Life — Grills, BBQ, Pasta & Rice in New Haven, Enugu" },
      {
        name: "description",
        content:
          "Daisy Life is a fast food kitchen at Sabbath Bustop, 7 Umueke St, New Haven, Enugu. Order grills, BBQ, jollof, pasta and combos for pickup or delivery.",
      },
      { property: "og:title", content: "Daisy Life — Grills, BBQ, Pasta & Rice in Enugu" },
      {
        property: "og:description",
        content: "Smoky grills, loaded platters and party jollof, made fresh daily in New Haven, Enugu.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    window.location.replace("/site/index.html");
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-sm text-muted-foreground">
        Loading Daisy Life… <a className="underline" href="/site/index.html">Continue</a>
      </p>
    </div>
  );
}
