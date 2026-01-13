import { Suspense } from "react"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export default function LoginPage() {
  return (
    <div className="bg-white dark:bg-black">
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  )
}
