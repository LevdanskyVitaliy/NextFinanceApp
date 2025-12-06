import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { TransactionProvider } from './contexts/TransactionContext'



const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})



export const metadata: Metadata = {
  title: {
    template: '%s - Finance Tracker',
    default: ''
  },
  description: 'This app is created for Tracking your money'
}



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
       <TransactionProvider>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased` }>{children}</body>
      </TransactionProvider>
    </html>
  )
}