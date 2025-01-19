'use client'

import { SidebarProvider, SidebarTrigger } from '@/components/core-ui/sidebar'
import { SideBar } from '@/components/ui/SideBar'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <SideBar />
      <main className="bg-secondary w-full">
        <div className="p-2">
          <SidebarTrigger />
        </div>
        {children}
      </main>
    </SidebarProvider>
  )
}
