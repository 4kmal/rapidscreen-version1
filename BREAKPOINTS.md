# Screen Size Breakpoints

This document outlines the screen size breakpoints used across the RapidSkreen project.

## 1. Tailwind Custom Breakpoints
Defined in `tailwind.config.ts`. Use these with Tailwind utility prefixes (e.g., `md:block`) or CSS `@screen` directives.

| Breakpoint | Type | Width |
| :--- | :--- | :--- |
| `xs` | min-width | 390px |
| `xs-max` | max-width | 389px |
| `sm` | min-width | 576px |
| `sm-max` | max-width | 575px |
| `md` | min-width | 768px |
| `md-max` | max-width | 767px |
| `lg` | min-width | 996px |
| `lg-max` | max-width | 995px |
| `xl` | min-width | 1200px |
| `xl-max` | max-width | 1199px |

## 2. JavaScript / React Hooks
Used for conditional rendering and logic in components.

*   **`useIsMobile(breakpoint)`**:
    *   **Default:** `1024px`
    *   **File:** `components/hooks/use-is-mobile.tsx`
    *   **Logic:** Returns `true` if `window.innerWidth < breakpoint`.

## 3. Design System CSS (Standard Defaults)
Defined in `styles/design-system/`. These are hardcoded media queries following standard Tailwind defaults.

| Breakpoint | Location | Purpose |
| :--- | :--- | :--- |
| `640px` | `layout.css` | Container max-width |
| `768px` | `layout.css`, `body.css` | Container max-width; Reduced base font-size to 15px |
| `1024px` | `layout.css`, `fire.css` | Container max-width; Sidebar collapse; Mobile fire effect |
| `1280px` | `layout.css` | Container max-width |
| `1536px` | `layout.css`, `body.css` | Container max-width; Increased base font-size to 17px |

---
*Generated on: 2025-12-27*

