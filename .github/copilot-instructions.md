# Copilot Instructions for 股東紀念品網頁

## Project Overview
This is a **Vue 3 + TypeScript + Vite** single-page application for a shareholder gift proxy collection service (大倉代領股東紀念品). The site is a marketing landing page built with modern frontend technologies.

## Tech Stack & Architecture

### Core Technologies
- **Vue 3** (Composition API with `<script setup>`)
- **TypeScript** - Full type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS with CSS variables
- **shadcn-vue** - Component library (New York style)
- **Lucide Vue Next** - Icon library
- **VueUse** - Vue composition utilities

### Key Configuration Files
- `components.json` - shadcn-vue config (style: "new-york", baseColor: "stone")
- `vite.config.ts` - Path alias `@/` points to `./src`
- `src/style.css` - Tailwind v4 with custom CSS variables and `tw-animate-css`

## Project Structure

```
src/
├── App.vue               # Main component, composes all sections
├── main.ts              # App entry point
├── style.css            # Tailwind v4 + theme variables (OKLCH color space)
├── components/          # All page sections (no subdirectories)
│   ├── Navbar.vue
│   ├── HeroSection.vue
│   ├── ServicesSection.vue
│   ├── PlansSection.vue
│   ├── GallerySection.vue
│   ├── AdvantagesSection.vue
│   ├── ContactSection.vue
│   └── FooterSection.vue
└── lib/
    └── utils.ts         # Contains cn() utility for class merging
```

## Development Patterns

### Component Structure
All components use **Vue 3 Composition API** with `<script setup lang="ts">`:
```vue
<script setup lang="ts">
import { Phone, MessageCircle } from 'lucide-vue-next'
// Reactive state, computed, functions here
</script>

<template>
  <!-- Single root element with semantic HTML -->
  <section id="hero" class="...">
</template>
```

### Styling Conventions
1. **Tailwind utility classes** - Primary styling method
2. **No scoped styles** - Components use only Tailwind classes
3. **CSS Variables** - Theme customization via OKLCH color space in `style.css`
4. **Responsive design** - Use `md:` and `lg:` breakpoints consistently
5. **Color palette** - Emerald/teal/cyan for brand, stone for neutral

### Component Patterns
- **Section-based architecture** - Each major page section is a separate component
- **No prop drilling** - Hardcoded content (marketing site, not data-driven)
- **Lucide icons** - Import specific icons: `import { Icon } from 'lucide-vue-next'`
- **Smooth scrolling** - Anchor links with `html { scroll-behavior: smooth }` in App.vue
- **ID-based navigation** - Sections have IDs for anchor navigation (`#hero`, `#services`, etc.)

### Key Business Context
- **Target audience**: Taiwanese shareholders who want proxy gift collection
- **Contact info**: Phone: 0982-571-134 (贊哥), LINE: @792nvftc
- **Service offerings**: Two main plans (全餐方案一 for items, 全餐方案二 for convenience store cards)
- **External images**: Gallery uses Strikingly CDN URLs from original site

## Development Workflow

### Commands
```bash
bun run dev      # Start Vite dev server (http://localhost:5173)
bun run build    # Type-check + production build
bun run preview  # Preview production build
```

### Adding shadcn-vue Components
```bash
bunx --bun shadcn-vue@latest add [component-name]
```
Components are added to `src/components/ui/` with path alias `@/components/ui`

### TypeScript Configuration
- Uses project references: `tsconfig.json` references `tsconfig.app.json` and `tsconfig.node.json`
- Path alias: `@/*` maps to `./src/*`
- Strict mode enabled

## UI/UX Patterns

### Design System
- **Primary colors**: Emerald-600, Teal-600, Cyan-700 (gradients)
- **Border radius**: `--radius: 0.625rem` (10px), extended via `rounded-xl`, `rounded-2xl`
- **Shadows**: `shadow-lg`, `shadow-xl` for elevation
- **Hover effects**: `hover:scale-105`, `hover:shadow-2xl`, `transition-all`

### Reusable Patterns
1. **Gradient backgrounds**: `bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700`
2. **Glass morphism**: `bg-white/20 backdrop-blur-sm`
3. **Card hover effects**: Group hover with scale and shadow transitions
4. **Icon containers**: Fixed size (w-12 h-12) with gradient backgrounds and rounded corners

### Component Examples
- **GallerySection.vue**: Pagination + lightbox with Teleport
- **ContactSection.vue**: Two-column layout (info + form) with gradient background
- **PlansSection.vue**: Grid layout with "popular" badge pattern

## Important Conventions

1. **Chinese/Traditional Chinese content** - All user-facing text in Traditional Chinese
2. **External links**: LINE, Facebook group, phone/tel links throughout
3. **No data fetching** - Static content, no API calls
4. **Mobile-first responsive** - Grid switches from stacked to side-by-side with `md:` prefix
5. **Accessibility**: Semantic HTML (section, nav, footer), alt text on images

## Common Tasks

### Adding a new section
1. Create component in `src/components/[Name]Section.vue`
2. Import in `App.vue`
3. Add to template between `<main>` tags
4. Add anchor link in `Navbar.vue` if needed

### Modifying colors
Edit CSS variables in `src/style.css` (OKLCH format) under `:root` or `.dark`

### Adding icons
Import from `lucide-vue-next` and use as components with size classes

### Updating contact info
Search for "0982-571-134", "@792nvftc", "playegg903@gmail.com" to find all instances
