"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function TimezoneSync() {
  const { status } = useSession();

  useEffect(() => {
    if (status !== "authenticated") return;
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!timeZone || localStorage.getItem("algo-rich-timezone") === timeZone) return;

    fetch("/api/user/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ timeZone }),
    })
      .then((response) => {
        if (response.ok) localStorage.setItem("algo-rich-timezone", timeZone);
      })
      .catch(() => undefined);
  }, [status]);

  return null;
}
