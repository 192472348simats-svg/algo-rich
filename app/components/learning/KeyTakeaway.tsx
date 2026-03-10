"use client";

interface KeyTakeawayProps {
  children: React.ReactNode;
  icon?: string;
}

/** Highlighted callout box for key learning points with a gold left border. */
export default function KeyTakeaway({
  children,
  icon = "💡",
}: KeyTakeawayProps) {
  return (
    <div className="my-5 flex gap-3 rounded-lg border-l-4 border-primary bg-primary/5 px-5 py-4">
      <span className="text-xl flex-shrink-0 mt-0.5">{icon}</span>
      <div className="text-[15px] font-medium text-foreground leading-relaxed">
        {children}
      </div>
    </div>
  );
}
