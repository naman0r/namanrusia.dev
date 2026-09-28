"use client";

import { useEffect } from "react";
import { emit, stage, type Day } from "@/lib/stage";

/** Hands the contribution calendar to the 3D scene, which builds its city from it. */
export function ActivityScene({ days }: { days: Day[] }) {
  useEffect(() => {
    stage.days = days;
    emit();
  }, [days]);
  return null;
}
