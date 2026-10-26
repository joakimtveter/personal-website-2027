"use client";

import { toast } from "@payloadcms/ui";
import React, { Fragment, useCallback, useState } from "react";

import "./index.css";

const SuccessMessage: React.FC = () => (
  <div>
    Database seeded! You can now{" "}
    <a target="_blank" href="/">
      visit your website
    </a>
  </div>
);

export const SeedButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [seeded, setSeeded] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      if (seeded) {
        toast.info("Database already seeded.");
        return;
      }
      if (loading) {
        toast.info("Seeding already in progress.");
        return;
      }
      if (error) {
        toast.error(`An error occurred, please refresh and try again.`);
        return;
      }

      setLoading(true);

      const seed = fetch("/api/seed", { method: "POST", credentials: "include" }).then((res) => {
        if (!res.ok) throw new Error("An error occurred while seeding.");
        setSeeded(true);
      });

      toast.promise(seed, {
        loading: "Seeding with data....",
        success: <SuccessMessage />,
        error: "An error occurred while seeding.",
      });

      void seed
        .catch((err: unknown) => {
          setError(err instanceof Error ? err.message : String(err));
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [loading, seeded, error],
  );

  let message = "";
  if (loading) message = " (seeding...)";
  if (seeded) message = " (done!)";
  if (error) message = ` (error: ${error})`;

  return (
    <Fragment>
      <button className="seedButton" onClick={handleClick}>
        Seed your database
      </button>
      {message}
    </Fragment>
  );
};
