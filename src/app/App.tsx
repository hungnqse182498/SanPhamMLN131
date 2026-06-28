import { useState, useEffect, useRef } from "react";
import {
  BookOpen, Network, Gamepad2, RotateCcw,
  CheckCircle2, XCircle, Clock, ChevronRight, ChevronLeft, Trophy, Eye, EyeOff,
  Star, GraduationCap, Compass,
} from "lucide-react";

type Page = "home" | "puzzle" | "mindmap" | "quiz" | "scenario";

// ─── TYPOGRAPHY HELPERS ──────────────────────────────────────────────────────

const OS = { fontFamily: "Oswald, sans-serif" } as const;
const VN = { fontFamily: "Be Vietnam Pro, sans-serif" } as const;

// ─── QUIZ DATA ───────────────────────────────────────────────────────────────

const QUIZ = [
  {
    q: "Nhà nước xã hội chủ nghĩa có bản chất là gì?",
    opts: [
      "Nhà nước của giai cấp vô sản thuần túy",
      "Nhà nước của toàn thể nhân dân lao động, do Đảng Cộng sản lãnh đạo",
      "Nhà nước liên minh các giai cấp bình đẳng",
      "Nhà nước trung lập, không đại diện cho giai cấp nào",
    ],
    ans: 1,
    ex: "Nhà nước XHCN là nhà nước của nhân dân lao động, đặt dưới sự lãnh đạo của Đảng Cộng sản.",
  },
  {
    q: "Nguyên tắc tổ chức và hoạt động cơ bản của Nhà nước XHCN là?",
    opts: [
      "Phân quyền triệt để (lập pháp, hành pháp, tư pháp độc lập)",
      "Đa đảng lãnh đạo luân phiên",
      "Tập trung dân chủ",
      "Phi tập trung hóa hoàn toàn",
    ],
    ans: 2,
    ex: "Tập trung dân chủ là nguyên tắc tổ chức và hoạt động cơ bản của nhà nước XHCN.",
  },
  {
    q: "Cơ quan quyền lực Nhà nước cao nhất của CHXHCN Việt Nam là?",
    opts: ["Chủ tịch nước", "Chính phủ", "Quốc hội", "Hội đồng Nhà nước"],
    ans: 2,
    ex: "Theo Hiến pháp, Quốc hội là cơ quan đại biểu cao nhất, cơ quan quyền lực nhà nước cao nhất.",
  },
  {
    q: "Chức năng đối nội của Nhà nước XHCN bao gồm?",
    opts: [
      "Chỉ bảo vệ an ninh quốc phòng",
      "Tổ chức xây dựng CNXH và trấn áp sự phản kháng của các thế lực thù địch",
      "Chỉ phát triển kinh tế thị trường",
      "Quản lý đối ngoại và ngoại giao",
    ],
    ans: 1,
    ex: "Chức năng đối nội gồm tổ chức xây dựng CNXH và trấn áp phản kháng của các thế lực thù địch.",
  },
  {
    q: "Hình thức cấu trúc nhà nước của CHXHCN Việt Nam là?",
    opts: ["Nhà nước liên bang", "Nhà nước liên minh", "Nhà nước đơn nhất", "Nhà nước quân chủ"],
    ans: 2,
    ex: "CHXHCN Việt Nam là nhà nước đơn nhất, lãnh thổ thống nhất.",
  },
  {
    q: "Theo Mác-Lênin, Nhà nước XHCN ra đời bằng con đường nào?",
    opts: [
      "Cải cách ôn hòa dần dần",
      "Bầu cử dân chủ đa đảng",
      "Cách mạng xã hội chủ nghĩa lật đổ nhà nước tư sản",
      "Thỏa hiệp giữa giai cấp công nhân và tư sản",
    ],
    ans: 2,
    ex: "NNXHCN ra đời qua cách mạng XHCN, lật đổ nhà nước tư sản và thiết lập chuyên chính vô sản.",
  },
];

// ─── PUZZLE COMPONENT LABELS ─────────────────────────────────────────────────

const COMP_LABELS = [
  { name: "ĐẢNG CỘNG SẢN", role: "Đội tiên phong lãnh đạo" },
  { name: "CÔNG NHÂN", role: "Giai cấp nòng cốt" },
  { name: "NÔNG DÂN", role: "Lực lượng cơ bản" },
  { name: "TRÍ THỨC", role: "Tầng lớp quan trọng" },
  { name: "NHÀ NƯỚC", role: "Trung tâm quyền lực" },
  { name: "PHÁP LUẬT", role: "Nền tảng pháp lý" },
  { name: "QUÂN ĐỘI", role: "Bảo vệ Tổ quốc" },
  { name: "KINH TẾ", role: "Nền tảng vật chất" },
  { name: "NGOẠI GIAO", role: "Quan hệ quốc tế" },
];

// ─── UTILS ───────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── NATIONAL EMBLEM SVG CONTENT ─────────────────────────────────────────────
// 450×450 composition — split into 3×3 grid (150×150 per piece)

function EmblemContent() {
  const COG_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];
  // Star centered at (225, 175), outer r=92, inner r=38
  const starPts = "225,83 247,144 313,147 261,187 279,249 225,213 171,249 189,187 138,147 203,144";
  return (
    <>
      {/* Background */}
      <rect width="450" height="450" fill="#C62828" />

      {/* Subtle grid lines for structure */}
      <line x1="150" y1="0" x2="150" y2="450" stroke="rgba(255,215,0,0.08)" strokeWidth="1" />
      <line x1="300" y1="0" x2="300" y2="450" stroke="rgba(255,215,0,0.08)" strokeWidth="1" />
      <line x1="0" y1="150" x2="450" y2="150" stroke="rgba(255,215,0,0.08)" strokeWidth="1" />
      <line x1="0" y1="300" x2="450" y2="300" stroke="rgba(255,215,0,0.08)" strokeWidth="1" />

      {/* Outer gold border */}
      <rect x="5" y="5" width="440" height="440" fill="none" stroke="#FFD700" strokeWidth="7" />
      <rect x="15" y="15" width="420" height="420" fill="none" stroke="#FFD700" strokeWidth="1.5" />

      {/* Corner ornaments */}
      {([[17, 17], [433, 17], [17, 433], [433, 433]] as [number, number][]).map(([cx, cy], i) => (
        <rect key={i} x={cx - 7} y={cy - 7} width="14" height="14" fill="#FFD700"
          transform={`rotate(45,${cx},${cy})`} />
      ))}

      {/* Mid-edge ornaments (small diamonds) */}
      {[112, 225, 337].map(pos => (
        <g key={pos}>
          <rect x={pos - 4} y={8} width="8" height="8" fill="#FFD700" transform={`rotate(45,${pos},12)`} />
          <rect x={pos - 4} y={434} width="8" height="8" fill="#FFD700" transform={`rotate(45,${pos},438)`} />
          <rect x={8} y={pos - 4} width="8" height="8" fill="#FFD700" transform={`rotate(45,12,${pos})`} />
          <rect x={434} y={pos - 4} width="8" height="8" fill="#FFD700" transform={`rotate(45,438,${pos})`} />
        </g>
      ))}

      {/* Top title */}
      <text x="225" y="42" textAnchor="middle" fill="#FFD700" fontSize="24" fontWeight="700"
        letterSpacing="5" style={OS}>NHÀ NƯỚC</text>

      {/* ── LEFT WHEAT BUNDLE (base at 72,308) ── */}
      <g stroke="#F9A825" strokeWidth="2.2" fill="none">
        <line x1="72" y1="308" x2="18" y2="135" />
        <line x1="72" y1="308" x2="33" y2="113" />
        <line x1="72" y1="308" x2="52" y2="103" />
        <line x1="72" y1="308" x2="67" y2="96" />
        <line x1="72" y1="308" x2="82" y2="97" />
        <line x1="72" y1="308" x2="95" y2="105" />
        <line x1="72" y1="308" x2="106" y2="118" />
        {/* stem tie */}
        <line x1="58" y1="262" x2="86" y2="262" stroke="#F9A825" strokeWidth="5" strokeLinecap="round" />
      </g>
      <ellipse cx="18" cy="126" rx="5" ry="10" fill="#F9A825" transform="rotate(-18,18,126)" />
      <ellipse cx="33" cy="104" rx="5" ry="10" fill="#F9A825" transform="rotate(-12,33,104)" />
      <ellipse cx="52" cy="94" rx="5" ry="10" fill="#F9A825" transform="rotate(-6,52,94)" />
      <ellipse cx="67" cy="87" rx="5" ry="10" fill="#F9A825" />
      <ellipse cx="82" cy="88" rx="5" ry="10" fill="#F9A825" />
      <ellipse cx="95" cy="96" rx="5" ry="10" fill="#F9A825" transform="rotate(8,95,96)" />
      <ellipse cx="106" cy="109" rx="5" ry="10" fill="#F9A825" transform="rotate(15,106,109)" />

      {/* ── RIGHT WHEAT BUNDLE (base at 378,308) ── */}
      <g stroke="#F9A825" strokeWidth="2.2" fill="none">
        <line x1="378" y1="308" x2="432" y2="135" />
        <line x1="378" y1="308" x2="417" y2="113" />
        <line x1="378" y1="308" x2="398" y2="103" />
        <line x1="378" y1="308" x2="383" y2="96" />
        <line x1="378" y1="308" x2="368" y2="97" />
        <line x1="378" y1="308" x2="355" y2="105" />
        <line x1="378" y1="308" x2="344" y2="118" />
        <line x1="364" y1="262" x2="392" y2="262" stroke="#F9A825" strokeWidth="5" strokeLinecap="round" />
      </g>
      <ellipse cx="432" cy="126" rx="5" ry="10" fill="#F9A825" transform="rotate(18,432,126)" />
      <ellipse cx="417" cy="104" rx="5" ry="10" fill="#F9A825" transform="rotate(12,417,104)" />
      <ellipse cx="398" cy="94" rx="5" ry="10" fill="#F9A825" transform="rotate(6,398,94)" />
      <ellipse cx="383" cy="87" rx="5" ry="10" fill="#F9A825" />
      <ellipse cx="368" cy="88" rx="5" ry="10" fill="#F9A825" />
      <ellipse cx="355" cy="96" rx="5" ry="10" fill="#F9A825" transform="rotate(-8,355,96)" />
      <ellipse cx="344" cy="109" rx="5" ry="10" fill="#F9A825" transform="rotate(-15,344,109)" />

      {/* ── GOLD STAR ── */}
      <polygon points={starPts} fill="#FFD700" />
      <polygon points={starPts} fill="none" stroke="#C8960C" strokeWidth="1.5" />

      {/* ── GOVERNMENT BUILDING ── */}
      {/* Pediment */}
      <polygon points="178,258 272,258 225,232" fill="#FFD700" />
      {/* Entablature */}
      <rect x="170" y="258" width="110" height="9" fill="#FFD700" />
      {/* 4 Columns */}
      <rect x="178" y="267" width="12" height="58" fill="#FFD700" rx="1" />
      <rect x="205" y="267" width="12" height="58" fill="#FFD700" rx="1" />
      <rect x="233" y="267" width="12" height="58" fill="#FFD700" rx="1" />
      <rect x="260" y="267" width="12" height="58" fill="#FFD700" rx="1" />
      {/* Stylobate */}
      <rect x="165" y="325" width="120" height="9" fill="#FFD700" />
      <rect x="158" y="334" width="134" height="5" fill="rgba(255,215,0,0.6)" />

      {/* ── COGWHEEL (center 225,390) ── */}
      <g transform="translate(225,390)">
        {COG_ANGLES.map(a => (
          <rect key={a} x="-9" y="-63" width="18" height="16" fill="#FFD700" rx="2"
            transform={`rotate(${a})`} />
        ))}
        <circle r="50" fill="#FFD700" />
        <circle r="31" fill="#C62828" />
        <circle r="12" fill="#FFD700" />
      </g>

      {/* ── BOTTOM RIBBON ── */}
      <rect x="30" y="420" width="390" height="24" fill="#1A237E" />
      <text x="225" y="436" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="700"
        letterSpacing="2.5" style={OS}>XÃ HỘI CHỦ NGHĨA VIỆT NAM</text>
    </>
  );
}

// ─── PUZZLE PIECE (variable grid size) ───────────────────────────────────────

