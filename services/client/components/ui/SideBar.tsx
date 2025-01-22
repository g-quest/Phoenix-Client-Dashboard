import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  Upload,
  Plus,
  UserPlus2,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/core-ui/sidebar'
import { Separator } from '@/components/core-ui/separator'

const internals = [
  {
    title: 'Add Client',
    url: '/internal/add-client',
    icon: UserPlus2,
  },
  {
    title: 'CSV Uploader',
    url: '/',
    icon: Upload,
  },
]

const clients = [
  {
    name: 'Humanity Protocol',
    url: '/clients/humanity-protocol',
  },
  {
    name: 'io.net',
    url: '/clients/io-net',
  },
]

export function SideBar() {
  return (
    <Sidebar>
      {/* <SidebarHeader /> */}
      <Separator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Clients</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {clients.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
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
      {/* <SidebarFooter /> */}
    </Sidebar>
  )
}
