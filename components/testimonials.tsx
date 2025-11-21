"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const testimonials = [
  {
    id: "1",
    name: "Teddy Ni",
    username: "@Teddarific",
    content:
      "Wow, this site is an ABSOLUTE GOLDMINE for design engineers.\n\nIf you're struggling with figuring out what animations to use. Check it out.\n\nThank me later 😊.\n\nstackrealm",
  },
  {
    id: "2",
    name: "Teddy Ni",
    username: "@Teddarific",
    content:
      "Wow, this site is an ABSOLUTE GOLDMINE for design engineers.\n\nIf you're struggling with figuring out what animations to use. Check it out.\n\nThank me later 😊.\n\nstackrealm",
  },
  {
    id: "3",
    name: "Teddy Ni",
    username: "@Teddarific",
    content:
      "Wow, this site is an ABSOLUTE GOLDMINE for design engineers.\n\nIf you're struggling with figuring out what animations to use. Check it out.\n\nThank me later 😊.\n\nstackrealm",
  },
  {
    id: "4",
    name: "Teddy Ni",
    username: "@Teddarific",
    content:
      "Wow, this site is an ABSOLUTE GOLDMINE for design engineers.\n\nIf you're struggling with figuring out what animations to use. Check it out.\n\nThank me later 😊.\n\nstackrealm",
  }
]

export function Testimonials() {
  return (
    <section className="py-20 px-4 bg-white dark:bg-black text-black dark:text-white relative overflow-hidden">

      <div className="relative max-w-[105rem] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-5">
            Loved by 1.3K+ Users
          </h2>

          <p className="text-lg max-w-3xl mx-auto">
            With much love of creating real and stunning images with Nano Banana directly to your gallery with just one click
          </p>
        </motion.div>

        {/* Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="mx-auto w-full max-w-[90rem]"
        >
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem
                key={testimonial.id}
                className="basis-full sm:basis-1/2 lg:basis-1/3 px-4"
              >
                <Card className="bg-white dark:bg-black border-slate-200/50 dark:border-white/10 backdrop-blur-sm transition-all duration-300 shadow-none rounded-none">
                  <CardContent className="p-6 flex flex-col justify-between h-full shadow-none rounded-none">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xl truncate mb-1">
                            {testimonial.name}
                          </h4>
                          <p className="text-xs opacity-80 truncate">
                            {testimonial.username}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="mb-1">
                      <p className="leading-relaxed text-sm whitespace-pre-line">
                        {testimonial.content}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation */}
          <CarouselPrevious className="left-2 sm:left-6" />
          <CarouselNext className="right-2 sm:right-6" />
        </Carousel>
      </div>
    </section>
  )
}
