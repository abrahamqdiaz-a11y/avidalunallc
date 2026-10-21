"use client";

import { useEffect } from "react";
import { safeSession, STORAGE } from "./forms/submit";

/** After a successful payment, forget the saved add-on selection. */
export function ClearSelection() {
  useEffect(() => {
    safeSession()?.removeItem(STORAGE.selection);
  }, []);
  return null;
}
