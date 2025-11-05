import React, { useEffect, useState, act } from "react"
import { describe, it, expect, vi, afterEach } from "vitest"
import { createRoot } from "react-dom/client"
import { useDebounce } from "./useDebounce"

// Simple harness to render the hook and expose controls
function HookViewer(props: { value: unknown; time?: number }) {
  const debounced = useDebounce(props.value, props.time as number)
  return React.createElement(
    "span",
    { "data-testid": "out" },
    String(debounced),
  )
}

function TestHarness(props: {
  initialValue: unknown
  time?: number
  register: (api: { setValue: (v: unknown) => void }) => void
}) {
  const [val, setVal] = useState(props.initialValue)
  useEffect(() => {
    props.register({ setValue: setVal })
  }, [props])
  return React.createElement(HookViewer, { value: val, time: props.time })
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.clearAllMocks()
  vi.useRealTimers()
})

describe("useDebounce", () => {
  it("debounces value changes with default delay and resets timer on change", () => {
    vi.useFakeTimers()

    const container = document.createElement("div")
    document.body.appendChild(container)
    const root = createRoot(container)

    let controls: { setValue: (v: unknown) => void } | null = null

    act(() => {
      root.render(
        React.createElement(TestHarness, {
          initialValue: "a",
          // no time provided -> default 200ms inside hook
          register: (api) => {
            controls = api
          },
        }),
      )
    })

    const getOutput = () =>
      container.querySelector('[data-testid="out"]')?.textContent

    expect(getOutput()).toBe("a")

    // Change value: should not update immediately
    act(() => controls!.setValue("b"))
    expect(getOutput()).toBe("a")

    // Advance just before default delay
    act(() => {
      vi.advanceTimersByTime(199)
    })
    expect(getOutput()).toBe("a")

    // Change again before timer fires to ensure reset
    act(() => controls!.setValue("c"))
    expect(getOutput()).toBe("a")

    // Still not updated before 200ms from last change
    act(() => {
      vi.advanceTimersByTime(199)
    })
    expect(getOutput()).toBe("a")

    // Now after full debounce period from latest change
    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(getOutput()).toBe("c")

    act(() => root.unmount())
  })

  it("uses custom delay when provided", () => {
    vi.useFakeTimers()

    const container = document.createElement("div")
    document.body.appendChild(container)
    const root = createRoot(container)

    let controls: { setValue: (v: unknown) => void } | null = null

    act(() => {
      root.render(
        React.createElement(TestHarness, {
          initialValue: 1,
          time: 500,
          register: (api) => {
            controls = api
          },
        }),
      )
    })

    const getOutput = () =>
      container.querySelector('[data-testid="out"]')?.textContent

    expect(getOutput()).toBe("1")

    act(() => controls!.setValue(2))
    expect(getOutput()).toBe("1")

    act(() => {
      vi.advanceTimersByTime(499)
    })
    expect(getOutput()).toBe("1")

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(getOutput()).toBe("2")

    act(() => root.unmount())
  })

  it("cleans up pending timeout on unmount", () => {
    vi.useFakeTimers()
    const clearSpy = vi.spyOn(globalThis, "clearTimeout")

    const container = document.createElement("div")
    document.body.appendChild(container)
    const root = createRoot(container)

    let controls: { setValue: (v: unknown) => void } | null = null

    act(() => {
      root.render(
        React.createElement(TestHarness, {
          initialValue: "x",
          time: 300,
          register: (api) => {
            controls = api
          },
        }),
      )
    })

    // Schedule a debounced update
    act(() => controls!.setValue("y"))
    // Unmount before the timer fires
    act(() => root.unmount())

    // Advancing timers should not cause state updates, and clearTimeout should be called
    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(clearSpy).toHaveBeenCalled()
  })
})
