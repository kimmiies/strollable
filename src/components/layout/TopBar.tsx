"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  action?: React.ReactNode;
  transparent?: boolean;
  className?: string;
}

export default function TopBar({
  title,
  showBack = false,
  action,
  transparent = false,
  className,
}: TopBarProps) {
  const router = useRouter();

  return (
    <header
      className={cn(
        "flex items-center h-14 px-4 gap-3",
        transparent ? "bg-transparent" : "bg-[var(--background)] border-b border-[var(--border)]",
        className
      )}
    >
      {showBack && (
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--muted)] transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}
      {title && (
        <h1 className="flex-1 font-semibold text-base truncate">{title}</h1>
      )}
      {!title && <div className="flex-1" />}
      {action && <div>{action}</div>}
    </header>
  );
}
