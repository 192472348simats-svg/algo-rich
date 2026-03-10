# Algo Rich Landing Page - Development Guidelines

## Project Overview
A modern landing page for Algo Rich, a structured programming education platform specializing in Python and DSA. Built with Next.js 14, TypeScript, Tailwind CSS v4, and Framer Motion.

## Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Typography**: Inter font (Google Fonts)

## Project Structure
```
app/
├── components/
│   ├── HeroSection.tsx          # Hero with headline, subheadline, CTA buttons
│   ├── FeaturesSection.tsx      # Three-column feature showcase
│   ├── LearningPathSection.tsx  # 4-stage curriculum cards
│   ├── HowItWorksSection.tsx    # 3-step methodology
│   └── CTAFooterSection.tsx     # Email signup & footer links
├── layout.tsx                   # Root layout with metadata
├── page.tsx                     # Main page composition
└── globals.css                  # Global styles & CSS theme variables
```

## Design System

### Color Palette
- **Navy Dark**: #0A1128 (background)
- **Navy Light**: #1E3A5F (secondary background)
- **Gold Primary**: #D4AF37 (main accent)
- **Gold Light**: #F4E4C1 (secondary accent)
- **Gray Light**: #E8E8E8 (text on dark)

### Typography
- **Font**: Inter (from Google Fonts)
- **Sizes**: Follow semantic HTML heading levels
- **Line Height**: Generous (1.6+) for readability

### Spacing & Layout
- Use Tailwind's spacing scale (px-4, py-8, etc.)
- Max-width container: max-w-7xl for most sections
- Generous whitespace between sections

## Component Guidelines

### Animation Standards
- Use `whileInView` for scroll-triggered animations
- Use `whileHover` for interactive elements
- Duration: 0.6-0.8s for smooth, professional feel
- Stagger children with 0.15-0.2s delays

### Responsive Design
- Mobile-first approach
- Breakpoints: Mobile (base), sm, md, lg, xl
- Use `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` pattern

### Interactive Elements
- All buttons must have hover states
- Use `transition-all duration-300` for smooth changes
- Include focus states for accessibility
- Provide visual feedback for form inputs

## Customization Instructions

### To Change Colors
1. Edit `:root` CSS variables in `app/globals.css`
2. Update Tailwind theme tokens if using custom class names
3. Test in all components

### To Modify Content
1. **Hero**: Edit `app/components/HeroSection.tsx`
2. **Features**: Update feature array in `FeaturesSection.tsx`
3. **Learning Path**: Modify `stages` array in `LearningPathSection.tsx`
4. **How It Works**: Edit `steps` array in `HowItWorksSection.tsx`
5. **Footer Links**: Update footer in `CTAFooterSection.tsx`

### To Add New Sections
1. Create component in `app/components/`
2. Import in `app/page.tsx`
3. Match animation patterns and styling

## Development Workflow

### Running the Project
```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Common Tasks
- **Update metadata**: Edit `metadata` in `app/layout.tsx`
- **Change font**: Import from `next/font/google` in layout
- **Add form submission**: Extend handler in `CTAFooterSection.tsx`
- **Modify animations**: Adjust `variants` objects in motion components

## Best Practices

1. **Keep It Clean**: Use semantic HTML and avoid unnecessary divs
2. **Accessibility**: Include alt text, proper ARIA labels, focus states
3. **Performance**: Framer Motion uses GPU acceleration; avoid heavy computations
4. **Mobile First**: Design for mobile, enhance for desktop
5. **Consistency**: Match animation speeds and spacing across sections
6. **Type Safety**: Always use TypeScript types for props and state

## Known Limitations & Future Enhancements

- Email signup form currently simulates submission (replace with API)
- No backend integration yet
- Footer links are placeholder anchors
- Consider adding:
  - Testimonials section
  - Pricing section
  - FAQ accordion
  - Blog preview section
  - Newsletter API integration

## Dependencies
- `next@16.1` - Framework
- `react@19` - UI library
- `typescript@5.8` - Type safety
- `tailwindcss@4` - Styling
- `@tailwindcss/postcss@4` - PostCSS plugin
- `framer-motion@12` - Animations
- `eslint` - Code linting

## Deployment
- Ready for deployment on Vercel
- Can be deployed on any Node.js hosting (Netlify, AWS, etc.)
- No database or backend dependencies required
- Fully static pre-renderable content

---

Last Updated: February 2026
