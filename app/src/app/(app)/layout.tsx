import BottomNav from "@/components/layout/BottomNav";
import TopNav from "@/components/layout/TopNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full">
      <TopNav />
      <main className="flex-1 overflow-hidden">{children}</main>
      <BottomNav />
    </div>
  );
}
