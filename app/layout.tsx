import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "IMvision",
  description: "Generative AI for instant Image creation.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning suppressContentEditableWarning={true} className="dark">
      <body
        className={` bg-black dark:bg-white text-white dark:text-black ${inter.className} `}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          {children}
          <Toaster closeButton={true} expand={true} className="rounded-none" />
        </ThemeProvider>
      </body>
    </html>
  );
}
