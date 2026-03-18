"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, Mail, Lock, Github } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Demo login - in production, use Supabase auth
    if (email && password) {
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } else {
      setError("Please enter email and password");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-surface-900 text-white flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold">BuildStream</span>
        </div>
        <div>
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Build AI workflows<br />without writing code
          </h1>
          <p className="text-lg text-surface-300 max-w-md">
            Design, deploy, and monitor production-ready AI applications with our visual workflow builder.
          </p>
        </div>
        <div className="flex items-center gap-8 text-sm text-surface-400">
          <div>
            <p className="text-2xl font-bold text-white">10K+</p>
            <p>Workflows created</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">500+</p>
            <p>Teams active</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">99.9%</p>
            <p>Uptime</p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-surface-900">BuildStream</span>
          </div>

          <h2 className="text-2xl font-bold text-surface-900 mb-1">Welcome back</h2>
          <p className="text-sm text-surface-500 mb-8">Sign in to your account to continue</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-surface-300 text-brand-600 focus:ring-brand-500"
                />
                <span className="text-sm text-surface-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
                Forgot password?
              </a>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-surface-50 text-surface-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              <Github className="w-4 h-4" />
              GitHub
            </Button>
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              <Mail className="w-4 h-4" />
              Google
            </Button>
          </div>

          <p className="mt-8 text-center text-sm text-surface-500">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-brand-600 hover:text-brand-700 font-medium">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
