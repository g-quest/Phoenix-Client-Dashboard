export default function Section({
  children,
  background = 'bg-white',
}: {
  children: React.ReactNode
  background?: string
}) {
  return (
    <div
      className={`mb-8 flex flex-col items-center justify-center ${background} py-12 px-4 rounded-2xl`}
    >
      {children}
    </div>
  )
}
