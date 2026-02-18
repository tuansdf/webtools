# GEMINI.md

## Description

A React SPA template built with **Vite**, **Mantine v8**, and **React Router v7**. It provides a pre-configured foundation with theming, CSS Modules, notifications, modals, date pickers, and file dropzone — ready to scaffold new projects quickly.

## Tech Stack

| Layer      | Technology                           | Version |
| ---------- | ------------------------------------ | ------- |
| Framework  | React                                | 19      |
| Build Tool | Vite                                 | 7       |
| UI Library | Mantine                              | 8       |
| Routing    | React Router                         | 7       |
| Language   | TypeScript                           | 5.9     |
| Styling    | CSS Modules + PostCSS Mantine preset |         |
| Icons      | Tabler Icons React                   | 3       |
| Date Util  | Day.js                               | 1       |
| Formatter  | Prettier                             | 3       |
| Linting    | ESLint (flat config)                 | 9       |

## Packages

### Dependencies

| Package                  | Purpose                                 |
| ------------------------ | --------------------------------------- |
| `@mantine/core`          | Core UI components and theming          |
| `@mantine/dates`         | Date/time pickers and calendar          |
| `@mantine/dropzone`      | Drag-and-drop file upload               |
| `@mantine/hooks`         | Collection of React hooks               |
| `@mantine/modals`        | Centralized modal manager               |
| `@mantine/notifications` | Toast notification system               |
| `@tabler/icons-react`    | Icon set designed for Mantine           |
| `dayjs`                  | Lightweight date utility (Mantine peer) |
| `react` / `react-dom`    | React 19                                |
| `react-router`           | Client-side routing                     |

### Dev Dependencies

| Package                                                                | Purpose                                                          |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `@vitejs/plugin-react`                                                 | Vite React plugin (SWC / Babel)                                  |
| `postcss-preset-mantine`                                               | Mantine PostCSS utilities (`light-dark()`, `@mixin hover`, etc.) |
| `postcss-simple-vars`                                                  | CSS variables for Mantine breakpoints                            |
| `typescript` / `typescript-eslint`                                     | Type checking and lint rules                                     |
| `eslint` / `eslint-plugin-react-hooks` / `eslint-plugin-react-refresh` | Linting                                                          |
| `prettier`                                                             | Code formatting                                                  |

## Commands

```bash
pnpm dev        # Start Vite dev server
pnpm build      # Type-check then build for production
pnpm preview    # Preview the production build locally
pnpm typecheck  # Run TypeScript type checking (no emit)
pnpm lint       # Run ESLint
pnpm check      # Typecheck + Prettier fix + ESLint fix (all-in-one)
```

## Project Structure

```
src/
├── main.tsx                   # Entry point — renders <App /> into DOM
├── app.tsx                    # Root component — MantineProvider wraps RouterProvider
├── index.css                  # Global styles (currently empty)
├── lib/
│   ├── mantine-provider.tsx   # Mantine theme config + style imports
│   └── router-provider.tsx    # React Router config (createBrowserRouter)
└── routes/
    ├── home.tsx               # Home page component
    └── home.module.css        # Scoped styles for Home
```

**Path alias**: `@` → `src/` (configured in `vite.config.ts` and `tsconfig.app.json`).

## Conventions

### React

- **Functional components only** — no class components.
- **Named exports** for reusable components; **default exports** for route pages.
- Use `PropsWithChildren` from React when a component only passes through children.
- Prefer **Mantine hooks** (`@mantine/hooks`) over hand-rolling custom hooks for common patterns (debounce, clipboard, local storage, media queries, etc.).
- Use `@tabler/icons-react` for all iconography — they are designed to pair with Mantine.

### Import Order

