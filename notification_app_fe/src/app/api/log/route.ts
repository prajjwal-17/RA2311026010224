import { NextResponse } from "next/server";
import {
  VALID_LEVELS,
  VALID_PACKAGES,
  VALID_STACKS,
} from "@logging-middleware";
import { serverLog } from "@/api/server";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as
    | {
        stack?: string;
        level?: string;
        package?: string;
        message?: string;
      }
    | null;

  if (
    !payload ||
    !VALID_STACKS.has(payload.stack as never) ||
    !VALID_LEVELS.has(payload.level as never) ||
    !VALID_PACKAGES.has(payload.package as never) ||
    typeof payload.message !== "string"
  ) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  await serverLog(
    payload.stack as "frontend",
    payload.level as never,
    payload.package as never,
    payload.message,
  );

  return NextResponse.json({ ok: true });
}
