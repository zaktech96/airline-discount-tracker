# Flight Price Tracker

A modern web application that helps users track flight prices and get notified when prices drop to their target price.

## Features

- 🛫 Track any flight route worldwide
- 📊 Real-time price monitoring
- 🔔 Instant price drop notifications
- 💰 Set custom price targets
- 🌙 Dark mode support
- ✨ Modern, responsive UI

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Styling**: Tailwind CSS, Framer Motion for animations
- **UI Components**: Radix UI, Lucide Icons
- **State Management**: React Hooks
- **API Integration**: Axios

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/flight-price-tracker.git
   cd flight-price-tracker
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.template .env
   ```
   Fill in your database and API credentials in `.env`

4. Run database migrations:
   ```bash
   pnpm prisma migrate dev
   ```

5. Start the development server:
   ```bash
   pnpm dev
   ```

## Environment Variables

Create a `.env` file with the following variables:

```env
DATABASE_URL="your-postgresql-url"
DIRECT_URL="your-direct-db-url"
FLIGHT_API_KEY="your-flight-api-key"
```

## Project Structure

```
├── app/                  # Next.js app directory
│   ├── api/             # API routes
│   ├── flights/         # Flight tracking page
│   └── page.tsx         # Landing page
├── components/          # Reusable components
├── lib/                 # Utility functions and services
├── prisma/             # Database schema and migrations
└── public/             # Static assets
```

## API Endpoints

- `POST /api/alerts` - Create a new price alert
- `GET /api/cron/check-prices` - Trigger price check (protected)
- `POST /api/webhooks/flight-prices` - Receive price updates

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

