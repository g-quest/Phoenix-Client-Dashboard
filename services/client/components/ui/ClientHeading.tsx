import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/core-ui/avatar'

export default function ClientHeading({ client }) {
  const getInitials = (name) => {
    if (!name) return ''
    const nameParts = name.split(' ')
    return nameParts
      .map((part) => part[0])
      .join('')
      .toUpperCase()
  }

  return (
    <div className={`mb-8 px-4 pb-8 border-b-2 w-full`}>
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src="" />
          <AvatarFallback className="bg-primary text-white">
            {getInitials(client?.name)}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-4xl font-bold">{client?.name}</h1>
      </div>
    </div>
  )
}
