"use client"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Moon, Sun, Menu, X } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    const stored = localStorage.getItem('darkMode')
    const initialDark = stored === 'true'
    setIsDark(initialDark)
    root.classList.toggle('dark', initialDark)
  }, [])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    const root = document.documentElement
    root.classList.toggle('dark', next)
    localStorage.setItem('darkMode', next ? 'true' : 'false')
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b bg-black text-white border-border shadow-sm">
      <div className="max-w-7xl flex justify-between items-center mx-auto px-4 py-4 h-16">
        <Link
          href="/"
          className="text-lg md:text-2xl sm:text-xl font-bold text-foreground hover:opacity-80 transition-opacity"
        >
          Finance App
        </Link>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Open menu"
          className="md:hidden"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>

        <div
          className={`${
            isMenuOpen ? 'flex' : 'hidden'
          } md:flex md:text-white md:flex-row flex-col  absolute md:static top-17 md:top-0 justify-end right-0 md:right-auto dark:bg-black dark:text-white text-black bg-gray-100 rounded-lg md:bg-transparent border md:border-0 border-border md:shadow-none shadow-lg md:rounded-none rounded-b-lg pt-0 p-5 md:p-0 items-stretch md:items-center gap-1 md:gap-4`}
        >
          <div className="flex justify-end md:hidden">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Close menu"
              onClick={() => setIsMenuOpen(false)}
            >
              <X className="h-2 w-2 text-red-500" />
            </Button>
          </div>

          <Button variant="ghost" asChild>
            <Link href="/">Home</Link>
          </Button>

          <Button variant="ghost" asChild>
            <Link href="/statistics">Stats</Link>
          </Button>

          <Button variant="ghost">
            <Link href="/users">Transactions</Link>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="w-full md:w-auto"
          >
            {isDark ? (
              <>
                <Sun className="h-4 w-4 mr-2" />
                Light mode
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 mr-2" />
                Dark mode
              </>
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}
