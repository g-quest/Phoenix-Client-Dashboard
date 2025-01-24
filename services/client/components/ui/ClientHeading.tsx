export default function ClientHeading({ client }) {
  return (
    <div className={`mb-8 bg-white p-4 rounded-2xl w-[650px]`}>
      <h1 className="text-2xl font-bold text-center">{client?.name}</h1>
    </div>
  )
}
