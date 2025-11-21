"use client"

import { SiGithub } from "react-icons/si"

const socialLinks = [
  { icon: SiGithub, href: "https://github.com/gitKarasune", label: "Github" },
]

export function Footer() {
  return (
    <footer className="bg-white dark:bg-black text-black dark:text-white">

      <div className="relative">
        {/* Bottom Bar */}
        <div
          className=" backdrop-blur-sm"
        >
          <div className="px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between space-y-4">
              <div className="flex items-center text-sm">
                © 2025 . All rights reserved
              </div>

              {/* github logo */}
              <div className="flex items-center justify-end">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-8 h-8 bg-white dark:bg-black rounded-none flex items-center justify-center transition-all duration-300`}
                  >
                    <social.icon className="w-6 h-6" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer >
  )
}
