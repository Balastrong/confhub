// @vitest-environment jsdom

import React, { act } from "react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { createRoot } from "react-dom/client"

import { useDebounce } from "./useDebounce"

function TestComponent(props: { value: unknown; time?: number }) {
  const debounced = useDebounce(props.value, props.time as number)
  return React.createElement(
    "div",
    { "data-testid": "value" },
    String(debounced as unknown as string),
  )
}

function setup(initialValue: unknown, time?: number) {
  const container = document.createElement("div")
  document.body.appendChild(container)
  const root = createRoot(container)

  const renderWith = (value: unknown, t?: number) =>
    React.createElement(TestComponent, { value, time: t })

  act(() => {
    root.render(renderWith(initialValue, time))
  })

  return {
    container,
    root,
    rerender: (value: unknown, t?: number) =>
      act(() => {
        root.render(renderWith(value, t))
      }),
    unmount: () =>
      act(() => {
        root.unmount()
        container.remove()
      }),
    getValueText: () =>
      (container.querySelector('[data-testid="value"]') as HTMLElement)
        ?.textContent || "",
  }
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.clearAllMocks()
  vi.useRealTimers()
})

describe("useDebounce", () => {
  it("returns the initial value immediately and updates after default delay", () => {
    vi.useFakeTimers()
    const { getValueText, rerender, unmount } = setup("a")

    expect(getValueText()).toBe("a")

    rerender("b")
    expect(getValueText()).toBe("a")

    vi.advanceTimersByTime(199)
    expect(getValueText()).toBe("a")

    vi.advanceTimersByTime(1)
    expect(getValueText()).toBe("b")

    unmount()
  })

  it("respects a custom debounce time", () => {
    vi.useFakeTimers()
    const { getValueText, rerender, unmount } = setup("x", 50)

    expect(getValueText()).toBe("x")
    rerender("y", 50)

    vi.advanceTimersByTime(49)
    expect(getValueText()).toBe("x")

    vi.advanceTimersByTime(1)
    expect(getValueText()).toBe("y")

    unmount()
  })

  it("updates only with the last value after rapid changes", () => {
    vi.useFakeTimers()
    const { getValueText, rerender, unmount } = setup("1", 100)

    rerender("2", 100)
    vi.advanceTimersByTime(50)
    rerender("3", 100)
    vi.advanceTimersByTime(50)
    // Still within the latest debounce window
    expect(getValueText()).toBe("1")

    vi.advanceTimersByTime(100)
    expect(getValueText()).toBe("3")

    unmount()
  })

  it("cleans up pending timers on unmount (no stray timers)", () => {
    vi.useFakeTimers()
    const { rerender, unmount } = setup("start", 200)

    rerender("next", 200)
    // Unmount before the debounce elapses
    unmount()

    // If cleanup ran, there should be no pending timers left
    expect(vi.getTimerCount()).toBe(0)
  })
})
