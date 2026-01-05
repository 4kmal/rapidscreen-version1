# Responsive Zoom Pattern

A documentation reference for the synchronized responsive scaling technique used in `MainFeaturesSection` and similar components.

---

## Overview

This pattern creates a "zoom-in/zoom-out" effect where components appear to scale proportionally as the viewport changes. It's achieved by **applying consistent responsive multipliers to all size-related properties at the same breakpoints**.

## How It Works

Instead of using CSS `transform: scale()` or container queries, we manually define proportional sizes for each breakpoint:

```tsx
<div className="p-3 sm:p-6 lg:p-12">
  <div className="w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32">
    <h3 className="text-[11px] sm:text-[16px] lg:text-[20px]">Title</h3>
    <p className="text-[9px] sm:text-[13px] lg:text-[16px]">Description</p>
  </div>
</div>
```

## Breakpoint Reference

| Breakpoint | Tailwind Prefix | Min Width |
|------------|-----------------|-----------|
| Mobile     | (none)          | 0px       |
| Small      | `sm:`           | 640px     |
| Medium     | `md:`           | 768px     |
| Large      | `lg:`           | 1024px    |
| XL         | `xl:`           | 1280px    |

## Scaling Ratios Used in MainFeaturesSection

The cards use approximately **1.5x scaling** between each breakpoint:

| Property | Mobile | Small (`sm:`) | Large (`lg:`) | Scale Factor |
|----------|--------|---------------|---------------|--------------|
| Padding | `p-3` (12px) | `p-6` (24px) | `p-12` (48px) | 2x per step |
| Icon Size | `w-16 h-16` (64px) | `w-24 h-24` (96px) | `w-32 h-32` (128px) | ~1.5x per step |
| Heading | `text-[11px]` | `text-[16px]` | `text-[20px]` | ~1.4x per step |
| Paragraph | `text-[9px]` | `text-[13px]` | `text-[16px]` | ~1.4x per step |
| Margin Bottom | `mb-3` | `mb-6` | `mb-8` | ~1.5x per step |
| Border Radius | `rounded-xl` | `rounded-2xl` | `rounded-2xl` | - |

## Implementation Example

### Card Component with Responsive Zoom

```tsx
<div className="group flex flex-col items-center text-center p-3 sm:p-6 lg:p-12 transition-all duration-500">
  
  {/* Icon Container - scales proportionally */}
  <div className="mb-3 sm:mb-6 lg:mb-8">
    <div className="w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 
                    rounded-xl sm:rounded-2xl 
                    bg-black-alpha-2 border border-border-faint">
      {/* Icon content */}
    </div>
  </div>
  
  {/* Title - scales proportionally */}
  <h3 className="text-[11px] sm:text-[16px] lg:text-[20px] font-bold mb-1 sm:mb-3">
    Card Title
  </h3>
  
  {/* Description - scales proportionally */}
  <p className="text-[9px] sm:text-[13px] lg:text-[16px] text-black-alpha-64 leading-[1.4] sm:leading-[1.5]">
    Card description text goes here
  </p>
  
</div>
```

### Grid Container (Always 3 Columns)

```tsx
<div className="grid grid-cols-3 
                bg-background-base 
                border border-border-faint 
                rounded-[10px] 
                divide-x divide-border-faint 
                shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
  {/* Cards */}
</div>
```

> **Note:** Using `grid-cols-3` keeps the grid at 3 columns on ALL screen sizes. The content inside scales down on mobile rather than stacking.

## Key Properties to Scale

When implementing this pattern, ensure these properties scale together:

1. **Container padding** - `p-*`
2. **Element dimensions** - `w-*`, `h-*`
3. **Font sizes** - `text-*` or `text-[*px]`
4. **Spacing/margins** - `mb-*`, `gap-*`
5. **Border radius** - `rounded-*`
6. **Line height** - `leading-*`

## Transitions

Add smooth transitions for hover/active states (note: breakpoint changes are instant):

```tsx
className="transition-all duration-500"
```

This applies a 500ms transition to:
- Background color changes on hover
- Ring/border highlight on active state
- Any other CSS property changes

## Active State Highlighting

Cards indicate active state with background tint and ring:

```tsx
className={`${
  activeCardIndex === 0 
    ? 'bg-blue-500/5 ring-2 ring-blue-500/30 ring-inset' 
    : 'hover:bg-black-alpha-2'
}`}
```

## Best Practices

1. **Use consistent multipliers** - Try to maintain the same scaling ratio (e.g., 1.5x) across all properties
2. **Test all breakpoints** - Verify the design looks balanced at each breakpoint
3. **Mind the extremes** - Ensure text remains readable at smallest sizes
4. **Group related elements** - Keep related size classes on the same breakpoint pattern
5. **Document custom sizes** - Use comments for non-standard Tailwind values like `text-[11px]`

## Related Files

- `components/app/(home)/sections/landing/MainFeatures.tsx` - Primary implementation
- `styles/design-system/typography.css` - Typography scale reference
- `BREAKPOINTS.md` - Project breakpoint documentation

## Comparison with Alternatives

| Approach | Pros | Cons |
|----------|------|------|
| **This Pattern** | Full control, no JS needed, predictable | Manual maintenance, verbose |
| `transform: scale()` | Simple, single property | Blurry text, layout issues |
| Container Queries | Modern, context-aware | Browser support, complexity |
| CSS `clamp()` | Fluid scaling | Less precise control |

---

*Last updated: January 2026*

