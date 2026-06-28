import { useState } from "react";
import { RotateCcw, CheckCircle2, ChevronRight } from "lucide-react";

const OS = { fontFamily: "Oswald, sans-serif" } as const;
const VN = { fontFamily: "Be Vietnam Pro, sans-serif" } as const;

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

export default function ScenarioPage() {
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