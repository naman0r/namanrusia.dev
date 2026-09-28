"use client";

import { useEffect } from "react";
import { stage } from "@/lib/stage";

/** Tells the scene which project page is open, so its cartridge takes that project's color. */
export function ProjectFocus({ slug }: { slug: string }) {
  useEffect(() => {
    stage.project = slug;
  }, [slug]);
  return null;
}
