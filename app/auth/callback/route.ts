// Magic-link callback. Module 0 stub — Module 4 wires up the actual
// `exchangeCodeForSession` + role check + redirect.

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  // Honor `next=` if the auth request asked us to land somewhere specific.
  const next = url.searchParams.get("next") || "/";
  return NextResponse.redirect(new URL(next, request.url));
}
