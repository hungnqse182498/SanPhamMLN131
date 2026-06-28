import { useState, useEffect } from "react";
import { RotateCcw, ChevronRight } from "lucide-react";

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

// ─── PUZZLE GAME ─────────────────────────────────────────────────────────────
const LEVEL_IMAGES = [
  './src/assets/images/logo.png',
  './src/assets/images/logo1.jpg',
  './src/assets/images/logo2.png',
  './src/assets/images/logo3.jpg',
  './src/assets/images/logo4.jpg'
];


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

export default function PuzzlePage() {
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