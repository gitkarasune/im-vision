"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
    Lock,
    Eye,
    EyeOff,
    Check,
    X,
} from "lucide-react"
import { motion } from "framer-motion"
import Header from "../layout/header"
import Link from "next/link"
import { useRouter } from 'next/navigation';
import { toast } from "sonner"
import { Skeleton } from "../ui/skeleton"
import { FaGoogle } from "react-icons/fa"

interface FormData {
    firstName: string
    lastName: string
    email: string
    password: string
}

interface PasswordStrength {
    score: number
    label: string
    color: string
    bgColor: string
    requirements: {
        minLength: boolean
        hasNumbers: boolean
        hasLowercase: boolean
        hasUppercase: boolean
        hasSpecialChars: boolean
        isStrong: boolean
    }
}

export function SignUpPage() {
    const [formData, setFormData] = useState<FormData>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const router = useRouter();

    const calculatePasswordStrength = useCallback((password: string): PasswordStrength => {
        const requirements = {
            minLength: password.length >= 6,
            hasNumbers: /\d/.test(password),
            hasLowercase: /[a-z]/.test(password),
            hasUppercase: /[A-Z]/.test(password),
            hasSpecialChars: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            isStrong: password.length >= 8,
        }

        let score = 0
        let label = "Very Weak"
        let color = "text-red-500"
        let bgColor = "bg-red-500"

        if (requirements.minLength) score += 20
        if (requirements.hasNumbers) score += 20
        if (requirements.hasLowercase) score += 15
        if (requirements.hasUppercase) score += 20
        if (requirements.hasSpecialChars) score += 15
        if (requirements.isStrong) score += 10

        if (score >= 90) {
            label = "Very Strong"
            color = "text-green-800"
            bgColor = "bg-green-800"
        } else if (score >= 70) {
            label = "Strong"
            color = "text-blue-800"
            bgColor = "bg-blue-800"
        } else if (score >= 50) {
            label = "Medium"
            color = "text-yellow-800"
            bgColor = "bg-yellow-800"
        } else if (score >= 30) {
            label = "Weak"
            color = "text-orange-800"
            bgColor = "bg-orange-800"
        }

        return { score, label, color, bgColor, requirements }
    }, []);

    const passwordStrength = calculatePasswordStrength(formData.password)

    const generateStrongPassword = useCallback(() => {
        setIsGenerating(true)

        // Simulate generation delay for better UX
        setTimeout(() => {
            const lowercase = "abcdefghijklmnopqrstuvwxyz"
            const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            const numbers = "0123456789"
            const specialChars = '!@#$%^&*(),.?":{}|<>'

            let password = ""

            // Ensure at least one character from each required category
            password += lowercase[Math.floor(Math.random() * lowercase.length)]
            password += uppercase[Math.floor(Math.random() * uppercase.length)]
            password += numbers[Math.floor(Math.random() * numbers.length)]
            password += specialChars[Math.floor(Math.random() * specialChars.length)]

            // Fill the rest randomly to make it 12 characters
            const allChars = lowercase + uppercase + numbers + specialChars
            for (let i = 4; i < 12; i++) {
                password += allChars[Math.floor(Math.random() * allChars.length)]
            }

            // Shuffle the password
            password = password
                .split("")
                .sort(() => Math.random() - 0.5)
                .join("")

            setFormData((prev) => ({ ...prev, password }))
            setIsGenerating(false)
            toast.success("Strong password generated!")
        }, 800)
    }, [])


    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }


    const isFormValid = () => {
        return (
            formData.firstName.trim() !== "" &&
            formData.lastName.trim() !== "" &&
            formData.email.trim() !== "" &&
            passwordStrength.requirements.minLength &&
            passwordStrength.requirements.hasNumbers &&
            passwordStrength.requirements.hasLowercase &&
            passwordStrength.requirements.hasUppercase &&
            passwordStrength.requirements.hasSpecialChars &&
            passwordStrength.requirements.isStrong
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid()) {
            toast.error("Please complete all requirements before submitting")
            return
        }
    };

    if (isLoading) {

        return (
            <>
                <Header />

                <div className="min-h-screen bg-white dark:bg-black overflow-hidden flex items-center justify-center flex-col p-1 lg:p-4 relative">

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

                        {/* Right Side - Sign Up Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="w-full"
                        >
                            {/* card */}
                            <div className="bg-none dark:bg-none border-none shadow-none">
                                <div className="text-center pb-8 relative">
                                    <CardTitle className=""></CardTitle>
                                    <div><Skeleton className="h-12 w-56 mx-auto" /></div>
                                </div>

                                <div className="space-y-6 border-none shadow-none">
                                    {/* Form */}
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <div>
                                                    <Skeleton className="h-6 w-56" />
                                                </div>
                                                <div className="relative">
                                                    <Skeleton className="h-6 w-6 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                                    <Skeleton className="h-16 w-full" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div>
                                                    <Skeleton className="h-6 w-56" />
                                                </div>
                                                <div className="relative">
                                                    <Skeleton className="h-6 w-6 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                                    <Skeleton className="h-16 w-full" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div>
                                                <Skeleton className="h-6 w-56" />
                                            </div>
                                            <div className="relative">
                                                <Skeleton className="h-6 w-6 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                                <Skeleton className="h-16 w-full" />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div>
                                                <Skeleton className="h-6 w-56" />
                                            </div>
                                            <div className="relative">
                                                <Skeleton className="h-6 w-6 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                                <Skeleton className="h-16 w-full" />

                                                <Skeleton className="h-6 w-6 absolute right-0 px-3 top-1/2 transform -translate-y-1/2 mr-2" />
                                            </div>

                                            {/* Generate Password Button */}
                                            <Skeleton className="h-10 w-full" />
                                        </div>

                                        <div className="space-y-2">
                                            <div>
                                                <Skeleton className="h-3 w-6" />
                                            </div>
                                            <Skeleton className="h-14 w-full" />
                                        </div>

                                        {/* sign-up button */}
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
        )
    }


    return (

        <>
            <Header />

            <div className="min-h-screen bg-white dark:bg-black backdrop-blur-xl supports-[backdrop-filter] text-black dark:text-white overflow-hidden flex items-center justify-center flex-col p-1 lg:p-4 relative">

                <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Side - Hero Content (Hidden on mobile) */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="hidden lg:block space-y-8"
                    >
                        <div>
                            <h1 className="text-5xl lg:text-6xl font-bold text-black dark:text-white mb-6 leading-tight">
                                Create Now
                            </h1>
                        </div>
                    </motion.div>

                    {/* Right Side - Sign Up Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="w-full rounded-none"
                    >
                        <Card className="bg-white dark:bg-black border-black/10 dark:border-white/10 backdrop-blur-xl shadow-none">
                            <CardHeader className="text-center pb-8 relative rounded-none shadow-none">
                                <p className="text-gray-800 dark:text-white">Join Now</p>
                            </CardHeader>

                            <CardContent className="space-y-6 shadow-none rounded-none">
                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-4 rounded-none">
                                    <div>
                                        <Button className="py-5 rounded-none shadow-none w-72 mx-auto flex justify-center items-center gap-3 font-medium cursor-pointer font-sans bg-black dark:bg-white">
                                            <FaGoogle className="text-blue-500" size={24} />
                                            Sign Up with Google
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


                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName" className="text-gray-900 dark:text-white">
                                                First Name
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    id="firstName"
                                                    placeholder="John"
                                                    value={formData.firstName}
                                                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                                                    className="bg-white dark:bg-black border-black/20 dark:border-white/20 text-black dark:text-white placeholder:text-gray-900 dark:placeholder:text-white focus:border-cyan-500 focus:ring-cyan-500/20 backdrop-blur-sm transition-all duration-300 py-6 rounded-none text-base"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName" className="text-gray-900 dark:text-white">
                                                Last Name
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    id="lastName"
                                                    placeholder="Doe"
                                                    value={formData.lastName}
                                                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                                                    className="bg-white dark:bg-black border-black/20 dark:border-white/20 text-black dark:text-white placeholder:text-gray-900 dark:placeholder:text-white focus:border-cyan-500 focus:ring-cyan-500/20 backdrop-blur-sm transition-all duration-300 py-6 rounded-none text-base"
                                                    required
                                                />
                                            </div>
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
                                                placeholder="Robin@example.com"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange("email", e.target.value)}
                                                className="bg-white dark:bg-black border-black/20 dark:border-white/20 text-black dark:text-white placeholder:text-gray-900 dark:placeholder:text-white focus:border-cyan-500 focus:ring-cyan-500/20 backdrop-blur-sm transition-all duration-300 py-6 rounded-none text-base"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="password" className="text-gray-900 dark:text-white">
                                            Password
                                        </Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-900 dark:text-gray-400 w-4 h-4" />
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Create a strong password"
                                                value={formData.password}
                                                onChange={(e) => handleInputChange("password", e.target.value)}
                                                className="bg-white dark:bg-black border-black/20 dark:border-white/20 text-black dark:text-white placeholder:text-gray-900 dark:placeholder:text-white focus:border-cyan-500 focus:ring-cyan-500/20 backdrop-blur-sm transition-all duration-300 py-6 rounded-none text-base"
                                                required
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-0 top-0 h-full px-3 text-gray-900 dark:text-white"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </Button>
                                        </div>

                                        {/* Password Strength Indicator */}
                                        {formData.password && (
                                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-gray-900 dark:text-slate-400">Password Strength</span>
                                                        <span className={`text-sm font-medium ${passwordStrength.color}`}>
                                                            {passwordStrength.label}
                                                        </span>
                                                    </div>
                                                    <Progress value={passwordStrength.score} className="h-2 bg-slate-600 dark:bg-slate-900" />
                                                </div>

                                                {/* Requirements Checklist */}
                                                <div className="grid grid-cols-2 gap-3 text-xs">
                                                    <div
                                                        className={`flex items-center space-x-2 ${passwordStrength.requirements.minLength ? "text-green-950 dark:text-green-400" : "text-red-400"}`}
                                                    >
                                                        {passwordStrength.requirements.minLength ? (
                                                            <Check className="w-3 h-3" />
                                                        ) : (
                                                            <X className="w-3 h-3" />
                                                        )}
                                                        <span>6+ characters</span>
                                                    </div>
                                                    <div
                                                        className={`flex items-center space-x-2 ${passwordStrength.requirements.hasNumbers ? "text-green-950 dark:text-green-400" : "text-red-400"}`}
                                                    >
                                                        {passwordStrength.requirements.hasNumbers ? (
                                                            <Check className="w-3 h-3" />
                                                        ) : (
                                                            <X className="w-3 h-3" />
                                                        )}
                                                        <span>Numbers</span>
                                                    </div>
                                                    <div
                                                        className={`flex items-center space-x-2 ${passwordStrength.requirements.hasLowercase ? "text-green-950 dark:text-green-400" : "text-red-400"}`}
                                                    >
                                                        {passwordStrength.requirements.hasLowercase ? (
                                                            <Check className="w-3 h-3" />
                                                        ) : (
                                                            <X className="w-3 h-3" />
                                                        )}
                                                        <span>Lowercase</span>
                                                    </div>
                                                    <div
                                                        className={`flex items-center space-x-2 ${passwordStrength.requirements.hasUppercase ? "text-green-950 dark:text-green-400" : "text-red-400"}`}
                                                    >
                                                        {passwordStrength.requirements.hasUppercase ? (
                                                            <Check className="w-3 h-3" />
                                                        ) : (
                                                            <X className="w-3 h-3" />
                                                        )}
                                                        <span>Uppercase</span>
                                                    </div>
                                                    <div
                                                        className={`flex items-center space-x-2 ${passwordStrength.requirements.hasSpecialChars ? "text-green-950 dark:text-green-400" : "text-red-400"}`}
                                                    >
                                                        {passwordStrength.requirements.hasSpecialChars ? (
                                                            <Check className="w-3 h-3" />
                                                        ) : (
                                                            <X className="w-3 h-3" />
                                                        )}
                                                        <span>Special chars</span>
                                                    </div>
                                                    <div
                                                        className={`flex items-center space-x-2 ${passwordStrength.requirements.isStrong ? "text-green-950 dark:text-green-400" : "text-red-400"}`}
                                                    >
                                                        {passwordStrength.requirements.isStrong ? (
                                                            <Check className="w-3 h-3" />
                                                        ) : (
                                                            <X className="w-3 h-3" />
                                                        )}
                                                        <span>8+ characters</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Generate Password Button */}
                                        <Button
                                            type="button"
                                            size="sm"
                                            onClick={generateStrongPassword}
                                            disabled={isGenerating}
                                            className="w-full h-9 bg-black dark:bg-white border-black/20 dark:border-white/20 text-white dark:text-black transition-all duration-300 rounded-none shadow-none"
                                        >
                                            {isGenerating ? (
                                                <>
                                                    Generating...
                                                </>
                                            ) : (
                                                <>
                                                    Generate Strong Password
                                                </>
                                            )}
                                        </Button>
                                    </div>

                                    {isFormValid() &&
                                        <Button
                                            type="submit"
                                            disabled={isLoading || !isFormValid()}
                                            className={`w-full h-12 shadow-none transition-all duration-300 px-8 py-7 bg-black dark:bg-white text-white dark:text-black cursor-pointer  rounded-none`}
                                        >
                                            {isLoading ? (
                                                <div className="flex items-center">
                                                    Creating Account...
                                                </div>
                                            ) : (
                                                <>
                                                    Create Account
                                                </>
                                            )}
                                        </Button>
                                    }
                                </form>

                                <div className="text-center">
                                    <p className="text-slate-800 dark:text-slate-200 text-sm">
                                        Already have an account?{" "}
                                        <Link href="/sign-in" className="text-blue-800 dark:text-blue-600 hover:underline font-medium">
                                            Sign in
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
