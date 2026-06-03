import { Eye, Download, Quote } from "lucide-react";
import type { Article } from "@/lib/mock-articles";

function fmt(n: number) {
  return n.toLocaleString("tr-TR");
}

// Kompakt metrik şeridi (başlık altı).
export function MetricsStrip({ metrics }: { metrics: Article["metrics"] }) {
  const items = [
    { icon: Eye, label: "Görüntülenme", value: metrics.views },
    { icon: Download, label: "İndirme", value: metrics.downloads },
    { icon: Quote, label: "Atıf", value: metrics.citations },
  ];
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-1.5 text-muted-foreground">
          <it.icon className="h-4 w-4" />
          <span className="font-semibold text-foreground">{fmt(it.value)}</span>
          <span>{it.label}</span>
        </div>
      ))}
    </div>
  );
}

// "Metrikler" sekmesi için büyük kartlar.
export function MetricsCards({ metrics }: { metrics: Article["metrics"] }) {
  const items = [
    { icon: Eye, label: "Görüntülenme", value: metrics.views },
    { icon: Download, label: "İndirme", value: metrics.downloads },
    { icon: Quote, label: "Atıf", value: metrics.citations },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((it) => (
        <div key={it.label} className="rounded-lg border border-border p-6 text-center">
          <it.icon className="mx-auto h-6 w-6 text-accent" />
          <div className="mt-3 font-serif-display text-3xl font-bold">{fmt(it.value)}</div>
          <div className="mt-1 text-sm text-muted-foreground">{it.label}</div>
        </div>
      ))}
    </div>
  );
}
