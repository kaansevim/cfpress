import type { Figure } from "@/lib/mock-articles";

const palette = ["#c2410c", "#0e7490", "#15803d", "#a16207", "#7e22ce", "#be185d"];

function BarChart() {
  const data = [62, 48, 78, 35, 90, 55, 70];
  const max = Math.max(...data);
  const bw = 100 / data.length;
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full">
      <line x1="30" y1="170" x2="310" y2="170" stroke="currentColor" strokeOpacity="0.2" />
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
        <line
          key={i}
          x1="30"
          x2="310"
          y1={170 - t * 140}
          y2={170 - t * 140}
          stroke="currentColor"
          strokeOpacity="0.06"
        />
      ))}
      {data.map((v, i) => {
        const h = (v / max) * 140;
        const x = 35 + i * (280 / data.length) + 4;
        return (
          <g key={i}>
            <rect
              x={x}
              y={170 - h}
              width={(280 / data.length) - 8}
              height={h}
              fill={palette[i % palette.length]}
              opacity="0.85"
              rx="2"
            />
          </g>
        );
      })}
      <text x="170" y="195" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.5">
        Coğrafi bölgeler
      </text>
    </svg>
  );
}

function ScatterChart() {
  const pts = Array.from({ length: 40 }, (_, i) => {
    const x = i / 40;
    const noise = (Math.sin(i * 7.3) + Math.cos(i * 2.1)) * 0.08;
    const y = 0.15 + x * 0.7 + noise;
    return { x: 30 + x * 270, y: 170 - y * 140 };
  });
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full">
      <line x1="30" y1="170" x2="310" y2="170" stroke="currentColor" strokeOpacity="0.2" />
      <line x1="30" y1="30" x2="30" y2="170" stroke="currentColor" strokeOpacity="0.2" />
      <line x1="35" y1="160" x2="305" y2="50" stroke="#c2410c" strokeWidth="1.5" strokeDasharray="4 3" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#0e7490" opacity="0.7" />
      ))}
      <text x="170" y="195" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.5">
        Organik madde (%)
      </text>
      <text
        x="12"
        y="100"
        fontSize="9"
        fill="currentColor"
        opacity="0.5"
        transform="rotate(-90 12 100)"
        textAnchor="middle"
      >
        Shannon indeksi
      </text>
    </svg>
  );
}

function RadarChart() {
  const cx = 160;
  const cy = 110;
  const r = 75;
  const axes = 6;
  const angles = Array.from({ length: axes }, (_, i) => (Math.PI * 2 * i) / axes - Math.PI / 2);
  const grid = [0.25, 0.5, 0.75, 1];
  const series = [
    { color: "#c2410c", vals: [0.9, 0.7, 0.85, 0.6, 0.8, 0.75] },
    { color: "#0e7490", vals: [0.6, 0.85, 0.55, 0.9, 0.65, 0.8] },
    { color: "#15803d", vals: [0.7, 0.6, 0.9, 0.55, 0.85, 0.7] },
  ];
  const point = (a: number, v: number) => `${cx + Math.cos(a) * r * v},${cy + Math.sin(a) * r * v}`;
  return (
    <svg viewBox="0 0 320 220" className="h-full w-full">
      {grid.map((g, i) => (
        <polygon
          key={i}
          points={angles.map((a) => point(a, g)).join(" ")}
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.1"
        />
      ))}
      {angles.map((a, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={cx + Math.cos(a) * r}
          y2={cy + Math.sin(a) * r}
          stroke="currentColor"
          strokeOpacity="0.1"
        />
      ))}
      {series.map((s, i) => (
        <polygon
          key={i}
          points={angles.map((a, j) => point(a, s.vals[j])).join(" ")}
          fill={s.color}
          fillOpacity="0.15"
          stroke={s.color}
          strokeWidth="1.5"
        />
      ))}
      {["Doğruluk", "Tutarlılık", "Akıcılık", "Terim", "Argüman", "Hız"].map((lbl, i) => (
        <text
          key={i}
          x={cx + Math.cos(angles[i]) * (r + 14)}
          y={cy + Math.sin(angles[i]) * (r + 14) + 3}
          textAnchor="middle"
          fontSize="9"
          fill="currentColor"
          opacity="0.7"
        >
          {lbl}
        </text>
      ))}
    </svg>
  );
}

function DataTable() {
  const rows = [
    ["Marmara", "38.2%", "24.7%", "12.1%"],
    ["Ege", "35.8%", "26.4%", "13.5%"],
    ["İç Anadolu", "41.5%", "22.9%", "10.8%"],
    ["Karadeniz", "33.1%", "21.5%", "18.7%"],
  ];
  return (
    <div className="h-full w-full overflow-hidden p-3">
      <table className="w-full text-[10px]">
        <thead>
          <tr className="border-b border-current/20 text-left">
            <th className="py-1 pr-2 font-semibold">Bölge</th>
            <th className="py-1 pr-2 font-semibold">Proteo.</th>
            <th className="py-1 pr-2 font-semibold">Actino.</th>
            <th className="py-1 font-semibold">Acido.</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-current/10">
              {r.map((c, j) => (
                <td key={j} className={`py-1 pr-2 ${j === 0 ? "font-medium" : "font-mono"}`}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MapView() {
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full">
      <rect x="0" y="0" width="320" height="200" fill="#f0f9ff" />
      {/* coastline-ish shapes */}
      <path
        d="M20,80 Q60,40 110,60 T200,50 Q260,70 300,100 L300,180 L20,180 Z"
        fill="#bae6fd"
        opacity="0.4"
      />
      {/* heat blobs */}
      {[
        { x: 90, y: 110, r: 32, c: "#ef4444" },
        { x: 140, y: 95, r: 26, c: "#f97316" },
        { x: 190, y: 120, r: 38, c: "#dc2626" },
        { x: 235, y: 100, r: 22, c: "#f59e0b" },
      ].map((b, i) => (
        <circle key={i} cx={b.x} cy={b.y} r={b.r} fill={b.c} opacity="0.45" />
      ))}
      {[
        { x: 80, y: 70, l: "Eminönü" },
        { x: 200, y: 75, l: "Sirkeci" },
        { x: 245, y: 130, l: "Sultanahmet" },
      ].map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="2" fill="#1e293b" />
          <text x={p.x + 5} y={p.y + 3} fontSize="8" fill="#1e293b">{p.l}</text>
        </g>
      ))}
    </svg>
  );
}

function pickRenderer(placeholder: string) {
  const p = placeholder.toLowerCase();
  if (p.includes("sütun") || p.includes("yığ")) return <BarChart />;
  if (p.includes("saçılım") || p.includes("scatter")) return <ScatterChart />;
  if (p.includes("radar")) return <RadarChart />;
  if (p.includes("tablo")) return <DataTable />;
  if (p.includes("harita") || p.includes("map")) return <MapView />;
  return <BarChart />;
}

export function MockFigure({ figure }: { figure: Figure }) {
  return (
    <div className="flex aspect-[16/10] items-center justify-center rounded-md border border-border bg-secondary/30 p-2 text-foreground/80">
      {pickRenderer(figure.placeholder)}
    </div>
  );
}
