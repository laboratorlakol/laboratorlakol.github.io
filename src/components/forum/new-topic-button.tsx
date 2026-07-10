"use client";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
export function NewTopicButton({ categorySlug }: { categoryId: string; categorySlug: string }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Button variant="outline" size="sm" asChild><Link href="/login">Conectează-te pentru a posta</Link></Button>;
  return <Button variant="primary" size="sm" asChild><Link href={`/forum/${categorySlug}/new`}><Plus size={15}/>Topic nou</Link></Button>;
}
