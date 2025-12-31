
# IMvision

![IMvision Banner](https://via.placeholder.com/1200x400?text=IMvision+AI+Platform)

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini-Flash_2.5-8E75B2?style=for-the-badge&logo=google)](https://deepmind.google/technologies/gemini/)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-API-7C3AED?style=for-the-badge)](https://openrouter.ai/)

**Create. Generate. Edit.**
The next-generation AI image platform built for speed and creativity.

[Documentation](/docs) · [Report Bug](https://github.com/gitkarasune/img-nano/issues) · [Request Feature](https://github.com/gitkarasune/img-nano/issues)

</div>

---

## 🚀 Overview

**IMvision** is a state-of-the-art generative AI platform designed to empower creators. Built with the latest web technologies, it offers zero-latency image generation, real-time editing capabilities, and a seamless collaborative experience.

Whether you're sketching a quick concept or refining a masterpiece, IMvision's optimized pipeline powered by Google's Gemini and OpenRouter ensures your creative flow is never interrupted.

## ✨ Key Features

- **⚡ Real-time Generation**: Instant visuals with optimized API streaming.
- **🎨 Advanced Editing**: Crop, zoom, generic fill, and comprehensive adjustment tools.
- **🔐 Secure Authentication**: Robust user management via Better-Auth.
- **📂 History & Persistence**: Automatic saving of all prompts and generated assets to PostgreSQL.
- **📱 Responsive Design**: A stunning, mobile-first interface with fluid animations.
- **🌗 Dark/Light Mode**: Fully themable UI for any environment.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn/UI](https://ui.shadcn.com/)
- **AI Models**: Google Gemini Flash 2.5 via [OpenRouter](https://openrouter.ai/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via Neon)
- **Auth**: [Better-Auth](https://github.com/better-auth/better-auth)
- **Deployment**: Vercel

## 🚀 Getting Started

Follow these steps to set up IMvision locally.

### Prerequisites

- Node.js 18+
- npm or pnpm
- A PostgreSQL database string

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gitkarasune/im-vision.git
   cd im-vision
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Renamed `env.example` to `.env` and fill in your keys.
   ```bash
   cp env.example .env
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🤝 Contributing

We welcome contributions from the community!

1. **Fork the Project**
2. **Create your Feature Branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your Changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the Branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

Please read our [Contribution Guidelines](CONTRIBUTING.md) strictly before submitting.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p>Built with ❤️ by <a href="https://github.com/gitkarasune">Karasune</a></p>
</div>