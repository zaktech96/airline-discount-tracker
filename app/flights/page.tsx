"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Plane, Bell, ArrowRight, Loader2 } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function FlightTrackerPage() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // TODO: Implement API call to save flight route and create alert
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success("Flight alert created successfully!");
    } catch (error) {
      toast.error("Failed to create flight alert");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Section */}
        <motion.div 
          className="text-center space-y-4"
          initial="initial"
          animate="animate"
          variants={{
            animate: { transition: { staggerChildren: 0.2 } }
          }}
        >
          <motion.div variants={fadeInUp}>
            <div className="inline-block rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 p-px mb-4">
              <div className="rounded-full bg-white/90 dark:bg-black/90 px-4 py-1.5">
                <span className="text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                  Set Up Price Alerts
                </span>
              </div>
            </div>
          </motion.div>
          <motion.h1 
            variants={fadeInUp}
            className="text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-900 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent"
          >
            Track Your Dream Flights
          </motion.h1>
          <motion.p 
            variants={fadeInUp}
            className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300"
          >
            Enter your route details below and we'll notify you when prices drop to your target.
          </motion.p>
        </motion.div>

        {/* Alert Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
            <div className="relative p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid gap-8 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="origin" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Origin Airport
                    </Label>
                    <div className="relative">
                      <Input
                        id="origin"
                        placeholder="e.g., LAX"
                        value={origin}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setOrigin(e.target.value.toUpperCase())}
                        className="uppercase bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-purple-500"
                        maxLength={3}
                        required
                      />
                      <Plane className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="destination" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Destination Airport
                    </Label>
                    <div className="relative">
                      <Input
                        id="destination"
                        placeholder="e.g., JFK"
                        value={destination}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setDestination(e.target.value.toUpperCase())}
                        className="uppercase bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-purple-500"
                        maxLength={3}
                        required
                      />
                      <Plane className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="targetPrice" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Target Price ($)
                    </Label>
                    <div className="relative">
                      <Input
                        id="targetPrice"
                        type="number"
                        placeholder="e.g., 299"
                        value={targetPrice}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setTargetPrice(e.target.value)}
                        className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-purple-500"
                        min="1"
                        required
                      />
                      <Bell className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Alert...
                    </>
                  ) : (
                    <>
                      Create Price Alert
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </Card>
        </motion.div>

        {/* Active Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
            <div className="relative p-8">
              <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Your Active Alerts
              </h2>
              <div className="space-y-4">
                {/* TODO: Implement alerts list */}
                <p className="text-gray-500 dark:text-gray-400">
                  No active alerts yet. Create one above to start tracking prices.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 