// Visible marker for content we don't have yet. Hidden everywhere once
// NEXT_PUBLIC_HIDE_TODOS=1 is set (do that before launch, after every TODO is resolved).
export function Todo({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  if (process.env.NEXT_PUBLIC_HIDE_TODOS === "1") return null;
  return (
    <p
      className={`rounded-lg border-2 border-dashed border-[#8a6d1f] bg-[#fff8e1] px-3 py-2 text-sm text-[#4a3b10] ${className}`}
      data-todo
    >
      <strong>TODO:</strong> {children}
    </p>
  );
}
