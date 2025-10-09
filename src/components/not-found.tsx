import { Button } from "./ui/button"

export const NotFoundComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <div className="text-6xl mb-4">😵</div>
      <h1 className="text-4xl font-bold  mb-2">404 - Not Found</h1>
      <p className="text-lg mb-8">The page you're looking for doesn't exist.</p>
      <Button
        onClick={() => window.history.back()}
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Go Back
      </Button>
    </div>
  )
}
