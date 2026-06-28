import { useState } from "react";
const OS = { fontFamily: "Oswald, sans-serif" } as const;
const VN = { fontFamily: "Be Vietnam Pro, sans-serif" } as const;

function SectionHeader({ tag, title }: { tag: string; title: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="bg-[#D32F2F] text-white text-xs font-bold tracking-[0.25em] px-3 py-1" style={OS}>{tag}</div>
      <h2 className="text-2xl md:text-3xl font-bold text-[#111111] leading-tight" style={OS}>{title}</h2>
      <div className="flex-1 h-px bg-[#111111]/15" />
    </div>
  );
}

export default function HomePage() {
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