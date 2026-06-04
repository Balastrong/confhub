import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import * as React from "react"
import { Button } from "~/components/ui/button"

const streamSentence = createServerFn().handler(async function* () {
  const words =
    "TanStack Start streams data from server to client with zero extra setup, just a server function with a generator".split(
      " ",
    )
  for (const word of words) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    yield word
  }
})

export const Route = createFileRoute("/demo/streaming")({
  component: StreamingDemo,
})

function StreamingDemo() {
  const [words, setWords] = React.useState<string[]>([])
  const [streaming, setStreaming] = React.useState(false)

  async function start() {
    setWords([])
    setStreaming(true)
    const stream = await streamSentence()
    for await (const word of stream) {
      setWords((prev) => [...prev, word])
    }
    setStreaming(false)
  }

  return (
    <div className="p-8">
      <Button onClick={start} disabled={streaming}>
        {streaming ? "Streaming..." : "Start stream"}
      </Button>
      <p className="mt-4 text-2xl">{words.join(" ")}</p>
    </div>
  )
}
