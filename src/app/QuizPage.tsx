import { useState, useEffect, useRef } from "react";
import { RotateCcw, CheckCircle2, XCircle, Clock, ChevronRight, Trophy } from "lucide-react";

const OS = { fontFamily: "Oswald, sans-serif" } as const;
const VN = { fontFamily: "Be Vietnam Pro, sans-serif" } as const;

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

// ─── ÔN TẬP PAGE ─────────────────────────────────────────────────────────────

type QuizPhase = "start" | "playing" | "result";

export default function QuizPage() {
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