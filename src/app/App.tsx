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
    q: "Thế nào là tăng trưởng kinh tế bền vững?",
    opts: [
      "Là sự tăng trưởng ổn định lâu dài và tốc độ rất cao",
      "Là sự tăng trưởng tương đối cao, ổn định trong thời gian tương đối dài",
      "Sự tăng trưởng gắn liền với bảo vệ môi trường sinh thái và tiến bộ xã hội",
      "Cả b và c",
    ],
    ans: 3,
    ex: "Tăng trưởng kinh tế bền vững yêu cầu sự ổn định trong thời gian dài gắn liền với bảo vệ môi trường sinh thái và tiến bộ xã hội.",
  },
  {
    q: "Trong các nhân tố tăng trưởng kinh tế, Đảng ta xác định nhân tố nào là cơ bản của tăng trưởng nhanh và bền vững?",
    opts: ["Vốn", "Con người", "Khoa học và công nghệ", "Cơ cấu kinh tế, thể chế kinh tế"],
    ans: 1,
    ex: "Đảng ta xác định nhân tố con người là cơ bản, là mục tiêu và động lực của sự phát triển nhanh và bền vững.",
  },
  {
    q: "Tăng trưởng kinh tế có vai trò thế nào?",
    opts: [
      "Là điều kiện để khắc phục tình trạng đói nghèo, lạc hậu",
      "Để tạo thêm việc làm, giảm thất nghiệp",
      "Để củng cố an ninh, quốc phòng",
      "Cả a, b và c",
    ],
    ans: 3,
    ex: "Tăng trưởng kinh tế đóng vai trò cốt lõi trong việc xóa đói giảm nghèo, giải quyết việc làm và củng cố tiềm lực an ninh quốc phòng.",
  },
  {
    q: "Phát triển kinh tế bao gồm những nội dung nào?",
    opts: [
      "Gia tăng GNP hoặc GDP trên đầu người.",
      "Cơ cấu kinh tế thay đổi theo hướng công nghiệp hóa.",
      "Chất lượng cuộc sống tăng lên, môi trường được bảo vệ.",
      "Cả a, b, c",
    ],
    ans: 3,
    ex: "Phát triển kinh tế là một quá trình toàn diện bao gồm tăng trưởng quy mô kinh tế, dịch chuyển cơ cấu và nâng cao chất lượng cuộc sống.",
  },
  {
    q: "Tiến bộ xã hội được thể hiện ở những mặt nào?",
    opts: [
      "Tiến bộ về kinh tế",
      "Tiến bộ về chính trị, xã hội",
      "Đời sống văn hoá, tinh thần ngày càng được nâng cao",
      "Cả a, b, c",
    ],
    ans: 3,
    ex: "Tiến bộ xã hội biểu hiện toàn diện trên cả ba mặt: kinh tế, chính trị - xã hội và đời sống văn hóa tinh thần.",
  },
  {
    q: "Sự kiện gì đánh dấu việc V.I.Lênin đã biến chủ nghĩa xã hội từ lý luận thành hiện thực?",
    opts: [
      "Cách mạng tháng Mười Nga 1917",
      "Sự ra đời của Liên Xô",
      "Sự chiến thắng trong nội chiến",
      "Cả a, b, c",
    ],
    ans: 0,
    ex: "Cách mạng tháng Mười Nga năm 1917 thành công đã chính thức đưa CNXH từ lý luận trở thành hiện thực sinh động trên thế giới.",
  },
  {
    q: "Bản chất của khủng hoảng kinh tế TBCN là:",
    opts: [
      "Khủng hoảng sản xuất 'thừa' so với nhu cầu xã hội",
      "Khủng hoảng sản xuất 'thừa' so với sức mua có hạn của quần chúng",
      "Sản xuất 'thiếu hụt' so với sức mua",
      "Nền kinh tế rối loạn",
    ],
    ans: 1,
    ex: "Khủng hoảng kinh tế TBCN mang bản chất là khủng hoảng sản xuất thừa, nhưng là 'thừa' so với sức mua có hạn của người lao động chứ không phải so với nhu cầu thực tế.",
  },
  {
    q: "Chu kỳ khủng hoảng kinh tế có mấy giai đoạn?",
    opts: ["2", "3", "4", "5"],
    ans: 2,
    ex: "Một chu kỳ khủng hoảng kinh tế của CNTB thường trải qua 4 giai đoạn: Khủng hoảng, Tiêu điều, Phục hồi và Hưng thịnh.",
  },
  {
    q: "Cuộc đại khủng hoảng kinh tế của CNTB nổ ra vào thời kỳ nào?",
    opts: ["1929 - 1933", "1954 - 1958", "1960 - 1963", "1973 - 1975"],
    ans: 0,
    ex: "Cuộc đại khủng hoảng kinh tế thế giới (hay còn gọi là thời kỳ Đại suy thoái) nổ ra khốc liệt nhất vào giai đoạn 1929 - 1933.",
  },
  {
    q: "Ai là người đầu tiên chia tư bản thành bất biến (c) và khả biến (v)?",
    opts: ["A.Smith", "D.Ricardo", "C.Mác", "F.Quesnay"],
    ans: 2,
    ex: "Các nhà kinh tế học trước đó chỉ chia thành tư bản cố định và lưu động. C.Mác là người đầu tiên chia thành tư bản bất biến (c) và khả biến (v) để làm rõ nguồn gốc bóc lột.",
  },
  {
    q: "Tư bản bất biến (c) là bộ phận tư bản:",
    opts: [
      "Giá trị chuyển dần vào sản phẩm",
      "Không thay đổi về lượng, chuyển nguyên vẹn sang sản phẩm",
      "Tăng lên trong quá trình sản xuất",
      "Chuyển ngay sau một chu kỳ",
    ],
    ans: 1,
    ex: "Tư bản bất biến (c) tồn tại dưới hình thức tư liệu sản xuất, giá trị của nó được bảo tồn và chuyển nguyên vẹn vào sản phẩm, không thay đổi về lượng giá trị.",
  },
  {
    q: "Tư bản khả biến (v) là bộ phận tư bản:",
    opts: [
      "Luôn biến đổi về lượng",
      "Sức lao động của công nhân làm thuê",
      "Nguồn gốc của giá trị thặng dư",
      "Cả b và c",
    ],
    ans: 3,
    ex: "Tư bản khả biến (v) dùng để mua sức lao động. Trong quá trình sản xuất, nó không những tái sản xuất ra giá trị của bản thân nó mà còn tạo ra giá trị thặng dư (m).",
  },
  {
    q: "Tư bản cố định là gì?",
    opts: [
      "TLSX như nhà xưởng, máy móc",
      "Tư bản bất biến",
      "Giá trị chuyển dần sang sản phẩm",
      "Cả a và c",
    ],
    ans: 3,
    ex: "Tư bản cố định bao gồm các tư liệu sản xuất như nhà xưởng, thiết bị, máy móc có đặc điểm là tham gia toàn bộ vào sản xuất nhưng giá trị chuyển dần từng phần vào sản phẩm.",
  },
  {
    q: "Tư bản lưu động bao gồm:",
    opts: [
      "Sức lao động, nguyên vật liệu, nhiên liệu",
      "Tham gia từng phần vào sản xuất",
      "Giá trị chuyển hết sang sản phẩm sau một chu kỳ",
      "Cả a và c",
    ],
    ans: 3,
    ex: "Tư bản lưu động gồm sức lao động (v) và một phần tư bản bất biến như nguyên nhiên vật liệu. Giá trị của nó chuyển hết toàn bộ vào sản phẩm sau một chu kỳ sản xuất.",
  },
  {
    q: "Hao mòn hữu hình của máy móc là do:",
    opts: [
      "Do sử dụng và tác động tự nhiên",
      "Do tiến bộ khoa học kỹ thuật",
      "Do máy móc cũ",
      "Khấu hao nhanh",
    ],
    ans: 0,
    ex: "Hao mòn hữu hình là sự mất mát về giá trị sử dụng và giá trị do quá trình làm việc (ma sát, hao tổn) hoặc do tác động của tự nhiên khi không sử dụng.",
  },
  {
    q: "Hao mòn vô hình là do:",
    opts: [
      "Sử dụng",
      "Tiến bộ kỹ thuật tạo ra máy mới rẻ hơn/năng suất hơn",
      "Tự nhiên",
      "Cả a và b",
    ],
    ans: 1,
    ex: "Hao mòn vô hình xảy ra thuần túy do sự phát triển của lực lượng sản xuất và tiến bộ kỹ thuật, làm xuất hiện các máy móc mới có hiệu suất cao hơn hoặc giá thành rẻ hơn.",
  },
  {
    q: "Tích lũy tư bản là:",
    opts: [
      "Biến một phần giá trị thặng dư thành tư bản",
      "Tích lũy có trước CNTB",
      "Tích lũy do bạo lực",
      "Tiết kiệm tư bản",
    ],
    ans: 0,
    ex: "Tích lũy tư bản là việc nhà tư bản sử dụng một phần giá trị thặng dư (m) để gộp vào tư bản ban đầu, tiếp tục mở rộng quy mô sản xuất.",
  },
  {
    q: "Nguồn gốc của tích lũy tư bản là:",
    opts: ["Tài sản kế thừa", "Lợi nhuận", "Giá trị thặng dư", "Của cái tiết kiệm"],
    ans: 2,
    ex: "Nguồn gốc duy nhất cấu thành nên tích lũy tư bản chính là giá trị thặng dư (m) do công nhân làm thuê tạo ra bị nhà tư bản chiếm đoạt.",
  },
  {
    q: "Tích tụ tư bản là:",
    opts: [
      "Tăng quy mô tư bản cá biệt bằng tư bản hóa giá trị thặng dư",
      "Kết quả của tích lũy",
      "Làm tăng tư bản xã hội",
      "Cả a, b, c",
    ],
    ans: 3,
    ex: "Tích tụ tư bản là quá trình tăng quy mô tư bản cá biệt bằng cách trích từ giá trị thặng dư thu được. Nó là kết quả trực tiếp của tích lũy và làm tăng tổng tư bản xã hội.",
  },
  {
    q: "Tập trung tư bản là:",
    opts: [
      "Hợp nhất các tư bản cá biệt nhỏ thành lớn",
      "Làm tăng tư bản xã hội",
      "Phảnánh quan hệ trực tiếp các nhà tư bản",
      "Cả a, c",
    ],
    ans: 3,
    ex: "Tập trung tư bản là sự liên kết, tổ hợp các tư bản cá biệt sẵn có trong xã hội thành một tư bản lớn hơn. Nó không làm tăng tổng tư bản xã hội mà chỉ sắp xếp lại cơ cấu sở hữu.",
  },
  {
    q: "Sự giống nhau giữa tích tụ và tập trung tư bản là:",
    opts: ["Nguồn gốc", "Vai trò", "Tăng quy mô tư bản cá biệt", "Tăng quy mô tư bản xã hội"],
    ans: 2,
    ex: "Dù có nguồn gốc và tác động đến tư bản xã hội khác nhau, nhưng cả tích tụ và tập trung tư bản đều dẫn đến kết quả chung là làm tăng quy mô của một tư bản cá biệt.",
  },
  {
    q: "Cấu tạo hữu cơ của tư bản là:",
    opts: [
      "Quan hệ TLSX và sức lao động",
      "Quan hệ giữa tư bản bất biến (c) và tư bản khả biến (v)",
      "Phản ánh mặt hiện vật và giá trị",
      "Cả a, b, c",
    ],
    ans: 3,
    ex: "Cấu tạo hữu cơ là cấu tạo giá trị của tư bản (c/v), do cấu tạo kỹ thuật (TLSX/Sức lao động) quyết định và phản ánh sự biến động của cấu tạo kỹ thuật đó.",
  },
  {
    q: "Thời gian chu chuyển của tư bản gồm:",
    opts: [
      "Thời gian sản xuất và thời gian lưu thông",
      "Thời gian lao động và thời gian dự trữ",
      "Thời gian sản xuất và thời gian tiêu thụ",
      "Thời gian lưu thông và thời gian gián đoạn",
    ],
    ans: 0,
    ex: "Thời gian chu chuyển của tư bản được tính bằng tổng thời gian tư bản nằm trong vòng quay sản xuất kết hợp với thời gian thực hiện lưu thông trên thị trường.",
  },
  {
    q: "Nhân tố nào ảnh hưởng đến thời gian sản xuất?",
    opts: ["Dự trữ sản xuất", "Tính chất ngành sản xuất", "Năng suất lao động", "Cả a, b, c"],
    ans: 3,
    ex: "Thời gian sản xuất chịu tác động lớn bởi các yếu tố đặc thù của ngành, trình độ công nghệ tăng năng suất và thời gian vật tư nằm ở dạng dự trữ chuẩn bị.",
  },
  {
    q: "Cách rút ngắn thời gian sản xuất?",
    opts: ["Cải tiến kỹ thuật", "Tăng năng suất lao động", "Cải tiến tổ chức sản xuất", "Cả a, b, c"],
    ans: 3,
    ex: "Để tối ưu và giảm thời gian sản xuất, doanh nghiệp phải ứng dụng công nghệ hiện đại, thúc đẩy năng suất và tổ chức dây chuyền khoa học.",
  },
  {
    q: "Cách rút ngắn thời gian lưu thông?",
    opts: ["Giảm giá", "Nâng cao chất lượng", "Quảng cáo, cải tiến phương thức bán", "Cả a, b, c"],
    ans: 3,
    ex: "Thời gian lưu thông được rút ngắn thông qua các chiến lược thị trường như điều chỉnh giá cả phù hợp, nâng chất lượng sản phẩm và tối ưu kênh phân phối, tiếp thị.",
  },
  {
    q: "Thu nhập quốc dân về mặt giá trị bao gồm:",
    opts: ["c + v + m", "Toàn bộ giá trị mới (v+m) tạo ra", "Chỉ có c+v", "v+m"],
    ans: 1,
    ex: "Thu nhập quốc dân là phần giá trị mới hoàn toàn do lao động sống tạo ra trong năm, được ký hiệu về mặt lượng giá trị là (v + m).",
  },
  {
    q: "Ai phát hiện phạm trù cấu tạo hữu cơ của tư bản?",
    opts: ["A.Smith", "D.Ricardo", "C.Mác", "Ph.Ăngghen"],
    ans: 2,
    ex: "C.Mác là nhà kinh tế chính trị đầu tiên phát hiện ra cấu tạo hữu cơ (c/v), vạch rõ mối quan hệ khăng khít giữa kỹ thuật và giá trị tư bản.",
  },
  {
    q: "Tỷ suất lợi nhuận (p') phản ánh:",
    opts: ["Trình độ bóc lột", "Nghệ thuật quản lý", "Hiệu quả đầu tư", "Cả a, b, c"],
    ans: 2,
    ex: "Trình độ bóc lột do tỷ suất giá trị thặng dư (m') phản ánh. Còn tỷ suất lợi nhuận (p') chỉ phản ánh mức độ sinh lời và hiệu quả đầu tư của toàn bộ vốn.",
  },
  {
    q: "Nguyên nhân hình thành lợi nhuận bình quân:",
    opts: ["Cạnh tranh trong ngành", "Cạnh tranh giữa các ngành", "Chạy theo giá trị thặng dư", "Cạnh tranh nội bộ ngành"],
    ans: 1,
    ex: "Cạnh tranh giữa các ngành khác nhau dẫn đến dòng vốn tự do di chuyển từ ngành có tỷ suất lợi nhuận thấp sang ngành cao, hình thành nên tỷ suất lợi nhuận bình quân.",
  },
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



