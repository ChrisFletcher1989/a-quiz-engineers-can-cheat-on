import { NextResponse } from "next/server";

export async function GET() {
  // Return HTTP 418 "I'm a teapot" status
  return new NextResponse("I'm a teapot", {
    status: 418,
    statusText: "I'm a teapot",
  });
}

export async function POST() {
  // Also handle POST requests with the same response
  return new NextResponse("I'm a teapot", {
    status: 418,
    statusText: "I'm a teapot",
  });
}