function PuzzlePiece({
  correctIdx, gridSize, isSelected, isSolved, onClick, imageUrl,
}: {
  correctIdx: number; gridSize: number;
  isSelected: boolean; isSolved: boolean; onClick: () => void;
  imageUrl: string;
}) {
  const sz = 450 / gridSize;
  const col = correctIdx % gridSize;
  const row = Math.floor(correctIdx / gridSize);
  const clipId = `pc${gridSize}x${correctIdx}`;
  const showLbl = gridSize === 3 && !isSolved && correctIdx < COMP_LABELS.length;
  const lbl = showLbl ? COMP_LABELS[correctIdx] : null;

  return (
    <svg viewBox={`0 0 ${sz} ${sz}`} width={sz} height={sz} onClick={onClick}
      style={{ cursor: isSolved ? "default" : "pointer", display: "block" }}>
      {/* <defs>
        <clipPath id={clipId}><rect width={sz} height={sz} /></clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`} transform={`translate(${-col * sz},${-row * sz})`}>
        <EmblemContent />
      </g> */}
      <g transform={`translate(${-col * sz},${-row * sz})`}>
        <image href={imageUrl} width="450" height="450" preserveAspectRatio="xMidYMid slice" />
      </g>
      {lbl && (
        <g>
          <rect width={sz} height={sz} fill="rgba(10,8,5,0.6)" />
          <rect x={sz * 0.1} y={sz * 0.14} width={sz * 0.8} height="1.5" fill="#FFD700" opacity=".6" />
          <text x={sz / 2} y={sz / 2 - 5} textAnchor="middle" fill="#FFD700"
            fontSize={sz * 0.09} fontWeight="700" style={OS}>{lbl.name}</text>
          <text x={sz / 2} y={sz / 2 + 11} textAnchor="middle" fill="rgba(255,255,255,.7)"
            fontSize={sz * 0.065} style={VN}>{lbl.role}</text>
          <rect x={sz * 0.1} y={sz * 0.72} width={sz * 0.8} height="1" fill="#FFD700" opacity=".4" />
        </g>
      )}
      {isSelected && !isSolved && (
        <rect width={sz} height={sz} fill="none" stroke="#FFD700" strokeWidth={4} />
      )}
      <rect width={sz} height={sz} fill="none" stroke="rgba(255,255,255,.15)" strokeWidth=".5" />
    </svg>
  );
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────

function Navbar({ active, setActive }: { active: Page; setActive: (p: Page) => void }) {
const items: { id: Page; label: string; Icon: any }[] = [
    { id: "home", label: "Nội Dung", Icon: BookOpen },
    { id: "puzzle", label: "Ghép Ảnh", Icon: () => (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z" fill="currentColor" opacity="0.9"/>
      </svg>
    )},
    { id: "mindmap", label: "Sơ Đồ Tư Duy", Icon: Network },
    { id: "quiz", label: "Ôn Tập", Icon: GraduationCap },
    { id: "scenario", label: "Mini Game", Icon: Compass },
  ];
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#111111] border-b-4 border-[#D32F2F]">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Brand */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Flag mini */}
          <div className="w-8 h-6 bg-[#D32F2F] flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 14 14">
              <polygon points="7,1 8.5,5.5 13,5.5 9.4,8.2 10.9,12.7 7,10 3.1,12.7 4.6,8.2 1,5.5 5.5,5.5"
                fill="#FFD700" />
            </svg>
          </div>
          <div className="leading-none">
            <p className="text-[#D32F2F] text-[10px] uppercase tracking-[0.3em] font-semibold" style={VN}>
              Khoa Học Chủ Nghĩa Xã Hội
            </p>
            <p className="text-white font-bold text-sm" style={OS}>NHÀ NƯỚC XHCN</p>
          </div>
        </div>

        {/* Nav */}
        <div className="flex items-center">
          {items.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all duration-100 border-b-4 ${
                active === id
                  ? "text-[#FFD700] border-[#FFD700]"
                  : "text-white/60 border-transparent hover:text-white hover:border-white/30"
              }`}
              style={OS}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="hidden md:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────

// (sections rendered inline in HomePage)

function SectionHeader({ tag, title }: { tag: string; title: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="bg-[#D32F2F] text-white text-xs font-bold tracking-[0.25em] px-3 py-1" style={OS}>{tag}</div>
      <h2 className="text-3xl font-bold text-[#111111] leading-tight" style={OS}>{title}</h2>
      <div className="flex-1 h-px bg-[#111111]/15" />
    </div>
  );
}

function BulletRow({ items, color = "#D32F2F" }: { items: string[]; color?: string }) {
  return (
    <ul className="space-y-1.5">
      {items.map(pt => (
        <li key={pt} className="flex items-start gap-2 text-sm" style={VN}>
          <span style={{ color }} className="mt-0.5 flex-shrink-0 font-bold">▸</span>
          <span className="text-[#111111]/80">{pt}</span>
        </li>
      ))}
    </ul>
  );
}

function HomePage() {
  return (
    <div className="pt-16 min-h-screen bg-[#F5E9D0]">

      {/* ── HERO ── */}
      <div className="relative bg-[#111111] overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-12 top-0 bottom-0 w-64 bg-[#D32F2F]"
            style={{ clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0% 100%)" }} />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <div className="inline-block bg-[#D32F2F] text-white text-xs font-bold tracking-[0.3em] px-3 py-1 mb-5" style={OS}>
              CHƯƠNG III — HỌC THUYẾT MÁC-LÊNIN
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-none mb-4" style={OS}>NHÀ NƯỚC</h1>
            <h2 className="text-3xl md:text-5xl font-bold text-[#D32F2F] leading-none mb-6" style={OS}>XÃ HỘI CHỦ NGHĨA</h2>
            <p className="text-white/70 text-base max-w-md leading-relaxed" style={VN}>
              Bản chất, sự ra đời, chức năng, hình thức, nguyên tắc tổ chức và vai trò thực thi
              dân chủ của nhà nước trong giai đoạn quá độ lên chủ nghĩa xã hội.
            </p>
          </div>
          <div className="flex-shrink-0 opacity-85">
            <svg viewBox="0 0 150 150" width="150" height="150">
              <rect width="150" height="150" fill="#C62828" />
              <rect x="3" y="3" width="144" height="144" fill="none" stroke="#FFD700" strokeWidth="3" />
              <polygon points="75,20 82,45 108,46 88,62 95,87 75,73 55,87 62,62 42,46 68,45" fill="#FFD700" />
              <line x1="25" y1="100" x2="20" y2="55" stroke="#F9A825" strokeWidth="1.5" />
              <line x1="25" y1="100" x2="30" y2="50" stroke="#F9A825" strokeWidth="1.5" />
              <line x1="25" y1="100" x2="38" y2="48" stroke="#F9A825" strokeWidth="1.5" />
              <line x1="125" y1="100" x2="130" y2="55" stroke="#F9A825" strokeWidth="1.5" />
              <line x1="125" y1="100" x2="120" y2="50" stroke="#F9A825" strokeWidth="1.5" />
              <line x1="125" y1="100" x2="112" y2="48" stroke="#F9A825" strokeWidth="1.5" />
              <g transform="translate(75,128)">
                <circle r="16" fill="#FFD700" />
                <circle r="9" fill="#C62828" />
                <circle r="4" fill="#FFD700" />
              </g>
              <text x="75" y="12" textAnchor="middle" fill="#FFD700" fontSize="7" fontWeight="700" style={OS}>NHÀ NƯỚC</text>
            </svg>
          </div>
        </div>
      </div>

      {/* ── STATS BAR ── */}
      <div className="bg-[#D32F2F] py-4 px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-10">
          {[["4","Đặc Trưng"],["3","Loại Chức Năng"],["3","Hình Thức"],["4","Nguyên Tắc"],["4","Vai Trò Dân Chủ"]].map(([n,l]) => (
            <div key={l} className="text-center">
              <p className="text-4xl font-bold text-white leading-none" style={OS}>{n}</p>
              <p className="text-white/70 text-xs uppercase tracking-wider mt-1" style={VN}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">

        {/* ── LÝ DO NGHIÊN CỨU ── */}
        <div className="bg-white border-2 border-[#111111] overflow-hidden">
          <div className="bg-[#111111] px-6 py-3 flex items-center gap-3">
            <span className="text-[#FFD700] font-bold" style={OS}>※</span>
            <span className="text-white font-bold tracking-[0.2em] text-sm" style={OS}>LÝ DO NGHIÊN CỨU SẢN PHẨM</span>
          </div>
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x-2 divide-[#EDD9A3]">
            <div className="p-6">
              <p className="text-[#D32F2F] text-xs font-bold tracking-[0.2em] mb-3" style={OS}>VỀ MẶT LÝ LUẬN</p>
              <p className="text-sm text-[#111111]/80 leading-relaxed" style={VN}>
                Sản phẩm giúp người học hiểu rõ bản chất của Nhà nước XHCN, mối quan hệ giữa nhà nước
                và quyền làm chủ của nhân dân, cũng như vai trò của nhà nước trong quá trình xây dựng xã hội mới.
              </p>
            </div>
            <div className="p-6">
              <p className="text-[#D32F2F] text-xs font-bold tracking-[0.2em] mb-3" style={OS}>VỀ MẶT THỰC TIỄN</p>
              <p className="text-sm text-[#111111]/80 leading-relaxed" style={VN}>
                Nâng cao nhận thức chính trị cho thế hệ trẻ, tìm hiểu Nhà nước pháp quyền XHCN Việt Nam,
                quyền và nghĩa vụ công dân; lan tỏa thông tin chính thống và đưa lý luận đến gần hơn đời sống.
              </p>
            </div>
          </div>
        </div>

        {/* ── SỰ RA ĐỜI ── */}
        <div>
          <SectionHeader tag="1.1" title="Sự Ra Đời của Nhà Nước XHCN" />
          {/* Khái niệm */}
          <div className="bg-[#D32F2F] text-white p-6 mb-4 relative overflow-hidden">
            <div className="absolute right-4 top-2 text-[64px] font-bold opacity-10 leading-none select-none" style={OS}>?</div>
            <p className="text-[#FFD700] text-xs font-bold tracking-[0.2em] mb-2" style={OS}>KHÁI NIỆM</p>
            <p className="text-sm leading-relaxed text-white/90 relative z-10" style={VN}>
              Nhà nước xã hội chủ nghĩa là nhà nước mà ở đó <strong>quyền lực thuộc về giai cấp công nhân và nhân dân lao động</strong>;
              được sinh ra từ cách mạng xã hội chủ nghĩa và có sứ mệnh xây dựng thành công chủ nghĩa xã hội,
              đưa nhân dân lao động trở thành người làm chủ trên mọi lĩnh vực của đời sống xã hội.
            </p>
            <p className="text-white/50 text-xs mt-2 relative z-10" style={VN}>— Theo quan điểm của chủ nghĩa Mác – Lênin</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Nguyên nhân */}
            <div className="bg-[#111111] text-white p-6 relative overflow-hidden">
              <div className="absolute right-3 top-2 text-[64px] font-bold opacity-10 leading-none select-none" style={OS}>①</div>
              <p className="text-[#FFD700] text-xs font-bold tracking-[0.2em] mb-3 relative z-10" style={OS}>NGUYÊN NHÂN RA ĐỜI</p>
              <div className="space-y-3 relative z-10">
                <div>
                  <p className="text-[#D32F2F] text-xs font-bold mb-1" style={OS}>VỀ KINH TẾ</p>
                  <p className="text-white/75 text-xs leading-relaxed" style={VN}>
                    Lực lượng sản xuất phát triển cao nhưng bị kìm hãm bởi chế độ sở hữu tư nhân tư bản chủ nghĩa.
                  </p>
                </div>
                <div>
                  <p className="text-[#D32F2F] text-xs font-bold mb-1" style={OS}>VỀ XÃ HỘI</p>
                  <p className="text-white/75 text-xs leading-relaxed" style={VN}>
                    Giai cấp công nhân và nhân dân lao động bị bóc lột, dẫn đến các cuộc đấu tranh chống giai cấp tư sản.
                  </p>
                </div>
                <div className="border-t border-white/10 pt-3">
                  <p className="text-white/60 text-xs leading-relaxed" style={VN}>
                    Khi mâu thuẫn lên đỉnh điểm, cách mạng vô sản nổ ra dưới sự lãnh đạo của Đảng Cộng sản,
                    lật đổ nhà nước tư sản và thiết lập nhà nước xã hội chủ nghĩa.
                  </p>
                </div>
              </div>
            </div>

            {/* Ý nghĩa */}
            <div className="bg-[#EDD9A3] border-2 border-[#111111] p-6 relative overflow-hidden">
              <div className="absolute right-3 top-2 text-[64px] font-bold opacity-10 leading-none select-none" style={OS}>②</div>
              <p className="text-[#D32F2F] text-xs font-bold tracking-[0.2em] mb-3 relative z-10" style={OS}>Ý NGHĨA SỰ RA ĐỜI</p>
              <BulletRow items={[
                "Đánh dấu sự thay thế nhà nước tư sản bằng một kiểu nhà nước mới",
                "Tạo công cụ chính trị để nhân dân lao động thực hiện quyền làm chủ",
                "Là phương tiện tổ chức xây dựng xã hội mới — xã hội XHCN",
                "Từng bước xóa bỏ áp bức, bóc lột, hướng tới giải phóng con người",
              ]} />
              <div className="mt-4 bg-[#D32F2F] text-white px-3 py-2 text-xs leading-relaxed" style={VN}>
                <strong style={OS}>KẾT LUẬN:</strong> Sự ra đời của NNXHCN là kết quả tất yếu của đấu tranh giai cấp —
                công cụ để xây dựng xã hội công bằng, dân chủ, tiến bộ.
              </div>
            </div>
          </div>
        </div>

        {/* ── 1.2 BẢN CHẤT CỦA NNXHCN ── */}
        <div>
          <SectionHeader tag="1.2" title="Bản Chất của Nhà Nước XHCN" />
          <div className="bg-[#111111] text-white p-6 mb-4">
            <p className="text-[#FFD700] text-xs font-bold tracking-[0.2em] mb-2" style={OS}>KHÁI QUÁT</p>
            <p className="text-sm leading-relaxed text-white/85" style={VN}>
              Nhà nước XHCN là kiểu nhà nước mới, <strong>khác về chất</strong> so với tất cả các kiểu nhà nước đã tồn tại
              trong lịch sử — được xây dựng nhằm phục vụ lợi ích nhân dân lao động, hướng tới xã hội công bằng, dân chủ, văn minh.
              Bản chất thể hiện trên <strong className="text-[#FFD700]">ba phương diện</strong>: chính trị, kinh tế và tư tưởng – văn hóa xã hội.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-0">
            {/* Chính trị */}
            <div className="bg-[#D32F2F] text-white p-6 relative overflow-hidden">
              <p className="text-[64px] font-bold leading-none opacity-10 absolute right-2 top-0 select-none" style={OS}>1</p>
              <p className="text-[#FFD700] text-xs font-bold tracking-[0.2em] mb-3 relative z-10" style={OS}>BẢN CHẤT CHÍNH TRỊ</p>
              <ul className="space-y-2.5 relative z-10">
                {[
                  "Mang bản chất giai cấp công nhân, đại diện lợi ích nhân dân lao động trong xây dựng xã hội mới",
                  "Do Đảng Cộng sản lãnh đạo — định hướng nhà nước và xã hội xây dựng CNXH",
                  "Nhân dân là chủ thể quyền lực: Nhà nước của dân, do dân, vì dân — mọi quyền lực phục vụ nhân dân",
                ].map(pt => (
                  <li key={pt} className="flex items-start gap-2 text-xs" style={VN}>
                    <span className="text-[#FFD700] mt-0.5 flex-shrink-0">▸</span>
                    <span className="text-white/85">{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Kinh tế */}
            <div className="bg-[#111111] text-white p-6 relative overflow-hidden">
              <p className="text-[64px] font-bold leading-none opacity-10 absolute right-2 top-0 select-none" style={OS}>2</p>
              <p className="text-[#FFD700] text-xs font-bold tracking-[0.2em] mb-3 relative z-10" style={OS}>BẢN CHẤT KINH TẾ</p>
              <ul className="space-y-2.5 relative z-10">
                {[
                  "Chịu sự quy định của cơ sở kinh tế xã hội chủ nghĩa",
                  "Chế độ công hữu hoặc sở hữu xã hội đối với tư liệu sản xuất chủ yếu giữ vai trò quan trọng",
                  "Không ngừng nâng cao đời sống vật chất, cải thiện thu nhập và chất lượng cuộc sống cho mọi người dân",
                ].map(pt => (
                  <li key={pt} className="flex items-start gap-2 text-xs" style={VN}>
                    <span className="text-[#FFD700] mt-0.5 flex-shrink-0">▸</span>
                    <span className="text-white/85">{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Tư tưởng – Văn hóa */}
            <div className="bg-[#EDD9A3] border-t-2 border-[#111111] p-6 relative overflow-hidden">
              <p className="text-[64px] font-bold leading-none opacity-10 absolute right-2 top-0 select-none text-[#111111]" style={OS}>3</p>
              <p className="text-[#D32F2F] text-xs font-bold tracking-[0.2em] mb-3 relative z-10" style={OS}>TƯ TƯỞNG – VĂN HÓA XÃ HỘI</p>
              <ul className="space-y-2.5 relative z-10">
                {[
                  "Hệ tư tưởng chủ đạo: Chủ nghĩa Mác – Lênin là nền tảng lý luận định hướng",
                  "Kế thừa và chọn lọc những giá trị tiến bộ của các nhà nước trước",
                  "Hướng tới xóa bỏ phân hóa giai cấp, giảm bất bình đẳng xã hội",
                  "Bảo đảm quyền cơ bản: tự do, bình đẳng, học tập, lao động, tham gia quản lý xã hội",
                ].map(pt => (
                  <li key={pt} className="flex items-start gap-2 text-xs" style={VN}>
                    <span className="text-[#D32F2F] mt-0.5 flex-shrink-0">▸</span>
                    <span className="text-[#111111]/80">{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── BẢN CHẤT + HÌNH THỨC (tóm tắt) ── */}
        <div className="grid md:grid-cols-2 gap-0">
          <div className="bg-[#D32F2F] text-white p-8 relative overflow-hidden">
            <p className="text-[80px] font-bold leading-none opacity-10 absolute top-2 right-4 select-none" style={OS}>01</p>
            <div className="relative">
              <span className="inline-block text-xs font-bold tracking-[0.3em] border border-white/40 px-2 py-0.5 mb-3" style={OS}>BẢN CHẤT</span>
              <h2 className="text-3xl font-bold mb-3 leading-tight" style={OS}>Bản Chất</h2>
              <p className="text-sm leading-relaxed text-white/85 mb-4" style={VN}>
                Nhà nước XHCN là nhà nước của giai cấp công nhân và toàn thể nhân dân lao động, đặt dưới sự lãnh đạo
                của Đảng Cộng sản. Mang tính nhân dân sâu sắc — khác về chất so với các nhà nước bóc lột.
              </p>
              <BulletRow color="#FFD700" items={[
                "Nhà nước của nhân dân lao động",
                "Do Đảng Cộng sản lãnh đạo",
                "Tính nhân dân và tính giai cấp",
                "Thực hiện nền dân chủ XHCN",
              ]} />
            </div>
          </div>
          <div className="bg-[#F5E9D0] border-2 border-[#111111] p-8 relative overflow-hidden">
            <p className="text-[80px] font-bold leading-none opacity-10 absolute top-2 right-4 select-none" style={OS}>03</p>
            <div className="relative">
              <span className="inline-block text-xs font-bold tracking-[0.3em] border border-[#111111]/40 px-2 py-0.5 mb-3" style={OS}>HÌNH THỨC</span>
              <h2 className="text-3xl font-bold mb-3 text-[#111111]" style={OS}>Hình Thức</h2>
              <p className="text-sm leading-relaxed text-[#111111]/80 mb-4" style={VN}>
                Hình thức NNXHCN thể hiện qua chính thể, cấu trúc và chế độ chính trị. CHXHCN Việt Nam
                có cấu trúc đơn nhất, chính thể cộng hòa XHCN và nền dân chủ XHCN.
              </p>
              <BulletRow items={[
                "Chính thể: Cộng hòa xã hội chủ nghĩa",
                "Cấu trúc: Nhà nước đơn nhất",
                "Chế độ chính trị: Dân chủ XHCN",
                "Cơ quan cao nhất: Quốc hội",
              ]} />
            </div>
          </div>
        </div>

        {/* ── CHỨC NĂNG ── */}
        <div>
          <SectionHeader tag="1.3" title="Chức Năng của Nhà Nước XHCN" />
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            {[
              {
                basis: "Theo phạm vi tác động",
                items: ["Chức năng đối nội", "Chức năng đối ngoại"],
                bg: "#D32F2F", tc: "#FFD700", bc: "white",
              },
              {
                basis: "Theo lĩnh vực tác động",
                items: ["Chức năng chính trị", "Chức năng kinh tế", "Chức năng văn hóa, xã hội"],
                bg: "#111111", tc: "#FFD700", bc: "white",
              },
              {
                basis: "Theo tính chất quyền lực",
                items: ["Chức năng giai cấp: trấn áp", "Chức năng xã hội: tổ chức và xây dựng"],
                bg: "#EDD9A3", tc: "#D32F2F", bc: "#111111",
              },
            ].map(({ basis, items, bg, tc, bc }) => (
              <div key={basis} className="p-5 relative overflow-hidden" style={{ backgroundColor: bg }}>
                <p className="text-xs font-bold tracking-[0.15em] mb-3 opacity-70" style={{ ...OS, color: tc }}>
                  CĂN CỨ
                </p>
                <p className="text-xs mb-3 leading-snug" style={{ ...VN, color: tc }}>{basis}</p>
                <ul className="space-y-1.5">
                  {items.map(it => (
                    <li key={it} className="flex items-start gap-1.5 text-xs" style={{ ...VN, color: bc }}>
                      <span className="mt-0.5 flex-shrink-0" style={{ color: tc }}>▸</span>{it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {/* Điểm khác biệt */}
          <div className="bg-white border-l-4 border-[#D32F2F] p-6">
            <p className="text-[#D32F2F] text-xs font-bold tracking-[0.2em] mb-3" style={OS}>ĐIỂM KHÁC BIỆT CỦA NNXHCN</p>
            <div className="grid md:grid-cols-2 gap-4 text-sm" style={VN}>
              <div>
                <p className="font-bold text-[#111111] mb-1" style={OS}>NHÀ NƯỚC BÓC LỘT</p>
                <p className="text-[#111111]/70 text-xs leading-relaxed">
                  Là công cụ của thiểu số thống trị đối với đa số nhân dân lao động.
                  <strong className="text-[#D32F2F]"> Chức năng trấn áp giữ vai trò quan trọng</strong> nhằm duy trì địa vị giai cấp nắm quyền.
                </p>
              </div>
              <div>
                <p className="font-bold text-[#111111] mb-1" style={OS}>NHÀ NƯỚC XHCN</p>
                <p className="text-[#111111]/70 text-xs leading-relaxed">
                  Chức năng trấn áp vẫn tồn tại nhưng mang bản chất khác —
                  <strong className="text-[#D32F2F]"> chức năng tổ chức và xây dựng là nội dung quan trọng nhất</strong>,
                  tạo năng suất cao hơn, tổ chức lao động tốt hơn, mang lại đời sống tốt hơn cho nhân dân.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── NGUYÊN TẮC ── */}
        <div className="bg-[#111111] text-white p-8 relative overflow-hidden">
          <p className="text-[80px] font-bold leading-none opacity-10 absolute top-2 right-4 select-none" style={OS}>04</p>
          <div className="relative">
            <span className="inline-block text-xs font-bold tracking-[0.3em] border border-white/30 px-2 py-0.5 mb-3" style={OS}>NGUYÊN TẮC TỔ CHỨC</span>
            <h2 className="text-3xl font-bold mb-5" style={OS}>Nguyên Tắc Tổ Chức và Hoạt Động</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { n: "01", t: "Tập trung dân chủ", s: "Nguyên tắc nền tảng" },
                { n: "02", t: "Đảng CS lãnh đạo", s: "Giữ vai trò chủ đạo" },
                { n: "03", t: "Nhân dân tham gia", s: "Quản lý nhà nước" },
                { n: "04", t: "Pháp chế XHCN", s: "Tôn trọng pháp luật" },
              ].map(({ n, t, s }) => (
                <div key={n} className="border border-white/15 p-4">
                  <p className="text-[#D32F2F] text-2xl font-bold leading-none mb-2" style={OS}>{n}</p>
                  <p className="text-white text-xs font-bold mb-1" style={OS}>{t}</p>
                  <p className="text-white/50 text-xs" style={VN}>{s}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── DÂN CHỦ XHCN ── */}
        <div>
          <SectionHeader tag="2.1" title="Dân Chủ XHCN — Cơ Sở và Nền Tảng" />
          <div className="bg-[#D32F2F] text-white p-6 mb-4">
            <p className="text-sm leading-relaxed text-white/90" style={VN}>
              Dân chủ xã hội chủ nghĩa là <strong>cơ sở và nền tảng của nhà nước XHCN</strong> — chỉ trong điều kiện đó
              người dân mới có đầy đủ khả năng thực hiện ý chí của mình thông qua việc lựa chọn một cách công bằng,
              bình đẳng những người đại diện cho quyền lực chính đáng vào bộ máy nhà nước.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white border-2 border-[#111111] p-5">
              <p className="text-[#D32F2F] text-xs font-bold tracking-[0.2em] mb-3" style={OS}>VAI TRÒ CỦA DÂN CHỦ XHCN</p>
              <BulletRow items={[
                "Nhân dân tham gia trực tiếp hoặc gián tiếp vào quản lý nhà nước",
                "Khai thác và phát huy sức mạnh, trí tuệ của nhân dân",
                "Kiểm soát hiệu quả quyền lực nhà nước",
                "Ngăn chặn sự tha hóa quyền lực",
              ]} />
            </div>
            <div className="bg-[#EDD9A3] border-2 border-[#111111] p-5">
              <p className="text-[#D32F2F] text-xs font-bold tracking-[0.2em] mb-3" style={OS}>HẬU QUẢ NẾU VI PHẠM</p>
              <p className="text-sm text-[#111111]/80 leading-relaxed" style={VN}>
                Nếu các nguyên tắc của nền dân chủ XHCN bị vi phạm thì việc xây dựng nhà nước XHCN
                sẽ không đạt được mục tiêu đề ra — quyền lực của nhân dân có thể bị chuyển thành
                quyền lực phục vụ lợi ích của một nhóm người.
              </p>
            </div>
          </div>
        </div>

        {/* ── NHÀ NƯỚC LÀ CÔNG CỤ THỰC THI DÂN CHỦ ── */}
        <div>
          <SectionHeader tag="2.2" title="Nhà Nước — Công Cụ Thực Thi Quyền Làm Chủ" />
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                n: "1", title: "Thể Chế Hóa Ý Chí Nhân Dân",
                body: "Nhà nước cụ thể hóa ý chí, nguyện vọng và quyền lực của nhân dân thành các văn bản pháp luật, chính sách và hành lang pháp lý. Quyền làm chủ không chỉ là tuyên bố mà được đảm bảo bằng quy định pháp luật cụ thể.",
                bg: "#D32F2F", tc: "#FFD700", bc: "white",
              },
              {
                n: "2", title: "Xác Lập Quyền và Trách Nhiệm",
                body: "Thông qua pháp luật, Nhà nước phân định rõ quyền hạn và trách nhiệm của mỗi công dân — giúp người dân hiểu phạm vi quyền làm chủ và tham gia quản lý xã hội một cách chủ động.",
                bg: "#111111", tc: "#FFD700", bc: "white",
              },
              {
                n: "3", title: "Công Cụ Bảo Vệ Quyền Làm Chủ",
                body: "Nhà nước sử dụng quyền lực để ngăn chặn và trừng trị các hành vi xâm phạm quyền lợi chính đáng của người dân; bảo vệ nền dân chủ XHCN trước các thế lực thù địch và phần tử đi ngược lợi ích nhân dân.",
                bg: "#EDD9A3", tc: "#D32F2F", bc: "#111111",
              },
              {
                n: "4", title: "Phương Thức Thực Hiện Dân Chủ",
                body: "Tạo điều kiện để nhân dân tham gia quản lý nhà nước và xã hội. Tổ chức đời sống xã hội, phát triển kinh tế, văn hóa phục vụ nhân dân. Thực hiện phương châm: \"Dân biết, dân bàn, dân làm, dân kiểm tra\".",
                bg: "#FFFFFF", tc: "#D32F2F", bc: "#111111",
              },
            ].map(({ n, title, body, bg, tc, bc }) => (
              <div key={n} className="p-6 relative overflow-hidden border border-[#111111]/10"
                style={{ backgroundColor: bg }}>
                <p className="text-[64px] font-bold leading-none opacity-10 absolute right-3 top-0 select-none"
                  style={{ ...OS, color: tc }}>{n}</p>
                <p className="text-xs font-bold tracking-[0.2em] mb-2 relative z-10" style={{ ...OS, color: tc }}>
                  VAI TRÒ {n}
                </p>
                <h3 className="text-lg font-bold mb-3 leading-tight relative z-10" style={{ ...OS, color: bc }}>
                  {title}
                </h3>
                <p className="text-xs leading-relaxed relative z-10 opacity-80" style={{ ...VN, color: bc }}>
                  {body}
                </p>
              </div>
            ))}
          </div>
          <div className="bg-[#111111] text-white px-6 py-4 mt-1">
            <p className="text-sm text-center" style={VN}>
              <span className="text-[#FFD700] font-bold" style={OS}>TÓM LẠI: </span>
              Nhà nước XHCN không đứng trên nhân dân mà là công cụ do nhân dân tạo ra.
              Quyền làm chủ được hiện thực hóa thông qua việc Nhà nước xây dựng pháp luật,
              tổ chức thực thi và bảo vệ các quyền lợi chính đáng đó.
            </p>
          </div>
        </div>

        {/* ── QUOTE ── */}
        <div className="bg-[#111111] text-white p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-[#D32F2F]" />
          <div className="absolute top-4 left-8 text-[80px] font-bold text-[#D32F2F] leading-none opacity-30 select-none" style={OS}>"</div>
          <p className="text-lg md:text-xl italic leading-relaxed mb-4 relative z-10 max-w-2xl" style={VN}>
            Nhà nước ta là nhà nước của nhân dân, do nhân dân, vì nhân dân.
            Mọi quyền lực đều thuộc về nhân dân.
          </p>
          <p className="text-[#FFD700] font-bold tracking-wider text-sm relative z-10" style={OS}>— HỒ CHÍ MINH</p>
        </div>

      </div>
    </div>
  );
}

// ─── PUZZLE GAME ─────────────────────────────────────────────────────────────
import img1 from '../public/images/logo.png';
import img2 from '../public/images/logo1.jpg';
import img3 from '../public/images/logo2.png';
import img4 from '../public/images/logo3.jpg';
import img5 from '../public/images/logo4.jpg';

const LEVEL_IMAGES = [
  img1,
  img2,
  img3,
  img4,
  img5,
];

const LEVEL_CFG = [
  { g: 3, base: 100, startMoves: 5, maxQ: 5, mvRight: 4, mvWrong: 1, hintP: 15 },
  { g: 3, base: 150, startMoves: 3, maxQ: 5, mvRight: 4, mvWrong: 1, hintP: 15 },
  { g: 4, base: 220, startMoves: 6, maxQ: 5, mvRight: 6, mvWrong: 2, hintP: 20 },
  { g: 4, base: 280, startMoves: 5, maxQ: 5, mvRight: 6, mvWrong: 2, hintP: 20 },
  { g: 5, base: 380, startMoves: 8, maxQ: 6, mvRight: 8, mvWrong: 3, hintP: 25 },
];

interface LBEntry { id: string; name: string; score: number; level: number; }

const INIT_LB: LBEntry[] = [
  { id: "1", name: "Nguyễn Thành Công", score: 1540, level: 5 },
  { id: "2", name: "Trần Minh Hiếu",    score: 1280, level: 5 },
  { id: "3", name: "Lê Thị Thu Hà",     score:  970, level: 4 },
  { id: "4", name: "Phạm Quốc Bảo",     score:  820, level: 4 },
  { id: "5", name: "Vũ Hoài Nam",        score:  650, level: 3 },
  { id: "6", name: "Đặng Thúy Anh",     score:  520, level: 3 },
  { id: "7", name: "Hoàng Văn Đức",      score:  390, level: 2 },
];

function initPieces(count: number): number[] {
  let arr = Array.from({ length: count }, (_, i) => i);
  do { arr = shuffle(arr); } while (arr.every((v, i) => v === i));
  return arr;
}

type GamePhase = "start" | "puzzle" | "win" | "gameover";

function PuzzlePage() {
  // ── Leaderboard
  const [lb, setLb] = useState<LBEntry[]>(INIT_LB);
  const [showLb, setShowLb] = useState(false);
  const [lbName, setLbName] = useState("");
  const [lbScore, setLbScore] = useState("");

  // ── Game state
  const [phase, setPhase] = useState<GamePhase>("start");
  const [pName, setPName] = useState("");
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [lvlScore, setLvlScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [movesUsed, setMovesUsed] = useState(0);
  const [qPool, setQPool] = useState<number[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [qCorrect, setQCorrect] = useState(0);
  const [showQA, setShowQA] = useState(false);
  const [qaChosen, setQaChosen] = useState<number | null>(null);
  const [qaLocked, setQaLocked] = useState(false);
  const [hintCost, setHintCost] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [pieces, setPieces] = useState<number[]>([]);
  const [sel, setSel] = useState<number | null>(null);

  const cfg = LEVEL_CFG[Math.min(level - 1, LEVEL_CFG.length - 1)];
  const gridSize = cfg.g;
  const qsLeft = Math.max(0, cfg.maxQ - qIdx);
  const curQ = qPool[qIdx] != null ? QUIZ[qPool[qIdx]] : null;
  const estScore = Math.max(Math.round(cfg.base * 0.25), cfg.base - movesUsed * 2 + qCorrect * 8 - hintCost);

  // Detect solve
  useEffect(() => {
    if (phase !== "puzzle" || pieces.length === 0) return;
    if (!pieces.every((v, i) => v === i)) return;
    const earned = Math.max(Math.round(cfg.base * 0.25), cfg.base - movesUsed * 2 + qCorrect * 8 - hintCost);
    const ns = score + earned;
    setLvlScore(earned);
    setScore(ns);
    setLb(prev => {
      const has = prev.find(e => e.name === pName);
      const next = has
        ? prev.map(e => e.name === pName ? { ...e, score: Math.max(e.score, ns), level: Math.max(e.level, level) } : e)
        : [...prev, { id: String(Date.now()), name: pName, score: ns, level }];
      return [...next].sort((a, b) => b.score - a.score);
    });
    setPhase("win");
  }, [pieces]);

  function startLevel(lvl: number) {
    const c = LEVEL_CFG[lvl - 1];
    setLevel(lvl);
    setMoves(c.startMoves);
    setMovesUsed(0);
    setQPool(shuffle(Array.from({ length: QUIZ.length }, (_, i) => i)));
    setQIdx(0); setQCorrect(0); setHintCost(0); setShowHint(false);
    setPieces(initPieces(c.g * c.g));
    setSel(null); setShowQA(false); setQaChosen(null); setQaLocked(false);
    setPhase("puzzle");
  }

  function handleStart() {
    if (!pName.trim()) return;
    setScore(0);
    startLevel(1);
  }

  function handlePieceClick(pos: number) {
    if (phase !== "puzzle" || showQA) return;
    if (moves <= 0) {
      if (qsLeft > 0) { setShowQA(true); return; }
      setMoves(m => m + 3);
      return;
    }
    if (sel === null) { setSel(pos); return; }
    if (sel === pos) { setSel(null); return; }
    const next = [...pieces];
    [next[sel], next[pos]] = [next[pos], next[sel]];
    setPieces(next); setSel(null);
    setMoves(m => m - 1); setMovesUsed(m => m + 1);
  }

  function handleQA(choice: number) {
    if (qaLocked || !curQ) return;
    const correct = choice === curQ.ans;
    setQaChosen(choice); setQaLocked(true);
    setTimeout(() => {
      setMoves(m => m + (correct ? cfg.mvRight : cfg.mvWrong));
      if (correct) setQCorrect(c => c + 1);
      setQIdx(i => i + 1);
      setQaChosen(null); setQaLocked(false); setShowQA(false);
    }, 1300);
  }

  function handleHint() {
    if (!showHint) { setHintCost(h => h + cfg.hintP); setScore(s => Math.max(0, s - cfg.hintP)); }
    setShowHint(v => !v);
  }

  function handleNext() {
    if (level >= LEVEL_CFG.length) setPhase("gameover");
    else startLevel(level + 1);
  }

  // LB helpers
  const lbDelta = (id: string, d: number) =>
    setLb(p => [...p.map(e => e.id === id ? { ...e, score: Math.max(0, e.score + d) } : e)].sort((a, b) => b.score - a.score));
  const lbDel = (id: string) => setLb(p => p.filter(e => e.id !== id));
  function lbAdd() {
    if (!lbName.trim()) return;
    setLb(p => [...p, { id: String(Date.now()), name: lbName.trim(), score: parseInt(lbScore) || 0, level: 1 }].sort((a, b) => b.score - a.score));
    setLbName(""); setLbScore("");
  }

  const medal = (i: number) => i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`;
  const playerRank = lb.findIndex(e => e.name === pName);

  // ── Leaderboard drawer ──────────────────────────────────────────────────
  const lbDrawer = showLb && (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-end" onClick={() => setShowLb(false)}>
      <div className="bg-white w-full max-w-sm h-full overflow-y-auto shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="bg-[#111111] px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <span className="text-white font-bold text-sm tracking-wide" style={OS}>🏆 BẢNG XẾP HẠNG</span>
          <button onClick={() => setShowLb(false)} className="text-white/60 hover:text-white text-xl leading-none">×</button>
        </div>
        <div className="flex-1 divide-y divide-[#F5E9D0]">
          {lb.map((e, i) => (
            <div key={e.id} className={`px-3 pt-2 pb-2 ${i < 3 ? "bg-[#FFFBF0]" : "bg-white"} ${e.name === pName ? "ring-2 ring-inset ring-[#D32F2F]" : ""}`}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-7 text-center text-sm flex-shrink-0">{medal(i)}</span>
                <span className="flex-1 text-sm font-medium truncate" style={VN}>{e.name}</span>
                <span className="font-bold text-[#D32F2F] tabular-nums text-sm" style={OS}>{e.score}</span>
                <span className="text-[10px] bg-[#F5E9D0] text-[#111111]/50 px-1.5 py-0.5 flex-shrink-0" style={OS}>L{e.level}</span>
              </div>
              <div className="flex gap-1 pl-7">
                {([10, 50] as const).map(d => (
                  <button key={d} onClick={() => lbDelta(e.id, d)}
                    className="text-[10px] font-bold bg-green-100 text-green-700 hover:bg-green-200 px-2 py-0.5" style={OS}>+{d}</button>
                ))}
                {([10, 50] as const).map(d => (
                  <button key={d} onClick={() => lbDelta(e.id, -d)}
                    className="text-[10px] font-bold bg-red-100 text-red-600 hover:bg-red-200 px-2 py-0.5" style={OS}>−{d}</button>
                ))}
                <button onClick={() => lbDel(e.id)}
                  className="text-[10px] font-bold bg-[#111111] text-white hover:bg-red-800 px-2 py-0.5 ml-auto" style={OS}>✕</button>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t-2 border-[#111111] p-4 bg-[#F5E9D0] sticky bottom-0">
          <p className="text-[#D32F2F] text-xs font-bold tracking-[0.2em] mb-2" style={OS}>THÊM NGƯỜI CHƠI</p>
          <div className="flex gap-2 mb-2">
            <input value={lbName} onChange={e => setLbName(e.target.value)} placeholder="Tên..."
              className="flex-1 border-2 border-[#111111] bg-white px-2 py-1.5 text-xs outline-none" style={VN} />
            <input value={lbScore} onChange={e => setLbScore(e.target.value)} placeholder="Điểm" type="number"
              className="w-20 border-2 border-[#111111] bg-white px-2 py-1.5 text-xs outline-none" style={VN} />
          </div>
          <button onClick={lbAdd} className="w-full bg-[#D32F2F] text-white py-2 text-xs font-bold hover:bg-[#B71C1C]" style={OS}>
            + THÊM VÀO BẢNG
          </button>
        </div>
      </div>
    </div>
  );

  // ── START ──────────────────────────────────────────────────────────────
  if (phase === "start") return (
    <div className="pt-16 min-h-screen bg-[#F5E9D0] flex flex-col">
      {lbDrawer}
      <div className="bg-[#111111] text-white py-8 px-6 relative overflow-hidden">
        <div className="absolute inset-y-0 right-0 w-48 bg-[#D32F2F]" style={{ clipPath: "polygon(40% 0,100% 0,100% 100%,0% 100%)" }} />
        <div className="relative max-w-5xl mx-auto">
          <span className="inline-block bg-[#D32F2F] text-white text-xs font-bold tracking-[0.3em] px-3 py-1 mb-3" style={OS}>TRÒ CHƠI TƯƠNG TÁC</span>
          <h1 className="text-4xl font-bold text-white" style={OS}>GHÉP ẢNH — 5 MÀN</h1>
          <p className="text-white/60 text-sm mt-1" style={VN}>Trả lời câu hỏi → nhận lượt đi → ghép hình → leo bảng xếp hạng</p>
        </div>
      </div>
      <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 flex flex-col lg:flex-row gap-6">
        <div className="lg:w-72 flex-shrink-0 space-y-4">
          <div className="bg-white border-2 border-[#111111] p-6">
            <p className="text-[#D32F2F] text-xs font-bold tracking-[0.2em] mb-4" style={OS}>BẮT ĐẦU GAME</p>
            <input value={pName} onChange={e => setPName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleStart()} placeholder="Nhập tên của bạn..."
              className="w-full border-2 border-[#111111] bg-[#F5E9D0] px-3 py-2.5 text-sm mb-4 outline-none focus:border-[#D32F2F]" style={VN} />
            <button onClick={handleStart} disabled={!pName.trim()}
              className="w-full bg-[#D32F2F] text-white py-3 font-bold text-sm disabled:opacity-40 hover:bg-[#B71C1C] flex items-center justify-center gap-2" style={OS}>
              BẮT ĐẦU <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="bg-[#111111] text-white p-4">
            <p className="text-[#FFD700] text-xs font-bold tracking-[0.2em] mb-3" style={OS}>5 MÀN ĐỘ KHÓ TĂNG DẦN</p>
            <div className="space-y-2">
              {LEVEL_CFG.map((c, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-[#D32F2F] text-xs font-bold w-14 flex-shrink-0" style={OS}>Màn {i + 1}</span>
                  <div className="flex gap-0.5 flex-shrink-0">
                    {Array.from({ length: c.g }).map((_, r) => (
                      <div key={r} className="flex flex-col gap-0.5">
                        {Array.from({ length: c.g }).map((_, cc) => (
                          <div key={cc} className="w-2 h-2 bg-[#D32F2F] opacity-80" />
                        ))}
                      </div>
                    ))}
                  </div>
                  <span className="text-white/50 text-xs ml-auto" style={OS}>{c.g}×{c.g} • {c.base}đ</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[#D32F2F] text-xs font-bold tracking-[0.2em]" style={OS}>🏆 BẢNG XẾP HẠNG HIỆN TẠI</p>
            <button onClick={() => setShowLb(true)} className="text-xs text-[#111111]/50 hover:text-[#D32F2F] font-semibold underline" style={VN}>Quản lý →</button>
          </div>
          <div className="bg-white border-2 border-[#111111] divide-y divide-[#F5E9D0]">
            {lb.slice(0, 8).map((e, i) => (
              <div key={e.id} className={`flex items-center gap-3 px-4 py-2.5 ${i < 3 ? "bg-[#FFFBF0]" : ""}`}>
                <span className="text-base w-8 text-center flex-shrink-0">{medal(i)}</span>
                <span className="flex-1 text-sm font-medium truncate" style={VN}>{e.name}</span>
                <span className="font-bold text-[#D32F2F] tabular-nums" style={OS}>{e.score}</span>
                <span className="text-[10px] bg-[#F5E9D0] text-[#111111]/40 px-1.5 py-0.5" style={OS}>L{e.level}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ── PUZZLE ─────────────────────────────────────────────────────────────
  if (phase === "puzzle") return (
    <div className="pt-16 min-h-screen bg-[#F5E9D0] flex flex-col">
      {lbDrawer}
      <div className="bg-[#111111] text-white px-4 py-2 flex items-center gap-3 text-xs flex-wrap">
        <span className="font-bold text-[#FFD700]" style={OS}>MÀN {level}/{LEVEL_CFG.length}</span>
        <span className="text-white/30">|</span>
        <span style={VN}>Điểm: <strong className="text-white">{score}</strong></span>
        <span className="text-white/30">|</span>
        <span className={`font-bold tabular-nums ${moves <= 2 ? "text-red-400" : "text-[#FFD700]"}`} style={OS}>{moves} lượt</span>
        <span className="text-white/30">|</span>
        <span style={VN}>Câu hỏi: <strong className="text-white">{qsLeft} còn</strong></span>
        <button onClick={() => setShowLb(true)}
          className="ml-auto text-[#FFD700] text-xs font-bold border border-[#FFD700]/30 px-3 py-1 hover:bg-[#FFD700]/10" style={OS}>
          🏆 XẾP HẠNG
        </button>
      </div>
      <div className="bg-[#D32F2F]/30 h-1">
        <div className="bg-[#D32F2F] h-1 transition-all" style={{ width: `${((level - 1) / LEVEL_CFG.length) * 100}%` }} />
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Puzzle + QA overlay */}
        <div className="flex-shrink-0 relative">
          <div className="border-4 border-[#111111] shadow-2xl overflow-hidden relative"
            style={{ display: "grid", gridTemplateColumns: `repeat(${gridSize}, ${450 / gridSize}px)` }}>
            {pieces.map((ci, pos) => (
              <PuzzlePiece key={pos} correctIdx={ci} gridSize={gridSize}
                isSelected={sel === pos} isSolved={false} onClick={() => handlePieceClick(pos)}
                imageUrl={LEVEL_IMAGES[level - 1] || LEVEL_IMAGES[0]} />
            ))}
            {/* Q&A overlay */}
            {showQA && curQ && (
              <div className="absolute inset-0 bg-black/82 flex items-center justify-center p-4 z-20">
                <div className="bg-white border-2 border-[#111111] w-full max-w-xs">
                  <div className="bg-[#D32F2F] px-4 py-3">
                    <p className="text-white text-xs font-bold tracking-wider" style={OS}>CÂU {qIdx + 1}/{cfg.maxQ} — NHẬN LƯỢT ĐI</p>
                    <p className="text-[#FFD700] text-[10px] mt-0.5" style={VN}>Đúng: +{cfg.mvRight} lượt &nbsp;•&nbsp; Sai: +{cfg.mvWrong} lượt</p>
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-semibold text-[#111111] mb-3 leading-snug" style={VN}>{curQ.q}</p>
                    <div className="space-y-1.5">
                      {curQ.opts.map((opt, i) => {
                        let cls = "w-full text-left px-3 py-2 text-xs border-2 border-[#111111]/15 hover:border-[#D32F2F] transition-all";
                        if (qaLocked) {
                          if (i === curQ.ans) cls = "w-full text-left px-3 py-2 text-xs border-2 bg-green-600 border-green-600 text-white";
                          else if (i === qaChosen) cls = "w-full text-left px-3 py-2 text-xs border-2 bg-red-50 border-red-500 text-red-800";
                          else cls = "w-full text-left px-3 py-2 text-xs border-2 border-[#111111]/10 opacity-40";
                        }
                        return (
                          <button key={i} onClick={() => handleQA(i)} disabled={qaLocked} className={cls} style={VN}>
                            <span className="font-bold mr-1" style={OS}>{String.fromCharCode(65 + i)}.</span>{opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {gridSize === 3 && (
            <div className="mt-2 grid grid-cols-3 gap-0.5">
              {COMP_LABELS.map((c, i) => (
                <div key={i} className="bg-[#111111] text-center py-1 px-1">
                  <p className="text-[#FFD700] text-[9px] font-bold leading-tight" style={OS}>{c.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-3 w-full lg:w-56">
          <div className="bg-[#D32F2F] text-white p-4 text-center">
            <p className="text-xs opacity-70 mb-0.5" style={VN}>Điểm hiện tại</p>
            <p className="text-4xl font-bold leading-none" style={OS}>{score}</p>
          </div>
          <button onClick={() => qsLeft > 0 ? setShowQA(true) : setMoves(m => m + 3)}
            className={`flex items-center justify-center gap-2 py-3 font-bold text-xs border-2 border-[#111111] transition-all ${moves <= 2 ? "bg-[#D32F2F] text-white border-[#D32F2F]" : "bg-white text-[#111111] hover:bg-[#F5E9D0]"}`}
            style={OS}>
            {moves <= 2 ? "⚠ " : ""}
            {qsLeft > 0 ? `KIẾM LƯỢT (+${cfg.mvRight}/${cfg.mvWrong})` : "CẤP CỨU +3 LƯỢT"}
          </button>
          <button onClick={handleHint}
            className={`flex items-center justify-center gap-2 py-3 font-bold text-xs border-2 transition-all ${showHint ? "bg-[#EDD9A3] border-[#D32F2F] text-[#D32F2F]" : "bg-white border-[#111111] text-[#111111] hover:bg-[#F5E9D0]"}`}
            style={OS}>
            {showHint ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showHint ? "ẨN GỢI Ý" : `GỢI Ý (−${cfg.hintP}đ)`}
          </button>
          <button onClick={() => { setPieces(initPieces(gridSize * gridSize)); setSel(null); }}
            className="flex items-center justify-center gap-2 bg-[#111111] text-white py-3 font-bold text-xs hover:bg-black" style={OS}>
            <RotateCcw className="w-3.5 h-3.5" /> ĐẶT LẠI HÌNH
          </button>
          {/* Live stats */}
          <div className="bg-white border-2 border-[#111111] p-3 space-y-1.5 text-xs">
            {([
              ["Lượt đã dùng:", `${movesUsed}`, "#111111"],
              ["Trả lời đúng:", `${qCorrect}/${qIdx}`, "#16a34a"],
              ...(hintCost > 0 ? [["Phí gợi ý:", `−${hintCost}đ`, "#dc2626"]] : []),
            ] as [string, string, string][]).map(([l, v, c]) => (
              <div key={l} className="flex justify-between">
                <span className="text-[#111111]/60" style={VN}>{l}</span>
                <span className="font-bold" style={{ ...OS, color: c }}>{v}</span>
              </div>
            ))}
            <div className="border-t border-[#EDD9A3] pt-1.5 flex justify-between">
              <span className="text-[#111111]/60" style={VN}>Điểm dự kiến:</span>
              <span className="font-bold text-[#D32F2F]" style={OS}>{estScore}</span>
            </div>
          </div>
          {showHint && (
            <div className="border-2 border-[#D32F2F] overflow-hidden">
              <svg viewBox="0 0 450 450" width="208" height="208" className="block"><EmblemContent /></svg>
              <p className="bg-[#D32F2F] text-white text-center py-1 text-[9px] font-bold" style={OS}>GỢI Ý — ĐÃ TRỪ {cfg.hintP} ĐIỂM</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ── WIN ────────────────────────────────────────────────────────────────
  if (phase === "win") return (
    <div className="pt-16 min-h-screen bg-[#F5E9D0] flex flex-col">
      {lbDrawer}
      <div className="bg-[#111111] text-white py-8 px-6">
        <div className="max-w-lg mx-auto">
          <span className="inline-block bg-[#D32F2F] text-white text-xs font-bold tracking-[0.3em] px-3 py-1 mb-3" style={OS}>MÀN {level} — HOÀN THÀNH!</span>
          <h1 className="text-4xl font-bold" style={OS}>🎉 XUẤT SẮC!</h1>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="bg-white border-2 border-[#111111] max-w-sm w-full">
          <div className="bg-[#D32F2F] text-white p-6 text-center">
            <p className="text-xs opacity-70" style={VN}>Điểm nhận được màn {level}</p>
            <p className="text-6xl font-bold leading-none mt-1" style={OS}>+{lvlScore}</p>
          </div>
          <div className="p-5 space-y-2 border-b-2 border-[#EDD9A3] text-sm">
            {([
              [`Điểm cơ bản:`, `+${cfg.base}`, "#D32F2F"],
              [`Lượt đã dùng (${movesUsed} × −2):`, `−${movesUsed * 2}`, "#555"],
              [`Trả lời đúng (${qCorrect} × +8):`, `+${qCorrect * 8}`, "#16a34a"],
              ...(hintCost > 0 ? [[`Phí gợi ý:`, `−${hintCost}`, "#dc2626"]] : []),
            ] as [string, string, string][]).map(([lbl, val, clr]) => (
              <div key={lbl} className="flex justify-between">
                <span style={VN} className="text-[#111111]/70">{lbl}</span>
                <span className="font-bold" style={{ ...OS, color: clr }}>{val}</span>
              </div>
            ))}
          </div>
          <div className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-[#111111]/60 mb-0.5" style={VN}>Tổng điểm</p>
              <p className="text-3xl font-bold text-[#D32F2F]" style={OS}>{score}</p>
              {playerRank >= 0 && <p className="text-xs text-[#111111]/50 mt-1" style={VN}>Hạng {playerRank + 1} 🏆</p>}
            </div>
            <div className="flex flex-col gap-2 items-end">
              {level < LEVEL_CFG.length ? (
                <button onClick={handleNext}
                  className="bg-[#D32F2F] text-white px-5 py-3 font-bold text-sm flex items-center gap-2 hover:bg-[#B71C1C]" style={OS}>
                  MÀN {level + 1} ({LEVEL_CFG[level].g}×{LEVEL_CFG[level].g}) <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={handleNext} className="bg-[#111111] text-[#FFD700] px-5 py-3 font-bold text-sm hover:bg-black" style={OS}>
                  KẾT THÚC 🏆
                </button>
              )}
              <button onClick={() => setShowLb(true)} className="text-xs text-[#111111]/50 hover:text-[#D32F2F] font-semibold" style={VN}>
                Xem bảng xếp hạng →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ── GAME OVER ──────────────────────────────────────────────────────────
  return (
    <div className="pt-16 min-h-screen bg-[#F5E9D0] flex flex-col">
      {lbDrawer}
      <div className="bg-[#D32F2F] text-white py-12 px-6 text-center">
        <p className="text-[#FFD700] text-xs font-bold tracking-[0.35em] mb-2" style={OS}>HOÀN THÀNH 5 MÀN</p>
        <h1 className="text-5xl font-bold leading-none" style={OS}>{score}</h1>
        <p className="text-white/70 text-sm mt-2" style={VN}>điểm cuối cùng</p>
        {playerRank >= 0 && (
          <p className="text-white/80 text-base mt-3" style={VN}>
            {pName} — <span className="font-bold text-[#FFD700]">Hạng {playerRank + 1}</span>
          </p>
        )}
      </div>
      <div className="max-w-2xl mx-auto w-full px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold tracking-[0.2em] text-[#D32F2F]" style={OS}>🏆 BẢNG XẾP HẠNG</p>
          <button onClick={() => setShowLb(true)} className="text-xs text-[#111111]/50 hover:text-[#D32F2F] font-semibold underline" style={VN}>Quản lý →</button>
        </div>
        <div className="bg-white border-2 border-[#111111] divide-y divide-[#F5E9D0] mb-6">
          {lb.map((e, i) => (
            <div key={e.id} className={`flex items-center gap-3 px-4 py-3 ${i < 3 ? "bg-[#FFFBF0]" : ""} ${e.name === pName ? "ring-2 ring-inset ring-[#D32F2F]" : ""}`}>
              <span className="text-base w-8 text-center">{medal(i)}</span>
              <span className="flex-1 text-sm font-medium truncate" style={VN}>{e.name}</span>
              <span className="font-bold text-[#D32F2F] tabular-nums" style={OS}>{e.score}</span>
              <span className="text-[10px] bg-[#F5E9D0] text-[#111111]/40 px-1.5 py-0.5" style={OS}>L{e.level}</span>
            </div>
          ))}
        </div>
        <button onClick={() => { setPName(""); setPhase("start"); }}
          className="w-full bg-[#111111] text-white py-4 font-bold text-sm flex items-center justify-center gap-2 hover:bg-black" style={OS}>
          <RotateCcw className="w-4 h-4" /> CHƠI LẠI
        </button>
      </div>
    </div>
  );
}

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

function MindmapPage() {
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

// ─── ÔN TẬP PAGE ─────────────────────────────────────────────────────────────

type QuizPhase = "start" | "playing" | "result";

function QuizPage() {
  const [phase, setPhase] = useState<QuizPhase>("start");
  const [qi, setQi] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const answersRef = useRef<(number | null)[]>([]);
  const lockedRef = useRef(false);
  const qiRef = useRef(0);

  useEffect(() => {
    if (phase !== "playing" || locked) return;
    if (timeLeft === 0) return;
    const t = setTimeout(() => setTimeLeft(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft, locked]);

  useEffect(() => {
    if (phase === "playing" && timeLeft === 0 && !lockedRef.current) advance(null);
  }, [timeLeft]);

  function advance(choice: number | null) {
    if (lockedRef.current) return;
    lockedRef.current = true;
    setLocked(true);
    setChosen(choice);
    const newAnswers = [...answersRef.current, choice];
    answersRef.current = newAnswers;
    setTimeout(() => {
      const next = qiRef.current + 1;
      if (next >= QUIZ.length) {
        setPhase("result");
      } else {
        qiRef.current = next;
        setQi(next);
        setChosen(null);
        lockedRef.current = false;
        setLocked(false);
        setTimeLeft(30);
      }
    }, 1600);
  }

  function startQuiz() {
    answersRef.current = [];
    qiRef.current = 0;
    lockedRef.current = false;
    setPhase("playing");
    setQi(0);
    setChosen(null);
    setLocked(false);
    setTimeLeft(30);
  }

  // ── START ──────────────────────────────────────────────────────────────────
  if (phase === "start") return (
    <div className="pt-16 min-h-screen bg-[#F5E9D0] flex flex-col">
      <div className="bg-[#111111] text-white py-10 px-6 relative overflow-hidden">
        <div className="absolute inset-y-0 right-0 w-48 bg-[#D32F2F]" style={{ clipPath: "polygon(40% 0, 100% 0, 100% 100%, 0% 100%)" }} />
        <div className="relative max-w-5xl mx-auto">
          <span className="inline-block bg-[#D32F2F] text-white text-xs font-bold tracking-[0.3em] px-3 py-1 mb-3" style={OS}>ÔN TẬP</span>
          <h1 className="text-4xl font-bold text-white" style={OS}>QUIZ TRẮC NGHIỆM</h1>
          <p className="text-white/60 text-sm mt-1" style={VN}>Kiểm tra kiến thức về Nhà nước Xã Hội Chủ Nghĩa</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="bg-white border-2 border-[#111111] p-10 max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-[#D32F2F] flex items-center justify-center">
              <Trophy className="w-10 h-10 text-[#FFD700]" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-[#111111] mb-3 text-center" style={OS}>SẴN SÀNG CHƯA?</h2>
          <p className="text-[#111111]/65 text-sm mb-8 text-center leading-relaxed" style={VN}>
            {QUIZ.length} câu hỏi trắc nghiệm — mỗi câu 30 giây.
          </p>
          <div className="grid grid-cols-3 gap-3 mb-8">
            {([["6", "CÂU HỎI"], ["30s", "MỖI CÂU"], ["100", "ĐIỂM TỐI ĐA"]] as const).map(([v, l]) => (
              <div key={l} className="bg-[#F5E9D0] border border-[#EDD9A3] p-3 text-center">
                <p className="text-[#D32F2F] text-xl font-bold" style={OS}>{v}</p>
                <p className="text-[#111111]/55 text-[10px] font-semibold tracking-wider mt-0.5" style={OS}>{l}</p>
              </div>
            ))}
          </div>
          <button onClick={startQuiz}
            className="w-full bg-[#D32F2F] text-white py-4 font-bold text-base flex items-center justify-center gap-2 hover:bg-[#B71C1C] transition-colors"
            style={OS}>
            BẮT ĐẦU NGAY <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  // ── RESULT ─────────────────────────────────────────────────────────────────
  if (phase === "result") {
    const answers = answersRef.current;
    const score = answers.filter((a, i) => a === QUIZ[i].ans).length;
    const pct = Math.round((score / QUIZ.length) * 100);
    return (
      <div className="pt-16 min-h-screen bg-[#F5E9D0]">
        <div className="bg-[#111111] text-white py-10 px-6">
          <div className="max-w-2xl mx-auto">
            <span className="inline-block bg-[#D32F2F] text-white text-xs font-bold tracking-[0.3em] px-3 py-1 mb-3" style={OS}>KẾT QUẢ</span>
            <h1 className="text-4xl font-bold text-white" style={OS}>HOÀN THÀNH!</h1>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-4 py-10">
          <div className="bg-[#D32F2F] text-white p-8 text-center mb-8">
            <p className="text-7xl font-bold leading-none mb-2" style={OS}>{pct}%</p>
            <p className="text-white/80 text-sm" style={VN}>{score}/{QUIZ.length} câu đúng</p>
            <div className="mt-4 border-t border-white/20 pt-4">
              <p className="text-[#FFD700] font-bold text-lg" style={OS}>
                {pct >= 80 ? "XUẤT SẮC!" : pct >= 60 ? "KHÁ TỐT!" : "CẦN CỐ GẮNG THÊM!"}
              </p>
            </div>
          </div>
          <div className="space-y-3 mb-8">
            {QUIZ.map((q, i) => {
              const ua = answers[i];
              const ok = ua === q.ans;
              return (
                <div key={i} className={`bg-white border-l-4 p-4 ${ok ? "border-green-600" : "border-red-600"}`}>
                  <div className="flex gap-2 mb-2">
                    {ok
                      ? <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      : <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />}
                    <p className="text-sm font-semibold text-[#111111]" style={VN}>{q.q}</p>
                  </div>
                  <p className="text-xs text-green-700 pl-6" style={VN}>✓ {q.opts[q.ans]}</p>
                  {!ok && ua !== null && (
                    <p className="text-xs text-red-600/80 pl-6 mt-0.5" style={VN}>✗ {q.opts[ua]}</p>
                  )}
                  {!ok && ua === null && (
                    <p className="text-xs text-gray-500 pl-6 mt-0.5" style={VN}>— Hết thời gian</p>
                  )}
                </div>
              );
            })}
          </div>
          <button onClick={startQuiz}
            className="w-full bg-[#111111] text-white py-4 font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors"
            style={OS}>
            <RotateCcw className="w-4 h-4" /> CHƠI LẠI
          </button>
        </div>
      </div>
    );
  }

  // ── PLAYING ────────────────────────────────────────────────────────────────
  const q = QUIZ[qi];
  const prog = (qi / QUIZ.length) * 100;
  const timerPct = (timeLeft / 30) * 100;

  return (
    <div className="pt-16 min-h-screen bg-[#F5E9D0]">
      <div className="bg-[#D32F2F] text-white py-8 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-3">
            <span className="text-white/80 text-sm font-semibold" style={OS}>
              CÂU {qi + 1} / {QUIZ.length}
            </span>
            <span
              className={`flex items-center gap-1.5 font-bold text-sm tabular-nums ${timeLeft <= 10 ? "text-yellow-300" : "text-white/80"}`}
              style={OS}
            >
              <Clock className="w-4 h-4" /> {timeLeft}s
            </span>
          </div>
          <div className="w-full bg-white/20 h-1.5 rounded-full mb-3">
            <div className="bg-white h-1.5 rounded-full transition-all" style={{ width: `${prog}%` }} />
          </div>
          <div className="w-full bg-white/20 h-1 mb-5">
            <div
              className={`h-1 transition-all duration-1000 ${timeLeft <= 10 ? "bg-yellow-300" : "bg-white/70"}`}
              style={{ width: `${timerPct}%` }}
            />
          </div>
          <h2 className="text-lg md:text-xl font-bold leading-snug" style={OS}>{q.q}</h2>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-3">
          {q.opts.map((opt, i) => {
            let cls = "bg-white border-2 border-[#111111]/15 text-[#111111] hover:border-[#D32F2F] hover:bg-red-50 cursor-pointer";
            if (locked) {
              if (i === q.ans) cls = "bg-green-600 border-2 border-green-600 text-white cursor-default";
              else if (i === chosen) cls = "bg-red-100 border-2 border-red-600 text-red-800 cursor-default";
              else cls = "bg-white border-2 border-gray-200 text-gray-400 cursor-default opacity-60";
            }
            return (
              <button
                key={i}
                onClick={() => !locked && advance(i)}
                disabled={locked}
                className={`w-full text-left p-4 transition-all text-sm font-medium flex items-center gap-3 ${cls}`}
                style={VN}
              >
                <span
                  className="w-7 h-7 border-2 border-current/30 flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={OS}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span>{opt}</span>
                {locked && i === q.ans && (
                  <CheckCircle2 className="w-4 h-4 ml-auto flex-shrink-0 text-white" />
                )}
                {locked && i === chosen && i !== q.ans && (
                  <XCircle className="w-4 h-4 ml-auto flex-shrink-0 text-red-600" />
                )}
              </button>
            );
          })}
        </div>
        {locked && (
          <div
            className={`mt-5 border-l-4 p-4 text-sm ${
              chosen === q.ans
                ? "bg-green-50 border-green-600 text-green-800"
                : "bg-amber-50 border-amber-500 text-amber-900"
            }`}
            style={VN}
          >
            <p className="font-bold mb-1" style={OS}>
              {chosen === q.ans ? "CHÍNH XÁC!" : chosen === null ? "HẾT THỜI GIAN!" : "CHƯA ĐÚNG!"}
            </p>
            <p>{q.ex}</p>
          </div>
        )}
      </div>
    </div>
  );
}


// ─── MINI GAME (SCENARIO) PAGE ────────────────────────────────────────────────

interface ScChoice {
  text: string;   // main choice label
  sub: string;    // short hint beneath
  pts: number;
  stat: [number, number, number]; // [economy, power, prestige] delta
  fb: string;
}
interface ScStage {
  id: number;
  title: string;
  quote: string; // character quote (right panel)
  q: string;
  choices: ScChoice[];
}

const SCENARIO: ScStage[] = [
  {
    id: 1, title: "Lựa Chọn Lãnh Đạo",
    quote: "Cách mạng thành công! Chính quyền cũ sụp đổ. Nhân dân xuống đường mừng thắng lợi. Giờ này, ai sẽ đứng ra lãnh đạo đất nước mới?",
    q: "Bạn sẽ trao quyền lãnh đạo nhà nước cho ai?",
    choices: [
      { text: "Đảng Cộng sản Việt Nam", sub: "Đội tiên phong — có lý luận Mác-Lênin, đường lối xây dựng CNXH", pts: 2, stat: [10, 15, 10],
        fb: "✅ Đúng đắn! Đảng CS là đội tiên phong của giai cấp công nhân, có đường lối và năng lực lãnh đạo xây dựng CNXH — nguyên tắc cốt lõi của NNXHCN." },
      { text: "Hội đồng quân sự kiểm soát tạm thời", sub: "Duy trì trật tự ngắn hạn nhưng thiếu định hướng chính trị lâu dài", pts: 0, stat: [-5, 5, -5],
        fb: "⚠️ Quân sự duy trì trật tự ngắn hạn nhưng không đảm bảo định hướng XHCN. Cần Đảng CS với nền tảng lý luận Mác-Lênin." },
      { text: "Hội đồng đa đảng phương Tây", sub: "Phân tán quyền lực, mâu thuẫn định hướng chính trị", pts: -1, stat: [-5, -10, -5],
        fb: "❌ Đa đảng tư bản phân tán quyền lực và tạo mâu thuẫn định hướng — khó xây dựng NNXHCN có đường lối nhất quán." },
    ],
  },
  {
    id: 2, title: "Nền Tảng Kinh Tế",
    quote: "Nền kinh tế vẫn mang nặng dấu ấn chế độ cũ. Hàng triệu người lao động đang chờ đợi chính sách kinh tế mang lại công bằng và ấm no.",
    q: "Bạn sẽ lựa chọn chính sách kinh tế nào?",
    choices: [
      { text: "Quốc hữu hóa tư liệu sản xuất chủ yếu", sub: "Chế độ công hữu — loại bỏ bóc lột, đảm bảo lợi ích chung toàn xã hội", pts: 2, stat: [20, 5, 5],
        fb: "✅ Chính xác! Chế độ công hữu về tư liệu sản xuất là nền tảng kinh tế của NNXHCN — loại bỏ bóc lột và đảm bảo lợi ích chung." },
      { text: "Kinh tế hỗn hợp có kiểm soát của nhà nước", sub: "Phương án trung gian, phù hợp giai đoạn quá độ", pts: 1, stat: [8, 2, 2],
        fb: "⚠️ Có thể chấp nhận trong giai đoạn quá độ, nhưng cần lộ trình chuyển đổi rõ ràng sang chế độ công hữu." },
      { text: "Giữ nguyên kinh tế tư bản tư nhân tự do", sub: "Tái tạo bất bình đẳng và mâu thuẫn giai cấp", pts: -1, stat: [-15, -5, -5],
        fb: "❌ Kinh tế tư bản tự do tái tạo bất bình đẳng và mâu thuẫn giai cấp — đi ngược lại bản chất của NNXHCN." },
    ],
  },
  {
    id: 3, title: "Thiết Lập Pháp Chế",
    quote: "Không có pháp luật, không có nhà nước thực sự. Giờ là lúc đặt nền móng pháp lý để đất nước vận hành đúng quỹ đạo của chủ nghĩa xã hội.",
    q: "Bạn sẽ xây dựng hệ thống pháp luật như thế nào?",
    choices: [
      { text: "Soạn thảo Hiến pháp XHCN mới", sub: "Thể chế hóa ý chí nhân dân — khuôn khổ cho mọi hoạt động nhà nước", pts: 2, stat: [5, 10, 15],
        fb: "✅ Hoàn hảo! Pháp chế XHCN với Hiến pháp là xương sống của NNXHCN — thể chế hóa ý chí nhân dân thành pháp luật." },
      { text: "Sửa đổi một phần hệ thống luật cũ", sub: "Kế thừa có chọn lọc nhưng thiếu nền tảng pháp lý XHCN", pts: 0, stat: [0, 0, 0],
        fb: "⚠️ Kế thừa có chọn lọc cần thiết, nhưng luật cũ bảo vệ giai cấp tư sản. Cần Hiến pháp mới đặt nền tảng pháp lý XHCN." },
      { text: "Lãnh đạo ra chỉ thị, không cần luật thành văn", sub: "Dẫn đến độc đoán — vi phạm nguyên tắc pháp chế XHCN", pts: -2, stat: [-5, -15, -15],
        fb: "❌ Nguy hiểm! Không có pháp luật dẫn đến độc đoán. Nguyên tắc pháp chế XHCN đòi hỏi mọi hoạt động phải tuân pháp luật." },
    ],
  },
  {
    id: 4, title: "Quyền Lực Nhân Dân",
    quote: "Nhà nước đã có bộ khung. Nhưng nhân dân — chủ thể thực sự của quyền lực — phải được trao quyền làm chủ một cách thực chất và đầy đủ.",
    q: "Bạn sẽ đảm bảo quyền làm chủ của nhân dân bằng cách nào?",
    choices: [
      { text: "Xây dựng Quốc hội đại diện nhân dân", sub: "Bầu cử dân chủ — tập trung dân chủ — nhân dân tham gia thực chất", pts: 2, stat: [5, 10, 15],
        fb: "✅ Xuất sắc! Quốc hội là cơ quan quyền lực cao nhất đại diện ý chí nhân dân. Tập trung dân chủ yêu cầu nhân dân tham gia thực chất." },
      { text: "Đảng và Chính phủ quyết định thay nhân dân", sub: "Thiếu cơ chế dân chủ thực chất — nhân dân chỉ chấp hành", pts: -1, stat: [-5, -5, -10],
        fb: "⚠️ Thiếu cơ chế dân chủ thực chất làm suy yếu NNXHCN. Nhân dân cần tham gia, giám sát và kiểm tra hoạt động nhà nước." },
      { text: "Tập trung toàn bộ quyền lực vào một lãnh đạo", sub: "Vi phạm tập trung dân chủ — dẫn đến chuyên quyền độc đoán", pts: -2, stat: [-10, -10, -20],
        fb: "❌ Tập trung quyền lực cá nhân vi phạm nguyên tắc tập trung dân chủ — đối lập hoàn toàn với bản chất NNXHCN." },
    ],
  },
  {
    id: 5, title: "Đường Lối Đối Ngoại",
    quote: "Đất nước non trẻ đang cần nguồn lực và đồng minh. Đường lối ngoại giao sẽ định hình vị thế của nhà nước mới trên trường quốc tế.",
    q: "Bạn sẽ lựa chọn đường lối đối ngoại nào?",
    choices: [
      { text: "Đoàn kết quốc tế XHCN, quan hệ bình đẳng", sub: "Bảo vệ thành quả cách mạng — phát triển và mở rộng hợp tác quốc tế", pts: 2, stat: [10, 5, 20],
        fb: "✅ Đường lối đúng đắn! NNXHCN cần đoàn kết quốc tế XHCN, đồng thời mở rộng hợp tác bình đẳng với tất cả các nước." },
      { text: "Độc lập tự chủ, hạn chế quan hệ ngoại giao", sub: "Tránh can thiệp bên ngoài nhưng làm yếu sức mạnh quốc gia", pts: 0, stat: [0, 0, -5],
        fb: "⚠️ Độc lập tự chủ quan trọng nhưng cô lập hoàn toàn làm yếu sức mạnh. NNXHCN cần cân bằng tự chủ và hợp tác." },
      { text: "Phụ thuộc viện trợ các cường quốc nước ngoài", sub: "Vi phạm chủ quyền dân tộc — mất độc lập tự chủ", pts: -2, stat: [-5, -15, -15],
        fb: "❌ Phụ thuộc cường quốc vi phạm chủ quyền — nền tảng của mọi nhà nước. NNXHCN phải giữ vững độc lập trong đối ngoại." },
    ],
  },
];

type ScPhase = "intro" | "playing" | "result";

// Small SVG icons for stat bars
function EcoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
      <rect x="1" y="9" width="3" height="4" rx="0.5" />
      <rect x="5.5" y="6" width="3" height="7" rx="0.5" />
      <rect x="10" y="3" width="3" height="10" rx="0.5" />
    </svg>
  );
}
function PwrIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
      <polygon points="7,1 8.3,5 12.5,5 9.2,7.5 10.5,11.5 7,9 3.5,11.5 4.8,7.5 1.5,5 5.7,5" />
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="7" cy="7" r="5.5" />
      <ellipse cx="7" cy="7" rx="2.5" ry="5.5" />
      <line x1="1.5" y1="7" x2="12.5" y2="7" />
    </svg>
  );
}

function ScenarioPage() {
  const clamp = (v: number) => Math.max(0, Math.min(100, v));

  const [phase, setPhase] = useState<ScPhase>("intro");
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [stats, setStats] = useState<[number, number, number]>([50, 50, 50]);
  const [picked, setPicked] = useState<number | null>(null);
  const [history, setHistory] = useState<{ ci: number; pts: number; stat: [number, number, number] }[]>([]);

  const stage = SCENARIO[idx];
  const MAX_SCORE = 10;

  function pick(ci: number) {
    if (picked !== null) return;
    const c = stage.choices[ci];
    setPicked(ci);
    setScore(s => s + c.pts);
    setStats(prev => [
      clamp(prev[0] + c.stat[0]),
      clamp(prev[1] + c.stat[1]),
      clamp(prev[2] + c.stat[2]),
    ]);
    setHistory(h => [...h, { ci, pts: c.pts, stat: c.stat }]);
  }

  function next() {
    if (idx + 1 >= SCENARIO.length) setPhase("result");
    else { setIdx(i => i + 1); setPicked(null); }
  }

  function restart() {
    setPhase("intro"); setIdx(0); setScore(0);
    setStats([50, 50, 50]); setPicked(null); setHistory([]);
  }

  const ending = (() => {
    if (score >= 8) return { title: "NHÀ NƯỚC VỮNG MẠNH", emoji: "🏆", bg: "#16a34a", desc: "Xuất sắc! Bạn đã áp dụng đúng các nguyên tắc cốt lõi của NNXHCN. Đất nước phát triển công bằng, dân chủ và văn minh." };
    if (score >= 5) return { title: "ĐANG PHÁT TRIỂN", emoji: "✅", bg: "#D32F2F", desc: "Khá tốt! Nhà nước được xây dựng với phần lớn nguyên tắc đúng đắn, đang trong quá trình hoàn thiện." };
    if (score >= 2) return { title: "GẶP KHÓ KHĂN", emoji: "⚠️", bg: "#92400e", desc: "Nhà nước đối mặt nhiều thách thức. Cần điều chỉnh lại chính sách theo đúng nguyên tắc của NNXHCN." };
    return { title: "THẤT BẠI", emoji: "❌", bg: "#111111", desc: "Những lựa chọn sai lầm dẫn đến sụp đổ. Hãy ôn lại lý luận về NNXHCN và thử lại từ đầu!" };
  })();

  // ── STAT BARS ──────────────────────────────────────────────────────────────
  const statDefs: [string, React.ReactNode, number][] = [
    ["NỀN KINH TẾ", <EcoIcon />, 0],
    ["QUYỀN LỰC", <PwrIcon />, 1],
    ["UY TÍN QUỐC TẾ", <GlobeIcon />, 2],
  ];

  const StatBars = (
    <div className="grid grid-cols-3 gap-2 px-4 pt-4 pb-3">
      {statDefs.map(([label, icon, i]) => (
        <div key={i} className="bg-[#F5E9D0] px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-[#111111]/70">
              {icon}
              <span className="text-[10px] font-bold tracking-wide" style={OS}>{label}</span>
            </span>
            <span className="text-xs font-bold text-[#111111]" style={OS}>{stats[i]}%</span>
          </div>
          <div className="bg-[#111111]/15 h-1.5">
            <div className="bg-[#C8960C] h-1.5 transition-all duration-700" style={{ width: `${stats[i]}%` }} />
          </div>
        </div>
      ))}
    </div>
  );

  // ── AVATAR ──────────────────────────────────────────────────────────────────
  const Avatar = (
    <div className="flex flex-col items-center text-center w-28 flex-shrink-0">
      <div className="w-20 h-20 rounded-full bg-[#111111] border-4 border-[#C8960C] flex items-center justify-center mb-2 shadow-lg">
        <svg viewBox="0 0 40 40" width="40" height="40">
          <polygon
            points="20,4 23.5,14 34,14 25.5,20.5 28.5,30.5 20,24.5 11.5,30.5 14.5,20.5 6,14 16.5,14"
            fill="#FFD700"
          />
        </svg>
      </div>
      <p className="text-xs font-bold text-[#111111] leading-tight" style={OS}>NHÀ LÃNH ĐẠO</p>
      <p className="text-[10px] text-[#111111]/50 mt-0.5" style={VN}>Cách Mạng XHCN</p>
    </div>
  );

  // ── INTRO ──────────────────────────────────────────────────────────────────
  if (phase === "intro") return (
    <div className="pt-16 min-h-screen bg-[#111111] flex flex-col">
      {/* Header */}
      <div className="px-4 pt-8 pb-4">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block bg-[#D32F2F] text-white text-xs font-bold tracking-[0.3em] px-3 py-1 mb-4" style={OS}>MINI GAME</span>
          <h1 className="text-5xl font-bold text-white leading-none mb-2" style={OS}>MINI GAME</h1>
          <p className="text-white/50 text-sm" style={VN}>Hành trình xây dựng Nhà nước Xã Hội Chủ Nghĩa</p>
        </div>
      </div>

      <div className="flex-1 max-w-3xl mx-auto w-full px-4 pb-8">
        {/* Stat preview */}
        {StatBars}

        {/* Description card */}
        <div className="bg-white border border-[#111111]/20 p-0 overflow-hidden mb-4">
          <div className="flex">
            {/* Avatar panel */}
            <div className="bg-[#F5E9D0] flex flex-col items-center justify-center px-8 py-6 flex-shrink-0 border-r border-[#111111]/10">
              {Avatar}
            </div>
            {/* Description */}
            <div className="p-6 flex-1">
              <p className="text-[#D32F2F] text-xs font-bold tracking-[0.2em] mb-3" style={OS}>BỐI CẢNH LỊCH SỬ</p>
              <p className="text-sm leading-relaxed text-[#111111]/85" style={VN}>
                Bạn là nhà lãnh đạo đứng trước thời khắc lịch sử — cách mạng vừa thành công.
                <strong className="text-[#111111]"> Đưa ra 5 quyết định then chốt để xây dựng Nhà nước Xã Hội Chủ Nghĩa</strong> trên các lĩnh vực: lãnh đạo, kinh tế, pháp luật, quyền lực nhân dân và đối ngoại.
              </p>
              <p className="text-xs text-[#111111]/50 mt-3 leading-relaxed" style={VN}>
                Mỗi quyết định ảnh hưởng đến 3 chỉ số: Nền Kinh Tế · Quyền Lực · Uy Tín Quốc Tế
              </p>
            </div>
          </div>
        </div>

        {/* Stage map */}
        <div className="grid grid-cols-5 gap-1 mb-4">
          {SCENARIO.map((s, i) => (
            <div key={i} className="bg-[#F5E9D0] p-3 text-center">
              <div className="bg-[#D32F2F] text-white text-xs font-bold w-6 h-6 flex items-center justify-center mx-auto mb-2" style={OS}>{i + 1}</div>
              <p className="text-[9px] text-[#111111]/65 leading-tight" style={VN}>{s.title}</p>
            </div>
          ))}
        </div>

        <button onClick={() => setPhase("playing")}
          className="w-full bg-[#D32F2F] text-white py-4 font-bold text-base flex items-center justify-center gap-2 hover:bg-[#B71C1C] transition-colors" style={OS}>
          BẮT ĐẦU HÀNH TRÌNH <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  // ── PLAYING ────────────────────────────────────────────────────────────────
  if (phase === "playing") {
    const choice = picked !== null ? stage.choices[picked] : null;
    return (
      <div className="pt-16 min-h-screen bg-[#111111] flex flex-col">
        {/* Stat bars */}
        {StatBars}

        <div className="flex-1 max-w-3xl mx-auto w-full px-4 pb-8">
          {/* Stage chip */}
          <div className="mb-3">
            <span className="inline-block bg-[#D32F2F] text-white text-xs font-bold px-3 py-1.5 tracking-wide" style={OS}>
              GIAI ĐOẠN {stage.id}/{SCENARIO.length}: {stage.title.toUpperCase()}
            </span>
          </div>

          {/* Main card */}
          <div className="bg-white" style={{ border: "2px dashed rgba(17,17,17,0.25)" }}>
            {/* Top: avatar + quote/consequence */}
            <div className="flex border-b border-[#111111]/10">
              {/* Avatar panel */}
              <div className="bg-[#F5E9D0] flex flex-col items-center justify-center px-6 py-6 border-r border-[#111111]/10 flex-shrink-0">
                {Avatar}
              </div>

              {/* Quote / Consequence */}
              <div className="flex-1 p-6 flex flex-col justify-center">
                {picked === null ? (
                  <>
                    <p className="text-2xl font-bold text-[#D32F2F] leading-snug mb-3" style={OS}>
                      "{stage.quote}"
                    </p>
                    <p className="text-sm text-[#111111]/60 font-semibold" style={VN}>{stage.q}</p>
                  </>
                ) : (
                  <>
                    <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 mb-3 w-fit ${choice!.pts > 0 ? "bg-green-100 text-green-700" : choice!.pts === 0 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`} style={OS}>
                      {choice!.pts > 0 ? "KẾT QUẢ TỐT" : choice!.pts === 0 ? "KẾT QUẢ TRUNG LẬP" : "KẾT QUẢ XẤU"}
                      <span className="font-bold">({choice!.pts > 0 ? `+${choice!.pts}` : choice!.pts} điểm)</span>
                    </div>
                    <p className="text-sm leading-relaxed text-[#111111]/85" style={VN}>{choice!.fb}</p>
                    {/* Stat deltas */}
                    <div className="flex gap-3 mt-3">
                      {statDefs.map(([label, , i]) => {
                        const d = choice!.stat[i];
                        if (d === 0) return null;
                        return (
                          <span key={i} className={`text-xs font-bold flex items-center gap-1 ${d > 0 ? "text-green-600" : "text-red-600"}`} style={OS}>
                            {d > 0 ? `+${d}` : d} {label}
                          </span>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Choices */}
            <div className="p-4 space-y-2">
              {stage.choices.map((c, i) => {
                const isSelected = picked === i;
                const isDimmed = picked !== null && !isSelected;
                return (
                  <button key={i} onClick={() => pick(i)} disabled={picked !== null}
                    className={`w-full text-left flex items-start gap-3 p-4 border transition-all ${
                      isSelected
                        ? "border-[#D32F2F] bg-red-50"
                        : isDimmed
                        ? "border-[#111111]/10 bg-white opacity-35 cursor-default"
                        : "border-[#111111]/15 bg-white hover:border-[#D32F2F] hover:bg-red-50 cursor-pointer"
                    }`}>
                    {/* Letter badge */}
                    <div className={`w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors ${isSelected ? "bg-[#D32F2F] text-white" : isDimmed ? "bg-[#111111]/20 text-white" : "bg-[#111111] text-white"}`} style={OS}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-[#111111] leading-tight" style={VN}>{c.text}</p>
                      <p className="text-xs text-[#D32F2F]/75 mt-0.5 leading-tight" style={VN}>{c.sub}</p>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-[#D32F2F] flex-shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}

              {/* Continue button when picked */}
              {picked !== null && (
                <button onClick={next}
                  className="w-full bg-[#111111] text-white py-3 font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#D32F2F] transition-colors mt-3" style={OS}>
                  {idx + 1 < SCENARIO.length
                    ? `TIẾP THEO: ${SCENARIO[idx + 1].title.toUpperCase()} →`
                    : "XEM KẾT QUẢ CUỐI 🏆"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── RESULT ────────────────────────────────────────────────────────────────
  return (
    <div className="pt-16 min-h-screen bg-[#111111] flex flex-col">
      {/* Final stats */}
      {StatBars}

      {/* Result header */}
      <div style={{ backgroundColor: ending.bg }} className="text-white py-8 px-6 text-center">
        <p className="text-5xl mb-3">{ending.emoji}</p>
        <p className="text-xs font-bold tracking-[0.35em] opacity-70 mb-2" style={OS}>KẾT QUẢ CUỐI CÙNG</p>
        <h1 className="text-3xl font-bold" style={OS}>{ending.title}</h1>
        <p className="text-white/80 text-2xl font-bold mt-1" style={OS}>{Math.max(0, score)}/{MAX_SCORE} điểm</p>
      </div>

      <div className="max-w-3xl mx-auto w-full px-4 py-6">
        {/* Ending description */}
        <div className="bg-white border border-[#111111]/20 p-5 mb-5">
          <p className="text-sm leading-relaxed text-[#111111]/85" style={VN}>{ending.desc}</p>
        </div>

        {/* History of decisions */}
        <p className="text-xs font-bold tracking-[0.2em] text-[#D32F2F] mb-3" style={OS}>TỔNG KẾT CÁC QUYẾT ĐỊNH</p>
        <div className="space-y-2 mb-5">
          {history.map((h, i) => {
            const s = SCENARIO[i]; const c = s.choices[h.ci];
            return (
              <div key={i} className="bg-white border border-[#111111]/15 flex items-start overflow-hidden">
                <div className={`w-1.5 self-stretch flex-shrink-0 ${h.pts > 0 ? "bg-green-600" : h.pts === 0 ? "bg-amber-500" : "bg-red-600"}`} />
                <div className="flex items-start gap-3 p-3 flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-[#D32F2F] flex-shrink-0 w-20 leading-tight pt-0.5" style={OS}>{s.title}</span>
                  <span className="flex-1 text-xs text-[#111111]/70 leading-snug" style={VN}>{c.text}</span>
                  <span className={`text-xs font-bold flex-shrink-0 ${h.pts > 0 ? "text-green-600" : h.pts === 0 ? "text-amber-600" : "text-red-600"}`} style={OS}>
                    {h.pts > 0 ? `+${h.pts}` : h.pts}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={restart}
          className="w-full bg-[#D32F2F] text-white py-4 font-bold flex items-center justify-center gap-2 hover:bg-[#B71C1C] transition-colors" style={OS}>
          <RotateCcw className="w-4 h-4" /> CHƠI LẠI
        </button>
      </div>
    </div>
  );
}


// ─── APP ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("home");
  return (
    <div className="min-h-screen bg-[#F5E9D0]" style={VN}>
      <Navbar active={page} setActive={setPage} />
      {page === "home" && <HomePage />}
      {page === "puzzle" && <PuzzlePage />}
      {page === "mindmap" && <MindmapPage />}
      {page === "quiz" && <QuizPage />}
      {page === "scenario" && <ScenarioPage />}
    </div>
  );
}
