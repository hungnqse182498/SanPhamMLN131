import { useState, useEffect, useRef } from "react";
import { RotateCcw, CheckCircle2, XCircle, Clock, ChevronRight, Trophy } from "lucide-react";
import { TOTAL_QUIZ } from "./data/quizData";

const OS = { fontFamily: "Oswald, sans-serif" } as const;
const VN = { fontFamily: "Be Vietnam Pro, sans-serif" } as const;

// ─── ÔN TẬP PAGE ─────────────────────────────────────────────────────────────

type QuizPhase = "start" | "playing" | "result";

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function QuizPage() {
  const [phase, setPhase] = useState<QuizPhase>("start");
  const [qi, setQi] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentQuiz, setCurrentQuiz] = useState(() => generateShuffledQuiz());
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
      if (next >= currentQuiz.length) {
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

  function generateShuffledQuiz(): typeof TOTAL_QUIZ {
    const shuffledQuestions = shuffleArray(TOTAL_QUIZ).slice(0, 30);
    return shuffledQuestions.map(item => {
      const correctText = item.opts[item.ans];
      const shuffledOpts = shuffleArray(item.opts);
      const newAnsIndex = shuffledOpts.indexOf(correctText);
      return {
        ...item,
        opts: shuffledOpts,
        ans: newAnsIndex 
      };
    });
  }

  function startQuiz() {
    setCurrentQuiz(generateShuffledQuiz());
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
      <div className="bg-[#111111] text-white py-8 px-6 relative overflow-hidden">
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
            {currentQuiz.length} câu hỏi trắc nghiệm — mỗi câu 30 giây.
          </p>
          <div className="grid grid-cols-3 gap-3 mb-8">
            {([
              [currentQuiz.length.toString(), "CÂU HỎI"], 
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
    const score = answers.filter((a, i) => a === currentQuiz[i].ans).length;
    const pct = Math.round((score / currentQuiz.length) * 100);
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
            <p className="text-white/80 text-sm" style={VN}>{score}/{currentQuiz.length} câu đúng</p>
            <div className="mt-4 border-t border-white/20 pt-4">
              <p className="text-[#FFD700] font-bold text-lg" style={OS}>
                {pct >= 80 ? "XUẤT SẮC!" : pct >= 60 ? "KHÁ TỐT!" : "CẦN CỐ GẮNG THÊM!"}
              </p>
            </div>
          </div>
          <div className="space-y-6 mb-8">
            {currentQuiz.map((q, i) => {
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
  const q = currentQuiz[qi];
  const prog = (qi / currentQuiz.length) * 100;
  const timerPct = (timeLeft / 30) * 100;

  return (
    <div className="pt-16 min-h-screen bg-[#F5E9D0]">
      <div className="bg-[#D32F2F] text-white py-8 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-3">
            <span className="text-white/80 text-sm font-semibold" style={OS}>
              CÂU {qi + 1} / {currentQuiz.length}
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