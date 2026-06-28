import { useState } from "react";

const VN = { fontFamily: "Be Vietnam Pro, sans-serif" } as const;

type Page = "home" | "puzzle" | "mindmap" | "quiz" | "scenario" | "ai";

import Navbar from "./Navbar.tsx";

import HomePage from "./HomePage.tsx";

import PuzzlePage from "./PuzzlePage.tsx";

import MindmapPage from "./MindmapPage.tsx"

import QuizPage from "./QuizPage.tsx"

import ScenarioPage from "./ScenarioPage.tsx"

import AIChatPage from "./AIChatPage.tsx";

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
      {page === "ai" && <AIChatPage />}
    </div>
  );
}
