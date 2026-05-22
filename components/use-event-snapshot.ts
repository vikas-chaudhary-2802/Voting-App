"use client";

import { EventSnapshot } from "@/lib/types";
import { useCallback, useEffect, useRef, useState } from "react";

export function useEventSnapshot(eventId: string, intervalMs = 1500) {
  const [snapshot, setSnapshot] = useState<EventSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isFetching = useRef(false);

  const refresh = useCallback(async () => {
    if (isFetching.current) return;
    isFetching.current = true;
    try {
      const response = await fetch(`/api/events/${eventId}`, { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load event.");
      }

      setSnapshot(data);
      setError("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, [eventId]);

  useEffect(() => {
    refresh();
  }, [eventId]);

  return { snapshot, loading, error, refresh };
}
