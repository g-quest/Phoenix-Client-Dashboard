import { Metadata } from 'next'
import '@/styles/globals.css'

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
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lilita+One&family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background">
        <main>{children}</main>
      </body>
    </html>
  )
}
