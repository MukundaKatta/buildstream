"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, Mail, Github } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (name && email && password) {
      if (password.length < 8) {
        setError("Password must be at least 8 characters");
        setLoading(false);
        return;
      }
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } else {
      setError("Please fill in all fields");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-surface-900">BuildStream</span>
        </div>

        <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-8">
          <h2 className="text-2xl font-bold text-surface-900 mb-1 text-center">Create your account</h2>
          <p className="text-sm text-surface-500 mb-6 text-center">Start building AI workflows for free</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
            />
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
              placeholder="At least 8 characters"
            />

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-surface-300 text-brand-600 focus:ring-brand-500 mt-0.5"
                defaultChecked
              />
              <span className="text-xs text-surface-500">
                I agree to the Terms of Service and Privacy Policy
              </span>
            </label>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-surface-500">Or sign up with</span>
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
        </div>

        <p className="mt-6 text-center text-sm text-surface-500">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-brand-600 hover:text-brand-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
