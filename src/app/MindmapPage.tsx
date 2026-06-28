import { useState } from "react";
const OS = { fontFamily: "Oswald, sans-serif" } as const;
const VN = { fontFamily: "Be Vietnam Pro, sans-serif" } as const;

// ─── MINDMAP PAGE ─────────────────────────────────────────────────────────────

interface MNode { id: string; label: string[]; x: number; y: number; parent?: string; level: 0 | 1 | 2; }

const MM: MNode[] = [
  { id: "root", label: ["NHÀ NƯỚC", "XHCN"], x: 540, y: 300, level: 0 },
  { id: "b1", label: ["Bản Chất"], x: 230, y: 140, parent: "root", level: 1 },
  { id: "b1a", label: ["Nhà nước", "của dân"], x: 60, y: 60, parent: "b1", level: 2 },
  { id: "b1b", label: ["Đảng CS", "lãnh đạo"], x: 60, y: 140, parent: "b1", level: 2 },
  { id: "b1c", label: ["Tính nhân", "dân sâu sắc"], x: 60, y: 220, parent: "b1", level: 2 },
  { id: "b2", label: ["Chức Năng"], x: 540, y: 75, parent: "root", level: 1 },
  { id: "b2a", label: ["Xây dựng", "CNXH"], x: 375, y: 18, parent: "b2", level: 2 },
  { id: "b2b", label: ["Bảo vệ", "Tổ quốc"], x: 540, y: 12, parent: "b2", level: 2 },
  { id: "b2c", label: ["Hợp tác", "quốc tế"], x: 705, y: 18, parent: "b2", level: 2 },
  { id: "b3", label: ["Hình Thức"], x: 850, y: 140, parent: "root", level: 1 },
  { id: "b3a", label: ["CH", "XHCN"], x: 1010, y: 60, parent: "b3", level: 2 },
  { id: "b3b", label: ["Nhà nước", "đơn nhất"], x: 1020, y: 140, parent: "b3", level: 2 },
  { id: "b3c", label: ["Dân chủ", "XHCN"], x: 1010, y: 220, parent: "b3", level: 2 },
  { id: "b4", label: ["Bộ Máy"], x: 850, y: 460, parent: "root", level: 1 },
  { id: "b4a", label: ["Quốc Hội"], x: 1010, y: 380, parent: "b4", level: 2 },
  { id: "b4b", label: ["Chính Phủ"], x: 1020, y: 460, parent: "b4", level: 2 },
  { id: "b4c", label: ["Tòa Án", "NDTC"], x: 1010, y: 540, parent: "b4", level: 2 },
  { id: "b5", label: ["Nguyên Tắc"], x: 230, y: 460, parent: "root", level: 1 },
  { id: "b5a", label: ["Tập trung", "dân chủ"], x: 60, y: 380, parent: "b5", level: 2 },
  { id: "b5b", label: ["Đảng CS", "lãnh đạo"], x: 60, y: 460, parent: "b5", level: 2 },
  { id: "b5c", label: ["Pháp chế", "XHCN"], x: 60, y: 540, parent: "b5", level: 2 },
];
const MM_MAP = Object.fromEntries(MM.map(n => [n.id, n]));

const LS = {
  0: { fill: "#D32F2F", text: "#FFD700", stroke: "#FFD700", sw: 3, w: 104, h: 56, r: 2, fs: 12, fw: "700" },
  1: { fill: "#111111", text: "#FFFFFF", stroke: "#D32F2F", sw: 2, w: 94, h: 38, r: 2, fs: 11, fw: "700" },
  2: { fill: "#F5E9D0", text: "#111111", stroke: "#111111", sw: 1.5, w: 86, h: 36, r: 2, fs: 9, fw: "600" },
} as const;

