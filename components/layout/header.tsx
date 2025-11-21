"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import {
  Sun,
  Moon,
} from "lucide-react"
import Link from "next/link"

export const LogoHeader = () => {
  return (
    <span className="text-xl font-bold transition-all duration-300 text-black dark:text-white underline font-serif">
      G-img-nano
    </span>
  )
}

export default function Header() {
  const { setTheme, resolvedTheme } = useTheme()

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white dark:bg-black" 
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center justify-centers">
              <LogoHeader />
            </Link>

            {/* Right Side */}
            <div className="flex items-center space-x-2">
              {/* Theme Toggle */}
  
              <div className="flex flex-col gap-4 justify-center items-center">
              <Link href={"/sign-in"}>
                <Button
                  size={"lg"}
                  className="bg-black dark:bg-white text-white dark:text-black px-3 py-6 cursor-pointer rounded-none transition-all duration-300"
                >
                  Try it for free
                </Button>
              </Link>
            </div>

              <Button
                size="lg"
                variant={"outline"}
                className="py-6 w-12 bg-white dark:bg-black text-black dark:text-white rounded-none"
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              >
                {resolvedTheme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>

            </div>
          </div>
        </div>
      </header>
    </>
  )
}
