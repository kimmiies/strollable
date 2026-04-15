# Bug Fix: Establishment Detail Card on Map View (Mobile)

## Context
Strollable is a mobile-first web app (React/TypeScript, Tailwind, Vite). On the Explore/map view, tapping an establishment marker opens a detail card (preview card that slides up from the bottom). There are two bugs with this card on mobile.

## Bug 1: Card is cut off by the top nav
When the establishment detail card appears on the map view, its content is partially hidden behind or overlapping with the sticky top navigation bar. The card's positioning doesn't account for the nav height, so the top portion of the card is clipped or obscured.

**Expected:** The card should be fully visible below the top nav, with no overlap or clipping.

**Fix direction:** Check the card's positioning (likely `position: fixed` or `absolute` with a `top` or `bottom` value). Make sure it respects the nav bar height — either by using a `top` offset that accounts for the nav, or by ensuring the card's `z-index` and layout don't cause it to render behind the nav. If the card slides up from the bottom, the issue may be its max-height extending behind the nav — add a `max-height: calc(100vh - [nav-height])` or similar constraint.

## Bug 2: Card persists after navigating to detail page and back
When a user taps the card to navigate to the full establishment detail page, then uses the back button to return to the map view, the establishment detail card is still visible (stuck open). It should be dismissed/closed when the user navigates away from the map view.

**Expected:** The card should be closed/hidden when the user navigates to the establishment detail page. When the user returns to the map view via back navigation, the card should not be visible — the user should see the clean map view.

**Fix direction:** 
- The card's open/visible state is likely managed by React state (e.g. `selectedEstablishment` or `showCard`). 
- When navigating to the detail page (via React Router or similar), reset this state — either in a `useEffect` cleanup, in the navigation handler, or by listening to route changes.
- Check if there's a `useEffect` in the map view component that should reset `selectedEstablishment` to `null` on unmount.
- If using React Router, a `useEffect(() => { return () => setSelectedEstablishment(null); }, [])` cleanup in the map component would fix this.

## Bug 3: Back button on establishment detail page should always return to Explore
The "Explore" back button in the top nav of the establishment detail page currently uses `window.history.back()` (or equivalent). This means if a user lands on the detail page from a shared link or deep link, the back button navigates outside the app entirely instead of returning to the map/explore view.

**Expected:** The back button should always navigate to the Explore (map) page, regardless of how the user arrived at the detail page.

**Fix direction:** Replace `window.history.back()` or `navigate(-1)` with an explicit route navigation like `navigate('/explore')` or `navigate('/')` — whichever route corresponds to the map view. This ensures deterministic behavior regardless of navigation history.

## How to verify
1. Open the app in mobile viewport (430px wide or use Chrome DevTools device mode)
2. Tap a marker on the map → card should appear fully visible, not clipped by nav
3. Tap the card to go to the detail page → navigate back → map should show with no card open
4. Back button on the detail page should always go to the Explore/map view, even if the detail page was opened directly via URL