export default function MindmapPage() {
  const [hov, setHov] = useState<string | null>(null);
  return (
    <div className="pt-16 min-h-screen bg-[#F5E9D0]">
      <div className="bg-[#111111] text-white py-10 px-6 relative overflow-hidden">
        <div className="absolute inset-y-0 right-0 w-48 bg-[#D32F2F]" style={{ clipPath: "polygon(40% 0, 100% 0, 100% 100%, 0% 100%)" }} />
        <div className="relative max-w-5xl mx-auto">
          <span className="inline-block bg-[#D32F2F] text-white text-xs font-bold tracking-[0.3em] px-3 py-1 mb-3" style={OS}>HỆ THỐNG KIẾN THỨC</span>
          <h1 className="text-4xl font-bold text-white" style={OS}>SƠ ĐỒ TƯ DUY</h1>
          <p className="text-white/60 text-sm mt-1" style={VN}>Di chuột vào nút để làm nổi bật liên kết</p>
        </div>
      </div>

      <div className="overflow-x-auto py-8 px-4">
        <div style={{ minWidth: 1100, maxWidth: 1100 }} className="mx-auto">
          <svg viewBox="-5 -10 1110 620" className="w-full" style={VN}>
            <rect x="-5" y="-10" width="1110" height="620" fill="#F5E9D0" />
            {/* Connections */}
            {MM.filter(n => n.parent).map(node => {
              const par = MM_MAP[node.parent!];
              const act = hov === node.id || hov === node.parent;
              const mx = (par.x + node.x) / 2;
              return (
                <path key={`p${node.id}`}
                  d={`M${par.x},${par.y} C${mx},${par.y} ${mx},${node.y} ${node.x},${node.y}`}
                  fill="none"
                  stroke={act ? "#D32F2F" : "#111111"}
                  strokeWidth={act ? 2.5 : node.level === 2 ? 1.2 : 2}
                  strokeOpacity={act ? 1 : node.level === 2 ? 0.3 : 0.5}
                  strokeDasharray={node.level === 2 ? "5 3" : undefined}
                />
              );
            })}
            {/* Nodes */}
            {MM.map(node => {
              const s = LS[node.level];
              const act = hov === node.id;
              const lh = 13;
              return (
                <g key={node.id}
                  transform={`translate(${node.x - s.w / 2},${node.y - s.h / 2})`}
                  onMouseEnter={() => setHov(node.id)}
                  onMouseLeave={() => setHov(null)}
                  style={{ cursor: "default" }}>
                  <rect width={s.w} height={s.h} rx={s.r}
                    fill={act && node.level > 0 ? "#D32F2F" : s.fill}
                    stroke={act ? "#FFD700" : s.stroke}
                    strokeWidth={act ? 3 : s.sw}
                    filter={act ? "drop-shadow(0 3px 8px rgba(211,47,47,0.5))" : node.level === 0 ? "drop-shadow(0 4px 10px rgba(211,47,47,0.4))" : undefined}
                    style={{ transition: "all 0.12s" }} />
                  {node.label.map((line, li) => (
                    <text key={li}
                      x={s.w / 2}
                      y={s.h / 2 + (li - (node.label.length - 1) / 2) * lh + 4}
                      textAnchor="middle"
                      fill={act ? "#FFD700" : s.text}
                      fontSize={s.fs} fontWeight={s.fw}
                      style={{ ...OS, transition: "fill 0.12s", userSelect: "none" }}>
                      {line}
                    </text>
                  ))}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-12">
        <div className="bg-white border-2 border-[#111111] p-5 flex flex-wrap gap-6 items-center">
          {[
            { fill: "#D32F2F", stroke: "#FFD700", label: "Chủ đề trung tâm" },
            { fill: "#111111", stroke: "#D32F2F", label: "Nhánh chính" },
            { fill: "#F5E9D0", stroke: "#111111", label: "Nhánh phụ" },
          ].map(({ fill, stroke, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-5 h-5" style={{ backgroundColor: fill, border: `2px solid ${stroke}` }} />
              <span className="text-sm text-[#111111]" style={VN}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}