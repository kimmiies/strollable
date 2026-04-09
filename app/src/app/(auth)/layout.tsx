export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full flex flex-col lg:items-center lg:justify-center lg:bg-[var(--cream)] lg:p-6">
      {/* Card — full-width on mobile, centred max-w on desktop */}
      <div
        className="w-full lg:max-w-[440px] lg:rounded-[var(--r-xl)] lg:overflow-hidden"
        style={{ boxShadow: "var(--shadow-float)" }}
      >
        {/* ── Ink header ── */}
        <div
          className="relative overflow-hidden text-center bg-[var(--ink)] px-8 pt-12 pb-9"
        >
          {/* Radial sage glow (400 px circle, centred) */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              width: 400,
              height: 400,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(122,158,126,.15) 0%, transparent 70%)",
              top: -150,
              left: "50%",
              transform: "translateX(-50%)",
              pointerEvents: "none",
            }}
          />
          {/* Brand mark */}
          <div className="relative z-10 font-display text-[28px] font-light tracking-[-0.03em] text-[var(--warm-white)]">
            Stroll<em className="text-[var(--sage-light)]">able</em>
          </div>
          <div
            className="relative z-10 text-[13px] mt-1.5"
            style={{ color: "rgba(255,255,255,.35)" }}
          >
            Find spots your stroller will love
          </div>
        </div>

        {/* ── Body ── */}
        <div className="bg-[var(--warm-white)] px-8 py-8">
          {children}
        </div>
      </div>
    </div>
  );
}
