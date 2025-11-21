"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, Code, Trophy, BookOpen, ArrowDown } from "lucide-react"
import { motion, useScroll } from "framer-motion"
import { LogoHeader } from "./layout/header"

interface Step {
  icon: React.ElementType
  title: string
  description: string
  features: string[]
}

const steps: Step[] = [
  {
    icon: BookOpen,
    title: "AI-Powered Image generation",
    description: "Select what you want to learn - React, Python, DevOps, or any tech skill.",
    features: ["500+ Topics Available", "Beginner to Advanced", "Industry-Relevant Skills", "Updated Weekly"],
  },
  {
    icon: Brain,
    title: "Customization Options",
    description: "Master concepts progressively from beginner to advanced with AI explanations.",
    features: ["AI-Powered Explanations", "Adaptive Learning", "Personalized Pace", "Interactive Examples"],
  },
  {
    icon: Code,
    title: "Image Editing Tools",
    description: "Apply knowledge with AI-generated projects and real-world code examples.",
    features: ["Real-World Projects", "Code Reviews", "Portfolio Building", "GitHub Integration"],
  },
  {
    icon: Trophy,
    title: "Image Recognition",
    description: "Earn XP, badges, and certificates while building your developer portfolio.",
    features: ["XP & Achievements", "Skill Certificates", "Progress Analytics", "Career Roadmap"],
  },
  {
    icon: Trophy,
    title: "Integrate with Design Tools",
    description: "Earn XP, badges, and certificates while building your developer portfolio.",
    features: ["XP & Achievements", "Skill Certificates", "Progress Analytics", "Career Roadmap"],
  },
  {
    icon: Trophy,
    title: "Real-time Preview",
    description: "Earn XP, badges, and certificates while building your developer portfolio.",
    features: ["XP & Achievements", "Skill Certificates", "Progress Analytics", "Career Roadmap"],
  },
  {
    icon: Trophy,
    title: "Export Options",
    description: "Earn XP, badges, and certificates while building your developer portfolio.",
    features: ["XP & Achievements", "Skill Certificates", "Progress Analytics", "Career Roadmap"],
  },
  {
    icon: Trophy,
    title: "API Access Support",
    description: "Earn XP, badges, and certificates while building your developer portfolio.",
    features: ["XP & Achievements", "Skill Certificates", "Progress Analytics", "Career Roadmap"],
  },
]

export default function Pattern() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeStep, setActiveStep] = useState(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((progress) => {
      const stepIndex = Math.floor(progress * steps.length)
      setActiveStep(Math.min(stepIndex, steps.length - 1))
    })

    return unsubscribe
  }, [scrollYProgress])

  return (
    <section
      ref={containerRef}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black relative overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl font-bold mb-6">
            < LogoHeader />
          </h2>
          <p className="text-lg max-w-3xl mx-auto">
            Everything you need for Images
          </p>
        </motion.div>

        {/* Steps Container */}
        <div className="relative">

          {/* Steps */}
          <div className="space-y-32">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0
              const isActive = activeStep >= index

              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 100 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.2,
                    type: "spring",
                    stiffness: 100,
                  }}
                  viewport={{ once: true, margin: "-100px" }}
                  className={`relative flex items-center ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                    } flex-col gap-12 lg:gap-20`}
                >
                  {/* Step Number Circle */}
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden lg:block z-10">
                    <motion.div
                      animate={{
                        scale: isActive ? 1.2 : 1,
                        boxShadow: isActive
                          ? `0 0 30px rgba(${index === 0 ? "59, 130, 246" : index === 1 ? "168, 85, 247" : index === 2 ? "34, 197, 94" : index === 3 ? "168, 85, 247" : index === 4 ? "168, 85, 247" : index === 5 ? "168, 85, 247" : index === 6 ? "168, 85, 247" : index === 7 ? "168, 85, 247" : "249, 115, 22"}, 0.5)`
                          : "none",
                      }}
                      transition={{ duration: 0.3 }}
                      className={`w-16 h-16 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-bold text-xl shadow-none border-none`}
                    >
                      {index + 1}
                    </motion.div>
                  </div>

                  {/* Content Card */}
                  <motion.div  
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`flex-1 ${isEven ? "lg:pr-20" : "lg:pl-20"}`}
                  >
                    <Card
                      className={`bg-white dark:bg-black border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-500 overflow-hidden group shadow-none rounded-md`}
                    >
                      <CardContent className="p-8 lg:p-10 shadow-none rounded-md">
                        {/* Mobile Step Number */}
                        <div className="lg:hidden mb-6">
                          <div
                            className={`w-12 h-12 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-bold text-lg mx-auto shadow-none`}
                          >
                            {index + 1}
                          </div>
                        </div>

                        {/* Title & Description for ID Card */}
                        <h3 className="text-3xl font-bold text-black dark:text-white mb-4 transition-all duration-300">
                          {step.title}
                        </h3>
                        <p className="text-black dark:text-white text-lg leading-relaxed mb-6">{step.description}</p>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-3">
                          {step.features.map((feature) => (
                            <motion.div
                              key={feature}
                              className="flex items-center space-x-2 text-sm text-black dark:text-white border rounded-full p-3"
                            >
                              {feature}
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Visual Element */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className={`flex-1 ${isEven ? "lg:pl-20" : "lg:pr-20"} hidden lg:block`}
                  >
                    <div
                      className={`relative h-80 bg-white/5 dark:black rounded-none border border-white/10 shadow-none backdrop-blur-sm overflow-hidden group`}
                    >

                      {/* Content Preview */}
                      <div className="relative z-10 p-8 h-full flex items-center justify-center">
                        <div
                          className={`w-24 h-24 bg-black dark:bg-white rounded-none flex items-center justify-center shadow-none`}
                        >
                          <step.icon className="w-12 h-12 text-white dark:text-black" />
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Arrow Connector (except for last step) */}
                  {index < steps.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 hidden lg:block"
                    >
                      <div
                        className="text-black dark:text-white"
                      >
                        <ArrowDown className="w-6 h-6" />
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
