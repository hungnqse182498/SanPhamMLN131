import { useState } from "react";

const OS = { fontFamily: "Oswald, sans-serif" } as const;
const VN = { fontFamily: "Be Vietnam Pro, sans-serif" } as const;

// ─── MINDMAP PAGE ─────────────────────────────────────────────────────────────

// Thêm thuộc tính 'desc' để lưu nội dung hiển thị chi tiết khi hover
interface MNode { 
  id: string; 
  label: string[]; 
  x: number; 
  y: number; 
  parent?: string; 
  level: 0 | 1 | 2; 
  desc?: string; // Nội dung chi tiết khi hover
}

const MM: MNode[] = [
  { id: "root", label: ["NHÀ NƯỚC", "XHCN"], x: 540, y: 300, level: 0, desc: "Nhà nước XHCN đóng vai trò là công cụ quan trọng nhất để thể chế hóa ý chí nhân dân, xác lập quyền và trách nhiệm của công dân, cũng như bảo vệ các quyền lợi chính đáng của người dân trong xã hội." },
  { id: "b1", label: ["Bản Chất"], x: 230, y: 140, parent: "root", level: 1, desc: "Là nhà nước của dân, do Đảng lãnh đạo, vì lợi ích nhân dân. " },
  { id: "b1a", label: ["Nhà nước", "của dân"], x: 60, y: 60, parent: "b1", level: 2, desc: " Nhà nước thuộc về nhân dân, do nhân dân làm chủ." },
  { id: "b1b", label: ["Đảng CS", "lãnh đạo"], x: 60, y: 140, parent: "b1", level: 2, desc: "Đảng Cộng sản là lực lượng duy nhất lãnh đạo Nhà nước và xã hội." },
  { id: "b1c", label: ["Tính nhân", "dân sâu sắc"], x: 60, y: 220, parent: "b1", level: 2, desc: "Mọi hoạt động của Nhà nước đều vì lợi ích của đại đa số nhân dân lao động." },
  { id: "b2", label: ["Chức Năng"], x: 540, y: 75, parent: "root", level: 1, desc: "Xây dựng kinh tế, bảo vệ Tổ quốc và hợp tác quốc tế." },
  { id: "b2a", label: ["Xây dựng", "CNXH"], x: 375, y: 18, parent: "b2", level: 2, desc: "Nhà nước tổ chức, điều hành việc phát triển kinh tế, văn hóa để xây dựng thành công xã hội chủ nghĩa." },
  { id: "b2b", label: ["Bảo vệ", "Tổ quốc"], x: 540, y: 12, parent: "b2", level: 2, desc: "Nhà nước có trách nhiệm giữ gìn an ninh, quốc phòng và chủ quyền quốc gia." },
  { id: "b2c", label: ["Hợp tác", "quốc tế"], x: 705, y: 18, parent: "b2", level: 2, desc: "Nhà nước thiết lập quan hệ hữu nghị và cùng phát triển với các quốc gia khác trên thế giới." },
  { id: "b3", label: ["Hình Thức"], x: 850, y: 140, parent: "root", level: 1, desc: "Chính thể Cộng hòa, quốc gia đơn nhất, thực thi dân chủ." },
  { id: "b3a", label: ["CH", "XHCN"], x: 1010, y: 60, parent: "b3", level: 2, desc: "Hình thức chính thể, nơi quyền lực tối cao thuộc về nhân dân và được thực hiện qua các cơ quan dân cử." },
  { id: "b3b", label: ["Nhà nước", "đơn nhất"], x: 1020, y: 140, parent: "b3", level: 2, desc: "Quốc gia có chủ quyền thống nhất, không chia cắt, có một hệ thống pháp luật và chính phủ duy nhất trên toàn lãnh thổ." },
  { id: "b3c", label: ["Dân chủ", "XHCN"], x: 1010, y: 220, parent: "b3", level: 2, desc: " Quyền lực thực sự thuộc về nhân dân, nhân dân tham gia quản lý Nhà nước và xã hội." },
  { id: "b4", label: ["Bộ Máy"], x: 850, y: 460, parent: "root", level: 1, desc: "Gồm Quốc hội (làm luật), Chính phủ (điều hành), Tòa án (xét xử)." },
  { id: "b4a", label: ["Quốc Hội"], x: 1010, y: 380, parent: "b4", level: 2, desc: "Cơ quan quyền lực cao nhất của Nhà nước, đại diện cho nhân dân, làm nhiệm vụ lập pháp (làm luật)." },
  { id: "b4b", label: ["Chính Phủ"], x: 1020, y: 460, parent: "b4", level: 2, desc: "Cơ quan hành chính cao nhất, chịu trách nhiệm quản lý, điều hành việc thực hiện luật pháp và chính sách." },
  { id: "b4c", label: ["Tòa Án", "NDTC"], x: 1010, y: 540, parent: "b4", level: 2, desc: " Cơ quan thực hiện quyền tư pháp, bảo vệ công lý và pháp luật." },
  { id: "b5", label: ["Nguyên Tắc"], x: 230, y: 460, parent: "root", level: 1, desc: "Đảng lãnh đạo, tập trung dân chủ, thượng tôn pháp chế." },
  { id: "b5a", label: ["Tập trung", "dân chủ"], x: 60, y: 380, parent: "b5", level: 2, desc: "Lãnh đạo tập trung trên cơ sở thảo luận dân chủ và tôn trọng ý kiến số đông." },
  { id: "b5b", label: ["Đảng CS", "lãnh đạo"], x: 60, y: 460, parent: "b5", level: 2, desc: "Đảng đưa ra đường lối, định hướng để Nhà nước thực hiện." },
  { id: "b5c", label: ["Pháp chế", "XHCN"], x: 60, y: 540, parent: "b5", level: 2, desc: " Nhà nước quản lý xã hội bằng pháp luật và mọi người đều phải tuân thủ pháp luật một cách nghiêm minh." },
];
const MM_MAP = Object.fromEntries(MM.map(n => [n.id, n]));

