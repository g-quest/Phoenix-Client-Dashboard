import '@/styles/globals.css'
import theme from '@/styles/theme'
import { Metadata } from 'next'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import localFont from 'next/font/local'

const lilitaOne = localFont({
  src: '../public/fonts/LilitaOne-Regular.ttf',
  display: 'swap',
  variable: '--font-lilita-one',
})

const nunitoSansRegular = localFont({
  src: '../public/fonts/NunitoSans-Regular.ttf',
  display: 'swap',
  variable: '--font-nunito-sans',
})

const nunitoSansItalic = localFont({
  src: '../public/fonts/NunitoSans-Italic.ttf',
  display: 'swap',
  variable: '--font-nunito-sans-italic',
})

const nunitoSansBold = localFont({
  src: '../public/fonts/NunitoSans-Bold.ttf',
  display: 'swap',
  variable: '--font-nunito-sans-bold',
})

const nunitoSansBoldItalic = localFont({
  src: '../public/fonts/NunitoSans-BoldItalic.ttf',
  display: 'swap',
  variable: '--font-nunito-sans-bold-italic',
})

export const metadata: Metadata = {
  title: 'phoenix',
  description: 'Planting Seeds for Lifelong Learning through Storytelling',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <html
        lang="en"
        className={`${lilitaOne.variable} ${nunitoSansRegular.variable} ${nunitoSansItalic.variable} ${nunitoSansBold.variable} ${nunitoSansBoldItalic.variable}`}
      >
        <head>
          <link rel="icon" href="/favicon.ico" sizes="any" />
        </head>
        <body>
          <main>{children}</main>
        </body>
      </html>
    </ThemeProvider>
  )
}
