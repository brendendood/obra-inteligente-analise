import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: React.ReactNode;
  vertical?: boolean;
  reverse?: boolean;
  pauseOnHover?: boolean;
  repeat?: number;
  className?: string;
}

export function Marquee({
  children,
  vertical = false,
  reverse = false,
  pauseOnHover = false,
  repeat = 1,
  className,
}: MarqueeProps) {
  const direction = vertical ? 'column' : 'row';
  const animationName = vertical 
    ? (reverse ? 'marquee-vertical-reverse' : 'marquee-vertical')
    : (reverse ? 'marquee-horizontal-reverse' : 'marquee-horizontal');
  
  return (
    <div
      className={cn(
        "flex overflow-hidden",
        vertical ? "flex-col" : "flex-row",
        className
      )}
      style={{
        animationName,
        animationDuration: "var(--duration, 40s)",
        animationTimingFunction: "linear",
        animationIterationCount: "infinite",
        animationPlayState: pauseOnHover ? "running" : "running",
      }}
      onMouseEnter={pauseOnHover ? (e) => {
        (e.currentTarget as HTMLElement).style.animationPlayState = "paused";
      } : undefined}
      onMouseLeave={pauseOnHover ? (e) => {
        (e.currentTarget as HTMLElement).style.animationPlayState = "running";
      } : undefined}
    >
      {Array.from({ length: repeat }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "flex shrink-0",
            vertical ? "flex-col gap-4" : "flex-row gap-4"
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}