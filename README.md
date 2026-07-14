# Product Explorer

An Amazon-style product listing & detail app built for the Leegality Frontend Engineer Assessment, using the [DummyJSON Products API](https://dummyjson.com/docs/products).

**Stack:** React 18 · TypeScript · MobX (`mobx` + `mobx-react-lite`) · MUI 6 · React Router 6 · Vite · Yarn

---

## 1. Setup Instructions

### Prerequisites
- Node.js 18+
- Yarn (`npm install -g yarn` if you don't have it)

### Install & run
```bash
yarn install
yarn dev
```
The app runs at `http://localhost:5173`.

### Other scripts
```bash
yarn build      # type-checks and builds a production bundle to dist/
yarn preview    # serves the production build locally
yarn lint       # runs ESLint
```

No environment variables or backend are required — the app talks directly to `https://dummyjson.com`.

---

## 2. Project Structure

```
src/
  api/            Thin axios wrapper around the DummyJSON endpoints
  components/     Presentational + observer components (cards, filters, states)
  pages/          Route-level screens: listing and detail
  stores/         MobX ProductStore (single source of truth) + React context
  theme/          MUI theme (palette, typography, component overrides)
  types/          Shared TypeScript interfaces
```

State management: a single `ProductStore` class (MobX, `makeAutoObservable`) is
provided via React Context (`stores/StoreContext.tsx`) and consumed with
`mobx-react-lite`'s `observer()` HOC — no prop drilling, and components only
re-render when the observables they actually read change.

---

## 3. Assumptions Made

- **Filtering is combined and client-side.** DummyJSON can filter by category
  server-side (`/products/category/:slug`) but not by price or brand at the
  same time. So the app fetches the full product set for the active category
  (`?limit=0`) once, then applies price/brand/search/sort filtering and
  pagination entirely in the browser via MobX computeds. This is what makes
  "filters work together" and "update immediately" both true without extra
  round trips per keystroke.
- **Brands are derived from the currently loaded category's products**, not
  the entire catalogue, since the brief asks to "extract unique brands from
  fetched products." Switching category refreshes the brand list accordingly.
- **Brand filtering is multi-select** (checkboxes), since the brief allows
  either single or multi-select and multi gives users more control.
- **Page size is fixed at 12** products per page (not specified in the brief).
- **The `/products/categories` response shape** has changed between DummyJSON
  versions (plain `string[]` vs. `{slug,name,url}[]`); the API layer
  normalizes both so the app doesn't break either way.
- A lightweight **search box** in the header was added on top of the
  mandatory filters — it's client-side only and treated as a bonus, not a
  replacement for any required filter.

---

## 4. Architectural Decisions

- **MobX over Redux/Context+useReducer:** the brief calls for state
  management explicitly; MobX's observable classes keep derived filtering
  logic (available brands, filtered list, pagination) as plain `get` computed
  properties instead of hand-written selectors/memoization.
- **Filters live in the store, mirrored to the URL query string**
  (`ProductListingPage`), rather than the other way around. This gives:
  - Deep-linkable/shareable filtered views.
  - "Back preserves filters" for free — the product card links to
    `/product/:id?<current filters>`, and the Back button on the detail page
    returns to `/?<those same filters>`, which the listing page re-hydrates
    from on mount.
- **One `ProductStore`, not one-per-page:** listing and detail state share a
  store instance so there's a single place to reason about loading/error
  state, even though today they don't share data.
- **MUI over a custom design system:** the brief explicitly allows/encourages
  a component library; MUI's `Grid2`, theming, and form controls covered every
  requirement (responsive grid, filters, pagination, chips) without extra
  dependencies.
- **Responsive strategy:** filters live in a sticky sidebar on `md+` and in a
  slide-over `Drawer` on mobile; the product grid uses MUI's responsive
  `Grid2` breakpoints (2 columns on phones up to 4 on large desktops).
- **Loading/error/empty states are separated** into their own components
  (`LoadingGrid`, `ErrorState`, `EmptyState`) so each screen can compose them
  without duplicating markup.

---

## 5. Improvements With More Time

- Debounce the search input and price fields to cut down on redundant
  re-computation while typing (currently cheap enough not to matter at this
  data scale, but wouldn't scale to a much larger catalogue).
- Move filtering/pagination to the server if the API supported combined
  query params, to avoid loading an entire category's products up front.
- Add unit tests for `ProductStore` (filter combinations, pagination math)
  and component tests for the listing/detail pages (React Testing Library).
- Add a price-range slider alongside the numeric inputs, and a "no results"
  illustration.
- Persist recently viewed products and add a wishlist, using the same MobX
  store pattern.
- Add skeleton/error boundaries at the route level and basic analytics
  events (filter usage, product clicks).

---

## Submission

- **GitHub repository:** _add your repo link here_
- **Demo link:** _add your deployed link here (e.g. Vercel/Netlify) — `yarn build` output in `dist/` is static and deploys anywhere_
