import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";

const OS = { fontFamily: "Oswald, sans-serif" } as const;
const VN = { fontFamily: "Be Vietnam Pro, sans-serif" } as const;
// ─── AI CHAT PAGE ─────────────────────────────────────────────────────────────

function vn2(s: string): string {
  return s.toLowerCase()
    .replace(/[àáảãạăắặằẳẵâấầẩẫậ]/g, "a").replace(/[èéẻẽẹêếềểễệ]/g, "e")
    .replace(/[ìíỉĩị]/g, "i").replace(/[òóỏõọôốồổỗộơớờởỡợ]/g, "o")
    .replace(/[ùúủũụưứừửữự]/g, "u").replace(/[ỳýỷỹỵ]/g, "y")
    .replace(/đ/g, "d").replace(/[^a-z0-9]/g, " ").replace(/\s+/g, " ").trim();
}

const AI_KB: { kw: string[]; ans: string }[] = [
  {
    kw: ["la gi", "khai niem", "dinh nghia", "nha nuoc xa hoi chu nghia la"],
    ans: "Nhà nước xã hội chủ nghĩa (NNXHCN) là kiểu nhà nước mới ra đời từ cách mạng XHCN do giai cấp công nhân lãnh đạo. Theo Mác-Lênin: đây là nhà nước mà quyền lực thuộc về giai cấp công nhân và nhân dân lao động, có sứ mệnh xây dựng thành công CNXH và đưa nhân dân trở thành người làm chủ trên mọi lĩnh vực đời sống xã hội.",
  },
  {
    kw: ["ban chat chinh tri", "ban chat ve chinh tri", "tinh giai cap"],
    ans: "Bản chất chính trị của NNXHCN gồm 3 điểm cốt lõi: (1) Mang bản chất giai cấp công nhân — đại diện lợi ích nhân dân lao động; (2) Do Đảng Cộng sản lãnh đạo — định hướng xây dựng CNXH; (3) Nhân dân là chủ thể quyền lực — nhà nước của dân, do dân, vì dân. Đây là điểm phân biệt căn bản giữa NNXHCN và các nhà nước bóc lột.",
  },
  {
    kw: ["ban chat kinh te", "co so kinh te", "cong huu", "so huu xa hoi"],
    ans: "Về kinh tế, NNXHCN chịu sự quy định của cơ sở kinh tế XHCN. Chế độ công hữu hoặc sở hữu xã hội đối với tư liệu sản xuất chủ yếu giữ vai trò quan trọng, nhằm xóa bỏ chế độ bóc lột. Nhà nước không ngừng nâng cao đời sống vật chất của nhân dân và cải thiện chất lượng cuộc sống.",
  },
  {
    kw: ["tu tuong", "van hoa xa hoi", "he tu tuong", "mac le nin"],
    ans: "Về tư tưởng - văn hóa, hệ tư tưởng chủ đạo của NNXHCN là chủ nghĩa Mác-Lênin — nền tảng lý luận định hướng. Nhà nước kế thừa giá trị tiến bộ từ các nhà nước trước, hướng tới xóa bỏ phân hóa giai cấp và giảm bất bình đẳng. Đồng thời bảo đảm quyền cơ bản: tự do, bình đẳng, học tập, lao động và tham gia quản lý xã hội.",
  },
  {
    kw: ["su ra doi", "ra doi", "hinh thanh", "nguon goc", "lich su"],
    ans: "NNXHCN ra đời từ cách mạng XHCN. Nguyên nhân: trong xã hội tư bản, mâu thuẫn giữa giai cấp công nhân và tư sản ngày càng gay gắt — về kinh tế (lực lượng sản xuất bị kìm hãm bởi chế độ tư hữu) và xã hội (nhân dân bị bóc lột nặng nề). Khi mâu thuẫn lên đỉnh điểm, cách mạng vô sản nổ ra dưới sự lãnh đạo của Đảng Cộng sản, lật đổ nhà nước tư sản và thiết lập NNXHCN.",
  },
  {
    kw: ["y nghia", "tam quan trong", "ket qua cach mang"],
    ans: "Sự ra đời NNXHCN có ý nghĩa lịch sử to lớn: đánh dấu sự thay thế nhà nước tư sản bằng kiểu nhà nước mới; tạo công cụ chính trị để nhân dân thực hiện quyền làm chủ; là phương tiện tổ chức xây dựng xã hội mới; từng bước xóa bỏ áp bức bóc lột và hướng tới giải phóng con người.",
  },
  {
    kw: ["chuc nang doi noi", "doi noi", "trong nuoc", "xay dung xa hoi"],
    ans: "Chức năng đối nội của NNXHCN gồm: tổ chức và xây dựng CNXH (nhiệm vụ then chốt); đảm bảo trật tự xã hội và bảo vệ quyền lợi nhân dân; trấn áp sự phản kháng của giai cấp bóc lột bị lật đổ. Theo Lênin, xây dựng kinh tế là nhiệm vụ quyết định — quan trọng hơn cả việc trấn áp.",
  },
  {
    kw: ["chuc nang doi ngoai", "doi ngoai", "quoc te", "ngoai giao", "hop tac"],
    ans: "Chức năng đối ngoại của NNXHCN gồm: bảo vệ vững chắc Tổ quốc; mở rộng quan hệ hợp tác quốc tế trên nguyên tắc bình đẳng cùng có lợi; đoàn kết với các nước XHCN và phong trào cách mạng thế giới. Chức năng đối ngoại phục vụ và hỗ trợ cho chức năng đối nội.",
  },
  {
    kw: ["chinh the", "hinh thuc chinh the", "cong hoa xa hoi"],
    ans: "Chính thể của NNXHCN là cộng hòa xã hội chủ nghĩa — quyền lực thuộc về nhân dân và được thực hiện qua các cơ quan đại diện do nhân dân bầu ra. CHXHCN Việt Nam là ví dụ điển hình với Quốc hội là cơ quan quyền lực nhà nước cao nhất, do toàn dân bầu ra theo nguyên tắc phổ thông, bình đẳng, trực tiếp và bỏ phiếu kín.",
  },
  {
    kw: ["cau truc", "don nhat", "lien bang", "hinh thuc cau truc"],
    ans: "NNXHCN có hai hình thức cấu trúc: nhà nước đơn nhất (Việt Nam, Cuba — lãnh thổ thống nhất, quyền lực tập trung) và nhà nước liên bang (Liên Xô trước đây — các nước cộng hòa có quyền tự trị). CHXHCN Việt Nam là nhà nước đơn nhất với lãnh thổ thống nhất, không chia thành các tiểu bang.",
  },
  {
    kw: ["tap trung dan chu", "nguyen tac tap trung", "tap trung"],
    ans: "Tập trung dân chủ là nguyên tắc tổ chức và hoạt động nền tảng của NNXHCN. Nội dung: cơ quan cấp trên lãnh đạo cấp dưới; thiểu số phục tùng đa số; quyết định tập thể nhưng trách nhiệm cá nhân rõ ràng; nhân dân bầu cử cơ quan quyền lực và có quyền giám sát, bãi miễn. Nguyên tắc này đảm bảo sức mạnh thống nhất đồng thời phát huy dân chủ rộng rãi.",
  },
  {
    kw: ["dang cong san", "dang lanh dao", "vai tro cua dang", "dang cs"],
    ans: "Đảng Cộng sản giữ vai trò lãnh đạo NNXHCN — đây là nguyên tắc cơ bản. Đảng lãnh đạo bằng đường lối chính trị, cán bộ và tuyên truyền giáo dục. Đảng không làm thay nhà nước mà định hướng và kiểm tra việc thực hiện đường lối. Ở Việt Nam, Điều 4 Hiến pháp 2013 khẳng định: Đảng CSVN là lực lượng lãnh đạo Nhà nước và xã hội.",
  },
  {
    kw: ["quoc hoi", "co quan quyen luc cao nhat", "lap phap"],
    ans: "Quốc hội là cơ quan đại biểu cao nhất và cơ quan quyền lực nhà nước cao nhất của CHXHCN Việt Nam. Ba chức năng chính: lập pháp (làm và sửa đổi Hiến pháp, pháp luật); quyết định các vấn đề quan trọng của đất nước; giám sát tối cao hoạt động của Nhà nước. Quốc hội do nhân dân trực tiếp bầu ra với nhiệm kỳ 5 năm.",
  },
  {
    kw: ["dan chu xa hoi chu nghia", "dan chu xhcn", "nen dan chu"],
    ans: "Dân chủ XHCN là cơ sở và nền tảng của NNXHCN. Chỉ trong điều kiện đó, nhân dân mới thực hiện được ý chí qua việc lựa chọn công bằng, bình đẳng những người đại diện vào bộ máy nhà nước. Dân chủ XHCN còn giúp kiểm soát quyền lực, ngăn chặn tha hóa quyền lực và đảm bảo nhà nước phục vụ lợi ích toàn dân.",
  },
  {
    kw: ["phap che", "hien phap", "luat phap", "nha nuoc phap quyen"],
    ans: "Pháp chế XHCN đòi hỏi mọi hoạt động nhà nước và xã hội đều phải tuân theo pháp luật. Hiến pháp là văn bản pháp lý cao nhất, thể chế hóa ý chí nhân dân. Ở Việt Nam, Hiến pháp 2013 xác định: \"Nhà nước CHXHCN Việt Nam là nhà nước pháp quyền XHCN của Nhân dân, do Nhân dân, vì Nhân dân.\"",
  },
  {
    kw: ["so sanh", "khac biet", "nha nuoc tu ban", "tu san", "boc lot"],
    ans: "Điểm khác biệt căn bản: NNXHCN là công cụ của đa số (nhân dân lao động) đối với thiểu số (giai cấp bóc lột bị lật đổ); còn nhà nước tư bản là công cụ của thiểu số (giai cấp tư sản) thống trị đa số (nhân dân). Chức năng xây dựng và tổ chức xã hội là chủ đạo trong NNXHCN, chức năng trấn áp — dù vẫn tồn tại — mang bản chất và mục tiêu hoàn toàn khác.",
  },
  {
    kw: ["nhan dan lam chu", "quyen lam chu", "chu the quyen luc", "nguoi lam chu"],
    ans: "Nhân dân là chủ thể quyền lực trong NNXHCN. Quyền làm chủ được thực hiện qua: thể chế hóa ý chí thành pháp luật; bầu cử cơ quan đại diện; tham gia trực tiếp vào quản lý nhà nước; giám sát hoạt động cơ quan nhà nước theo phương châm \"Dân biết, dân bàn, dân làm, dân kiểm tra\". Quyền làm chủ không chỉ là tuyên bố mà phải được pháp luật bảo đảm thực chất.",
  },
  {
    kw: ["viet nam", "nuoc ta", "chxhcn viet nam", "viet"],
    ans: "CHXHCN Việt Nam là nhà nước đơn nhất, có lãnh thổ thống nhất. Theo Hiến pháp 2013: Quốc hội là cơ quan quyền lực cao nhất; Chính phủ là cơ quan hành chính; Tòa án NDTC là cơ quan tư pháp; Đảng CSVN là lực lượng lãnh đạo. Việt Nam đang trong thời kỳ quá độ xây dựng CNXH với nền kinh tế thị trường định hướng XHCN và nhà nước pháp quyền XHCN.",
  },
  {
    kw: ["giai cap cong nhan", "cong nhan", "vo san"],
    ans: "Giai cấp công nhân là lực lượng lãnh đạo cách mạng và là cơ sở giai cấp của NNXHCN. Đặc điểm nổi bật: gắn với nền sản xuất công nghiệp hiện đại; có lợi ích đối lập với giai cấp tư sản; có tổ chức kỷ luật cao và tinh thần quốc tế vô sản. Đảng Cộng sản — đội tiên phong của giai cấp công nhân — lãnh đạo nhà nước và xã hội hướng tới xây dựng CNXH.",
  },
];

