# 🚗 Ride-Based Pricing Setup Guide

This guide walks you through setting up dynamic pricing based on ride distance/type using Polar payments.

## 📋 Overview

The ride pricing system allows you to:
- **Calculate prices** based on distance, duration, and ride type
- **Apply discounts** based on user subscription tiers
- **Track ride history** and user statistics
- **Manage pricing tiers** dynamically
- **Integrate with Polar** for subscription billing

## 🏗️ Architecture

### Database Schema
- **`rides`** - Stores individual ride records with pricing details
- **`pricingTiers`** - Defines subscription tiers and their benefits
- **`ridePricing`** - Base pricing configuration for each ride type
- **`subscriptions`** - User subscription data (existing)

### Pricing Flow
1. User selects ride type and enters details
2. System calculates base price using distance/duration
3. Checks user's active subscription
4. Applies appropriate discount based on tier
5. Returns final price with breakdown
6. Creates ride record for tracking

## 🚀 Setup Steps

### 1. Initialize Pricing Data

First, run the initialization function to set up default pricing:

```bash
# In your Convex dashboard or via API
# Call the initializePricingTiers mutation
```

### 2. Configure Polar Products

Create these products in your Polar dashboard:

#### Basic Ride Plan
- **Name**: "Basic Ride Plan"
- **Price**: 29 SAR/month
- **Features**: 10% off short rides, 20 rides/month
- **Polar Price ID**: `basic_ride_plan` (replace in code)

#### Premium Ride Plan  
- **Name**: "Premium Ride Plan"
- **Price**: 79 SAR/month
- **Features**: 20% off all rides, 50 rides/month, priority support
- **Polar Price ID**: `premium_ride_plan` (replace in code)

#### Enterprise Ride Plan
- **Name**: "Enterprise Ride Plan" 
- **Price**: 199 SAR/month
- **Features**: 30% off all rides, unlimited rides, luxury vehicles
- **Polar Price ID**: `enterprise_ride_plan` (replace in code)

### 3. Update Polar Price IDs

Replace the placeholder price IDs in `convex/ridePricing.ts`:

```typescript
// Update these with your actual Polar price IDs
const defaultTiers = [
  {
    name: "Basic",
    polarPriceId: "price_1234567890", // Your actual Polar price ID
    // ... rest of config
  },
  // ... other tiers
];
```

### 4. Environment Variables

Ensure these are set in your `.env` file:

```bash
# Polar Configuration
POLAR_ACCESS_TOKEN=polar_...
POLAR_ORGANIZATION_ID=org_...
POLAR_WEBHOOK_SECRET=whsec_...

# Convex (if not already set)
CONVEX_DEPLOYMENT=your-deployment
VITE_CONVEX_URL=https://your-deployment.convex.cloud
```

## 💰 Pricing Configuration

### Base Pricing (SAR)
- **Short Rides**: 2.5 SAR/km + 0.8 SAR/min (15-50 SAR)
- **Medium Rides**: 2.0 SAR/km + 0.6 SAR/min (25-100 SAR)  
- **Long Rides**: 1.8 SAR/km + 0.5 SAR/min (40-200 SAR)
- **Premium Rides**: 4.0 SAR/km + 1.2 SAR/min (30-300 SAR)

### Subscription Discounts
- **Basic**: 10% off short rides
- **Premium**: 20% off all rides
- **Enterprise**: 30% off all rides

### Surge Pricing
- **Short**: 1.2x multiplier
- **Medium**: 1.3x multiplier
- **Long**: 1.4x multiplier
- **Premium**: 1.1x multiplier

## 🔧 Usage Examples

### Calculate Ride Price

```typescript
import { useAction } from "convex/react";
import { api } from "../convex/_generated/api";

const calculatePrice = useAction(api.ridePricing.calculateRidePrice);

const result = await calculatePrice({
  userId: "user_123",
  rideType: "medium",
  distance: 15, // km
  duration: 25, // minutes
  fromLocation: "Riyadh City Center",
  toLocation: "King Khalid Airport",
});
```

### Get User Statistics

```typescript
import { useQuery } from "convex/react";

const userStats = useQuery(api.ridePricing.getUserRideStats, { 
  userId: "user_123" 
});

// Returns: { totalRides, totalSpent, totalSaved, averageRidePrice, ridesByType }
```

### Update Pricing

```typescript
import { useMutation } from "convex/react";

const updatePricing = useMutation(api.ridePricing.updatePricing);

await updatePricing({
  rideType: "short",
  basePricePerKm: 3.0, // Increase to 3 SAR/km
  basePricePerMinute: 1.0, // Increase to 1 SAR/min
  minimumPrice: 20, // Increase minimum to 20 SAR
  maximumPrice: 60, // Increase maximum to 60 SAR
});
```

## 🎯 Features

### Real-time Pricing
- **Dynamic calculation** based on current rates
- **Subscription discounts** applied automatically
- **Surge pricing** during peak times
- **Price bounds** to prevent extreme pricing

### User Experience
- **Price preview** before booking
- **Savings display** for subscribers
- **Ride history** and statistics
- **Subscription benefits** clearly shown

### Admin Features
- **Pricing management** via API
- **Tier configuration** updates
- **Ride analytics** and reporting
- **Revenue tracking** by subscription

## 🔄 Integration Points

### With Existing Systems
- **Clerk Auth**: User identification for pricing
- **Polar Payments**: Subscription management
- **Convex**: Real-time data and functions
- **Dashboard**: User ride history and stats

### Webhook Handling
The system integrates with Polar webhooks to:
- **Update subscription status** when users upgrade/downgrade
- **Track payment events** for billing
- **Sync pricing tiers** when plans change

## 📊 Monitoring

### Key Metrics to Track
- **Average ride price** by subscription tier
- **Discount utilization** rates
- **Ride frequency** by user type
- **Revenue per user** by tier
- **Conversion rates** from free to paid

### Analytics Queries
```typescript
// Get pricing analytics
const analytics = await ctx.runQuery(api.ridePricing.getPricingAnalytics);

// Get user behavior
const behavior = await ctx.runQuery(api.ridePricing.getUserBehavior, { 
  timeRange: "30d" 
});
```

## 🚨 Troubleshooting

### Common Issues

**"Pricing not found for ride type"**
- Ensure `initializePricingTiers` has been run
- Check that ride type exists in `ridePricing` table

**"User subscription not found"**
- Verify user is signed in with Clerk
- Check subscription status in Polar dashboard
- Ensure webhook events are being processed

**"Price calculation error"**
- Validate distance and duration are positive numbers
- Check pricing configuration is active
- Verify surge multiplier is set correctly

### Debug Steps
1. Check Convex logs for errors
2. Verify Polar webhook events
3. Test with known good data
4. Check environment variables
5. Validate database schema

## 🔮 Future Enhancements

### Planned Features
- **Dynamic surge pricing** based on demand
- **Geographic pricing** by city/region
- **Time-based discounts** (off-peak hours)
- **Loyalty rewards** for frequent riders
- **Corporate accounts** with custom pricing
- **API for third-party integrations**

### Advanced Pricing
- **Machine learning** for demand prediction
- **A/B testing** for pricing strategies
- **Real-time competitor** price monitoring
- **Dynamic discount** algorithms

## 📞 Support

For issues with this implementation:
1. Check the troubleshooting section
2. Review Convex logs
3. Verify Polar configuration
4. Test with sample data
5. Contact support with specific error messages

---

**Ready to implement?** Start with the initialization step and test with the booking form at `/book-ride`!
