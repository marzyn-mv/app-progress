"use client";

import { useEffect } from "react";

export function ReactGrep() {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      import("react-grep");
    }
  }, []);
  return null;
}