const AI_GREET = `Xin chào! Tôi là **Trợ Lý AI** — được lập trình để hỗ trợ học tập về chủ đề **Nhà Nước Xã Hội Chủ Nghĩa**.\n\nTôi có thể giải đáp về:\n• Khái niệm và bản chất NNXHCN\n• Sự ra đời và ý nghĩa lịch sử\n• Chức năng đối nội, đối ngoại\n• Hình thức và nguyên tắc tổ chức\n• Dân chủ XHCN, pháp chế, Quốc hội\n\nHãy đặt câu hỏi để bắt đầu! 👇`;

const AI_DEFAULT = `Xin lỗi, tôi chưa có thông tin cụ thể về câu hỏi này. Bạn có thể hỏi về: bản chất NNXHCN, sự ra đời, chức năng, hình thức nhà nước, nguyên tắc tập trung dân chủ, Quốc hội, dân chủ XHCN, hoặc so sánh với nhà nước tư bản. Hãy thử một chủ đề đó nhé! 😊`;

const SUGGESTIONS = [
  "Nhà nước XHCN là gì?",
  "Bản chất chính trị NNXHCN?",
  "Nguyên tắc tập trung dân chủ?",
  "Chức năng đối nội NNXHCN?",
  "Vai trò của Quốc hội Việt Nam?",
  "So sánh NNXHCN với nhà nước tư sản?",
];

