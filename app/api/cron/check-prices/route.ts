import { NextResponse } from "next/server";
import { checkAllRoutes } from "@/lib/services/flight-price-service";

// This endpoint should be called by a cron service (e.g., Vercel Cron Jobs)
export async function GET() {
  try {
    await checkAllRoutes();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Vercel Cron configuration
export const config = {
  runtime: 'edge',
  regions: ['iad1'], // Choose regions close to your users
} 