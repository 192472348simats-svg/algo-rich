export default function ProblemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Override parent layout padding — ProblemSolver uses fixed positioning
  return <div className="!p-0">{children}</div>;
}
