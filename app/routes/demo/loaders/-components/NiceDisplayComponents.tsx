import { getRouteApi } from "@tanstack/react-router"

const LoaderDemoApi = getRouteApi("/demo/loaders/blocking")

export const NiceDisplayComponent = () => {
  const data = LoaderDemoApi.useLoaderData()

  return (
    <div>
      <h1>Nice Display Component</h1>
      <p>The answer is: {data.theAnswer}</p>
    </div>
  )
}