Follow the [TanStack ESLint import rules](https://github.com/TanStack/config/blob/main/packages/eslint-config/src/import.ts). Imports must be ordered by group, with a newline after the import block:

1. **Side-effect** — e.g. `import "./index.css";`, `import "@mantine/core/styles.css";`
2. **Builtin** — Node built-ins (`path`, `fs`, etc.)
3. **External** — third-party packages (`react`, `@mantine/core`, `react-router`, etc.)
4. **Internal** — project aliases (`@/lib/...`, `@/routes/...`)
5. **Parent** — relative parent imports (`../`)
6. **Sibling** — relative sibling imports (`./`)
7. **Index** — index file imports (`.`)
8. **Type** — type-only imports (`import type { ... }`)

Additional rules:

- **`import type` must be top-level** — use `import type { Foo }` instead of `import { type Foo }` (`consistent-type-specifier-style: prefer-top-level`).
- **No duplicate imports** — merge imports from the same module into one statement.
- **No `require()` / `module.exports`** — ESM only (`import` / `export`).
- **Imports come first** — no statements before import declarations.

Example:

```tsx
import "@mantine/core/styles.css";

import { useState } from "react";
import { Button, Group } from "@mantine/core";

import { MantineProvider } from "@/lib/mantine-provider";

import classes from "./home.module.css";

import type { PropsWithChildren } from "react";
```

### Routing

- Routes are defined in `src/lib/router-provider.tsx` using `createBrowserRouter`.
- Route page components live in `src/routes/`.
- Each route page should have a co-located `*.module.css` file for its styles.

### Styling (CSS Modules)

CSS Modules is the **primary and recommended** styling approach in this project. It is the most performant way — generating static CSS that is never re-evaluated at runtime.

#### File naming

- Co-locate styles with their component: `component.tsx` + `component.module.css`.
- Import as: `import classes from "./component.module.css";`

#### Using Mantine CSS variables in modules

Reference the Mantine theme through CSS variables — **do not hardcode colors, spacing, or fonts**:

```css
.card {
  background-color: var(--mantine-color-body);
  color: var(--mantine-color-text);
  padding: var(--mantine-spacing-md);
  border-radius: var(--mantine-radius-md);
  font-family: var(--mantine-font-family);
}
```

Common variable patterns:

- **Colors**: `var(--mantine-color-{color}-{shade})` — e.g. `var(--mantine-color-blue-6)`
- **Primary color**: `var(--mantine-primary-color-filled)`, `var(--mantine-primary-color-light)`, `var(--mantine-primary-color-{0-9})`
- **Semantic colors**: `var(--mantine-color-text)`, `var(--mantine-color-body)`, `var(--mantine-color-dimmed)`, `var(--mantine-color-bright)`, `var(--mantine-color-anchor)`, `var(--mantine-color-error)`, `var(--mantine-color-placeholder)`
- **Default variant**: `var(--mantine-color-default)`, `var(--mantine-color-default-hover)`, `var(--mantine-color-default-color)`, `var(--mantine-color-default-border)`
- **Spacing**: `var(--mantine-spacing-{xs|sm|md|lg|xl})` — defaults: xs=10px, sm=12px, md=16px, lg=20px, xl=32px
- **Radius**: `var(--mantine-radius-{xs|sm|md|lg|xl})`, `var(--mantine-radius-default)`
- **Shadows**: `var(--mantine-shadow-{xs|sm|md|lg|xl})`
- **Font family**: `var(--mantine-font-family)`, `var(--mantine-font-family-headings)`, `var(--mantine-font-family-monospace)`
- **Font size**: `var(--mantine-font-size-{xs|sm|md|lg|xl})`
- **Line height**: `var(--mantine-line-height-{xs|sm|md|lg|xl})`

#### Dark / light mode

Use the `light-dark()` function from `postcss-preset-mantine`:

```css
.card {
  background-color: light-dark(var(--mantine-color-white), var(--mantine-color-dark-7));
  color: light-dark(var(--mantine-color-black), var(--mantine-color-white));
}
```

Alternatively, use `@mixin light` / `@mixin dark` for block-level overrides:

```css
.card {
  /* Light scheme default */
  color: red;

  @mixin dark {
    /* Dark scheme override */
    color: blue;
  }
}
```

> **Note**: `light-dark()` does NOT work on `:root`/`html`. Use `@mixin light-root` / `@mixin dark-root` instead.

#### Hover states

Use the `@mixin hover` from `postcss-preset-mantine` (works correctly on touch devices — uses `@media (hover: hover)` and falls back to `:active` on touch):

```css
.button {
  @mixin hover {
    background-color: var(--mantine-color-blue-7);
  }
}
```

#### Responsive breakpoints

Breakpoints are available as PostCSS variables (defined in `postcss.config.cjs`):

```css
.grid {
  display: grid;
  grid-template-columns: 1fr;

  @media (min-width: $mantine-breakpoint-sm) {
    grid-template-columns: 1fr 1fr;
  }
}
```

You can also use the `smaller-than` / `larger-than` mixins:

```css
.demo {
  @mixin smaller-than $mantine-breakpoint-sm {
    font-size: var(--mantine-font-size-sm);
  }

  @mixin larger-than $mantine-breakpoint-sm {
    font-size: var(--mantine-font-size-lg);
  }
}
```

All Mantine components also support `hiddenFrom` and `visibleFrom` props:

```tsx
<Button hiddenFrom="sm">Mobile only</Button>
<Button visibleFrom="sm">Desktop only</Button>
```

#### rem / em units

Use the `rem()` function from `postcss-preset-mantine` to convert `px` to `rem` (16px = 1rem). Use `em()` for media queries. Mantine uses `rem` units internally — avoid raw `px` values.

```css
.demo {
  font-size: rem(16px);

  @media (min-width: em(320px)) {
    font-size: rem(32px);
  }
}
```

#### Color functions (PostCSS)

```css
.demo {
  /* Alpha transparency */
  color: alpha(var(--mantine-color-red-4), 0.5);

  /* Lighten / darken (uses color-mix) */
  background: lighten(var(--mantine-color-blue-6), 0.3);
  border-color: darken(#ffc, 0.2);
}
```

#### Styling Mantine component internals (Styles API)

Use the `classNames` prop to target inner elements via the Styles API:

```tsx
<TextInput
  classNames={{
    root: classes.inputRoot,
    input: classes.input,
    label: classes.label,
  }}
/>
```

Each component documents its available selectors (e.g. Button has `root`, `inner`, `label`, `section`, `loader`). Check the **Styles API** tab in component docs.

You can also set `classNames` globally in `theme.components`:

```tsx
const theme = createTheme({
  components: {
    TextInput: TextInput.extend({
      classNames: {
        root: classes.root,
        input: classes.input,
        label: classes.label,
      },
    }),
  },
});
```

#### Data attributes for conditional styling

Mantine components expose `data-*` attributes for state (e.g. `data-disabled`, `data-active`, `data-position`). Use them in CSS Modules:

```css
.button {
  color: var(--mantine-color-black);

  &[data-disabled] {
    color: var(--mantine-color-gray-5);
  }
}
```

The `mod` prop adds custom data attributes to any component:

```tsx
<Box mod={{ orientation: "horizontal" }} />
// → <div data-orientation="horizontal" />
```

#### Global class references

Use `:global` selector in CSS Modules when you need to reference a non-scoped class:

```css
.wrapper {
  & :global(.mantine-Text-root) {
    font-weight: 700;
  }
}
```

### Theme & Styling Rules (Mantine)

1. **Always prefer Mantine components** — use `<Button>`, `<TextInput>`, `<Stack>`, `<Group>`, `<Paper>`, `<Text>`, `<Title>`, etc. over raw HTML elements whenever possible.
2. **Theme customization lives in `src/lib/mantine-provider.tsx`** — use `createTheme()` to configure colors, fonts, default props, component overrides, and other theme tokens.
3. **Never hardcode colors** — always reference Mantine CSS variables or use component props (`color`, `variant`). This ensures dark/light mode compatibility.
4. **Use component-specific props first** (`color`, `variant`, `size`, `radius`) — they handle multiple CSS properties at once and respect the theme.
5. **Style props for minor tweaks** (`mt`, `p`, `c`, `fz`, etc.) — limit to 3-4 per component. If more are needed, extract to a CSS Module. Style props generate inline styles and are less performant at scale.
6. **CSS Modules for complex styling** — anything beyond simple props should go in a `.module.css` file using Mantine CSS variables.
7. **Do not use inline `style` / `styles` as a primary styling method** — they have higher specificity than classes (hard to override without `!important`), styles are not reused between components, and they can increase HTML size. Reserve for one-off CSS properties or setting CSS variables.
8. **Use `rem` / Mantine spacing** — avoid `px` for spacing values. Mantine uses `rem` units internally; the `postcss-preset-mantine` provides `rem()` and `em()` functions.

#### Colors

- Custom colors require **exactly 10 shades** (index 0–9). Use the [Mantine colors generator](https://mantine.dev/colors-generator) if you only have one value.
- Set `theme.primaryColor` to a **key** of `theme.colors` (not a CSS value). It determines the default color for most components.
- `theme.primaryShade` (0–9) controls which shade is used by default. Can differ for light/dark: `{ light: 6, dark: 8 }`.
- The `color` prop on components accepts: a theme color key (`"blue"`), a key with index (`"blue.5"`), or a raw CSS color (`"#fff"`).
- **`color` vs `c` prop**: `color` controls multiple properties (background, text, border). `c` is a style prop that only sets CSS `color`. Combine them for contrast: `<Button color="#C3FF36" c="black">`.
- Use `virtualColor()` for colors that differ between light/dark schemes automatically.
- Supported formats: HEX, RGB/RGBA, HSL/HSLA, OKLCH.

#### Color Schemes

- Use `useMantineColorScheme()` hook: provides `colorScheme`, `setColorScheme("light" | "dark" | "auto")`, `toggleColorScheme()`, `clearColorScheme()`.
- Use `useComputedColorScheme("light")` for the resolved value (always `"light"` or `"dark"`, never `"auto"`) — use this for toggle logic.
- `lightHidden` / `darkHidden` props hide components based on color scheme.
- Set `defaultColorScheme` on `MantineProvider` (default: `"light"`). Use `forceColorScheme` to lock it.

#### Default Props

- Set default props for any Mantine component globally via `theme.components`:

```tsx
const theme = createTheme({
  components: {
    Button: Button.extend({
      defaultProps: {
        color: "cyan",
        variant: "outline",
      },
    }),
  },
});
```

- For compound components, omit the dot: `MenuItem` (not `Menu.Item`), `TabsList` (not `Tabs.List`).
- Use `Component.withProps({...})` for inline component variants: `const LinkButton = Button.withProps({ component: "a", variant: "subtle" })`.

#### Custom Variants & Sizes

- Use `theme.variantColorResolver` to customize how colors are resolved for built-in variants or to add entirely new variants (e.g. `"danger"`).
- Add custom sizes via the `vars` resolver in `theme.components`:

```tsx
Button: Button.extend({
  vars: (theme, props) => {
    if (props.size === "xxl") {
      return {
        root: {
          "--button-height": "60px",
          "--button-padding-x": "30px",
          "--button-fz": "24px",
        },
      };
    }
    return { root: {} };
  },
}),
```

#### Responsive Style Props

- Style props support responsive object syntax: `w={{ base: 200, sm: 400, lg: 500 }}`.
- **Use sparingly** — responsive style props are less performant than static CSS Modules with media queries. Avoid in large lists.

#### Performance Hierarchy (best → worst)

1. **CSS Modules** (`className` / `classNames`) — static CSS, never re-evaluated ✅
2. **Inline styles** (`style` / `styles`) — acceptable but not reused across instances
3. **Style props** (`mt`, `p`, `c`, etc.) — fine for 1–3 props, avoid in bulk
4. **Responsive style props** (`w={{ base: 200, sm: 400 }}`) — avoid in large lists

### Formatting

Enforced via Prettier (`.prettierrc`):

- Print width: 100
- Tab width: 2, spaces (no tabs)
- Semicolons: yes
- Quotes: double
- Trailing commas: all
