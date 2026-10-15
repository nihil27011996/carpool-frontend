# Carpool frontend

React 18 application for driver and rider registration, profiles, ride creation, matching, requests, and trip history. Uses Redux Toolkit with redux-persist, React Router, Google Maps, and Firebase Storage.

## Run locally

1. Run `npm ci`.
2. Copy `.env.example` to `.env` and fill in the Google Maps and Firebase settings.
3. Start the separate backend and set `REACT_APP_BACKEND_URL` to its origin (for example `http://localhost:9000`, without `/carpool/v1`).
4. Run `npm start`.

`npm test -- --watchAll=false --runInBand` runs the regression tests. `npm run build` creates the production bundle. Configure hosting to serve `index.html` for frontend routes.

## Application flow

`src/index.js` supplies the persisted Redux store. `src/CarpoolApplication.js` defines public pages and nested role-protected pages. `src/Utils/session.js` validates the session and clears browser storage and Redux state on logout or expiration. Existing sessions require a matching token, persisted authentication, and an unexpired session timestamp.

Drivers create rides with locations, pickup time, seats, and total fare. Riders search by route, pickup time, and seats. Matching retains the original combined pickup/destination distance limit of 5 km, requires enough seats and a positive fare, and allows pickup times within one hour. These are frontend matching rules; capacity and pricing must also be enforced by the backend.

Profiles use the backend's public `UserId` identifier (`userId` in the login response); ride references use the MongoDB identifier (`id` in the login response). Requests use `RequestId` for approval decisions. Trip lists use the current `/carpool/v1/rideRequest` API instead of obsolete `/riderOrders` endpoints.

## Backend integration gaps

The adjacent backend was inspected but not modified as part of this frontend change:

- Its request decision route declares `:RequestId`, but `updateRideRequest` reads `request.params.RideRequestId`. Fix that mismatch before approval/rejection can succeed. The frontend sends `{ commuterStatus: "approved" | "rejected" }` and treats a null response as failure.
- Approval must reserve seats atomically on the server. Its current decision service only changes request status.
- No payment route is registered in the inspected backend. Checkout requires `REACT_APP_STRIPE_PUBLISHABLE_KEY`, a numeric ride fare, and a working payment service. The payment service must verify the fare from the ride and confirm payment before returning `{ success: true }`. The bare `/payment` page has no fare and therefore does not offer checkout. No real payment was exercised during validation.
- The request collection endpoint does not implement rider filtering. Rider trip history filters the returned records for display; server-side ownership checks and filtering remain necessary.
- Rating and trip-completion controls from the obsolete orders API are not part of the current trip list. Those features need a supported backend contract.

## Configuration

All `REACT_APP_*` values are included in the browser bundle. Use browser-restricted Google Maps keys and appropriate Firebase Storage rules. `.env` is ignored for future additions, but the existing file was already tracked; adding an ignore rule does not remove it from Git history. The hardcoded key in the unused matching prototype has been replaced with environment configuration.

The test suite uses mocked services; a passing build does not verify live backend, Firebase, Maps, Stripe, or email delivery.
