import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { origin, destination, targetPrice, userId = "demo" } = await req.json();

    // Create or find existing route
    const route = await prisma.flight_route.upsert({
      where: {
        origin_destination_user_id: {
          origin: origin.toUpperCase(),
          destination: destination.toUpperCase(),
          user_id: userId,
        },
      },
      update: {},
      create: {
        origin: origin.toUpperCase(),
        destination: destination.toUpperCase(),
        user_id: userId,
      },
    });

    // Create price alert
    const alert = await prisma.price_alert.create({
      data: {
        route_id: route.id,
        target_price: parseFloat(targetPrice),
        user_id: userId,
      },
      include: {
        route: true,
      },
    });

    return NextResponse.json({ success: true, alert });
  } catch (error) {
    console.error("Failed to create alert:", error);
    return NextResponse.json(
      { error: "Failed to create alert" },
      { status: 500 }
    );
  }
} 