"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Plane, Bell, ArrowRight, Loader2, Calendar } from "lucide-react";
import axios from "axios";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function FlightTrackerPage() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [priceDates, setPriceDates] = useState<any[]>([]);
  const [isLoadingCalendar, setIsLoadingCalendar] = useState(false);

  // Get min and max dates for the date picker
  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 6); // Allow booking up to 6 months ahead

  const validateForm = () => {
    if (origin === destination) {
      toast.error("Origin and destination cities cannot be the same");
      return false;
    }
    if (origin.length < 3 || destination.length < 3) {
      toast.error("Please enter valid city names (minimum 3 letters)");
      return false;
    }
    return true;
  };

  const loadPriceCalendar = async () => {
    if (!validateForm()) return;
    
    setIsLoadingCalendar(true);
    try {
      const response = await axios.get(`/api/flights/search`, {
        params: {
          origin,
          destination,
          mode: 'calendar'
        }
      });

      if (response.data.success && response.data.prices) {
        setPriceDates(response.data.prices);
        toast.success(`Found prices for ${response.data.prices.filter((p: any) => p.available).length} dates`);
      } else {
        toast.error(response.data.error || "Failed to load price calendar");
      }
    } catch (error: any) {
      console.error("Calendar error:", error);
      toast.error(error.response?.data?.error || error.message);
    } finally {
      setIsLoadingCalendar(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      console.log('Searching flights:', { origin, destination, date: selectedDate });
      
      // First, search for flights
      const searchResponse = await axios.get(`/api/flights/search`, {
        params: {
          origin,
          destination,
          date: selectedDate ? formatDate(selectedDate) : undefined
        }
      });

      console.log('Search response:', searchResponse.data);

      if (searchResponse.data.success && searchResponse.data.flights) {
        setSearchResults(searchResponse.data.flights);
        toast.success(`Found ${searchResponse.data.flights.length} flights!`);
        
        // Load the price calendar after successful search
        loadPriceCalendar();
      } else {
        console.error('API returned success false:', searchResponse.data);
        toast.error(searchResponse.data.error || "No flights found for this route");
      }

    } catch (error: any) {
      console.error("Flight search error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      const errorMessage = error.response?.data?.details || 
                          error.response?.data?.error || 
                          error.message || 
                          "Failed to search flights";
                          
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const getDisplayDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
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
                <div className="grid gap-8 sm:grid-cols-4">
                  <div className="space-y-2">
                    <Label htmlFor="origin" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Origin City
                    </Label>
                    <div className="relative">
                      <Input
                        id="origin"
                        placeholder="Enter departure city"
                        value={origin}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setOrigin(e.target.value)}
                        className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-purple-500"
                        minLength={3}
                        required
                      />
                      <Plane className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="destination" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Destination City
                    </Label>
                    <div className="relative">
                      <Input
                        id="destination"
                        placeholder="Enter arrival city"
                        value={destination}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setDestination(e.target.value)}
                        className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-purple-500"
                        minLength={3}
                        required
                      />
                      <Plane className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Travel Date
                    </Label>
                    <div className="relative">
                      <Input
                        id="date"
                        type="date"
                        value={selectedDate ? formatDate(selectedDate) : ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setSelectedDate(e.target.value ? new Date(e.target.value) : undefined)}
                        min={formatDate(minDate)}
                        max={formatDate(maxDate)}
                        className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-purple-500"
                      />
                      <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                      {selectedDate && (
                        <div className="mt-1 text-sm text-gray-500">
                          Selected: {getDisplayDate(selectedDate)}
                        </div>
                      )}
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
                      Searching Flights...
                    </>
                  ) : (
                    <>
                      Search Flights
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </Card>
        </motion.div>

        {/* Price Calendar */}
        {priceDates.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="relative overflow-hidden mt-8">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
              <div className="relative p-8">
                <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Price Calendar
                </h2>
                <div className="grid grid-cols-7 gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-medium text-gray-500 text-sm p-2">
                      {day}
                    </div>
                  ))}
                  {priceDates.map((date, index) => {
                    const dateObj = new Date(date.date);
                    const dayOfWeek = dateObj.getDay();
                    const style = index === 0 ? { gridColumnStart: dayOfWeek + 1 } : {};
                    
                    return (
                      <div
                        key={date.date}
                        style={style}
                        className={`
                          p-2 text-center rounded-lg transition-all duration-200
                          ${date.available 
                            ? 'bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-700/80 cursor-pointer'
                            : 'bg-gray-100/50 dark:bg-gray-900/50 text-gray-400 cursor-not-allowed'}
                        `}
                        onClick={() => {
                          if (date.available) {
                            setSelectedDate(dateObj);
                            const searchElement = document.getElementById('date');
                            if (searchElement) {
                              searchElement.scrollIntoView({ behavior: 'smooth' });
                            }
                          }
                        }}
                        title={date.available ? `${formatDisplayDate(date.date)} - ${formatPrice(date.price)}` : formatDisplayDate(date.date)}
                      >
                        <div className="text-sm font-medium">
                          {dateObj.getDate()}
                        </div>
                        {date.available && (
                          <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                            {formatPrice(date.price)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="relative overflow-hidden mt-8">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
              <div className="relative p-8">
                <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Available Flights
                </h2>
                <div className="space-y-4">
                  {searchResults.map((flight, index) => (
                    <div 
                      key={index}
                      className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{flight.airline}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {flight.departure?.time} - {flight.arrival?.time}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                            ${flight.price}
                          </p>
                          <Button
                            size="sm"
                            onClick={() => setTargetPrice(flight.price)}
                            className="mt-2"
                          >
                            Set as Target
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Active Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="relative overflow-hidden mt-8">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
            <div className="relative p-8">
              <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Your Active Alerts
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-gray-500 dark:text-gray-400 text-center">
                    No active alerts yet. Create one above to start tracking prices.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 