"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Role } from "../types";
import { useAuth } from "../context/AuthContext";

export function AuthGuard({
  children,
  allowedRoles
}: {
  children: React.ReactNode;
  allowedRoles?: Role[];
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.replace("/dashboard");
    }
  }, [user, loading, router, allowedRoles]);

  if (loading || !user) return <p className="p-6">Loading...</p>;
  if (allowedRoles && !allowedRoles.includes(user.role)) return null;
  return <>{children}</>;
}
