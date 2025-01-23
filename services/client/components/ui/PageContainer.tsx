export default function PageContainer({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className={`mb-8 flex flex-col items-center justify-center py-12 px-4`}
    >
      {children}
    </div>
  )
}
