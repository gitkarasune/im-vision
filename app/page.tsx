"use client"

import Header from "../components/layout/header"
import { Testimonials } from "@/components/testimonials"
import LandPage from "@/components/land-page"
import Pattern from "@/components/pattern"

export default function Home() {
  return (
    <>
      <Header />

      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
        <LandPage />
        <Pattern />
        <Testimonials />
      </div>
    </>
  )
}
