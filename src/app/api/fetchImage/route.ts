import { NextResponse } from "next/server";

export async function GET() {
  // Return HTTP 418 "I'm a teapot" status
  return new NextResponse("{status: 418, message: 'I'm a teapot'}", {
    status: 418,
    statusText: "I'm a teapot",
  });
}
