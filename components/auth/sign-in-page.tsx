"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, EyeOff, Eye } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from 'next/navigation';
import { toast } from "sonner"
import { useState } from "react"
import { Skeleton } from "../ui/skeleton"
import Header from "../layout/header"
import { FaGoogle } from "react-icons/fa"

export function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const router = useRouter();

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg(null);
    };

    // using skeleton loading 
    if (isLoading) {
        return (
            <> <Header /> <div className="min-h-screen bg-white dark:bg-black overflow-hidden flex items-center flex-col justify-center p-1 lg:p-4 relative">
                <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Side - Hero Content (Hidden on mobile) */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="hidden lg:block space-y-8"
                    >
                        <div>
                            <div className="mb-5">
                                <Skeleton className="h-16 w-56" />
                            </div>

                            <div>
                                <Skeleton className="h-20 w-full" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Side - Sign In Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="w-full"
                    >
                        {/* card */}
                        <div className="bg-none dark:bg-none border-none shadow-none">
                            <div className="text-center pb-8">
                                <div className="w-full"><Skeleton className="h-12 w-56 mx-auto" /></div>
                            </div>

                            <div className="space-y-6 border-none shadow-none">
                                {/* Form */}
                                <form onSubmit={handleSignIn} className="space-y-4">
                                    <div className="space-y-2">
                                        {/* Email */}
                                        <div>
                                            <Skeleton className="h-6 w-56" />
                                        </div>
                                        <div className="relative">
                                            <Skeleton className="h-6 w-6 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                            <Skeleton className="h-16 w-full" />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div className="space-y-2">
                                        <Skeleton className="h-6 w-56" />
                                        <div className="relative">
                                            <Skeleton className="h-6 w-6 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                            <Skeleton className="h-16 w-full" />

                                            <Skeleton className="h-6 w-6 absolute right-0 px-3 top-1/2 transform -translate-y-1/2 mr-2" />

                                        </div>
                                    </div>

                                    {/* Forget password */}
                                    <div className="flex items-center justify-between py-3">
                                        <Skeleton className="h-6 w-56 " />
                                    </div>

                                    {/* Sign-in button */}
                                    <Skeleton className="h-12 w-full" />
                                </form>

                                <div className="text-center">
                                    <Skeleton className="h-6 w-full " />

                                </div>

                                <div className="text-center">
                                    <Skeleton className="h-6 w-full " />

                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            </>
        );
    }

    return (
        <>
            <Header />

            <div className="min-h-screen bg-white dark:bg-black backdrop-blur-xl supports-[backdrop-filter] text-black dark:text-black overflow-hidden flex items-center flex-col justify-center p-1 lg:p-4 relative">
                <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Side - Hero Content (Hidden on mobile) */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="hidden lg:block space-y-8"
                    >
                        <div>
                            <h1 className="text-6xl font-bold text-black dark:text-white mb-6 leading-tight">
                                Sign In
                            </h1>
                        </div>
                    </motion.div>

                    {/* Right Side - Sign In Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="w-full"
                    >
                        <Card className="bg-white dark:bg-black border-black/10 dark:border-white/10 backdrop-blur-xl rounded-md shadow-none">
                            <CardHeader className="text-center pb-8">
                                <CardTitle className=""></CardTitle>
                                <p className="text-black dark:text-white">Sign in to continue</p>
                            </CardHeader>

                            <CardContent className="space-y-6 rounded-md shadow-none">
                                {/* Form */}
                                <form onSubmit={handleSignIn} className="space-y-4">
                                    <div>
                                        <Button className="py-5 rounded-none shadow-none w-72 mx-auto flex justify-center items-center gap-3 font-medium cursor-pointer font-sans bg-black dark:bg-white">
                                            <FaGoogle className="text-blue-500" size={24} />
                                            Sign In with Google
                                        </Button>
                                    </div>

                                    <div className="relative py-7">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-black dark:border-white"></div>
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-1 bg-black dark:bg-white text-white dark:text-black">
                                                or
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-gray-900 dark:text-white">
                                            Email Address
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="Enter your email"
                                                className=" bg-white dark:bg-black border-black/20 dark:border-white/20 text-black dark:text-white placeholder:text-gray-900 dark:placeholder:text-white focus:border-cyan-500 focus:ring-cyan-500/20 backdrop-blur-sm transition-all duration-300 py-6 rounded-none text-base"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-gray-900 dark:text-white">
                                            Password
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Enter your password"
                                                className=" pr-10 bg-white dark:bg-black border-black/20 dark:border-white/20 text-black dark:text-white placeholder:text-gray-900 dark:placeholder:text-white focus:border-cyan-500 focus:ring-cyan-500/20 backdrop-blur-sm transition-all duration-300 py-6 rounded-none text-base"
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                                required
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-0 top-0 h-full px-3 text-gray-900 dark:text-white rounded-none"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </Button>
                                        </div>
                                    </div>

                                    <Button size={"sm"} className="flex items-center justify-between py-3 bg-black dark:bg-white text-white dark:text-black rounded-none">
                                        <Link href="/forgot-password" className="text-sm">
                                            Forgot password ?
                                        </Link>
                                    </Button>

                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full transition-all duration-300 py-5 bg-black dark:bg-white shadow-none text-white dark:text-black cursor-pointer rounded-none"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center">
                                                Proceeding...
                                            </div>
                                        ) : (
                                            <>
                                                Sign In
                                            </>
                                        )}
                                    </Button>
                                </form>

                                <div className="text-center">
                                    <p className="text-slate-800 dark:text-slate-200 text-sm">
                                        Don&apos;t have an account?{" "}
                                        <Link href="/sign-up" className="text-blue-800 dark:text-blue-600 hover:underline font-medium">
                                            Sign up
                                        </Link>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </>
    )
}
