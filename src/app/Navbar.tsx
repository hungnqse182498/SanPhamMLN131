import { BookOpen, Network, GraduationCap, Compass, MessageCircle } from "lucide-react";

type Page = "home" | "puzzle" | "mindmap" | "quiz" | "scenario" | "ai";

const OS = { fontFamily: "Oswald, sans-serif" } as const;
const VN = { fontFamily: "Be Vietnam Pro, sans-serif" } as const;

export default function Navbar({ active, setActive }: { active: Page; setActive: (p: Page) => void }) {
const items: { id: Page; label: string; Icon: any }[] = [
    { id: "home", label: "Nội Dung", Icon: BookOpen },
    { id: "puzzle", label: "Ghép Ảnh", Icon: () => (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z" fill="currentColor" opacity="0.9"/>
      </svg>
    )},
    { id: "mindmap", label: "Sơ Đồ Tư Duy", Icon: Network },
    { id: "quiz", label: "Ôn Tập", Icon: GraduationCap },
    { id: "scenario", label: "Kịch Bản", Icon: Compass },
    { id: "ai", label: "AI Chat", Icon: MessageCircle },
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