# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an e-commerce fashion visualizer built with Next.js 15, TypeScript, and Tailwind CSS. The app enables users to select fashion items, generate AI-powered outfit preview images, and purchase selected items.

### Core Pages Structure
- **Products**: Grid view for adding/removing items to outfit list
- **Outfit List**: Panel showing 2-6 selected items with reorder/remove functionality  
- **Generate Preview**: Modal/page for AI generation with optional style presets
- **Preview Display**: Shows generated outfit image with regenerate, swap, and "Buy Look" actions

## Development Commands

```bash
# Development server with Turbopack
npm run dev

# Production build with Turbopack
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **UI Components**: Radix UI primitives with class-variance-authority
- **AI Integration**: Vercel AI SDK (ai package)
- **Icons**: Lucide React

### Directory Structure
- `src/app/` - Next.js App Router pages and layouts
- `src/components/ui/` - shadcn/ui reusable components
- `src/lib/` - Utility functions and shared logic
- Path alias `~/*` maps to `./src/*`

### Component Conventions
- Uses shadcn/ui "new-york" style with neutral base color
- Components follow Radix UI patterns with `asChild` prop support
- CSS variables enabled for theming
- `cn()` utility function combines clsx and tailwind-merge

### TypeScript Configuration
- Target: ES2017 with Next.js optimizations
- Strict type checking enabled
- Import type preferences enforced via ESLint
- Path mapping: `~/*` → `./src/*`

## Code Style Rules

### ESLint Configuration
- TypeScript recommended + stylistic rules
- Next.js core web vitals + recommended rules
- React hooks rules enforced
- Unused variables must be prefixed with `_`
- Consistent type imports preferred (`import type`)
- No non-null assertions allowed
- Top-level type specifiers required

### Key Restrictions
- Must use `import { z } from 'zod/v4'` instead of 'zod'
- No unnecessary conditions allowed
- Void return checks disabled for attributes