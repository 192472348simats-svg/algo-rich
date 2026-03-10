"use client";

const defaultColors = [
  "bg-gradient-to-br from-[#d4af37] to-[#f4d03f]",
  "bg-gradient-to-br from-[#7eb8ff] to-[#4a90d9]",
  "bg-gradient-to-br from-[#60d4a0] to-[#2ea87a]",
  "bg-gradient-to-br from-[#f0c674] to-[#d4a04a]",
];

const defaultInitials = ["AK", "SM", "JL", "RD"];

interface AvatarStackProps {
  /** Image URLs for avatars. Falls back to colored circles with initials. */
  avatars?: string[];
  /** Total count to show as "+X more" */
  count?: number;
}

/** Overlapping avatar circles for social proof. */
export default function AvatarStack({
  avatars,
  count = 127,
}: AvatarStackProps) {
  const displayCount = 4;
  const remaining = Math.max(0, count - displayCount);

  return (
    <div className="flex items-center">
      <div className="flex -space-x-2.5">
        {Array.from({ length: displayCount }).map((_, i) => (
          <div
            key={i}
            className={`w-9 h-9 rounded-full border-2 border-[var(--navy-dark)] flex items-center justify-center text-xs font-bold ${
              avatars && avatars[i]
                ? ""
                : defaultColors[i % defaultColors.length]
            }`}
            style={
              avatars && avatars[i]
                ? {
                    backgroundImage: `url(${avatars[i]})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : undefined
            }
          >
            {!(avatars && avatars[i]) && (
              <span className="text-background text-[10px]">
                {defaultInitials[i % defaultInitials.length]}
              </span>
            )}
          </div>
        ))}
      </div>
      {remaining > 0 && (
        <span className="ml-3 text-sm text-foreground/70">
          <span className="text-primary font-semibold">
            +{remaining}
          </span>{" "}
          learning this week
        </span>
      )}
    </div>
  );
}
