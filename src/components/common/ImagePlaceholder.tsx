interface ImagePlaceholderProps {
  label: string;
  className?: string;
}

/** Stand-in for a real photo/screenshot — swap for a real <Image> once assets exist. */
export function ImagePlaceholder({ label, className = "" }: ImagePlaceholderProps) {
  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-ink/[0.04] px-4 text-center ${className}`}
    >
      <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-soft">{label}</span>
    </div>
  );
}
