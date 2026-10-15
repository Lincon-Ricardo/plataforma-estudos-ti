export default function ProgressBar({ pct }: { pct: number }) {
  const v = Math.min(100, Math.max(0, pct));
  return (
    <div className="h-1.5 bg-line/60 overflow-hidden" role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full bg-accent transition-all" style={{ width: `${v}%` }} />
    </div>
  );
}
