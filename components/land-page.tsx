"use client"

import { motion } from "framer-motion"

export default function LandPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white dark:bg-black min-h-screen flex flex-col justify-center items-center">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight text-black dark:text-white">
              Generate images with AI
            </h1>

            <p className="text-lg mb-24 max-w-3xl mx-auto leading-relaxed text-black dark:text-white">
              Create unique, high-quality images from simple text descriptions using advanced AI models
            </p>
          </motion.div>
        </div>
      </section>
    </>
  )
}
