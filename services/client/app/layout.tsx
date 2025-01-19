import { Metadata } from 'next'
import '@/styles/globals.css'

import ClientLayout from './ClientLayout'
import NavBar from '@/components/ui/NavBar'

export const metadata: Metadata = {
  title: 'Phoenix Client Insights Dashboard',
  description:
    'The Client Insights Dashboard is a comprehensive tool designed to empower clients by gathering and analyzing actionable insights from their social platforms, such as Twitter and Discord',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <div className="relative">
          <ClientLayout>{children}</ClientLayout>
        </div>
      </body>
    </html>
  )
}
