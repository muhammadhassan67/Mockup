import React, { useState } from 'react';
import { 
  Coins, 
  Wifi, 
  Battery, 
  RotateCcw, 
  Plus, 
  Scissors, 
  CreditCard, 
  Sparkles, 
  Award, 
  Users2, 
  HeartHandshake, 
  CheckCircle, 
  XCircle, 
  MapPin, 
  ChevronRight,
  Heart,
  BookOpen,
  Info,
  AlertTriangle
} from 'lucide-react';
import { FatimaCharacter } from './FatimaCharacter';
import { MilestoneRoadmap } from './MilestoneRoadmap';
import { ItemizedReceipt } from './ItemizedReceipt';
import { ConsequenceDrawer } from './ConsequenceDrawer';
import { HouseholdPersona, RoundDecision, DecisionType, GameStage, PlayerStats, ChoiceOption } from '../types/game';
import { sound } from '../utils/audio';

interface MobileSimulatorProps {
  persona: HouseholdPersona;
  currentRoundIndex: number;
  stage: GameStage;
  remainingFloat: number;
  totalDebt: number;
  playerStats: PlayerStats;
  decisions: RoundDecision[];
  lastChoiceMade: ChoiceOption | null;
  onStartGame: () => void;
  onEnterRound: () => void;
  onMakeDecision: (choice: ChoiceOption) => void;
  onContinueFromConsequence: () => void;
  onLotteryDraw: (won: boolean) => void;
  onRestart: () => void;
  lotteryResult: boolean | null;
  lotteryDrawn: boolean;
}

