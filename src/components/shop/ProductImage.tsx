import { useState } from "react";

export function ProductImage({ src, name, className = "" }: { src?: string | undefined; name: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed || !src)
    return (
      <div className={`jute-block grid place-items-center p-4 text-center ${className}`}>
        <span className="font-display text-xl font-semibold text-foreground">{name}</span>
      </div>
    );
  return <img src={src} alt={name} loading="lazy" onError={() => setFailed(true)} className={`object-cover ${className}`} />;
}
