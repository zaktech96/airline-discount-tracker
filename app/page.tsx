"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Plane, Bell, PiggyBank } from "lucide-react";

const slideIn = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.3
    }
  }
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20" />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px)] bg-[size:14px] bg-[position:center] dark:bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px)]" />
          </motion.div>
          
          <div className="container relative px-4 md:px-6">
            <motion.div 
              className="flex flex-col items-center space-y-8 text-center"
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="space-y-4 max-w-3xl">
                <div className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-px">
                  <div className="rounded-full bg-white/80 dark:bg-black/80 px-4 py-1.5">
                    <span className="text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                      Never Overpay for Flights Again
                    </span>
                  </div>
                </div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none bg-gradient-to-r from-gray-900 via-blue-800 to-purple-900 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                  Your Personal Flight
                  <br />
                  Price Guardian
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl dark:text-gray-300">
                  Get instant alerts when flight prices drop to your target. Save hundreds on your next adventure.
                </p>
              </motion.div>

              <motion.div 
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center"
              >
                <Link href="/flights" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 group">
                    Start Tracking
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-20 bg-white dark:bg-gray-800/50">
          <div className="container px-4 md:px-6">
            <motion.div 
              className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {[
                {
                  title: "Smart Route Tracking",
                  description: "Monitor any flight route worldwide with real-time price updates",
                  icon: Plane,
                  gradient: "from-blue-500 to-cyan-500"
                },
                {
                  title: "Instant Price Alerts",
                  description: "Get notified the moment prices drop below your target",
                  icon: Bell,
                  gradient: "from-purple-500 to-pink-500"
                },
                {
                  title: "Maximize Savings",
                  description: "Save hundreds by booking at the perfect moment",
                  icon: PiggyBank,
                  gradient: "from-green-500 to-emerald-500"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={slideIn}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />
                  <div className="relative p-8 rounded-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-6`}
                    >
                      <feature.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-20 bg-gradient-to-b from-white to-blue-50 dark:from-gray-800 dark:to-gray-900">
          <div className="container px-4 md:px-6">
            <motion.div 
              className="relative max-w-3xl mx-auto text-center"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Ready to Start Saving?
                </h2>
                <p className="text-gray-600 dark:text-gray-300 md:text-lg">
                  Join thousands of smart travelers who never overpay for flights
                </p>
              </motion.div>
              <motion.div 
                variants={fadeInUp}
                className="mt-8"
              >
                <Link href="/flights">
                  <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                    Set Up Your First Alert
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