export const MobileSimulator: React.FC<MobileSimulatorProps> = ({
  persona,
  currentRoundIndex,
  stage,
  remainingFloat,
  totalDebt,
  playerStats,
  decisions,
  lastChoiceMade,
  onStartGame,
  onEnterRound,
  onMakeDecision,
  onContinueFromConsequence,
  onLotteryDraw,
  onRestart,
  lotteryResult,
  lotteryDrawn,
}) => {
  const [isScratchingLottery, setIsScratchingLottery] = useState(false);
  const [hoveredChoice, setHoveredChoice] = useState<DecisionType | null>(null);

  const currentRound = persona.rounds[currentRoundIndex] || persona.rounds[0];

  // Calculate float percentage
  const initialFloat = persona.startingFloat;
  const floatPercent = Math.max(0, Math.min(100, (remainingFloat / initialFloat) * 100));

  // Determine Fatima's emotion
  const getFatimaEmotion = () => {
    if (stage === 'intro') return 'cheerful';
    if (hoveredChoice === 'cut') return 'distressed';
    if (hoveredChoice === 'borrowed') return 'worried';
    if (hoveredChoice === 'paid') return 'cheerful';
    if (totalDebt > 0 || decisions.some((d) => d.decision === 'cut') || remainingFloat <= 0) {
      return 'distressed';
    }
    if (currentRoundIndex >= 3) return 'worried';
    return 'cheerful';
  };

  // Outcome calculation
  const cutsCount = decisions.filter((d) => d.decision === 'cut').length;
  const borrowsCount = decisions.filter((d) => d.decision === 'borrowed').length;

  let outcomeVerdict = 'Comfortable';
  let outcomeSubtitle = 'Fatima completed grade 5 without taking on informal debt or sacrificing essentials.';
  let verdictColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';

  if (cutsCount > 0 && borrowsCount > 0) {
    outcomeVerdict = 'Severe Crisis & Sacrifice';
    outcomeSubtitle = `The family incurred PKR ${totalDebt.toLocaleString()} in high-interest debt AND Fatima had to sacrifice ${cutsCount} crucial school need(s).`;
    verdictColor = 'text-rose-700 bg-rose-50 border-rose-200';
  } else if (cutsCount > 0) {
    outcomeVerdict = 'Something Gave (Sacrifice Tier)';
    outcomeSubtitle = `To prevent debt, Fatima sacrificed essential item(s). Her daily learning was severely compromised.`;
    verdictColor = 'text-amber-700 bg-amber-50 border-amber-200';
  } else if (borrowsCount >= 2) {
    outcomeVerdict = 'Debt Trap (High Risk)';
    outcomeSubtitle = `The family is saddled with PKR ${totalDebt.toLocaleString()} in informal credit from shopkeepers and moneylenders.`;
    verdictColor = 'text-rose-600 bg-rose-50 border-rose-200';
  } else if (borrowsCount === 1) {
    outcomeVerdict = 'Edge Borrowed';
    outcomeSubtitle = `Managed to keep Fatima in school by borrowing PKR ${totalDebt.toLocaleString()}, stretching future months thin.`;
    verdictColor = 'text-amber-600 bg-amber-50 border-amber-200';
  } else if (remainingFloat === 0) {
    outcomeVerdict = 'Stretched to the Limit';
    outcomeSubtitle = 'Exactly zero cash left for emergencies or her 2 younger siblings.';
    verdictColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  }

  const handleDrawLottery = () => {
    sound.playClick();
    setIsScratchingLottery(true);
    setTimeout(() => {
      const rand = Math.random() * 100;
      const won = rand < persona.stipendOddsPercent;
      if (won) {
        sound.playLotteryWin();
      } else {
        sound.playLotteryLose();
      }
      setIsScratchingLottery(false);
      onLotteryDraw(won);
    }, 1200);
  };

  const canAfford = currentRound.cost <= remainingFloat;

  return (
    <div className="relative mx-auto w-[350px] sm:w-[380px] h-[750px] sm:h-[790px] bg-slate-900 rounded-[50px] p-3 shadow-2xl border-4 border-slate-700/80 flex flex-col select-none ring-1 ring-black/20">
      {/* Side buttons */}
      <div className="absolute -left-1.5 top-24 w-1 h-8 bg-slate-700 rounded-l-md" />
      <div className="absolute -left-1.5 top-36 w-1 h-12 bg-slate-700 rounded-l-md" />
      <div className="absolute -left-1.5 top-52 w-1 h-12 bg-slate-700 rounded-l-md" />
      <div className="absolute -right-1.5 top-32 w-1 h-16 bg-slate-700 rounded-r-md" />

      {/* Screen Container */}
      <div className="relative w-full h-full bg-[#E8F8F0] rounded-[42px] overflow-hidden flex flex-col text-slate-800">
        {/* Dynamic Island Notch & Status Bar */}
        <div className="relative z-40 px-6 pt-3 pb-1.5 flex items-center justify-between text-slate-800 text-xs font-semibold">
          <span>9:41</span>
          <div className="w-24 h-5 bg-black rounded-full flex items-center justify-between px-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-600/40" />
            <div className="w-2 h-2 rounded-full bg-slate-800" />
          </div>
          <div className="flex items-center gap-1.5 text-slate-700">
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* SCREEN 1: INTRO (Scan & Intro Screen) */}
        {stage === 'intro' && (
          <div className="relative flex-1 flex flex-col justify-between overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#7DD3FC] via-[#BAE6FD] to-[#FED7AA] pointer-events-none">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full opacity-60">
                <circle cx="85" cy="20" r="14" fill="#FEF08A" />
                <path d="M 0 55 Q 35 35 70 50 T 100 42 L 100 100 L 0 100 Z" fill="#FDBA74" opacity="0.7" />
                <path d="M 0 65 Q 40 50 80 62 T 100 55 L 100 100 L 0 100 Z" fill="#FB923C" opacity="0.8" />
                <path d="M 12 60 L 14 75 L 10 75 Z" fill="#78350F" />
                <path d="M 13 60 Q 5 55 2 58 M 13 60 Q 20 54 24 58 M 13 60 Q 8 50 7 46 M 13 60 Q 18 50 20 48" stroke="#065F46" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 88 56 L 90 75 L 86 75 Z" fill="#78350F" />
                <path d="M 89 56 Q 80 50 78 54 M 89 56 Q 96 50 99 54 M 89 56 Q 84 46 83 42 M 89 56 Q 94 46 96 44" stroke="#065F46" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>

            {/* Top Coin Badge & Region */}
            <div className="relative z-20 px-4 pt-1 flex items-center justify-between">
              <div className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-emerald-100 shadow-sm flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                {persona.regionName}
              </div>

              <div className="flex items-center gap-1.5 bg-amber-400 text-slate-900 px-3 py-1 rounded-full shadow-md font-mono font-extrabold text-xs">
                <Coins className="w-4 h-4 text-amber-900" />
                <span>PKR {persona.startingFloat.toLocaleString()}</span>
              </div>
            </div>

            {/* Fatima Character */}
            <div className="relative z-10 flex-1 flex items-center justify-center pt-2">
              <FatimaCharacter
                emotion="cheerful"
                urduText="السلام علیکم! میں اسکول جانا چاہتی ہوں، کیا آپ میری مدد کریں گے؟"
                englishText="As-salamu alaykum! I want to study in school, will you help me?"
                showDialogue={true}
                className="w-48 sm:w-56"
              />
            </div>

            {/* Household Profile Card */}
            <div className="relative z-20 p-4 pt-2">
              <div className="bg-white/95 backdrop-blur-md rounded-[28px] p-4 shadow-xl border border-emerald-100 flex flex-col gap-3">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1">
                    <span className="flex items-center gap-1 text-emerald-800">
                      Float Bar
                    </span>
                    <span className="font-mono text-emerald-700">
                      PKR {persona.startingFloat.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-3.5 bg-slate-100 rounded-full p-0.5 overflow-hidden shadow-inner border border-slate-200">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-[#00C274] rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                <div className="text-[11.5px] leading-relaxed text-slate-600 space-y-1">
                  <p className="font-bold text-slate-900">
                    Persona Intro:
                  </p>
                  <p>
                    Your household earns <span className="font-bold text-slate-800">PKR {persona.monthlyIncome.toLocaleString()}</span>/month. Most of that is already spoken for: rent, food, your other kids.
                  </p>
                  <p className="text-emerald-900 font-medium">
                    What you can actually move this time for Fatima&apos;s school: <span className="font-bold font-mono">PKR {persona.startingFloat.toLocaleString()}</span>.
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-2.5 flex items-start gap-2 text-[10.5px] text-amber-900">
                  <Users2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <p className="leading-snug">
                    <span className="font-bold">Sibling Reality: </span>
                    {persona.siblingStory.details}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sound.playCash();
                    onStartGame();
                  }}
                  className="w-full py-3.5 rounded-2xl btn-3d-green text-white font-extrabold text-sm tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>BEGIN GAME</span>
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                    <ChevronRight className="w-3.5 h-3.5 text-white" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 2: 3D ROADMAP */}
        {stage === 'roadmap' && (
          <MilestoneRoadmap
            persona={persona}
            currentRoundIndex={currentRoundIndex}
            decisions={decisions}
            onSelectRound={() => {}}
            onProceed={() => {
              sound.playClick();
              onEnterRound();
            }}
          />
        )}

        {/* SCREEN 3: IN-ROUND SITUATION & DECISION SCREEN */}
        {(stage === 'decision' || stage === 'shock_lottery') && (
          <div className="relative flex-1 flex flex-col justify-between p-3.5 overflow-y-auto">
            {/* Top Floating HUD: Float, Debt, and Vitals */}
            <div className="flex flex-col gap-2">
              {/* Round Title */}
              <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-slate-800">
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  ROUND {currentRound.id} OF 6
                </span>
                <span className="text-slate-500 font-mono text-[10px]">
                  {persona.regionName}
                </span>
              </div>

              {/* Dynamic Float Bar + Debt Counter */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-2.5 border border-emerald-100 shadow-xs">
                <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                  <span className="text-slate-600 flex items-center gap-1">
                    Remaining Float:
                  </span>
                  <span
                    className={`font-mono font-extrabold ${
                      !canAfford ? 'text-rose-600' : 'text-emerald-700'
                    }`}
                  >
                    PKR {remainingFloat.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full p-0.5 overflow-hidden border border-slate-200">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      remainingFloat <= 0
                        ? 'bg-rose-500'
                        : !canAfford
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${floatPercent}%` }}
                  />
                </div>

                {/* Status Badges: Debt & Sibling Risk */}
                <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100 text-[10px]">
                  <span className="flex items-center gap-1 font-bold text-rose-600 font-mono">
                    <Coins className="w-3 h-3" />
                    Debt: PKR {totalDebt.toLocaleString()}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-0.5 font-bold text-slate-600">
                      <Heart className="w-2.5 h-2.5 text-rose-500" />
                      {playerStats.health}%
                    </span>
                    <span className="flex items-center gap-0.5 font-bold text-slate-600">
                      <BookOpen className="w-2.5 h-2.5 text-emerald-600" />
                      {playerStats.academic}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Fatima Character Speaking Nastaliq Urdu */}
            <div className="flex-1 flex flex-col items-center justify-center my-0.5">
              <FatimaCharacter
                emotion={getFatimaEmotion()}
                urduText={currentRound.urduDialogue}
                englishText={currentRound.englishTranslation}
                showDialogue={true}
                className="w-40 sm:w-46"
              />
            </div>

            {/* Itemized Bill Card */}
            <div className="my-0.5">
              <ItemizedReceipt round={currentRound} />
            </div>

            {/* Real Context Situation Callout */}
            <div className="bg-amber-50/90 rounded-xl p-2 border border-amber-200 text-[10.5px] text-amber-950 my-1 leading-snug">
              <span className="font-bold flex items-center gap-1 text-amber-900 mb-0.5">
                <Info className="w-3 h-3 text-amber-700" />
                The Household Situation:
              </span>
              <p>{currentRound.situationContext}</p>
            </div>

            {/* SPECIAL SHOCK ROUND LOTTERY (Round 6) */}
            {currentRound.isShock && !lotteryDrawn && (
              <div className="my-1.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-2.5 border-2 border-dashed border-amber-300 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-amber-800 mb-1">
                  <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
                  Provincial Cash Stipend Lottery
                </div>
                <p className="text-[10px] text-slate-600 mb-1.5">
                  Official stipend odds for {persona.regionName}:{' '}
                  <span className="font-bold text-amber-900 font-mono">
                    {persona.stipendOddsPercent}%
                  </span>
                </p>
                <button
                  type="button"
                  disabled={isScratchingLottery}
                  onClick={handleDrawLottery}
                  className="w-full py-2.5 rounded-xl btn-3d-amber text-slate-900 font-extrabold text-xs tracking-wider cursor-pointer"
                >
                  {isScratchingLottery ? 'CHECKING PROVINCIAL DATABASE...' : 'CHECK GOVT STIPEND BAILOUT'}
                </button>
              </div>
            )}

            {/* SHOCK LOTTERY RESULT BANNER */}
            {currentRound.isShock && lotteryDrawn && (
              <div
                className={`my-1.5 rounded-xl p-2 text-center text-[11px] font-bold border ${
                  lotteryResult
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                {lotteryResult ? (
                  <div className="flex items-center justify-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>STIPEND GRANTED! +PKR 3,000 ADDED TO FLOAT</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>NO STIPEND BAILOUT ({persona.regionName} odds were {persona.stipendOddsPercent}%)</span>
                  </div>
                )}
              </div>
            )}

            {/* ACTION BUTTON LOGIC & GAMING DILEMMAS */}
            <div className="pt-1.5 flex flex-col gap-2">
              {/* When Round Cost <= Remaining Float: Show PAY FROM FLOAT */}
              {canAfford ? (
                <div className="flex flex-col gap-1.5">
                  {/* Primary Pay Button */}
                  <button
                    type="button"
                    onMouseEnter={() => setHoveredChoice('paid')}
                    onMouseLeave={() => setHoveredChoice(null)}
                    onClick={() => {
                      sound.playCash();
                      onMakeDecision(currentRound.choices.pay);
                    }}
                    className="w-full py-3.5 rounded-2xl btn-3d-green text-white font-extrabold text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>PAY FROM FLOAT (PKR {currentRound.cost.toLocaleString()})</span>
                  </button>

                  {/* Secondary Tactical Options: Even with float, parent can choose to Borrow or Cut to save money for siblings! */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onMouseEnter={() => setHoveredChoice('borrowed')}
                      onMouseLeave={() => setHoveredChoice(null)}
                      onClick={() => {
                        sound.playBorrow();
                        onMakeDecision(currentRound.choices.borrow);
                      }}
                      className="py-2 px-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      title="Borrow to preserve float for siblings"
                    >
                      <Plus className="w-3 h-3 text-emerald-600" />
                      <span>Borrow (+Debt)</span>
                    </button>

                    <button
                      type="button"
                      onMouseEnter={() => setHoveredChoice('cut')}
                      onMouseLeave={() => setHoveredChoice(null)}
                      onClick={() => {
                        sound.playCut();
                        onMakeDecision(currentRound.choices.cut);
                      }}
                      className="py-2 px-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      title="Cut this expense to preserve float"
                    >
                      <Scissors className="w-3 h-3 text-rose-600" />
                      <span>Cut (Sacrifice)</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* When Round Cost > Remaining Float: PAY BUTTON MUST VANISH COMPLETELY! Strictly locked into BORROW or CUT */
                <div className="flex flex-col gap-2">
                  <div className="text-[10px] font-bold text-rose-700 text-center bg-rose-50 border border-rose-200 rounded-xl py-1 px-2">
                    Float depleted! Cannot pay PKR {currentRound.cost.toLocaleString()}. The Pay button is gone.
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {/* + BORROW Button */}
                    <button
                      type="button"
                      onMouseEnter={() => setHoveredChoice('borrowed')}
                      onMouseLeave={() => setHoveredChoice(null)}
                      onClick={() => {
                        sound.playBorrow();
                        onMakeDecision(currentRound.choices.borrow);
                      }}
                      className="py-3 px-2 rounded-2xl btn-3d-green text-white font-extrabold text-xs flex flex-col items-center justify-center gap-0.5 cursor-pointer"
                    >
                      <div className="flex items-center gap-1">
                        <Plus className="w-3.5 h-3.5" />
                        <span className="tracking-wide">BORROW</span>
                      </div>
                      <span className="text-[9.5px] opacity-90 font-normal">
                        + Debt: PKR {currentRound.cost.toLocaleString()}
                      </span>
                    </button>

                    {/* ✂ CUT Button */}
                    <button
                      type="button"
                      onMouseEnter={() => setHoveredChoice('cut')}
                      onMouseLeave={() => setHoveredChoice(null)}
                      onClick={() => {
                        sound.playCut();
                        onMakeDecision(currentRound.choices.cut);
                      }}
                      className="py-3 px-2 rounded-2xl btn-3d-white text-slate-800 font-extrabold text-xs flex flex-col items-center justify-center gap-0.5 cursor-pointer"
                    >
                      <div className="flex items-center gap-1">
                        <Scissors className="w-3.5 h-3.5 text-slate-700" />
                        <span className="tracking-wide">CUT</span>
                      </div>
                      <span className="text-[9.5px] text-slate-500 font-normal">
                        Something gave
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SCREEN 4: IMMEDIATE CONSEQUENCE DRAWER */}
        {stage === 'consequence' && lastChoiceMade && (
          <ConsequenceDrawer
            choice={lastChoiceMade}
            persona={persona}
            playerStats={playerStats}
            remainingFloat={remainingFloat}
            totalDebt={totalDebt}
            roundNumber={currentRound.id}
            onContinue={onContinueFromConsequence}
          />
        )}

        {/* SCREEN 5: FINAL CLOSING SEQUENCE */}
        {stage === 'closing' && (
          <div className="relative flex-1 flex flex-col justify-between p-4 overflow-y-auto">
            <div className="text-center pt-1 pb-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-2 shadow-inner">
                <Award className="w-7 h-7" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                School Year Completed
              </span>
              <h2 className="text-base font-black text-slate-900">
                Final Educational Verdict
              </h2>
            </div>

            {/* Outcome Tier Verdict Banner */}
            <div className={`rounded-2xl p-3 border text-center ${verdictColor}`}>
              <span className="text-[10px] font-extrabold uppercase tracking-widest block mb-0.5">
                Outcome Tier
              </span>
              <h3 className="text-sm font-black">{outcomeVerdict}</h3>
              <p className="text-[11px] mt-1 leading-snug">{outcomeSubtitle}</p>
            </div>

            {/* Fatima's Final Vitals */}
            <div className="grid grid-cols-3 gap-2 my-2 text-center text-xs">
              <div className="bg-white rounded-xl p-2 border border-slate-200">
                <span className="text-slate-500 block text-[9.5px]">Health</span>
                <span className="font-mono font-bold text-xs text-rose-600">{playerStats.health}%</span>
              </div>
              <div className="bg-white rounded-xl p-2 border border-slate-200">
                <span className="text-slate-500 block text-[9.5px]">Studies</span>
                <span className="font-mono font-bold text-xs text-emerald-600">{playerStats.academic}%</span>
              </div>
              <div className="bg-white rounded-xl p-2 border border-slate-200">
                <span className="text-slate-500 block text-[9.5px]">Dignity</span>
                <span className="font-mono font-bold text-xs text-amber-600">{playerStats.dignity}%</span>
              </div>
            </div>

            {/* Totals */}
            <div className="grid grid-cols-2 gap-2 mb-2 text-center text-xs">
              <div className="bg-white rounded-xl p-2.5 border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Total Debt Accumulated</span>
                <span className="text-sm font-mono font-bold text-rose-600">
                  PKR {totalDebt.toLocaleString()}
                </span>
              </div>
              <div className="bg-white rounded-xl p-2.5 border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Items Sacrificed</span>
                <span className="text-sm font-mono font-bold text-amber-600">
                  {cutsCount} need(s) cut
                </span>
              </div>
            </div>

            {/* Itemized All 6 Rounds Summary */}
            <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs my-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 pb-2 border-b border-slate-100">
                <span>All 6 Rounds Summary</span>
                <span className="text-[10px] text-slate-400">Action Tag</span>
              </div>
              <div className="divide-y divide-slate-100 text-[11px]">
                {decisions.map((d) => (
                  <div key={d.roundId} className="py-1.5 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-800">
                        R{d.roundId}: {d.roundTitle}
                      </span>
                      <span className="block text-[10px] text-slate-400">
                        PKR {d.cost.toLocaleString()}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        d.decision === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : d.decision === 'borrowed'
                          ? 'bg-rose-100 text-rose-800'
                          : d.decision === 'stipend_covered'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {d.decision === 'paid'
                        ? '[Paid]'
                        : d.decision === 'borrowed'
                        ? '[Borrowed]'
                        : d.decision === 'stipend_covered'
                        ? '[Stipend]'
                        : '[Cut]'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sibling Reality Reflection */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3 my-2 text-[11px] text-amber-900 leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <HeartHandshake className="w-4 h-4 text-amber-700" />
                <span>The Unassisted Siblings Reality</span>
              </div>
              <p>
                {persona.siblingStory.names.join(' and ')} watched their father scrape together every rupee.
                In 1,000 households studied, protecting one girl&apos;s schooling often means withdrawing a brother or younger sister into farm labor.
              </p>
            </div>

            {/* Restart Button */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onRestart();
              }}
              className="w-full py-3 rounded-2xl btn-3d-green text-white font-extrabold text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer mt-1"
            >
              <RotateCcw className="w-4 h-4" />
              <span>TEST ANOTHER HOUSEHOLD PERSONA</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
