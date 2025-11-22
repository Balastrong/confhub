---
applyTo: "**/*.spec.ts, **/*.spec.tsx, **/*.test.ts, **/*.test.tsx"
---

# Vitest Test Guidelines

- Purpose: Write fast, deterministic unit tests focused on behavior.
- Structure: Use `describe` per unit and `it` per behavior; follow Arrange–Act–Assert.
- Isolation: No network/filesystem or env coupling; mock with `vi.mock`, `vi.fn`, `vi.spyOn`.
- Cleanup: In `afterEach`, call `vi.restoreAllMocks()`, `vi.clearAllMocks()`, and `vi.useRealTimers()`.
- Async: Always `await` promises; for React, use `await waitFor(...)` from `@testing-library/react`.
- Timers/Time: Use `vi.useFakeTimers()`, `vi.setSystemTime(...)`, `vi.advanceTimersByTime(...)`; revert to real timers after.
- React: Prefer `@testing-library/react`; assert on user-visible output (roles/text), not internals.
- If you don't need jsx, just test the logic without rendering a component.
- Assertions: Prefer explicit matchers (`toEqual`, `toStrictEqual`, `toHaveBeenCalledWith`); use snapshots sparingly.
- Coverage: Include happy path, edge cases, and at least one failure path.
- Hygiene: Don’t commit `it.only`/`describe.only` or skipped tests; keep tests under ~100ms locally.
- Naming/Placement: Keep tests near source using `.spec.ts(x)`/`.test.ts(x)`; name suites and tests clearly.
- import `act` from "react", not from "react-dom/test-utils".
