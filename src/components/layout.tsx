export const Layout = ({
  children,
  className,
}: {
  className?: string
  children: React.ReactNode
}) => {
  return (
    <main className={`flex flex-col max-w-6xl mx-auto p-4 ${className}`}>
      {children}
    </main>
  )
}