const LS = {
  0: { fill: "#D32F2F", text: "#FFD700", stroke: "#FFD700", sw: 3, w: 140, h: 70, r: 4, fs: 16, fw: "700", lh: 18 },
  1: { fill: "#111111", text: "#FFFFFF", stroke: "#D32F2F", sw: 2, w: 120, h: 50, r: 4, fs: 14, fw: "700", lh: 15 },
  2: { fill: "#F5E9D0", text: "#111111", stroke: "#111111", sw: 1.5, w: 110, h: 46, r: 4, fs: 12, fw: "600", lh: 14 },
} as const;

export default function MindmapPage() {
  const [hov, setHov] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<string[]>([]);
  
  // State quản lý vị trí và thông tin của Tooltip nội dung phụ
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  const handleNodeClick = (nodeId: string) => {
    if (expandedNodes.includes(nodeId)) {
      const getAllChildIds = (id: string): string[] => {
        let children = MM.filter(n => n.parent === id).map(n => n.id);
        children.forEach(childId => {
          children = [...children, ...getAllChildIds(childId)];
        });
        return children;
      };
      const childIds = getAllChildIds(nodeId);
      setExpandedNodes(prev => prev.filter(id => id !== nodeId && !childIds.includes(id)));
    } else {
      setExpandedNodes(prev => [...prev, nodeId]);
    }
  };

  const checkAncestorsExpanded = (node: MNode): boolean => {
    if (node.level === 0) return true;
    if (!node.parent) return false;
    if (!expandedNodes.includes(node.parent)) return false;
    return checkAncestorsExpanded(MM_MAP[node.parent]);
  };

  const getRenderPosition = (node: MNode): { x: number; y: number; isVisible: boolean } => {
    if (node.level === 0) return { x: node.x, y: node.y, isVisible: true };
    if (checkAncestorsExpanded(node)) {
      return { x: node.x, y: node.y, isVisible: true };
    }
    let current = node;
    while (current.parent) {
      const parentNode = MM_MAP[current.parent];
      if (parentNode.level === 0 || expandedNodes.includes(parentNode.id)) {
        return { x: parentNode.x, y: parentNode.y, isVisible: false };
      }
      current = parentNode;
    }
    return { x: 540, y: 300, isVisible: false };
  };

  // Xử lý di chuột để hiển thị nội dung bổ sung
  const handleMouseEnterNode = (e: React.MouseEvent, node: MNode) => {
    setHov(node.id);
    
    // Nếu node có nội dung mô tả, tính toán vị trí để hiện Tooltip HTML
    if (node.desc) {
      const svgElement = e.currentTarget.closest("svg");
      if (svgElement) {
        const rect = svgElement.getBoundingClientRect();
        // Tính toán vị trí tương đối của chuột so với khung SVG để đặt Tooltip chính xác
        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;
        
        setTooltip({
          x: clientX,
          y: clientY - 15, // Đẩy lên trên con trỏ chuột một chút
          text: node.desc
        });
      }
    }
  };

  // Cập nhật vị trí Tooltip khi di chuyển chuột bên trong ô
  const handleMouseMoveNode = (e: React.MouseEvent) => {
    if (tooltip) {
      const svgElement = e.currentTarget.closest("svg");
      if (svgElement) {
        const rect = svgElement.getBoundingClientRect();
        setTooltip({
          ...tooltip,
          x: e.clientX - rect.left,
          y: e.clientY - rect.top - 15
        });
      }
    }
  };

  const handleMouseLeaveNode = () => {
    setHov(null);
    setTooltip(null);
  };

  return (
    <div className="pt-16 min-h-screen bg-[#F5E9D0] flex flex-col">
      <div className="bg-[#111111] text-white py-8 px-6 relative overflow-hidden">
        <div className="absolute inset-y-0 right-0 w-48 bg-[#D32F2F]" style={{ clipPath: "polygon(40% 0, 100% 0, 100% 100%, 0% 100%)" }} />
        <div className="relative max-w-5xl mx-auto">
          <span className="inline-block bg-[#D32F2F] text-white text-xs font-bold tracking-[0.3em] px-3 py-1 mb-3" style={OS}>HỆ THỐNG KIẾN THỨC</span>
          <h1 className="text-4xl font-bold text-white" style={OS}>SƠ ĐỒ TƯ DUY</h1>
          <p className="text-white/60 text-sm mt-1" style={VN}>Sơ đồ tư duy của nhà nước XHCN</p>
        </div>
      </div>

      <div className="overflow-x-auto py-8 px-4">
        <div style={{ minWidth: 1100, maxWidth: 1100 }} className="mx-auto relative">
          
          <svg viewBox="-10 -20 1140 640" className="w-full relative" style={VN}>
            <rect x="-10" y="-20" width="1140" height="640" fill="#F5E9D0" />
            <g transform="translate(0, 40)">
            {/* Connections */}
            {MM.filter(n => n.parent).map(node => {
              const par = MM_MAP[node.parent!];
              const nodePos = getRenderPosition(node);
              const parPos = getRenderPosition(par);
              const act = hov === node.id || hov === node.parent;
              const mx = (parPos.x + nodePos.x) / 2;
              
              return (
                <path key={`p${node.id}`}
                  d={`M${parPos.x},${parPos.y} C${mx},${parPos.y} ${mx},${nodePos.y} ${nodePos.x},${nodePos.y}`}
                  fill="none"
                  stroke={act ? "#D32F2F" : "#111111"}
                  strokeWidth={act ? 3 : node.level === 2 ? 1.5 : 2.5}
                  strokeOpacity={nodePos.isVisible ? (act ? 1 : node.level === 2 ? 0.4 : 0.6) : 0}
                  strokeDasharray={node.level === 2 ? "5 3" : undefined}
                  style={{ 
                    transition: "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
                    pointerEvents: "none"
                  }}
                />
              );
            })}

            {/* Nodes */}
            {MM.map(node => {
              const s = LS[node.level];
              const act = hov === node.id;
              const isExpanded = expandedNodes.includes(node.id);
              const { x, y, isVisible } = getRenderPosition(node);
              
              return (
                <g key={node.id}
                  transform={`translate(${x - s.w / 2},${y - s.h / 2})`}
                  onMouseEnter={(e) => isVisible && handleMouseEnterNode(e, node)}
                  onMouseMove={(e) => isVisible && handleMouseMoveNode(e)}
                  onMouseLeave={handleMouseLeaveNode}
                  onClick={() => isVisible && handleNodeClick(node.id)}
                  style={{ 
                    cursor: isVisible ? "pointer" : "default",
                    opacity: isVisible ? 1 : 0,
                    pointerEvents: isVisible ? "auto" : "none",
                    transition: "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s ease",
                  }}>
                  
                  <rect width={s.w} height={s.h} rx={s.r}
                    fill={act && node.level > 0 ? "#D32F2F" : s.fill}
                    stroke={act ? "#FFD700" : isExpanded && node.level > 0 ? "#D32F2F" : s.stroke}
                    strokeWidth={act ? 3 : isExpanded ? s.sw + 1 : s.sw}
                    filter={act ? "drop-shadow(0 3px 8px rgba(211,47,47,0.5))" : node.level === 0 ? "drop-shadow(0 4px 10px rgba(211,47,47,0.4))" : undefined}
                    style={{ transition: "fill 0.15s, stroke 0.15s" }} />
                  
                  {node.label.map((line, li) => (
                    <text key={li}
                      x={s.w / 2}
                      y={s.h / 2 + (li - (node.label.length - 1) / 2) * s.lh + (s.fs / 3)}
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
            </g>
          </svg>

          {/* HTML Tooltip: Hiển thị nội dung mô tả đi theo con trỏ chuột */}
          {tooltip && (
            <div 
              className="absolute z-50 w-64 bg-[#111111] text-white p-3 text-xs border border-[#D32F2F] shadow-xl rounded pointer-events-none"
              style={{ 
                left: tooltip.x, 
                top: tooltip.y,
                transform: "translate(-50%, -100%)", // Đưa tâm Tooltip lên trên con trỏ chuột
                ...VN,
                transition: "left 0.05s ease-out, top 0.05s ease-out"
              }}
            >
              {tooltip.text}
              {/* Tạo mũi tên nhỏ phía dưới Tooltip */}
              <div className="absolute left-1/2 bottom-0 w-2 h-2 bg-[#111111] border-r border-b border-[#D32F2F] transform -translate-x-1/2 translate-y-1/2 rotate-45"></div>
            </div>
          )}

        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-12">
        <div className="bg-white border-2 border-[#111111] p-5 flex flex-wrap gap-6 items-center justify-between">
          <div className="flex flex-wrap gap-6 items-center">
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
          {expandedNodes.length > 0 && (
            <button 
              onClick={() => setExpandedNodes([])}
              className="text-xs bg-[#111111] text-white px-3 py-1.5 font-bold uppercase tracking-wider hover:bg-[#D32F2F] transition-colors"
              style={OS}
            >
              Thu gọn hết
            </button>
          )}
        </div>
      </div>
    </div>
  );
}