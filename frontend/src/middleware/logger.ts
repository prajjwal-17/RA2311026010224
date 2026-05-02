"use client";

import type { EvaluationLevel, EvaluationPackage } from "@logging-middleware";
import { sendClientLog } from "@/api/client";

export async function log(
  stack: "frontend",
  level: EvaluationLevel,
  packageName: EvaluationPackage,
  message: string,
): Promise<void> {
  if (stack !== "frontend") {
    return;
  }

  await sendClientLog(level, packageName, message);
}
