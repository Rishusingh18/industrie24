import { Suspense } from "react";
import Link from "next/link";
import GoogleAuthButton from "@/components/auth/google-auth-button";
import { MoveLeft } from "lucide-react";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen w-full bg-gray-50 dark:bg-black relative overflow-hidden">
            {/* Abstract Background Shapes */}
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[100px] pointer-events-none" />

            <div className="z-10 w-full max-w-md m-auto px-4">
                <Link
                    href="/"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 mb-8 transition-colors"
                >
                    <MoveLeft className="w-4 h-4 mr-2" />
                    Back to store
                </Link>

                <div className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50 mb-2">
                                Welcome back
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Sign in to your account to continue
                            </p>
                        </div>

                        <div className="space-y-4">
                            <GoogleAuthButton />
                        </div>

                        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/signup"
                                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors"
                            >
                                Sign up
                            </Link>
                        </div>
                    </div>
                    <div className="px-8 py-4 bg-gray-50 dark:bg-gray-900/80 border-t border-gray-100 dark:border-gray-800 text-center text-xs text-gray-500 dark:text-gray-400">
                        By clicking continue, you agree to our <Link href="/terms" className="underline cursor-pointer hover:text-gray-900 dark:hover:text-gray-200">Terms of Service</Link> and <Link href="/privacy" className="underline cursor-pointer hover:text-gray-900 dark:hover:text-gray-200">Privacy Policy</Link>.
                    </div>
                </div>
            </div>
        </div>
    );
}
