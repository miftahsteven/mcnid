"use client";

import { useEffect } from "react";

interface ViewTrackerProps {
  type: "post" | "video";
  slug: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function ViewTracker({ type, slug }: ViewTrackerProps) {
  useEffect(() => {
    if (!slug) return;

    // Fire-and-forget: POST to view tracking API
    fetch(`${API_URL}/api/views`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, slug }),
      credentials: "include", // include cookies
    }).catch(() => {
      // Silently fail - view tracking should not affect UX
    });
  }, [type, slug]);

  return null; // renders nothing
}
