import Image from "next/image";

interface AvatarFrameProps {
  src: string | null;
  username: string;
  size?: number;
  frame?: string;
}

function initials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

const FRAME_STYLES: Record<string, string> = {
  circle:   "rounded-full border-4 border-void ring-2 ring-line",
  none:     "rounded-lg border-4 border-void",
  cannabis: "rounded-full border-4 border-void ring-2 ring-signal",  // kept as alias for circle
  hexagon:  "border-4 border-void ring-2 ring-signal",
};

const FALLBACK_STYLES: Record<string, string> = {
  circle:   "rounded-full",
  none:     "rounded-lg",
  cannabis: "rounded-full",
  hexagon:  "",
};

// Hexagon clip-path CSS
const HEX_CLIP = "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)";

export function AvatarFrame({ src, username, size = 80, frame = "circle" }: AvatarFrameProps) {
  const imgClass = FRAME_STYLES[frame] ?? FRAME_STYLES.circle;
  const fallbackClass = FALLBACK_STYLES[frame] ?? FALLBACK_STYLES.circle;
  const clipPath = frame === "hexagon" ? HEX_CLIP : undefined;
  const sizePx = `${size}px`;

  return (
    <div className="relative" style={{ width: sizePx, height: sizePx, flexShrink: 0 }}>
      {src ? (
        <Image
          src={src} alt={username} fill
          className={`object-cover ${imgClass}`}
          style={clipPath ? { clipPath } : undefined}
        />
      ) : (
        <div
          className={`w-full h-full flex items-center justify-center bg-panel font-display text-signal ${fallbackClass}`}
          style={{
            fontSize: size * 0.35,
            clipPath: clipPath,
          }}
        >
          {initials(username)}
        </div>
      )}

      {/* Cannabis themed decoration */}
      {frame === "cannabis" && (
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: "conic-gradient(from 0deg, rgba(78,255,58,0.0) 0deg, rgba(78,255,58,0.25) 30deg, rgba(78,255,58,0.0) 60deg, rgba(78,255,58,0.0) 90deg, rgba(78,255,58,0.25) 120deg, rgba(78,255,58,0.0) 150deg, rgba(78,255,58,0.0) 180deg, rgba(78,255,58,0.25) 210deg, rgba(78,255,58,0.0) 240deg, rgba(78,255,58,0.0) 270deg, rgba(78,255,58,0.25) 300deg, rgba(78,255,58,0.0) 330deg, rgba(78,255,58,0.0) 360deg)",
            opacity: 0.6,
          }}
        />
      )}
    </div>
  );
}
