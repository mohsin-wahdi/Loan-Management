"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
  }>({});

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const nextErrors: { fullName?: string; email?: string; password?: string } = {};
    if (!fullName.trim()) nextErrors.fullName = "Full name is required";
    if (!email.trim()) nextErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = "Enter a valid email";
    if (!password.trim()) nextErrors.password = "Password is required";
    else if (password.length < 6) nextErrors.password = "Password must be at least 6 characters";
    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }
    setFieldErrors({});
    try {
      await signup({ fullName, email, password, role: "Borrower" });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="bg-white p-8 rounded-xl shadow w-full max-w-md space-y-4">
        <h1 className="text-2xl font-semibold">Borrower Signup</h1>
        <label className="text-sm font-medium block">Full Name</label>
        <input className="w-full border p-2 rounded" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        {fieldErrors.fullName && <p className="text-red-600 text-sm">{fieldErrors.fullName}</p>}
        <label className="text-sm font-medium block">Email</label>
        <input className="w-full border p-2 rounded" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        {fieldErrors.email && <p className="text-red-600 text-sm">{fieldErrors.email}</p>}
        <label className="text-sm font-medium block">Password</label>
        <input className="w-full border p-2 rounded" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {fieldErrors.password && <p className="text-red-600 text-sm">{fieldErrors.password}</p>}
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="w-full bg-blue-600 text-white py-2 rounded">Signup</button>
      </form>
    </main>
  );
}
