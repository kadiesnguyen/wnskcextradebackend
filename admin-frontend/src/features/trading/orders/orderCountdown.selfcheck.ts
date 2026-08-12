/**
 * ponytail: self-check for order countdown helpers (no test runner required).
 * Run: npx --yes tsx src/features/trading/orders/orderCountdown.selfcheck.ts
 */
import {
  orderDurationSeconds,
  orderRemainingSeconds,
} from "./OrderCountdown";

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

const now = 1_700_000_000_000; // fixed ms

assert(orderDurationSeconds({ time: 1 }) === 60, "1 min -> 60s");
assert(orderDurationSeconds({ time: 3 }) === 180, "3 min -> 180s");
assert(orderDurationSeconds({ time: 0 }) === 0, "0 min -> 0s");

assert(
  orderRemainingSeconds(
    { status: 1, intselltime: Math.floor(now / 1000) + 45, selltime: null },
    now,
  ) === 45,
  "intselltime remaining",
);

assert(
  orderRemainingSeconds(
    { status: 2, intselltime: Math.floor(now / 1000) + 45, selltime: null },
    now,
  ) === 0,
  "settled -> 0",
);

assert(
  orderRemainingSeconds(
    {
      status: 1,
      intselltime: 0,
      selltime: new Date(now + 30_000).toISOString(),
    },
    now,
  ) === 30,
  "selltime fallback (iso)",
);

console.log("orderCountdown.selfcheck: ok");
