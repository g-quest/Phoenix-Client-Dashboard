'use client'

import { UserPlus2 } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/core-ui/sidebar'
import { Separator } from '@/components/core-ui/separator'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useClientContext } from '@/context/ClientContext'

const internals = [
  {
    title: 'Add Client',
    url: '/internal/add-client',
    icon: UserPlus2,
  },
]

export function SideBar() {
  const [clients, setClients] = useState([])
  const { refreshClients } = useClientContext()

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/v1/client/`,
        )
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        setClients(data)
      } catch (error) {
        console.error('Failed to fetch clients:', error)
      }
    }

    fetchClients()
  }, [refreshClients])

  return (
    <Sidebar>
      <Separator />
      <SidebarContent>
        {clients.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Clients</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {clients
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((item) => (
                    <SidebarMenuItem key={item.slug}>
                      <SidebarMenuButton asChild>
                        <Link href={`/clients/${item.slug}`}>
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        <SidebarGroup>
          <SidebarGroupLabel>Internal Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {internals.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
