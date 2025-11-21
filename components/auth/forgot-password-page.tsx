"use client"

import { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Header from "../layout/header";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Check, Eye, EyeOff, RefreshCw, X, Zap } from "lucide-react";
import { Progress } from "../ui/progress";
import { InputOTP, InputOTPSlot } from "../ui/input-otp";
import { CustomModal } from "../ui/custom-modal";
import { Label } from "../ui/label";

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

export function ForgotPasswordPage() {
    const [step, setStep] = useState(0);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    // const [newPassword, setNewPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [password, setPassword] = useState("");


    useEffect(() => {
        if (step === 2) setShowSuccessModal(true);
    }, [step]);

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

    const isFormValid = () => {
        return (
            passwordStrength.requirements.minLength &&
            passwordStrength.requirements.hasNumbers &&
            passwordStrength.requirements.hasLowercase &&
            passwordStrength.requirements.hasUppercase &&
            passwordStrength.requirements.hasSpecialChars &&
            passwordStrength.requirements.isStrong
        )
    }

    const passwordStrength = calculatePasswordStrength(password)

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
                .join("");

            setPassword(password)
            setIsGenerating(false)
            toast.success("Strong password generated!")
        }, 800)
    }, [])

    const handleRequestReset = async () => {

        setIsLoading(true);
        const res = await fetch("/api/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const data = await res.json();
        setIsLoading(false);

        if (res.ok) {
            toast.success("OTP sent to your email");
            setStep(1);
        } else {
            toast.error(data.error || "Error sending OTP");
        }
    };

    const handleResetPassword = async () => {
        if (!isFormValid()) {
            toast.error("Please complete all requirements before submitting")
            return
        }
        setIsLoading(true);
        const res = await fetch("/api/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp, newPassword: password }),
        });

        const data = await res.json();
        setIsLoading(false);

        if (res.ok) {
            toast.success("Password reset successful! You can now sign in.");
            setStep(2);
        } else {
            toast.error(data.error || "Error resetting password");
        }
    };

    return (
        <>
            <Header />

            <div className="min-h-screen backdrop-blur-xl supports-[backdrop-filter]  text-black dark:text-white overflow-hidden relative bg-white dark:bg-black">

                <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20 rounded-full blur-3xl" />

                <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 rounded-full blur-3xl" />

                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-500/5 to-cyan-500/5 dark:from-indigo-500/10 dark:to-cyan-500/10 rounded-full blur-3xl" />

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="max-w-2xl mx-auto mt-20 p-2"
                >

                    {/* step 1 | 2 */}
                      {/* step 0 */}

                    {/* step 0 */}
                    {step == 0 && (
                        <Card className="bg-white dark:bg-black border-white/10 backdrop-blur-xl">
                            <CardHeader className="text-center pb-8 relative">
                                
                                <CardTitle className="text-lg mb-2">Reset Password</CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <div className="relative">
                                         <Label htmlFor="password" className="text-gray-900 dark:text-white font-semibold dark:font-normal mb-3">
                                            Enter current password
                                        </Label>
                                        <div className="mb-7">
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="Enter your current email"
                                                className="pl-10 bg-slate-200 dark:bg-slate-700/50 border-white/20 text-black dark:text-white placeholder:text-gray-900 dark:placeholder:text-white focus:border-cyan-500 focus:ring-cyan-500/20 backdrop-blur-sm transition-all duration-300 h-14"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <Button
                                            onClick={handleRequestReset}
                                            disabled={isLoading}
                                            className="w-full h-12 font-semibold shadow-sm transition-all duration-300 px-8 py-6 bg-black dark:bg-white shadow-black text-white dark:text-black cursor-pointer hover:shadow-md"
                                        >
                                            {/* {isLoading ? "Sending..." : "Send OTP"} */}
                                            {isLoading ? (
                                                <div className="flex items-center">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Sending...
                                                </div>
                                            ) : (
                                                <>
                                                    Send OTP
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>

                            </CardContent>

                            <CardFooter className="flex justify-center items-center pb-2 ">
                                <div className="text-center">
                                    <p className="text-black dark:text-white text-xs">Protected by industry-standard encryption and security measures</p>
                                </div>
                            </CardFooter>
                        </Card>
                    )}


                    {/*step 1  */}
                    {step === 1 && (
                        <Card className="bg-white dark:bg-black border-white/10 backdrop-blur-xl mt-5">
                            <CardHeader className="text-center pb-8 relative">

                                <CardTitle className="text-lg mb-2">More step</CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <div className="relative">
                                         <Label htmlFor="password" className="text-gray-900 dark:text-white font-semibold dark:font-normal mb-3">
                                            Enter OTP
                                        </Label>
                                        <div className="mb-7">
                                            <div className="flex flex-col justify-center items-center bg-slate-100 dark:bg-slate-700/50 border-white/20 focus:border-cyan-500 focus:ring-cyan-500/20 backdrop-blur-sm transition-all duration-300 h-16 rounded-md">
                                                <InputOTP
                                                    value={otp}
                                                    onChange={setOtp}
                                                    maxLength={6}
                                                    autoFocus
                                                    className=""
                                                    required
                                                >
                                                    {Array.from({ length: 6 }).map((_, i) => (
                                                        <InputOTPSlot key={i} index={i} />
                                                    ))}
                                                </InputOTP>
                                            </div>
                                        </div>
                                        <div className="mb-4 relative">
                                             <Label htmlFor="password" className="text-gray-900 dark:text-white font-semibold dark:font-normal mb-3">
                                            Enter new password
                                        </Label>
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter new password"
                                                className="pl-10 bg-slate-200 dark:bg-slate-700/50 border-white/20 text-black dark:text-white placeholder:text-gray-900 dark:placeholder:text-white focus:border-cyan-500 focus:ring-cyan-500/20 backdrop-blur-sm transition-all duration-300 h-14"
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                                required
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-0 top-0 h-full px-3 text-gray-900 dark:text-white hover:text-slate-950 hover:dark:text-white"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </Button>
                                        </div>
                                        <div className="flex justify-center items-center mb-2">or</div>

                                        {/* Generate Password Button */}
                                        <Button
                                            type="button"
                                            size="sm"
                                            onClick={generateStrongPassword}
                                            disabled={isGenerating}
                                            className="w-full bg-black dark:bg-white border-white/20 text-white dark:text-black transition-all duration-300 mt-2 mb-4"
                                        >
                                            {isGenerating ? (
                                                <>
                                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                                    Generating...
                                                </>
                                            ) : (
                                                <>
                                                    <Zap className="w-4 h-4 mr-2" />
                                                    Generate Strong Password
                                                </>
                                            )}
                                        </Button>

                                        {/* Password Strength Indicator */}
                                        {password && (
                                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-black dark:text-white">Password Strength</span>
                                                        <span className={`text-sm font-medium ${passwordStrength.color}`}>
                                                            {passwordStrength.label}
                                                        </span>
                                                    </div>
                                                    <Progress value={passwordStrength.score} className="h-2 bg-slate-600 dark:bg-slate-900" />
                                                </div>

                                                {/* Requirements Checklist */}
                                                <div className="grid grid-cols-2 gap-3 text-xs">
                                                    <div
                                                        className={`flex items-center space-x-2 ${passwordStrength.requirements.minLength ? "text-green-950 dark:text-green-400 font-bold" : "text-red-400"}`}
                                                    >
                                                        {passwordStrength.requirements.minLength ? (
                                                            <Check className="w-3 h-3" />
                                                        ) : (
                                                            <X className="w-3 h-3" />
                                                        )}
                                                        <span>6+ characters</span>
                                                    </div>
                                                    <div
                                                        className={`flex items-center space-x-2 ${passwordStrength.requirements.hasNumbers ? "text-green-950 dark:text-green-400 font-bold" : "text-red-400"}`}
                                                    >
                                                        {passwordStrength.requirements.hasNumbers ? (
                                                            <Check className="w-3 h-3" />
                                                        ) : (
                                                            <X className="w-3 h-3" />
                                                        )}
                                                        <span>Numbers</span>
                                                    </div>
                                                    <div
                                                        className={`flex items-center space-x-2 ${passwordStrength.requirements.hasLowercase ? "text-green-950 dark:text-green-400 font-bold" : "text-red-400"}`}
                                                    >
                                                        {passwordStrength.requirements.hasLowercase ? (
                                                            <Check className="w-3 h-3" />
                                                        ) : (
                                                            <X className="w-3 h-3" />
                                                        )}
                                                        <span>Lowercase</span>
                                                    </div>
                                                    <div
                                                        className={`flex items-center space-x-2 ${passwordStrength.requirements.hasUppercase ? "text-green-950 dark:text-green-400 font-bold" : "text-red-400"}`}
                                                    >
                                                        {passwordStrength.requirements.hasUppercase ? (
                                                            <Check className="w-3 h-3" />
                                                        ) : (
                                                            <X className="w-3 h-3" />
                                                        )}
                                                        <span>Uppercase</span>
                                                    </div>
                                                    <div
                                                        className={`flex items-center space-x-2 ${passwordStrength.requirements.hasSpecialChars ? "text-green-950 dark:text-green-400 font-bold" : "text-red-400"}`}
                                                    >
                                                        {passwordStrength.requirements.hasSpecialChars ? (
                                                            <Check className="w-3 h-3" />
                                                        ) : (
                                                            <X className="w-3 h-3" />
                                                        )}
                                                        <span>Special chars</span>
                                                    </div>
                                                    <div
                                                        className={`flex items-center space-x-2 ${passwordStrength.requirements.isStrong ? "text-green-950 dark:text-green-400 font-bold" : "text-red-400"}`}
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

                                        <Button
                                            onClick={handleResetPassword}
                                            disabled={isLoading || !isFormValid()}
                                            className="w-full h-12 font-semibold shadow-sm transition-all duration-300 px-8 py-6  shadow-black  cursor-pointer hover:shadow-md"
                                        >
                                            {/* {isLoading ? "Resetting..." : "Reset Password"} */}
                                            {isLoading ? (
                                                <div className="flex items-center">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Resetting...
                                                </div>
                                            ) : (
                                                <>
                                                    Reset Password
                                                </>
                                            )}
                                        </Button>
                                    </div>

                                </div>

                            </CardContent>

                            <CardFooter className="flex justify-center items-center pb-2 ">
                                <div className="text-center">
                                    <p className="text-black dark:text-white text-xs">Protected by industry-standard encryption and security measures</p>
                                </div>
                            </CardFooter>
                        </Card>
                    )}

                </motion.div>

                {/* use my custom modal instead of normal like this and display this information and more content inside as well  */}
                {step === 2 && (
                    <CustomModal
                        isOpen={showSuccessModal}
                        onClose={() => setShowSuccessModal(false)}
                        title="Password Reset Successful!"
                        size="xl"
                    >
                        <div className="space-y-4 text-center">
                            <h2 className="text-lg font-bold text-black dark:text-white mb-2">Your password has been changed!</h2>
                            <p className="text-black dark:text-white">
                                You can now sign in with your new password.<br />
                                For your security, never share your password with anyone.
                            </p>
                            <Button
                                onClick={() => {
                                    setShowSuccessModal(false);
                                    window.location.href = "/sign-in";
                                }}
                                className="w-full h-12 font-semibold shadow-sm transition-all duration-300 px-8 py-6 bg-black dark:bg-white dark:text-black shadow-black text-white hover:shadow-md cursor-pointer"
                            >
                                Sign In
                            </Button>
                        </div>
                    </CustomModal>
                )}
            </div>

        </>
    );
}