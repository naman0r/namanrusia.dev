"use client";

import { useEffect } from "react";
import { stage } from "@/lib/stage";

/** Tells the scene which post is open, so it reseeds from the slug and takes the post's color. */
export function PostFocus({ slug, color }: { slug: string; color: string }) {
  useEffect(() => {
    stage.post = { slug, color };
  }, [slug, color]);
  return null;
}
