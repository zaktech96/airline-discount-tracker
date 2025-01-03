
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // Verify webhook signature if using a service that provides it
    const headersList = await headers();
    const signature = headersList.get("x-webhook-signature");

    const body = await req.json();
    const { route_id, price, airline, flight_number } = body;

    // Store the new price in history
    const priceHistory = await prisma.price_history.create({
      data: {
        route_id,
        price,
        airline,
        flight_number
      }
    });

    // Check if this price triggers any alerts
    const alerts = await prisma.price_alert.findMany({
      where: {
        route_id,
        is_active: true,
        target_price: {
          gte: price // Only get alerts where target price is greater than or equal to current price
        }
      },
      include: {
        route: true
      }
    });

    // TODO: Send notifications for triggered alerts
    for (const alert of alerts) {
      // Here you would integrate with your notification service
      // (email, push notification, etc.)
      console.log(`Alert triggered for route ${alert.route.origin} to ${alert.route.destination}`);
    }

    return NextResponse.json({ 
      success: true, 
      priceHistory,
      triggeredAlerts: alerts.length
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 