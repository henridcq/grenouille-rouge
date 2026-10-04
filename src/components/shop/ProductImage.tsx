import { useState } from "react";

/** Photo avec repli : bloc beige portant le nom, jamais d'image générique. */
export function ProductImage({ src, name, alt, className = "" }: { src?: string | undefined; name: string; alt?: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed || !src)
    return (
      <div role="img" aria-label={alt ?? name} className={`jute-block grid place-items-center p-4 text-center ${className}`}>
        <span className="font-display text-lg font-semibold text-foreground sm:text-xl">{name}</span>
      </div>
    );
  return <img src={src} alt={alt ?? name} loading="lazy" onError={() => setFailed(true)} className={`object-cover ${className}`} />;
}
