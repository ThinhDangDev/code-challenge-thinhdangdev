# Token Swap Application

A modern, feature-rich token swap interface built with React, TypeScript, and Vite. This application provides a smooth and intuitive experience for swapping between different cryptocurrencies with real-time price data.

## Features

- **Real-time Token Prices**: Fetches live cryptocurrency prices from Switcheo's API
- **Intuitive Swap Interface**: Clean, modern UI with smooth animations and transitions
- **Smart Token Selection**: Automatically prevents selecting the same token for both sides
- **Price Calculations**: Real-time conversion calculations with USD value display
- **Slippage Control**: Customizable slippage tolerance settings
- **Form Validation**: Comprehensive input validation with Zod schema
- **Responsive Design**: Mobile-first design that works on all devices
- **Loading States**: Elegant loading indicators and success feedback
- **Error Handling**: Robust error handling with user-friendly messages

## Tech Stack

- **React 19** - Latest React with modern hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Beautiful, accessible UI components
- **Radix UI** - Headless UI primitives
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation
- **Axios** - HTTP client for API requests
- **Lucide React** - Beautiful icons

## Getting Started

### Prerequisites

- Node.js 16+ and pnpm

### Installation

1. Navigate to the project directory:

```bash
cd src/problem2
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm dev
```

4. Open your browser and visit `http://localhost:5173`

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

## Project Structure

```
src/
├── components/
│   ├── SwapForm.tsx          # Main swap interface component
│   ├── TokenSelector.tsx     # Token selection modal
│   └── ui/                   # Shadcn/ui components
├── constants/
│   └── tokens.ts            # Token list and icon utilities
├── hooks/
│   └── useTokenPrices.ts    # Custom hook for fetching token prices
├── types/
│   └── token.ts             # TypeScript type definitions
└── lib/
    └── utils.ts             # Utility functions
```

## Key Components

### SwapForm

The main component that orchestrates the entire swap experience:

- Manages form state with React Hook Form and Zod validation
- Handles token selection and price calculations
- Provides real-time exchange rate display
- Includes slippage tolerance controls

### TokenSelector

A searchable modal for token selection:

- Search functionality by symbol or name
- Real-time price display for each token
- Fallback images for missing token icons
- Prevents duplicate token selection

### useTokenPrices Hook

Custom hook for managing price data:

- Fetches real-time prices from Switcheo API
- Handles loading and error states
- Processes and normalizes price data

## Features Deep Dive

### Smart Token Selection

The application automatically handles edge cases when users select tokens:

- If you select the same token for both "from" and "to", it automatically switches to the next available token
- Seamless token swapping with a single button click

### Real-time Calculations

- Instant price calculations as you type
- USD value display for both input and output amounts
- Exchange rate display with proper decimal precision

### Slippage Protection

- Preset slippage options (0.1%, 0.5%, 1.0%)
- Custom slippage input
- Collapsible interface to save space

### Form Validation

- Prevents negative amounts
- Ensures numeric input only
- Real-time error feedback
- Disabled states for incomplete forms

## Design System

The application uses a cohesive design system built on:

- **Color Palette**: Blue and purple gradients with clean whites and grays
- **Typography**: Consistent font sizes and weights
- **Spacing**: Tailwind's spacing scale for consistency
- **Components**: Shadcn/ui for accessible, beautiful components

## API Integration

The app integrates with Switcheo's price API:

- **Endpoint**: `https://interview.switcheo.com/prices.json`
- **Data Processing**: Automatically selects the highest price for each token
- **Error Handling**: Graceful fallbacks for API failures

## Testing & Development

The project includes:

- ESLint configuration for code quality
- TypeScript for type safety
- Component-based architecture for testability
- Error boundaries for robust error handling

## Deployment

To build for production:

```bash
pnpm build
```

The build output will be in the `dist/` directory, ready for deployment to any static hosting service.
