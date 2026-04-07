export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full flex flex-col items-center justify-center p-4 bg-[var(--background)]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--primary)]">
            Strollable
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Find places your stroller can actually get into.
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
