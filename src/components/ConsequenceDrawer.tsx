import React from 'react';
import { 
  Heart, 
  BookOpen, 
  Sparkles, 
  Users2, 
  Coins, 
  AlertTriangle, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown,
  Languages
} from 'lucide-react';
import { FatimaCharacter } from './FatimaCharacter';
import { ChoiceOption, PlayerStats, HouseholdPersona } from '../types/game';
import { sound } from '../utils/audio';

interface ConsequenceDrawerProps {
  choice: ChoiceOption;
  persona: HouseholdPersona;
  playerStats: PlayerStats;
  remainingFloat: number;
  totalDebt: number;
  roundNumber: number;
  onContinue: () => void;
}

export const ConsequenceDrawer: React.FC<ConsequenceDrawerProps> = ({
  choice,
  persona,
  playerStats,
  remainingFloat,
  totalDebt,
  roundNumber,
  onContinue,
}) => {
  const isCut = choice.action === 'cut';
  const isBorrowed = choice.action === 'borrowed';
  const isPaid = choice.action === 'paid';

  const emotion = isCut ? 'distressed' : isBorrowed ? 'worried' : 'cheerful';

  return (
    <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col justify-end p-2 select-none animate-fadeIn">
      <div className="bg-white rounded-[32px] p-4 shadow-2xl border border-emerald-100 flex flex-col justify-between max-h-[92%] overflow-y-auto">
        {/* Top Header Tag */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isPaid ? 'bg-emerald-500' : isBorrowed ? 'bg-amber-500' : 'bg-rose-500'
              }`}
            />
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-800">
              Round {roundNumber} Decision Consequence
            </span>
          </div>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
              isPaid
                ? 'bg-emerald-100 text-emerald-800'
                : isBorrowed
                ? 'bg-amber-100 text-amber-800'
                : 'bg-rose-100 text-rose-800'
            }`}
          >
            {isPaid ? 'Paid from Float' : isBorrowed ? 'Debt Incurred' : 'Item Cut'}
          </span>
        </div>

        {/* Fatima Character Reaction */}
        <div className="my-2 flex flex-col items-center">
          <FatimaCharacter
            emotion={emotion}
            urduText={choice.fatimaQuoteUrdu}
            englishText={choice.fatimaQuoteEn}
            showDialogue={true}
            className="w-40 sm:w-44"
          />
        </div>

        {/* Consequence Summary Card */}
        <div
          className={`rounded-2xl p-3 mb-2.5 border text-xs leading-relaxed ${
            isPaid
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
              : isBorrowed
              ? 'bg-amber-50/80 border-amber-200 text-amber-950'
              : 'bg-rose-50/80 border-rose-200 text-rose-950'
          }`}
        >
          <span className="font-extrabold block mb-0.5 text-[10.5px] uppercase tracking-wide">
            Real Household Impact:
          </span>
          <p className="font-medium">{choice.consequenceSummary}</p>
        </div>

        {/* Dynamic Vitals Meters */}
        <div className="grid grid-cols-3 gap-1.5 mb-2.5 text-center">
          {/* Health */}
          <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
            <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-slate-600 mb-0.5">
              <Heart className="w-3 h-3 text-rose-500" />
              <span>Health</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <span className="font-mono font-bold text-xs text-slate-900">{playerStats.health}%</span>
              {choice.healthDelta !== 0 && (
                <span
                  className={`text-[10px] font-bold font-mono ${
                    choice.healthDelta > 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {choice.healthDelta > 0 ? `+${choice.healthDelta}` : choice.healthDelta}
                </span>
              )}
            </div>
          </div>

          {/* Academic */}
          <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
            <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-slate-600 mb-0.5">
              <BookOpen className="w-3 h-3 text-emerald-600" />
              <span>Studies</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <span className="font-mono font-bold text-xs text-slate-900">{playerStats.academic}%</span>
              {choice.academicDelta !== 0 && (
                <span
                  className={`text-[10px] font-bold font-mono ${
                    choice.academicDelta > 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {choice.academicDelta > 0 ? `+${choice.academicDelta}` : choice.academicDelta}
                </span>
              )}
            </div>
          </div>

          {/* Dignity */}
          <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
            <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-slate-600 mb-0.5">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Dignity</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <span className="font-mono font-bold text-xs text-slate-900">{playerStats.dignity}%</span>
              {choice.dignityDelta !== 0 && (
                <span
                  className={`text-[10px] font-bold font-mono ${
                    choice.dignityDelta > 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {choice.dignityDelta > 0 ? `+${choice.dignityDelta}` : choice.dignityDelta}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Sibling Risk Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-2 mb-3 text-[11px] text-amber-900 flex items-start gap-1.5">
          <Users2 className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Sibling Toll ({persona.siblingStory.names[0]} &amp; {persona.siblingStory.names[1]}): </span>
            <span>{choice.siblingRisk}</span>
          </div>
        </div>

        {/* Continue Button */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onContinue();
          }}
          className="w-full py-3.5 rounded-2xl btn-3d-green text-white font-extrabold text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>PROCEED TO NEXT ROADMAP STEP</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
