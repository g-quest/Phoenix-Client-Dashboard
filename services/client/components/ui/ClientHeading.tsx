import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/core-ui/avatar'

import { Mail, Phone, LayoutList } from 'lucide-react'

export default function ClientHeading({ client }) {
  // Utility function to get initials from a name
  const getInitials = (name) => {
    if (!name) return ''
    const nameParts = name.split(' ')
    return nameParts
      .map((part) => part[0])
      .join('')
      .toUpperCase()
  }

  return (
    <div className={`mb-8 p-4 border-b-2 w-full`}>
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src="" />
          <AvatarFallback className="bg-primary text-white">
            {getInitials(client?.name)}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-4xl font-bold">{client?.name}</h1>
      </div>
      <div className="text-sm space-y-4 mt-4">
        <div className="flex items-center gap-2">
          <Mail />
          <p>{client?.poc_email}: email@company.com</p>
        </div>
        <div className="flex items-center gap-2">
          <Phone />
          <p>{client?.poc_phone}: 888-888-8888</p>
        </div>
        <div className="flex items-center gap-2">
          <LayoutList />
          <p>TODO: Add other required fields</p>
        </div>
      </div>
    </div>
  )
}
