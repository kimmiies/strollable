import TopBar from "@/components/layout/TopBar";
import { Bell } from "lucide-react";

export default function NotificationsPage() {
  return (
    <div className="flex flex-col h-full bg-[var(--background)]">
      <TopBar title="Updates" />
      <div className="flex flex-col items-center justify-center flex-1 px-8 text-center gap-4 pb-nav">
        <div className="w-16 h-16 rounded-full bg-[var(--muted)] flex items-center justify-center">
          <Bell className="w-7 h-7 text-[var(--muted-foreground)]" />
        </div>
        <div>
          <h2 className="font-semibold text-[var(--foreground)]">
            Notifications coming soon
          </h2>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            You&apos;ll get notified when new verified listings appear in your area.
          </p>
        </div>
      </div>
    </div>
  );
}
