"use client";

import { useEffect, useRef } from "react";

/** Records when the form was opened, for the server's minimum-time spam check. */
export function useStartedAt() {
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  return startedAt;
}