// ─── PUZZLE PIECE (variable grid size) ───────────────────────────────────────

function PuzzlePiece({
  correctIdx, gridSize, isSelected, isSolved, onClick, imageUrl,
}: {
  correctIdx: number; gridSize: number; isSelected: boolean; isSolved: boolean; onClick: () => void; imageUrl: string;
}) {
  const sz = 450 / gridSize;
  const col = correctIdx % gridSize;
  const row = Math.floor(correctIdx / gridSize);

  return (
    <svg viewBox={`0 0 ${sz} ${sz}`} width={sz} height={sz} onClick={onClick} style={{ cursor: isSolved ? "default" : "pointer", display: "block" }}>
      <g transform={`translate(${-col * sz},${-row * sz})`}>
        <image href={imageUrl} width="450" height="450" preserveAspectRatio="xMidYMid slice" />
      </g>
      {isSelected && !isSolved && <rect width={sz} height={sz} fill="none" stroke="#FFD700" strokeWidth={4} />}
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
              Chủ Nghĩa Xã Hội Khoa Học
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

// Component con hỗ trợ tiêu đề phân đoạn
function SectionHeader({ tag, title }: { tag: string; title: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="bg-[#D32F2F] text-white text-xs font-bold tracking-[0.25em] px-3 py-1" style={OS}>{tag}</div>
      <h2 className="text-2xl md:text-3xl font-bold text-[#111111] leading-tight" style={OS}>{title}</h2>
      <div className="flex-1 h-px bg-[#111111]/15" />
    </div>
  );
}

function HomePage() {
  // ─── MANAGEMENT STATES (CÁC TRẠNG THÁI TƯƠNG TÁC) ──────────────────────────
  const [activeReasonTab, setActiveReasonTab] = useState<"ly_luan" | "thuc_tien">("ly_luan");
  const [activeBirthFactor, setActiveBirthFactor] = useState<number>(0);
  const [activeNatureTab, setActiveNatureTab] = useState<number>(0);
  const [activeFuncBasis, setActiveFuncBasis] = useState<string>("scope");
  const [compareMode, setCompareMode] = useState<"bo_lot" | "xhcn">("xhcn");
  const [activeRelationStep, setActiveRelationStep] = useState<number>(0);
  const [activeToolCard, setActiveToolCard] = useState<number>(0);

  // ─── DATA MOCKING ──────────────────────────────────────────────────────────
  const birthFactors = [
    { title: "Kinh tế", detail: "Lực lượng sản xuất phát triển ở trình độ xã hội hóa cao xung đột gay gắt với quan hệ sản xuất tư bản mang tính tư hữu tư nhân tư bản chủ nghĩa." },
    { title: "Xã hội", detail: "Giai cấp công nhân và nhân dân lao động bị áp bức, bóc lột nặng nề, tích tụ mâu thuẫn dẫn đến các cuộc đấu tranh trực diện chống lại giai cấp tư sản." },
    { title: "Chính trị - Xã hội", detail: "Sự trưởng thành của giai cấp công nhân cùng sự ra đời của Đảng Cộng sản lãnh đạo, kết hợp liên minh công - nông lật đổ nhà nước tư sản." }
  ];

  const natureData = [
    { title: "Chính trị", tag: "BẢN CHẤT CHÍNH TRỊ", points: ["Mang bản chất giai cấp công nhân, đại diện lợi ích nhân dân lao động", "Do Đảng Cộng sản lãnh đạo tối cao và duy nhất", "Nhân dân là chủ thể quyền lực: Nhà nước của dân, do dân, vì dân"] },
    { title: "Kinh tế", tag: "BẢN CHẤT KINH TẾ", points: ["Chịu sự quy định của cơ sở kinh tế xã hội chủ nghĩa", "Chế độ công hữu đối với tư liệu sản xuất chủ yếu giữ vai trò chủ đạo", "Không ngừng nâng cao đời sống vật chất, cải thiện thu nhập cho toàn dân"] },
    { title: "Tư tưởng - Văn hóa", tag: "BẢN CHẤT TƯ TƯỞNG - XÃ HỘI", points: ["Chủ nghĩa Mác – Lênin là nền tảng lý luận tinh thần định hướng", "Kế thừa, chọn lọc những giá trị văn hóa tiến bộ của nhân loại", "Hướng tới xóa bỏ phân hóa giai cấp, giảm bất bình đẳng xã hội"] }
  ];

  const functionData: Record<string, { title: string; items: string[] }[]> = {
    scope: [
      { title: "Chức năng đối nội", items: ["Quản lý kinh tế - xã hội nội địa", "Giữ vững an ninh chính trị, trật tự"] },
      { title: "Chức năng đối ngoại", items: ["Bảo vệ chủ quyền toàn vẹn lãnh thổ", "Mở rộng hợp tác, hội nhập quốc tế"] }
    ],
    fields: [
      { title: "Chính trị", items: ["Tổ chức thực hiện quyền lực", "Bảo vệ chế độ chính trị xã hội"] },
      { title: "Kinh tế", items: ["Quản lý và điều tiết nền kinh tế", "Nâng cao năng suất lao động"] },
      { title: "Văn hóa, xã hội", items: ["Chăm lo giáo dục, y tế, khoa học", "Bảo vệ quyền con người tối ưu"] }
    ],
    power: [
      { title: "Giai cấp (Trấn áp)", items: ["Trấn áp thiểu số bóc lột cũ phá hoại", "Bảo vệ thành quả cách mạng của dân"] },
      { title: "Xã hội (Xây dựng)", items: ["Tổ chức kiến tạo xã hội mới", "Mang lại năng suất lao động cao hơn"] }
    ]
  };

  const toolCards = [
    { title: "Thể Chế Hóa Ý Chí", body: "Nhà nước cụ thể hóa ý chí, nguyện vọng và quyền lực của nhân dân thành các văn bản pháp luật, chính sách và hành lang pháp lý. Quyền làm chủ không chỉ là tuyên bố suông mà được đảm bảo bằng sức mạnh cưỡng chế hành pháp." },
    { title: "Xác Lập Quyền & Trách Nhiệm", body: "Thông qua hệ thống pháp luật, Nhà nước phân định rõ quyền hạn và trách nhiệm của mỗi công dân — giúp người dân hiểu rõ ranh giới quyền làm chủ và tham gia quản lý xã hội một cách chủ động." },
    { title: "Công Cụ Bảo Vệ", body: "Nhà nước sử dụng bộ máy tư pháp để ngăn chặn và trừng trị các hành vi độc đoán, xâm phạm quyền lợi chính đáng của người dân; bảo vệ nền dân chủ trước thế lực thù địch." },
    { title: "Phương Thức Thực Hiện Dân Chủ", body: "Tạo điều kiện vận hành cơ chế thực tiễn để nhân dân tham gia trực tiếp và gián tiếp vào quản lý nhà nước. Hiện thực hóa triệt để phương châm dân bàn, dân làm, dân kiểm tra." }
  ];

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
              CHƯƠNG IV — DÂN CHỦ XÃ HỘI CHỦ NGHĨA VÀ NHÀ NƯỚC XÃ HỘI CHỦ NGHĨA
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-none mb-4" style={OS}>NHÀ NƯỚC</h1>
            <h2 className="text-3xl md:text-5xl font-bold text-[#D32F2F] leading-none mb-6" style={OS}>XÃ HỘI CHỦ NGHĨA</h2>
            <p className="text-white/70 text-base max-w-md leading-relaxed" style={VN}>
              Bản chất, sự ra đời, chức năng, hình thức, nguyên tắc tổ chức và vai trò thực thi
              dân chủ của nhà nước trong giai đoạn quá độ lên chủ nghĩa xã hội.
            </p>
          </div>
          {/* <div className="flex-shrink-0 opacity-85">
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
          </div> */}
        </div>
      </div>

      {/* ── STATS BAR (SỬA LỖI CUỘN LỆCH VỊ TRÍ) ── */}
      <div className="bg-[#D32F2F] py-4 px-6 sticky top-16 z-40 shadow-md">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-6 md:gap-10">
          {[
            { n: "1.1", l: "Sự Ra Đời của Nhà Nước", target: "su-ra-doi" },
            { n: "1.2", l: "Bản Chất Ba Phương Diện", target: "ban-chat" },
            { n: "1.3", l: "Cấu Trúc Chức Năng", target: "cau-truc-chuc-nang" },
            { n: "2.1", l: "Cơ Sơ Dân Chủ Biện Chứng", target: "co-so-dan-chu" },
            { n: "2.2", l: "Công Cụ Thực Thi Quyền", target: "cong-cu-thuc-thi" }
          ].map(({ n, l, target }) => (
            <button 
              key={l} 
              onClick={() => {
                const element = document.getElementById(target);
                if (element) {
                  const elementPosition = element.getBoundingClientRect().top + window.scrollY;
                  const offsetPosition = elementPosition - 150; 
                  window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                  });
                }
              }}
              className="text-center hover:scale-105 transition-transform duration-200 cursor-pointer focus:outline-none"
            >
              <p className="text-2xl md:text-3xl font-bold text-white leading-none" style={OS}>{n}</p>
              <p className="text-white/70 text-[10px] md:text-[11px] uppercase tracking-wider mt-1.5" style={VN}>{l}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-12">

        {/* ── THAO TÁC 1: LÝ DO NGHIÊN CỨU (Tab Chuyển Đổi) ── */}
        <div className="bg-white border-2 border-[#111111] overflow-hidden shadow-[4px_4px_0px_0px_#111111]">
          <div className="bg-[#111111] px-6 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[#FFD700] font-bold" style={OS}>※</span>
              <span className="text-white font-bold tracking-[0.2em] text-sm" style={OS}>LÝ DO NGHIÊN CỨU SẢN PHẨM</span>
            </div>
            <div className="flex gap-1 bg-white/10 p-1 border border-white/20">
              <button 
                onClick={() => setActiveReasonTab("ly_luan")}
                className={`px-3 py-1 text-xs font-bold transition-all ${activeReasonTab === "ly_luan" ? "bg-[#D32F2F] text-white" : "text-white/60 hover:text-white"}`}
                style={OS}
              >
                MẶT LÝ LUẬN
              </button>
              <button 
                onClick={() => setActiveReasonTab("thuc_tien")}
                className={`px-3 py-1 text-xs font-bold transition-all ${activeReasonTab === "thuc_tien" ? "bg-[#D32F2F] text-white" : "text-white/60 hover:text-white"}`}
                style={OS}
              >
                MẶT THỰC TIỄN
              </button>
            </div>
          </div>
          <div className="p-6 min-h-[110px] bg-[#EDD9A3]/10 transition-all duration-300">
            {activeReasonTab === "ly_luan" ? (
              <div className="animate-fadeIn">
                <p className="text-[#D32F2F] text-xs font-bold tracking-[0.2em] mb-2" style={OS}>TƯ DUY LÝ LUẬN CỐT LÕI</p>
                <p className="text-sm text-[#111111]/90 leading-relaxed" style={VN}>
                  Sản phẩm giúp người học làm rõ bản chất ưu việt của Nhà nước XHCN, mối quan hệ hữu cơ biện chứng giữa cơ cấu bộ máy nhà nước và quyền làm chủ tối cao của quần chúng nhân dân lao động trong tiến trình xây dựng chủ nghĩa xã hội.
                </p>
              </div>
            ) : (
              <div className="animate-fadeIn">
                <p className="text-[#D32F2F] text-xs font-bold tracking-[0.2em] mb-2" style={OS}>HÀNH ĐỘNG THỰC TIỄN XÃ HỘI</p>
                <p className="text-sm text-[#111111]/90 leading-relaxed" style={VN}>
                  Góp phần trực tiếp nâng cao nhận thức chính trị xã hội cho thế hệ trẻ; giúp tra cứu và tìm hiểu sâu sắc về Nhà nước pháp quyền XHCN Việt Nam, quyền và nghĩa vụ công dân, đẩy lùi thông tin sai lệch ngoài đời sống.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── THAO TÁC 2: SỰ RA ĐỜI (Sơ Đồ Chọn Nguyên Nhân & Hiển Thị Động) ── */}
        <div id="su-ra-doi">
          <SectionHeader tag="1.1" title="Sự Ra Đời của Nhà Nước XHCN" />
          <div className="bg-[#D32F2F] text-white p-5 mb-4 relative overflow-hidden">
            <p className="text-[#FFD700] text-xs font-bold tracking-[0.2em] mb-1" style={OS}>ĐỊNH NGHĨA CHÍNH THỐNG</p>
            <p className="text-sm leading-relaxed text-white/95" style={VN}>
              Nhà nước XHCN là kiểu nhà nước mà ở đó quyền lực hoàn toàn thuộc về giai cấp công nhân và nhân dân lao động; sinh ra từ thắng lợi của cuộc cách mạng xã hội chủ nghĩa nhằm thiết lập quyền làm chủ trên mọi lĩnh vực đời sống.
            </p>
          </div>

          <div className="grid md:grid-cols-12 gap-4">
            {/* Thanh chọn yếu tố tác động bên trái */}
            <div className="md:col-span-5 flex flex-col gap-2">
              <span className="text-xs font-bold text-[#111111]/60 uppercase tracking-wider mb-1" style={OS}>Chọn nguồn gốc mâu thuẫn:</span>
              {birthFactors.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setActiveBirthFactor(index)}
                  className={`w-full p-4 border-2 text-left font-bold text-xs uppercase tracking-wide transition-all duration-200 flex justify-between items-center ${
                    activeBirthFactor === index
                      ? "bg-[#111111] text-white border-[#111111] translate-x-1"
                      : "bg-white text-[#111111] border-[#111111]/20 hover:border-[#111111]"
                  }`}
                  style={OS}
                >
                  <span>{index + 1}. Mâu thuẫn về {item.title}</span>
                  <span>{activeBirthFactor === index ? "▶" : "▷"}</span>
                </button>
              ))}
            </div>

            {/* Khung hiển thị nội dung phân tích chi tiết bên phải */}
            <div className="md:col-span-7 bg-[#EDD9A3] border-2 border-[#111111] p-6 flex flex-col justify-between shadow-[4px_4px_0px_0px_#111111]">
              <div>
                <p className="text-[#D32F2F] text-xs font-bold tracking-[0.15em] mb-2" style={OS}>LUẬN ĐIỂM NGHIÊN CỨU</p>
                <p className="text-sm text-[#111111] leading-relaxed transition-opacity duration-300" style={VN}>
                  {birthFactors[activeBirthFactor].detail}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-[#111111]/15 text-xs text-[#111111]/60 font-medium" style={VN}>
                * Kết quả tất yếu: Mâu thuẫn đỉnh điểm thúc đẩy Cách mạng vô sản bùng nổ, thiết lập bộ máy kiểu mới.
              </div>
            </div>
          </div>
        </div>

        {/* ── THAO TÁC 3: BẢN CHẤT CỦA NNXHCN (Hệ Thống Tab Đồ Họa Phương Diện) ── */}
        <div id="ban-chat">
          <SectionHeader tag="1.2" title="Bản Chất Ba Phương Diện Của Nhà Nước XHCN" />
          
          <div className="flex border-b-2 border-[#111111] mb-4 bg-white/40 p-1">
            {natureData.map((tab, idx) => (
              <button
                key={idx}
                onClick={() => setActiveNatureTab(idx)}
                className={`flex-1 py-2 px-3 text-center font-bold text-xs uppercase tracking-wider transition-all ${
                  activeNatureTab === idx
                    ? "bg-[#D32F2F] text-white shadow-sm"
                    : "text-[#111111]/60 hover:text-[#111111] hover:bg-white/50"
                }`}
                style={OS}
              >
                {tab.title}
              </button>
            ))}
          </div>

          <div className="bg-[#111111] text-white p-6 shadow-[4px_4px_0px_0px_#D32F2F]">
            <p className="text-[#FFD700] text-xs font-bold tracking-[0.2em] mb-3" style={OS}>
              {natureData[activeNatureTab].tag}
            </p>
            <ul className="space-y-3">
              {natureData[activeNatureTab].points.map((pt, i) => (
                <li key={i} className="flex items-start gap-3 text-sm animate-fadeIn" style={VN}>
                  <span className="text-[#FFD700] font-bold mt-0.5">✔</span>
                  <span className="text-white/90">{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── THAO TÁC 4: CHỨC NĂNG VÀ ĐỐI CHIẾU TRẤN ÁP (Bộ Lọc Phân Loại & Đóng/Mở So Sánh) ── */}
        <div id="cau-truc-chuc-nang">
          <SectionHeader tag="1.3" title="Cấu Trúc Chức Năng & Điểm Khác Biệt Tuyệt Đối" />
          
          {/* Bộ lọc phân loại căn cứ chức năng */}
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              { id: "scope", label: "Căn cứ Phạm vi tác động" },
              { id: "fields", label: "Căn cứ Lĩnh vực tác động" },
              { id: "power", label: "Căn cứ Tính chất quyền lực" }
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setActiveFuncBasis(btn.id)}
                className={`py-2 px-4 font-bold text-xs uppercase tracking-wide border-2 transition-all ${
                  activeFuncBasis === btn.id
                    ? "bg-[#111111] text-white border-[#111111]"
                    : "bg-white text-[#111111] border-[#111111]/20 hover:border-[#111111]"
                }`}
                style={OS}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Render danh sách chức năng tương ứng bộ lọc */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {functionData[activeFuncBasis].map((func, i) => (
              <div key={i} className="bg-white border-2 border-[#111111] p-4 shadow-[2px_2px_0px_0px_#111111]">
                <h4 className="font-bold text-xs text-[#D32F2F] uppercase mb-2" style={OS}>✦ {func.title}</h4>
                <ul className="space-y-1">
                  {func.items.map((it, idx) => (
                    <li key={idx} className="text-xs text-[#111111]/80 flex items-center gap-1.5" style={VN}>
                      <span className="text-gray-400">▪</span> {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Khung tương tác bật/tắt đối chiếu mô hình trấn áp */}
          <div className="border-2 border-[#111111] bg-white overflow-hidden shadow-[4px_4px_0px_0px_#111111]">
            <div className="bg-[#EDD9A3] px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b-2 border-[#111111]">
              <div>
                <p className="text-[#D32F2F] text-xs font-bold tracking-[0.2em]" style={OS}>BẢNG ĐỐI CHIẾU LUẬN ĐIỂM CHUYÊN CHÍNH</p>
                <h3 className="text-sm font-bold text-[#111111] mt-0.5" style={OS}>Bản chất chức năng trấn áp có gì khác biệt?</h3>
              </div>
              <div className="inline-flex bg-[#111111] p-1 border border-black rounded-sm">
                <button 
                  onClick={() => setCompareMode("bo_lot")}
                  className={`px-3 py-1 text-[11px] font-bold uppercase transition-all ${compareMode === "bo_lot" ? "bg-[#D32F2F] text-white" : "text-white/50 hover:text-white"}`}
                  style={OS}
                >
                  Mô hình Bóc lột cũ
                </button>
                <button 
                  onClick={() => setCompareMode("xhcn")}
                  className={`px-3 py-1 text-[11px] font-bold uppercase transition-all ${compareMode === "xhcn" ? "bg-[#D32F2F] text-white" : "text-white/50 hover:text-white"}`}
                  style={OS}
                >
                  Mô hình XHCN kiểu mới
                </button>
              </div>
            </div>
            <div className="p-5 min-h-[90px] bg-[#EDD9A3]/10">
              {compareMode === "bo_lot" ? (
                <p className="text-xs md:text-sm text-[#111111]/80 leading-relaxed animate-fadeIn" style={VN}>
                   <strong>Nhà nước bóc lột cũ:</strong> Hoạt động như một công cụ chuyên chính của một <em>thiểu số giai cấp thống trị</em> dùng để áp bức, cưỡng chế và cấu xé quyền lợi của đại đa số quần chúng nhân dân lao động trong xã hội nhằm độc chiếm tư liệu sản xuất.
                </p>
              ) : (
                <p className="text-xs md:text-sm text-[#111111]/80 leading-relaxed animate-fadeIn" style={VN}>
                   <strong>Nhà nước XHCN kiểu mới:</strong> Thực hiện sự trấn áp của <em>đại đa số nhân dân lao động</em> chống lại thiểu số bóc lột cũ đã bị lật đổ cùng các phần tử phản động phá hoại; lấy nhiệm vụ <strong>tổ chức và xây dựng kinh tế - xã hội làm nội dung cốt lõi và tối thượng</strong> (Theo luận điểm V.I. Lênin).
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── THAO TÁC 5: MỐI QUAN HỆ BIỆN CHỨNG (Interactive Workflow) ── */}
        <div id="co-so-dan-chu">
          <SectionHeader tag="2.1" title="Dân Chủ XHCN — Cơ Sơ và Nền Tảng Biện Chứng" />
          
          <div className="grid md:grid-cols-3 gap-3 mb-4">
            {[
              { id: 0, title: "1. Cơ sở nền tảng", desc: "Tạo điều kiện để người dân bầu cử người đại diện quyền lực hợp pháp." },
              { id: 1, title: "2. Phát huy sức mạnh", desc: "Khai thác trí tuệ tập thể và thiết lập cơ chế kiểm soát quyền lực." },
              { id: 2, title: "3. Hậu quả sai phạm", desc: "Nếu vi phạm dân chủ, quyền lực sẽ biến tướng thành lợi ích nhóm." }
            ].map((step) => (
              <div
                key={step.id}
                onClick={() => setActiveRelationStep(step.id)}
                className={`p-4 border-2 cursor-pointer transition-all duration-200 ${
                  activeRelationStep === step.id
                    ? "bg-[#D32F2F] text-white border-[#D32F2F] shadow-[3px_3px_0px_0px_#111111]"
                    : "bg-white text-[#111111] border-[#111111]/15 hover:border-[#111111]"
                }`}
              >
                <h4 className="font-bold text-xs uppercase mb-1" style={OS}>{step.title}</h4>
                <p className="text-[11px] opacity-80" style={VN}>{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#111111] text-white p-5 border-l-4 border-[#FFD700]">
            <p className="text-[#FFD700] text-xs font-bold tracking-wider mb-1" style={OS}>HỆ QUẢ LUẬN CHỨNG CHI TIẾT:</p>
            {activeRelationStep === 0 && (
              <p className="text-xs md:text-sm text-white/85 leading-relaxed animate-fadeIn" style={VN}>
                Dân chủ xã hội chủ nghĩa đảm bảo tính chính danh của bộ máy nhà nước. Chỉ khi nhân dân được thực hiện quyền lực chính trị một cách tự do, bình đẳng, các cơ quan công quyền mới thực sự đại diện cho ý chí cốt lõi của toàn xã hội.
              </p>
            )}
            {activeRelationStep === 1 && (
              <p className="text-xs md:text-sm text-white/85 leading-relaxed animate-fadeIn" style={VN}>
                Nền dân chủ tạo hành lang thông thoáng để nhân dân trực tiếp tham gia đóng góp giải pháp vĩ mô, đồng thời thực thi vai trò giám sát, ngăn chặn kịp thời các mầm mống tha hóa, quan liêu, hách dịch của cán bộ công quyền.
              </p>
            )}
            {activeRelationStep === 2 && (
              <p className="text-xs md:text-sm text-red-300 font-medium leading-relaxed animate-fadeIn" style={VN}>
                Cảnh báo lý luận: Bất kỳ hành vi buông lỏng hay chà đạp lên các nguyên tắc dân chủ nào cũng sẽ làm suy yếu bản chất nhà nước, biến công cụ của nhân dân thành phương tiện đặc quyền phục vụ lợi ích cục bộ của thiểu số phe nhóm.
              </p>
            )}
          </div>
        </div>

        {/* ── THAO TÁC 6: NHÀ NƯỚC LÀ CÔNG CỤ (Khung Chọn Tính Năng Hiện Thực Hóa) ── */}
        <div id="cong-cu-thuc-thi">
          <SectionHeader tag="2.2" title="Nhà Nước — Công Cụ Thực Thi Quyền Làm Chủ" />
          
          <div className="grid md:grid-cols-12 gap-4">
            {/* Cột chọn vai trò bên trái */}
            <div className="md:col-span-4 flex flex-col gap-2">
              {toolCards.map((card, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveToolCard(idx)}
                  className={`w-full p-3 border-2 text-left font-bold text-xs uppercase tracking-wide transition-all ${
                    activeToolCard === idx
                      ? "bg-[#111111] text-white border-[#111111] translate-x-1"
                      : "bg-white text-[#111111] border-[#111111]/20 hover:border-[#111111]"
                  }`}
                  style={OS}
                >
                  Vai Trò {idx + 1}: {card.title.split(" ")[0]}...
                </button>
              ))}
            </div>

            {/* Màn hình hiển thị nội dung bên phải */}
            <div className="md:col-span-8 bg-white border-2 border-[#111111] p-6 shadow-[4px_4px_0px_0px_#111111] flex flex-col justify-between min-h-[180px]">
              <div>
                <p className="text-[#D32F2F] text-xs font-bold tracking-[0.2em] mb-1" style={OS}>VA TRÒ THỰC THI {activeToolCard + 1}</p>
                <h3 className="text-base font-bold text-[#111111] mb-2" style={OS}>{toolCards[activeToolCard].title}</h3>
                <p className="text-xs md:text-sm text-[#111111]/80 leading-relaxed animate-fadeIn" style={VN}>
                  {toolCards[activeToolCard].body}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-dashed border-[#111111]/20 text-center text-xs text-[#D32F2F] font-bold tracking-wide" style={OS}>
                "DÂN BIẾT — DÂN BÀN — DÂN LÀM — DÂN KIỂM TRA"
              </div>
            </div>
          </div>

          <div className="bg-[#111111] text-white px-6 py-4 mt-4">
            <p className="text-xs md:text-sm text-center leading-relaxed" style={VN}>
              <span className="text-[#FFD700] font-bold" style={OS}>TÓM LẠI: </span>
              Nhà nước XHCN không đứng trên nhân dân mà là công cụ hành pháp do nhân dân tạo dựng. Quyền làm chủ tối cao được hiện thực hóa toàn diện thông qua việc Nhà nước xây dựng pháp luật, tổ chức thực thi và bảo vệ các quyền lợi chính đáng đó.
            </p>
          </div>
        </div>

        {/* ── QUOTE ── */}
        <div className="bg-[#111111] text-white p-10 relative overflow-hidden shadow-lg">
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
// Đồ họa cục bộ
import img1 from '../public/images/logo.png';
import img2 from '../public/images/logo1.jpg';
import img3 from '../public/images/logo2.png';
import img4 from '../public/images/logo3.jpg';
import img5 from '../public/images/logo4.jpg';

const LEVEL_IMAGES = [img1, img2, img3, img4, img5];

const LEVEL_CFG = [
  { g: 3, base: 100, startMoves: 5, maxQ: 5, mvRight: 4, mvWrong: 1, hintP: 15 },
  { g: 3, base: 150, startMoves: 3, maxQ: 5, mvRight: 4, mvWrong: 1, hintP: 15 },
  { g: 4, base: 220, startMoves: 6, maxQ: 5, mvRight: 6, mvWrong: 2, hintP: 20 },
  { g: 4, base: 280, startMoves: 5, maxQ: 5, mvRight: 6, mvWrong: 2, hintP: 20 },
  { g: 5, base: 380, startMoves: 8, maxQ: 6, mvRight: 8, mvWrong: 3, hintP: 25 },
];

// Cấu trúc Interface khớp với MongoDB _id
interface LBEntry { _id: string; name: string; score: number; level: number; }

function initPieces(count: number): number[] {
  let arr = Array.from({ length: count }, (_, i) => i);
  do { arr = shuffle(arr); } while (arr.every((v, i) => v === i));
  return arr;
}

type GamePhase = "start" | "puzzle" | "win" | "gameover";

function PuzzlePage() {
  // ── Leaderboard States
  const [lb, setLb] = useState<LBEntry[]>([]);
  const [showLb, setShowLb] = useState(false);
  const [lbName, setLbName] = useState("");
  const [lbScore, setLbScore] = useState("");

  // ── Game States
  const [phase, setPhase] = useState<GamePhase>("start");
  const [pName, setPName] = useState("");
  const [nameError, setNameError] = useState(""); 
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

  // 1. Tự động tải bảng xếp hạng từ DB khi mở game
  useEffect(() => {
    fetch("http://localhost:5000/api/leaderboard")
      .then(res => res.json())
      .then(data => setLb(data))
      .catch(err => console.error("Lỗi tải BXH:", err));
  }, []);

  // 2. Lưu điểm tự động lên MongoDB khi hoàn thành màn chơi (Solve)
  useEffect(() => {
    if (phase !== "puzzle" || pieces.length === 0) return;
    if (!pieces.every((v, i) => v === i)) return;

    const earned = Math.max(Math.round(cfg.base * 0.25), cfg.base - movesUsed * 2 + qCorrect * 8 - hintCost);
    const ns = score + earned;
    setLvlScore(earned);
    setScore(ns);

    fetch("http://localhost:5000/api/leaderboard/save-game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: pName, score: ns, level: level })
    })
      .then(res => res.json())
      .then(data => setLb(data))
      .catch(err => console.error("Lỗi đồng bộ kết quả thắng cuộc:", err));

    setPhase("win");
  }, [pieces]);

  // ─── GAMEPLAY HANDLERS ─────────────────────────────────────────────────────
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
  const trimmedName = pName.trim();
  if (!trimmedName) {
    setNameError("Vui lòng nhập tên trước khi bắt đầu!");
    return;
  }

  const isNameTaken = lb.some(
    (entry) => entry.name.toLowerCase() === trimmedName.toLowerCase()
  );

  if (isNameTaken) {
    setNameError(`Tên "${trimmedName}" đã có người sử dụng!`);
    return;
  }

  setNameError(""); 
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

  const medal = (i: number) => i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`;
  const playerRank = lb.findIndex(e => e.name.toLowerCase() === pName.trim().toLowerCase());

  // ─── LEADERBOARD DRAWER ────────────────────────────────────────────────────
  const lbDrawer = showLb && (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-end" onClick={() => setShowLb(false)}>
      <div className="bg-white w-full max-w-sm h-full overflow-y-auto shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="bg-[#111111] px-4 py-4 flex items-center justify-between sticky top-0 z-10">
          <span className="text-white font-bold text-sm tracking-wide" style={OS}>🏆 BẢNG XẾP HẠNG TOÀN CẦU</span>
          <button onClick={() => setShowLb(false)} className="text-white/60 hover:text-white text-xl leading-none">×</button>
        </div>
        <div className="flex-1 divide-y divide-[#F5E9D0]">
          {lb.map((e, i) => (
            <div key={e._id} className={`px-4 py-3.5 flex items-center gap-3 ${i < 3 ? "bg-[#FFFBF0]" : "bg-white"} ${e.name.toLowerCase() === pName.trim().toLowerCase() ? "ring-2 ring-inset ring-[#D32F2F]" : ""}`}>
              <span className="w-7 text-center text-sm flex-shrink-0">{medal(i)}</span>
              <span className="flex-1 text-sm font-medium truncate" style={VN}>{e.name}</span>
              <span className="font-bold text-[#D32F2F] tabular-nums text-sm" style={OS}>{e.score}</span>
              <span className="text-[10px] bg-[#F5E9D0] text-[#111111]/50 px-1.5 py-0.5 flex-shrink-0" style={OS}>L{e.level}</span>
            </div>
          ))}
          {lb.length === 0 && (
            <div className="text-center py-8 text-xs text-[#111111]/40" style={VN}>Chưa có người chơi nào được ghi nhận.</div>
          )}
        </div>
      </div>
    </div>
  );

// ─── SCREEN: START ─────────────────────────────────────────────────────────
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
            <input value={pName} onChange={e => {setPName(e.target.value); setNameError("")}}
              onKeyDown={e => e.key === "Enter" && handleStart()} placeholder="Nhập tên của bạn..."
              className="w-full border-2 border-[#111111] bg-[#F5E9D0] px-3 py-2.5 text-sm mb-4 outline-none focus:border-[#D32F2F]" style={VN} />
              {nameError && (<p className="text-red-600 text-xs font-semibold mb-3 animate-pulse" style={VN}>{nameError}</p>)}
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
            <button onClick={() => setShowLb(true)} className="text-xs text-[#111111]/50 hover:text-[#D32F2F] font-semibold underline" style={VN}>Xem tất cả →</button>
          </div>
          <div className="bg-white border-2 border-[#111111] divide-y divide-[#F5E9D0]">
            {lb.slice(0, 8).map((e, i) => (
              <div key={e._id} className={`flex items-center gap-3 px-4 py-2.5 ${i < 3 ? "bg-[#FFFBF0]" : ""}`}>
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
  
  // ─── SCREEN: PUZZLE PLAYING ────────────────────────────────────────────────
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
        <div className="flex-shrink-0 relative">
          <div className="border-4 border-[#111111] shadow-2xl overflow-hidden relative"
            style={{ display: "grid", gridTemplateColumns: `repeat(${gridSize}, ${450 / gridSize}px)` }}>
            {pieces.map((ci, pos) => (
              <PuzzlePiece key={pos} correctIdx={ci} gridSize={gridSize}
                isSelected={sel === pos} isSolved={false} onClick={() => handlePieceClick(pos)}
                imageUrl={LEVEL_IMAGES[level - 1] || LEVEL_IMAGES[0]} />
            ))}
            {showQA && curQ && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-20">
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
        </div>

        <div className="flex flex-col gap-3 w-full lg:w-56">
          <div className="bg-[#D32F2F] text-white p-4 text-center">
            <p className="text-xs opacity-70 mb-0.5" style={VN}>Điểm hiện tại</p>
            <p className="text-4xl font-bold leading-none" style={OS}>{score}</p>
          </div>
          <button onClick={() => qsLeft > 0 ? setShowQA(true) : setMoves(m => m + 3)}
            className={`flex items-center justify-center gap-2 py-3 font-bold text-xs border-2 border-[#111111] transition-all ${moves <= 2 ? "bg-[#D32F2F] text-white border-[#D32F2F]" : "bg-white text-[#111111] hover:bg-[#F5E9D0]"}`}
            style={OS}>
            {moves <= 2 ? "⚠ " : ""} {qsLeft > 0 ? `KIẾM LƯỢT (+${cfg.mvRight}/${cfg.mvWrong})` : "CẤP CỨU +3 LƯỢT"}
          </button>
          <button onClick={handleHint}
            className={`flex items-center justify-center gap-2 py-3 font-bold text-xs border-2 transition-all ${showHint ? "bg-[#EDD9A3] border-[#D32F2F] text-[#D32F2F]" : "bg-white border-[#111111] text-[#111111] hover:bg-[#F5E9D0]"}`}
            style={OS}>
            {showHint ? "ẨN GỢI Ý" : `GỢI Ý (−${cfg.hintP}đ)`}
          </button>
          <button onClick={() => { setPieces(initPieces(gridSize * gridSize)); setSel(null); }}
            className="flex items-center justify-center gap-2 bg-[#111111] text-white py-3 font-bold text-xs hover:bg-black" style={OS}>
            <RotateCcw className="w-3.5 h-3.5" /> ĐẶT LẠI HÌNH
          </button>
          <div className="bg-white border-2 border-[#111111] p-3 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-[#111111]/60" style={VN}>Lượt đã dùng:</span>
              <span className="font-bold" style={OS}>{movesUsed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#111111]/60" style={VN}>Trả lời đúng:</span>
              <span className="font-bold text-green-600" style={OS}>{qCorrect}/{qIdx}</span>
            </div>
            {hintCost > 0 && (
              <div className="flex justify-between">
                <span className="text-[#111111]/60" style={VN}>Phí gợi ý:</span>
                <span className="font-bold text-red-600" style={OS}>−{hintCost}đ</span>
              </div>
            )}
            <div className="border-t border-[#EDD9A3] pt-1.5 flex justify-between">
              <span className="text-[#111111]/60" style={VN}>Điểm dự kiến:</span>
              <span className="font-bold text-[#D32F2F]" style={OS}>{estScore}</span>
            </div>
          </div>
          {showHint && (
            <div className="border-2 border-[#D32F2F] overflow-hidden bg-white p-2">
              <img src={LEVEL_IMAGES[level - 1] || LEVEL_IMAGES[0]} alt="Gợi ý" className="w-[208px] h-[208px] object-cover mx-auto" />
              <p className="bg-[#D32F2F] text-white text-center py-1 text-[9px] font-bold mt-2" style={OS}>GỢI Ý — ĐÃ TRỪ {cfg.hintP} ĐIỂM</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ─── SCREEN: WIN LEVEL ─────────────────────────────────────────────────────
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
            <div className="flex justify-between">
              <span style={VN} className="text-[#111111]/70">Điểm cơ bản:</span>
              <span className="font-bold text-[#D32F2F]" style={OS}>+{cfg.base}</span>
            </div>
            <div className="flex justify-between">
              <span style={VN} className="text-[#111111]/70">Lượt sử dụng ({movesUsed} × −2):</span>
              <span className="font-bold text-gray-600" style={OS}>−{movesUsed * 2}</span>
            </div>
            <div className="flex justify-between">
              <span style={VN} className="text-[#111111]/70">Trả lời đúng ({qCorrect} × +8):</span>
              <span className="font-bold text-green-600" style={OS}>+{qCorrect * 8}</span>
            </div>
            {hintCost > 0 && (
              <div className="flex justify-between">
                <span style={VN} className="text-[#111111]/70">Phí gợi ý:</span>
                <span className="font-bold text-red-600" style={OS}>−{hintCost}</span>
              </div>
            )}
          </div>
          <div className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-[#111111]/60 mb-0.5" style={VN}>Tổng điểm</p>
              <p className="text-3xl font-bold text-[#D32F2F]" style={OS}>{score}</p>
              {playerRank >= 0 && <p className="text-xs text-[#111111]/50 mt-1" style={VN}>Hạng {playerRank + 1} 🏆</p>}
            </div>
            <div className="flex flex-col gap-2 items-end">
              {level < LEVEL_CFG.length ? (
                <button onClick={handleNext} className="bg-[#D32F2F] text-white px-5 py-3 font-bold text-sm flex items-center gap-2 hover:bg-[#B71C1C]" style={OS}>
                  MÀN {level + 1} ({LEVEL_CFG[level].g}×{LEVEL_CFG[level].g}) <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={handleNext} className="bg-[#111111] text-[#FFD700] px-5 py-3 font-bold text-sm hover:bg-black" style={OS}>
                  KẾT THÚC 🏆
                </button>
              )}
              <button onClick={() => setShowLb(true)} className="text-xs text-[#111111]/50 hover:text-[#D32F2F] font-semibold" style={VN}>Xem bảng xếp hạng →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ─── SCREEN: GAME OVER ─────────────────────────────────────────────────────
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
          <p className="text-xs font-bold tracking-[0.2em] text-[#D32F2F]" style={OS}>🏆 BẢNG XẾP HẠNG CHUNG CUỘC</p>
          <button onClick={() => setShowLb(true)} className="text-xs text-[#111111]/50 hover:text-[#D32F2F] font-semibold underline" style={VN}>Xem tất cả →</button>
        </div>
        <div className="bg-white border-2 border-[#111111] divide-y divide-[#F5E9D0] mb-6">
          {lb.map((e, i) => (
            <div key={e._id} className={`flex items-center gap-3 px-4 py-3 ${i < 3 ? "bg-[#FFFBF0]" : ""} ${e.name.toLowerCase() === pName.trim().toLowerCase() ? "ring-2 ring-inset ring-[#D32F2F]" : ""}`}>
              <span className="text-base w-8 text-center">{medal(i)}</span>
              <span className="flex-1 text-sm font-medium truncate" style={VN}>{e.name}</span>
              <span className="font-bold text-[#D32F2F] tabular-nums" style={OS}>{e.score}</span>
              <span className="text-[10px] bg-[#F5E9D0] text-[#111111]/40 px-1.5 py-0.5" style={OS}>L{e.level}</span>
            </div>
          ))}
        </div>
        <button onClick={() => { setPName(""); setPhase("start"); }} className="w-full bg-[#111111] text-white py-4 font-bold text-sm flex items-center justify-center gap-2 hover:bg-black" style={OS}>
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
            {([
              [QUIZ.length.toString(), "CÂU HỎI"], 
              ["30s", "MỖI CÂU"], 
              ["100", "ĐIỂM TỐI ĐA"]
            ] as const).map(([v, l]) => (
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
          <div className="space-y-6 mb-8">
            {QUIZ.map((q, i) => {
              const ua = answers[i]; 
              const ok = ua === q.ans; 
              
              return (
                <div key={i} className={`bg-white border-t-4 p-5 shadow-sm ${ok ? "border-green-600" : "border-red-600"}`}>
                  <div className="flex gap-2 mb-4">
                    {ua === null ? (
                      <span className="text-xs font-bold px-2 py-0.5 bg-gray-100 text-gray-500 rounded h-fit mt-0.5 flex-shrink-0" style={OS}>HẾT GIỜ</span>
                    ) : ok ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <p className="text-sm font-bold text-[#111111]" style={VN}>
                      Câu {i + 1}: {q.q}
                    </p>
                  </div>
                  <div className="space-y-2 mb-4">
                    {q.opts.map((opt, optIdx) => {
                      let optionCls = "border-[#111111]/10 text-gray-700 bg-gray-50/50";
                      let badge = null;
                      if (optIdx === q.ans) {
                        optionCls = "border-green-600 bg-green-50 text-green-900 font-semibold";
                        badge = <span className="text-[10px] font-bold bg-green-600 text-white px-2 py-0.5 rounded ml-auto" style={OS}>ĐÁP ÁN ĐÚNG</span>;
                      }
                      else if (optIdx === ua && !ok) {
                        optionCls = "border-red-600 bg-red-50 text-red-900 font-semibold";
                        badge = <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded ml-auto" style={OS}>BẠN CHỌN</span>;
                      }

                      return (
                        <div key={optIdx} className={`border p-3 text-xs flex items-center gap-3 transition-all ${optionCls}`} style={VN}>
                          <span className={`w-6 h-6 border flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                            optIdx === q.ans ? "bg-green-600 text-white border-green-600" : optIdx === ua ? "bg-red-600 text-white border-red-600" : "bg-white text-gray-500 border-gray-300"
                          }`} style={OS}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                          {badge}
                        </div>
                      );
                    })}
                  </div>
                  <div className="bg-amber-50/60 border-l-2 border-amber-500 p-3 text-xs text-amber-900 leading-relaxed" style={VN}>
                    <strong style={OS}>Giải thích:</strong> {q.ex}
                  </div>
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
