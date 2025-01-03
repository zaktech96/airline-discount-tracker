"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function FlightTrackerPage() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [targetPrice, setTargetPrice] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // TODO: Implement API call to save flight route and create alert
      toast.success("Flight alert created successfully!");
    } catch (error) {
      toast.error("Failed to create flight alert");
    }
  };

  return (
    <div className="container mx-auto py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">Never Miss a Flight Deal Again</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Set up price alerts for your favorite routes and get notified when prices drop below your target.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8">
          <div className="flex flex-col items-center">
            <div className="bg-primary/10 p-3 rounded-full mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="font-semibold mb-1">Create Alerts</h3>
            <p className="text-sm text-muted-foreground">Set your desired price for any route</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-primary/10 p-3 rounded-full mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="font-semibold mb-1">Get Notified</h3>
            <p className="text-sm text-muted-foreground">Receive alerts when prices drop</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-primary/10 p-3 rounded-full mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-1">Save Money</h3>
            <p className="text-sm text-muted-foreground">Book flights at the best prices</p>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <Card className="p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-6">Set Up Price Alert</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origin">Origin Airport</Label>
              <Input
                id="origin"
                placeholder="e.g., LAX"
                value={origin}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setOrigin(e.target.value.toUpperCase())}
                className="uppercase"
                maxLength={3}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="destination">Destination Airport</Label>
              <Input
                id="destination"
                placeholder="e.g., JFK"
                value={destination}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setDestination(e.target.value.toUpperCase())}
                className="uppercase"
                maxLength={3}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="targetPrice">Target Price ($)</Label>
              <Input
                id="targetPrice"
                type="number"
                placeholder="e.g., 299"
                value={targetPrice}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setTargetPrice(e.target.value)}
                min="1"
                required
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full">
            Create Price Alert
          </Button>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Your Active Alerts</h2>
        <div className="space-y-4">
          {/* TODO: Implement alerts list */}
          <p className="text-muted-foreground">No active alerts yet.</p>
        </div>
      </Card>
    </div>
  );
} 