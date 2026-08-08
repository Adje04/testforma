import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

// Carte avec halo lumineux qui suit le curseur (style Aceternity).
export default function SpotlightCard({ icon: Icon, title, desc, children, className }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0, visible: false });

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top, visible: true });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => setPos((p) => ({ ...p, visible: false }))}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-card',
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(220px circle at ${pos.x}px ${pos.y}px, hsl(var(--primary) / 0.14), transparent 65%)`,
          opacity: pos.visible ? 1 : 0,
        }}
      />
      <div className="relative">
        {Icon && (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 text-primary">
            <Icon className="h-5 w-5" />
          </div>
        )}
        {title && <p className="mt-4 text-sm font-semibold text-foreground">{title}</p>}
        {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
        {children}
      </div>
    </div>
  );
}