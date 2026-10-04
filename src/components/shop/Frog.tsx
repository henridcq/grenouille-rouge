export function Frog({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <g fill="var(--primary)">
        <circle cx="20" cy="20" r="9" />
        <circle cx="44" cy="20" r="9" />
        <ellipse cx="32" cy="38" rx="24" ry="17" />
      </g>
      <circle cx="20" cy="19" r="4" fill="var(--background)" />
      <circle cx="44" cy="19" r="4" fill="var(--background)" />
      <circle cx="21" cy="20" r="2" fill="var(--foreground)" />
      <circle cx="45" cy="20" r="2" fill="var(--foreground)" />
      <path d="M22 41 Q32 49 42 41" stroke="var(--background)" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}
