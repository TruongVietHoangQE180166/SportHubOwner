import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SportHupOwner Dashboard',
  description: 'for sporting events',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}