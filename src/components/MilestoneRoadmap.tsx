import React from 'react';
import { BookOpen, Shirt, Footprints, Utensils, FileSpreadsheet, AlertTriangle, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import { FatimaCharacter } from './FatimaCharacter';
import { HouseholdPersona, RoundDecision } from '../types/game';
import { sound } from '../utils/audio';

interface MilestoneRoadmapProps {
  persona: HouseholdPersona;
  currentRoundIndex: number;
  decisions: RoundDecision[];
  onSelectRound: (roundIndex: number) => void;
  onProceed: () => void;
}

export const MilestoneRoadmap: React.FC<MilestoneRoadmapProps> = ({
  persona,
  currentRoundIndex,
  decisions,
  onProceed,
}) => {
  const currentRound = persona.rounds[currentRoundIndex] || persona.rounds[0];

  const getRoundStatus = (index: number) => {
    const dec = decisions.find((d) => d.roundId === index + 1);
    if (dec) return dec.decision; // 'paid' | 'borrowed' | 'cut'
    if (index === currentRoundIndex) return 'current';
    return 'locked';
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'book':
        return <BookOpen className="w-5 h-5" />;
      case 'shirt':
        return <Shirt className="w-5 h-5" />;
      case 'walk':
        return <Footprints className="w-5 h-5" />;
      case 'food':
        return <Utensils className="w-5 h-5" />;
      case 'file-text':
        return <FileSpreadsheet className="w-5 h-5" />;
      case 'alert-triangle':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  // Node positions on a winding vertical path (S-curve)
  const nodePositions = [
    { x: 30, y: 75 },  // Node 1: Bottom left
    { x: 70, y: 63 },  // Node 2: Mid-right
    { x: 32, y: 50 },  // Node 3: Mid-left
    { x: 68, y: 37 },  // Node 4: Mid-right
    { x: 34, y: 24 },  // Node 5: Upper-left
    { x: 50, y: 11 },  // Node 6: Top center (Shock)
  ];

  return (
    <div className="relative w-full h-full flex flex-col justify-between bg-gradient-to-b from-[#E0F2FE] via-[#E8F8F0] to-[#FEF3C7] overflow-hidden p-4 select-none">
      {/* Top Header Card */}
      <div className="relative z-20 flex items-center justify-between bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-sm border border-emerald-100">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
            Pakistan School Journey
          </span>
          <h2 className="text-sm font-extrabold text-slate-800">
            {persona.regionName}: Milestone Roadmap
          </h2>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold font-mono">
          Round {Math.min(currentRoundIndex + 1, 6)} of 6
        </div>
      </div>

      {/* Main Roadmap Area with Winding Path */}
      <div className="relative flex-1 my-2 overflow-hidden flex items-center justify-center">
        {/* SVG Decorative Road and Hills */}
        <svg
          viewBox="0 0 100 90"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <defs>
            <linearGradient id="roadGradient" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#CBD5E1" />
              <stop offset="40%" stopColor="#A7F3D0" />
              <stop offset="100%" stopColor="#FDE68A" />
            </linearGradient>
            <linearGradient id="hillBalochistan" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#D97706" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#B45309" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="hillPunjab" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Background Terraced Hills */}
          <path d="M 0 45 Q 30 20 60 35 T 100 25 L 100 90 L 0 90 Z" fill="url(#hillPunjab)" />
          <path d="M 0 25 Q 40 5 80 18 T 100 10 L 100 90 L 0 90 Z" fill="url(#hillBalochistan)" />

          {/* Winding 3D Road */}
          <path
            d="M 30 75 Q 50 69 70 63 T 32 50 T 68 37 T 34 24 T 50 11"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M 30 75 Q 50 69 70 63 T 32 50 T 68 37 T 34 24 T 50 11"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Dashed center line */}
          <path
            d="M 30 75 Q 50 69 70 63 T 32 50 T 68 37 T 34 24 T 50 11"
            fill="none"
            stroke="#00C274"
            strokeWidth="1"
            strokeDasharray="2 3"
            strokeLinecap="round"
          />
        </svg>

        {/* Milestone Nodes */}
        {persona.rounds.map((round, idx) => {
          const status = getRoundStatus(idx);
          const pos = nodePositions[idx];
          const isCurrent = status === 'current';
          const isDone = status === 'paid' || status === 'borrowed' || status === 'cut';

          return (
            <div
              key={round.id}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center group cursor-pointer"
              onClick={() => {
                sound.playClick();
              }}
            >
              {/* Node Button Circle */}
              <div
                className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-transform duration-200 ${
                  isCurrent
                    ? 'bg-gradient-to-b from-emerald-400 to-emerald-600 text-white shadow-lg ring-4 ring-emerald-300/80 scale-110 animate-bounce'
                    : isDone
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white/80 text-slate-400 border border-slate-200'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-6 h-6 text-white" />
                ) : status === 'locked' ? (
                  <Lock className="w-4 h-4 text-slate-300" />
                ) : (
                  getIcon(round.icon)
                )}

                {/* Node Number Badge */}
                <span
                  className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center ${
                    isCurrent ? 'bg-amber-400 text-slate-900' : 'bg-slate-700 text-white'
                  }`}
                >
                  {round.id}
                </span>
              </div>

              {/* Node Title Label */}
              <div className="mt-1 px-1.5 py-0.5 rounded bg-white/90 shadow-xs border border-black/5 text-[9px] font-bold text-slate-700 whitespace-nowrap">
                {round.title}
              </div>
            </div>
          );
        })}

        {/* Floating Fatima beside the Current Node */}
        <div
          className="absolute z-20 pointer-events-none transition-all duration-500"
          style={{
            left: `${nodePositions[currentRoundIndex]?.x > 50 ? 18 : 72}%`,
            top: `${nodePositions[currentRoundIndex]?.y || 50}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <FatimaCharacter
            emotion={currentRoundIndex >= 3 ? 'worried' : 'cheerful'}
            urduText={currentRound?.urduDialogue}
            englishText={currentRound?.englishTranslation}
            scale={0.8}
            className="w-40 sm:w-44"
          />
        </div>
      </div>

      {/* Bottom Action Drawer */}
      <div className="relative z-20 bg-white/95 rounded-3xl p-3.5 shadow-xl border border-emerald-100 flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-semibold text-slate-800">
              Next Up: {currentRound?.title}
            </span>
          </div>
          <span className="font-mono font-bold text-emerald-800">
            PKR {currentRound?.cost.toLocaleString()}
          </span>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onProceed();
          }}
          className="w-full py-3.5 rounded-2xl btn-3d-green text-white font-extrabold text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>ENTER ROUND {currentRoundIndex + 1}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