function aiLookup(input: string): string {
  const t = vn2(input);
  for (const item of AI_KB) {
    if (item.kw.some(k => t.includes(k))) return item.ans;
  }
  return AI_DEFAULT;
}

interface ChatMsg { id: string; role: "user" | "ai"; text: string; }

export default function AIChatPage() {
  const [msgs, setMsgs] = useState<ChatMsg[]>([{ id: "0", role: "ai", text: AI_GREET }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing]);

  function send(text: string) {
    const t = text.trim();
    if (!t || typing) return;
    setInput("");
    setMsgs(m => [...m, { id: Date.now().toString(), role: "user", text: t }]);
    setTyping(true);
    const reply = aiLookup(t);
    setTimeout(() => {
      setMsgs(m => [...m, { id: (Date.now() + 1).toString(), role: "ai", text: reply }]);
      setTyping(false);
      inputRef.current?.focus();
    }, Math.max(700, Math.min(1800, reply.length * 12)));
  }

  function Bubble({ text, role }: { text: string; role: "user" | "ai" }) {
    // Parse **bold** and line breaks
    const lines = text.split("\n");
    return (
      <div className="text-sm leading-relaxed" style={VN}>
        {lines.map((line, li) => (
          <span key={li}>
            {line.split(/\*\*(.+?)\*\*/g).map((chunk, ci) =>
              ci % 2 === 1
                ? <strong key={ci} className={role === "user" ? "text-[#FFD700]" : "text-[#111111]"}>{chunk}</strong>
                : chunk
            )}
            {li < lines.length - 1 && <br />}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="pt-16 h-screen bg-[#F5E9D0] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-[#111111] text-white px-6 py-5 relative overflow-hidden flex-shrink-0">
        <div className="absolute inset-y-0 right-0 w-48 bg-[#D32F2F]"
          style={{ clipPath: "polygon(40% 0,100% 0,100% 100%,0% 100%)" }} />
        <div className="relative max-w-3xl mx-auto flex items-center gap-4">
          <div className="w-11 h-11 bg-[#D32F2F] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
            <svg viewBox="0 0 20 20" width="18" height="18">
              <polygon points="10,2 11.8,7 17,7 12.9,10.2 14.5,15.2 10,12.2 5.5,15.2 7.1,10.2 3,7 8.2,7" fill="#FFD700" />
            </svg>
          </div>
          <div>
            <span className="inline-block bg-[#D32F2F] text-white text-[10px] font-bold tracking-[0.3em] px-2 py-0.5 mb-0.5" style={OS}>TRỢ LÝ HỌC TẬP</span>
            <h1 className="text-2xl font-bold leading-none" style={OS}>AI HỎI ĐÁP</h1>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-white/60" style={VN}>Đang hoạt động</span>
          </div>
        </div>
      </div>

      {/* Suggestion chips */}
      <div className="bg-white border-b border-[#111111]/10 px-4 py-2.5 flex gap-2 flex-wrap flex-shrink-0">
        {SUGGESTIONS.map(s => (
          <button key={s} onClick={() => send(s)}
            className="text-xs border border-[#D32F2F]/30 text-[#D32F2F] px-3 py-1.5 hover:bg-[#D32F2F] hover:text-white transition-colors font-medium rounded-full flex-shrink-0"
            style={VN}>{s}</button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 max-w-3xl mx-auto w-full">
        {msgs.map(msg => (
          <div key={msg.id} className={`flex gap-3 items-end ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            {/* AI avatar */}
            {msg.role === "ai" && (
              <div className="w-8 h-8 bg-[#D32F2F] rounded-full flex items-center justify-center flex-shrink-0 shadow">
                <svg viewBox="0 0 16 16" width="13" height="13">
                  <polygon points="8,1.5 9.4,5.6 13.7,5.6 10.3,8.1 11.5,12.2 8,9.7 4.5,12.2 5.7,8.1 2.3,5.6 6.6,5.6" fill="#FFD700" />
                </svg>
              </div>
            )}
            <div className={`max-w-[80%] shadow-sm ${msg.role === "user" ? "bg-[#D32F2F] text-white rounded-tl-2xl rounded-bl-2xl rounded-tr-sm rounded-br-2xl" : "bg-white border border-[#111111]/10 rounded-tr-2xl rounded-br-2xl rounded-tl-sm rounded-bl-2xl"} px-4 py-3`}>
              <Bubble text={msg.text} role={msg.role} />
            </div>
          </div>
        ))}

        {/* Typing dots */}
        {typing && (
          <div className="flex gap-3 items-end">
            <div className="w-8 h-8 bg-[#D32F2F] rounded-full flex items-center justify-center flex-shrink-0 shadow">
              <svg viewBox="0 0 16 16" width="13" height="13">
                <polygon points="8,1.5 9.4,5.6 13.7,5.6 10.3,8.1 11.5,12.2 8,9.7 4.5,12.2 5.7,8.1 2.3,5.6 6.6,5.6" fill="#FFD700" />
              </svg>
            </div>
            <div className="bg-white border border-[#111111]/10 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl px-4 py-3 flex gap-1.5 items-center">
              {[0, 160, 320].map(d => (
                <span key={d} className="w-2 h-2 bg-[#D32F2F]/50 rounded-full"
                  style={{ display: "inline-block", animation: `chatbounce 1s ease-in-out ${d}ms infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t-2 border-[#111111]/10 px-4 py-3 flex-shrink-0">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && send(input)}
            placeholder="Nhập câu hỏi về Nhà nước XHCN..."
            className="flex-1 border-2 border-[#111111]/15 bg-[#F5E9D0] px-4 py-2.5 text-sm outline-none focus:border-[#D32F2F] transition-colors rounded-full"
            style={VN}
            disabled={typing}
          />
          <button onClick={() => send(input)} disabled={typing || !input.trim()}
            className="w-11 h-11 bg-[#D32F2F] text-white rounded-full flex items-center justify-center disabled:opacity-40 hover:bg-[#B71C1C] transition-colors flex-shrink-0 shadow"
            style={OS}>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes chatbounce {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}