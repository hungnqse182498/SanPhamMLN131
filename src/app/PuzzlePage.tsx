import { useState, useEffect } from "react";
import { RotateCcw, ChevronRight } from "lucide-react";
import { TOTAL_QUIZ } from "./data/quizData";
import { io } from "socket.io-client";

// Khởi tạo kết nối socket bên ngoài Component để tránh re-render sinh ra nhiều kết nối thừa
const socket = io("http://localhost:5000", {
  transports: ["websocket"]
});

const OS = { fontFamily: "Oswald, sans-serif" } as const;
const VN = { fontFamily: "Be Vietnam Pro, sans-serif" } as const;

// ─── QUIZ DATA (Lấy chính xác 20 câu từ 50 câu) ──────────────────────────────

const QUIZ = TOTAL_QUIZ.slice(30, 50);

// ─── UTILS ───────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── PUZZLE PIECE ────────────────────────────────────────────────────────────

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

// ─── PUZZLE GAME CONFIG ──────────────────────────────────────────────────────

const LEVEL_IMAGES = [
  './src/assets/images/logo.png',
  './src/assets/images/logo1.jpg',
  './src/assets/images/logo2.png',
  './src/assets/images/logo3.jpg',
  './src/assets/images/logo4.jpg'
];

const LEVEL_CFG = [
  { g: 3, base: 100, startMoves: 5, mvRight: 4, mvWrong: 1, hintP: 15 },
  { g: 3, base: 150, startMoves: 3, mvRight: 4, mvWrong: 1, hintP: 15 },
  { g: 4, base: 220, startMoves: 6, mvRight: 6, mvWrong: 2, hintP: 20 },
  { g: 4, base: 280, startMoves: 5, mvRight: 6, mvWrong: 2, hintP: 20 },
  { g: 5, base: 380, startMoves: 8, mvRight: 8, mvWrong: 3, hintP: 25 },
];

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

  // ── Game States
  const [phase, setPhase] = useState<GamePhase>("start");
  const [pName, setPName] = useState("");
  const [nameError, setNameError] = useState(""); 
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [lvlScore, setLvlScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [movesUsed, setMovesUsed] = useState(0);
  
  // Quản lý câu hỏi đơn lẻ ngẫu nhiên liên tục
  const [curQ, setCurQ] = useState<typeof QUIZ[0] | null>(null);
  const [showQA, setShowQA] = useState(false);
  const [qCorrect, setQCorrect] = useState(0);
  const [qTotalAnswered, setQTotalAnswered] = useState(0);
  const [qaChosen, setQaChosen] = useState<number | null>(null);
  const [qaLocked, setQaLocked] = useState(false);
  
  const [hintCost, setHintCost] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [pieces, setPieces] = useState<number[]>([]);
  const [sel, setSel] = useState<number | null>(null);

  const cfg = LEVEL_CFG[Math.min(level - 1, LEVEL_CFG.length - 1)];
  const gridSize = cfg.g;
  const qWrong = qTotalAnswered - qCorrect;
  const estScore = Math.max(Math.round(cfg.base * 0.25), cfg.base - movesUsed * 2 + qCorrect * 8 - qWrong * 5 - hintCost);
  
  // 🔥 1. Tải BXH gốc lần đầu và LẮNG NGHE cập nhật Realtime qua Socket.io
  useEffect(() => {
    fetch("http://localhost:5000/api/leaderboard")
      .then(res => res.json())
      .then(data => setLb(data))
      .catch(err => console.error("Lỗi tải BXH ban đầu:", err));

    // Nhận dữ liệu phát từ backend và cập nhật state tức thì
    socket.on("leaderboardUpdate", (updatedLb: LBEntry[]) => {
      setLb(updatedLb);
    });

    // Hủy lắng nghe khi cấu trúc component bị gỡ bỏ
    return () => {
      socket.off("leaderboardUpdate");
    };
  }, []);

  // ─── 2. Tự động kiểm tra thắng cuộc và lưu điểm
  useEffect(() => {
    if (phase !== "puzzle" || pieces.length === 0) return;
    if (!pieces.every((v, i) => v === i)) return;

    const qWrong = qTotalAnswered - qCorrect;
    const earned = Math.max(
        Math.round(cfg.base * 0.25), 
        cfg.base - movesUsed * 2 + qCorrect * 8 - qWrong * 5 - hintCost
      );
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
    setQCorrect(0);
    setQTotalAnswered(0);
    setHintCost(0); 
    setShowHint(false);
    setPieces(initPieces(c.g * c.g));
    setSel(null); 
    setShowQA(false); 
    setCurQ(null);
    setQaChosen(null); 
    setQaLocked(false);
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
      triggerNewQuestion();
      return;
    }
    
    if (sel === null) { setSel(pos); return; }
    if (sel === pos) { setSel(null); return; }
    
    const next = [...pieces];
    [next[sel], next[pos]] = [next[pos], next[sel]];
    setPieces(next); 
    setSel(null);
    setMoves(m => m - 1); 
    setMovesUsed(m => m + 1);
  }

  function triggerNewQuestion() {
    const randomQuestion = QUIZ[Math.floor(Math.random() * QUIZ.length)];
    setCurQ(randomQuestion);
    setShowQA(true);
  }

  function handleQA(choice: number) {
    if (qaLocked || !curQ) return;
    const correct = choice === curQ.ans;
    setQaChosen(choice); 
    setQaLocked(true);
    
    setTimeout(() => {
      setMoves(m => m + (correct ? cfg.mvRight : cfg.mvWrong));
      if (correct) setQCorrect(c => c + 1);
      setQTotalAnswered(t => t + 1);
      setQaChosen(null); 
      setQaLocked(false); 
      setShowQA(false);
      setCurQ(null);
    }, 1300);
  }

  function handleHint() {
    if (!showHint) { 
      setHintCost(h => h + cfg.hintP); 
      setScore(s => Math.max(0, s - cfg.hintP)); 
    }
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
          <span className="text-white font-bold text-sm tracking-wide" style={OS}>🏆 BẢNG XẾP HẠNG</span>
          <button onClick={() => setShowLb(false)} className="text-white/60 hover:text-white text-xl leading-none">×</button>
        </div>
        <div className="flex-1 divide-y divide-[#F5E9D0]">
          {lb.map((e, i) => (
            <div key={e._id} className={`px-4 py-3.5 flex items-center gap-3 ${i < 3 ? "bg-[#FFFBF0]" : "bg-white"} ${e.name.toLowerCase() === pName.trim().toLowerCase() ? "ring-2 ring-inset ring-[#D32F2F]" : ""}`}>
              <span className="w-7 text-center text-sm flex-shrink-0">{medal(i)}</span>
              <span className="flex-1 text-sm font-medium truncate" style={VN}>{e.name}</span>
              <span className="font-bold text-[#D32F2F] tabular-nums text-sm" style={OS}>{e.score}</span>
              <span className="text-[10px] bg-[#F5E9D0] text-[#111111]/50 px-1.5 py-0.5" style={OS}>L{e.level}</span>
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
          <p className="text-white/60 text-sm mt-1" style={VN}>Trả lời câu hỏi trắc nghiệm liên tục để nhận thêm lượt xếp hình puzzle</p>
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
            {lb.slice(0, 10).map((e, i) => (
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
  
  // 🔥 GỘP CHUNG LAYOUT CHO CẢ TRẠNG THÁI "PUZZLE" VÀ "WIN" ĐỂ BXH KHÔNG BỊ UNMOUNT
  if (phase === "puzzle" || phase === "win") return (
    <div className="pt-16 min-h-screen bg-[#F5E9D0] flex flex-col">
      {lbDrawer}
      <div className="bg-[#111111] text-white px-4 py-2 flex items-center gap-3 text-xs flex-wrap">
        <span className="font-bold text-[#FFD700]" style={OS}>MÀN {level}/{LEVEL_CFG.length}</span>
        <span className="text-white/30">|</span>
        <span style={VN}>Điểm: <strong className="text-white">{score}</strong></span>
        <span className="text-white/30">|</span>
        {phase === "puzzle" && <span className={`font-bold tabular-nums ${moves <= 1 ? "text-red-400" : "text-[#FFD700]"}`} style={OS}>{moves} lượt còn lại</span>}
        {phase === "win" && <span className="text-green-400 font-bold" style={OS}>🎉 MÀN HOÀN THÀNH CHỜ CHUYỂN TIẾP!</span>}
        <span className="text-white/30">|</span>
        <span style={VN}>Độ phân giải hình: <strong className="text-[#FFD700]">{gridSize}x{gridSize}</strong></span>
      </div>
      <div className="bg-[#D32F2F]/30 h-1">
        <div className="bg-[#D32F2F] h-1 transition-all" style={{ width: `${((level - 1) / LEVEL_CFG.length) * 100}%` }} />
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 flex flex-col lg:flex-row gap-6 justify-center items-start">
        
        {/* 🏆 1. CỘT TRÁI (LUÔN LUÔN KHÔNG ĐỔI): BẢNG XẾP HẠNG REALTIME */}
        <div className="w-full lg:w-64 flex-shrink-0 bg-white border-2 border-[#111111] self-stretch lg:self-start max-h-[520px] flex flex-col shadow-md">
          <div className="bg-[#111111] px-3 py-2.5">
            <span className="text-white font-bold text-xs tracking-wide" style={OS}>🏆 BẢNG XẾP HẠNG</span>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-[#F5E9D0]">
            {lb.slice(0, 10).map((e, i) => (
              <div key={e._id} className={`px-3 py-2 flex items-center gap-2 ${i < 3 ? "bg-[#FFFBF0]" : "bg-white"} ${e.name.toLowerCase() === pName.trim().toLowerCase() ? "ring-2 ring-inset ring-[#D32F2F]" : ""}`}>
                <span className="w-6 text-center text-xs flex-shrink-0">{medal(i)}</span>
                <span className="flex-1 text-xs font-medium truncate" style={VN}>{e.name}</span>
                <span className="font-bold text-[#D32F2F] tabular-nums text-xs" style={OS}>{e.score}</span>
                <span className="text-[9px] bg-[#F5E9D0] text-[#111111]/50 px-1 py-0.5 flex-shrink-0" style={OS}>L{e.level}</span>
              </div>
            ))}
            {lb.length === 0 && (
              <div className="text-center py-6 text-xs text-[#111111]/40" style={VN}>Chưa có dữ liệu.</div>
            )}
          </div>
        </div>

        {/* 🕹 2. PHẦN NỘI DUNG SẼ THAY ĐỔI DỰA TRÊN PHASE */}
        {phase === "puzzle" ? (
          <>
            {/* KHUNG GHÉP HÌNH PUZZLE */}
            <div className="flex-shrink-0 relative mx-auto lg:mx-0">
              <div className="border-4 border-[#111111] shadow-2xl overflow-hidden relative"
                style={{ display: "grid", gridTemplateColumns: `repeat(${gridSize}, ${450 / gridSize}px)`, width: '450px', height: '450px' }}>
                {pieces.map((ci, pos) => (
                  <PuzzlePiece key={pos} correctIdx={ci} gridSize={gridSize}
                    isSelected={sel === pos} isSolved={false} onClick={() => handlePieceClick(pos)}
                    imageUrl={LEVEL_IMAGES[level - 1] || LEVEL_IMAGES[0]} />
                ))}
                {showQA && curQ && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-20">
                    <div className="bg-white border-2 border-[#111111] w-full max-w-sm subpixel-antialiased">
                      <div className="bg-[#D32F2F] px-4 py-3">
                        <p className="text-white text-xs font-bold tracking-wider" style={OS}>CÂU HỎI NGẪU NHIÊN — NHẬN LƯỢT ĐI</p>
                        <p className="text-[#FFD700] text-[10px] mt-0.5" style={VN}>Đúng: +{cfg.mvRight} lượt &nbsp;•&nbsp; Sai: +{cfg.mvWrong} lượt</p>
                      </div>
                      <div className="p-4 max-h-[300px] overflow-y-auto operational-quiz">
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

            {/* CỘT PHẢI: ĐIỂM SỐ & ĐIỀU KHIỂN */}
            <div className="flex flex-col gap-3 w-full lg:w-56 self-stretch lg:self-start">
              <div className="bg-[#D32F2F] text-white p-4 text-center shadow-sm">
                <p className="text-xs opacity-70 mb-0.5" style={VN}>Điểm hiện tại</p>
                <p className="text-4xl font-bold leading-none" style={OS}>{score}</p>
              </div>
              <button onClick={triggerNewQuestion}
                className={`flex items-center justify-center gap-2 py-3 font-bold text-xs border-2 border-[#111111] shadow-sm transition-all ${moves <= 1 ? "bg-[#D32F2F] text-white border-[#D32F2F] animate-pulse" : "bg-white text-[#111111] hover:bg-[#F5E9D0]"}`}
                style={OS}>
                {moves <= 1 ? "⚠ " : ""} KIẾM THÊM LƯỢT (+{cfg.mvRight}/{cfg.mvWrong})
              </button>
              <button onClick={handleHint}
                className={`flex items-center justify-center gap-2 py-3 font-bold text-xs border-2 shadow-sm transition-all ${showHint ? "bg-[#EDD9A3] border-[#D32F2F] text-[#D32F2F]" : "bg-white border-[#111111] text-[#111111] hover:bg-[#F5E9D0]"}`}
                style={OS}>
                {showHint ? "ẨN GỢI Ý" : `GỢI Ý (−${cfg.hintP}đ)`}
              </button>
              <button onClick={() => { setPieces(initPieces(gridSize * gridSize)); setSel(null); }}
                className="flex items-center justify-center gap-2 bg-[#111111] text-white py-3 font-bold text-xs hover:bg-black shadow-sm" style={OS}>
                <RotateCcw className="w-3.5 h-3.5" /> ĐẶT LẠI HÌNH
              </button>
              
              <div className="bg-white border-2 border-[#111111] p-3 space-y-1.5 text-xs shadow-sm">
                <div className="flex justify-between">
                  <span className="text-[#111111]/60" style={VN}>Lượt đã dùng:</span>
                  <span className="font-bold" style={OS}>{movesUsed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#111111]/60" style={VN}>Trả lời đúng:</span>
                  <span className="font-bold text-green-600" style={OS}>{qCorrect}/{qTotalAnswered}</span>
                </div>
                {hintCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-[#111111]/60" style={VN}>Phí gửi ý:</span>
                    <span className="font-bold text-red-600" style={OS}>−{hintCost}đ</span>
                  </div>
                )}
                <div className="border-t border-[#EDD9A3] pt-1.5 flex justify-between">
                  <span className="text-[#111111]/60" style={VN}>Điểm dự kiến:</span>
                  <span className="font-bold text-[#D32F2F]" style={OS}>{estScore}</span>
                </div>
              </div>
              
              {showHint && (
                <div className="border-2 border-[#D32F2F] overflow-hidden bg-white p-2 shadow-md">
                  <img src={LEVEL_IMAGES[level - 1] || LEVEL_IMAGES[0]} alt="Gợi ý" className="w-[208px] h-[208px] object-cover mx-auto" />
                  <p className="bg-[#D32F2F] text-white text-center py-1 text-[9px] font-bold mt-2" style={OS}>GỢI Ý — ĐÃ TRỪ {cfg.hintP} ĐIỂM</p>
                </div>
              )}
            </div>
          </>
        ) : (
          /* 🎉 GIAO DIỆN CHÚC MỪNG CHIẾN THẮNG (SẼ HIỂN THỊ THAY THẾ KHUNG PUZZLE VẪN CÓ BXH BÊN CẠNH) */
          <div className="bg-white border-2 border-[#111111] max-w-xl w-full mx-auto lg:mx-0 shadow-xl border-t-8 border-t-[#D32F2F]">
            <div className="bg-[#111111] text-white p-6 text-center">
              <span className="inline-block bg-[#D32F2F] text-white text-xs font-bold tracking-[0.2em] px-3 py-1 mb-2" style={OS}>
                MÀN {level} — HOÀN THÀNH!
              </span>
              <h2 className="text-3xl font-bold text-[#FFD700]" style={OS}>🎉 XUẤT SẮC!</h2>
            </div>
            <div className="bg-[#FBF7ED] text-[#111111] p-6 text-center border-b-2 border-[#EDD9A3]">
              <p className="text-xs opacity-70" style={VN}>Điểm nhận được màn này</p>
              <p className="text-6xl font-bold text-[#D32F2F] leading-none mt-1" style={OS}>+{lvlScore}</p>
            </div>
            <div className="p-5 space-y-2 border-b-2 border-[#EDD9A3] text-sm bg-white">
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
              {qTotalAnswered - qCorrect > 0 && (
                <div className="flex justify-between">
                  <span style={VN} className="text-[#111111]/70">Trả lời sai ({(qTotalAnswered - qCorrect)} × −5):</span>
                  <span className="font-bold text-red-600" style={OS}>−{(qTotalAnswered - qCorrect) * 5}</span>
                </div>
              )}
              {hintCost > 0 && (
                <div className="flex justify-between">
                  <span style={VN} className="text-[#111111]/70">Phí gợi ý:</span>
                  <span className="font-bold text-red-600" style={OS}>−{hintCost}</span>
                </div>
              )}
            </div>
            <div className="p-5 flex items-center justify-between bg-[#FFFBF0]">
              <div>
                <p className="text-xs text-[#111111]/60 mb-0.5" style={VN}>Tổng điểm tích lũy</p>
                <p className="text-3xl font-bold text-[#D32F2F]" style={OS}>{score}</p>
                {playerRank >= 0 && <p className="text-xs text-[#111111]/50 mt-1" style={VN}>Hạng của bạn: <strong className="text-[#D32F2F]">#{playerRank + 1}</strong> 🏆</p>}
              </div>
              <div className="flex flex-col gap-2 items-end">
                {level < LEVEL_CFG.length ? (
                  <button onClick={handleNext} className="bg-[#D32F2F] text-white px-5 py-3 font-bold text-sm flex items-center gap-2 hover:bg-[#B71C1C] shadow-md" style={OS}>
                    MÀN {level + 1} ({LEVEL_CFG[level].g}×{LEVEL_CFG[level].g}) <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button onClick={handleNext} className="bg-[#111111] text-[#FFD700] px-5 py-3 font-bold text-sm hover:bg-black shadow-md" style={OS}>
                    KẾT THÚC 🏆
                  </button>
                )}
                <button onClick={() => setShowLb(true)} className="text-xs text-[#111111]/50 hover:text-[#D32F2F] font-semibold underline mt-1" style={VN}>Xem chi tiết BXH →</button>
              </div>
            </div>
          </div>
        )}

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
          {lb.slice(0, 8).map((e, i) => (
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