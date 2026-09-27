import React, { useState } from 'react';
import { 
  Smartphone, 
  Tv, 
  Columns2, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  BookOpen, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { STUDY_PERSONAS } from './data/studyData';
import { 
  HouseholdPersona, 
  RegionId, 
  GameStage, 
  ViewMode, 
  RoundDecision, 
  AudienceStats,
  PlayerStats,
  ChoiceOption
} from './types/game';
import { MobileSimulator } from './components/MobileSimulator';
import { VenueProjector } from './components/VenueProjector';
import { MethodologyModal } from './components/MethodologyModal';
import { sound } from './utils/audio';

export default function App() {
  // Navigation & View Mode
  const [viewMode, setViewMode] = useState<ViewMode>('dual');
  const [selectedRegionId, setSelectedRegionId] = useState<RegionId>('balochistan');
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);

  // Active Persona
  const activePersona: HouseholdPersona = STUDY_PERSONAS[selectedRegionId];

  // Game Engine Reactive State
  const [stage, setStage] = useState<GameStage>('intro');
  const [currentRoundIndex, setCurrentRoundIndex] = useState<number>(0);
  const [remainingFloat, setRemainingFloat] = useState<number>(activePersona.startingFloat);
  const [totalDebt, setTotalDebt] = useState<number>(0);
  const [decisions, setDecisions] = useState<RoundDecision[]>([]);
  const [lastChoiceMade, setLastChoiceMade] = useState<ChoiceOption | null>(null);
  const [lotteryDrawn, setLotteryDrawn] = useState(false);
  const [lotteryResult, setLotteryResult] = useState<boolean | null>(null);

  // Player Vitals (Real Gaming Mechanics)
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    health: 100,
    academic: 100,
    dignity: 100,
    siblingSecurity: 100,
  });

  // Live Room Audience Simulation Stats (342 attendees in Islamabad venue)
  const [audienceStats, setAudienceStats] = useState<AudienceStats>({
    totalParticipants: 342,
    borrowRate: 34.2,
    cutRate: 21.8,
    paidRate: 44.0,
    activeRound: 1,
  });

  // Handle region switch
  const handleSelectRegion = (regionId: RegionId) => {
    sound.playClick();
    setSelectedRegionId(regionId);
    const newPersona = STUDY_PERSONAS[regionId];
    setRemainingFloat(newPersona.startingFloat);
    setTotalDebt(0);
    setDecisions([]);
    setLastChoiceMade(null);
    setCurrentRoundIndex(0);
    setStage('intro');
    setLotteryDrawn(false);
    setLotteryResult(null);
    setPlayerStats({
      health: 100,
      academic: 100,
      dignity: 100,
      siblingSecurity: 100,
    });
  };

  // Sound toggle
  const toggleSound = () => {
    sound.isMuted = !isAudioMuted;
    setIsAudioMuted(!isAudioMuted);
    if (isAudioMuted) {
      sound.playClick();
    }
  };

  // Restart game simulation
  const handleRestart = () => {
    sound.playClick();
    setRemainingFloat(activePersona.startingFloat);
    setTotalDebt(0);
    setDecisions([]);
    setLastChoiceMade(null);
    setCurrentRoundIndex(0);
    setStage('intro');
    setLotteryDrawn(false);
    setLotteryResult(null);
    setPlayerStats({
      health: 100,
      academic: 100,
      dignity: 100,
      siblingSecurity: 100,
    });
  };

  // Progression handlers
  const handleStartGame = () => {
    setStage('roadmap');
  };

  const handleEnterRound = () => {
    setStage('decision');
  };

  // Action decision handler (with rich situation choices & consequence)
  const handleMakeDecision = (choice: ChoiceOption) => {
    const currentRound = activePersona.rounds[currentRoundIndex];
    let newFloat = remainingFloat;
    let newDebt = totalDebt;

    if (choice.action === 'paid') {
      newFloat = Math.max(0, remainingFloat - choice.cost);
    } else if (choice.action === 'borrowed') {
      newDebt = totalDebt + choice.debtAdded;
    }

    // Update vitals
    setPlayerStats((prev) => ({
      health: Math.max(0, Math.min(100, prev.health + choice.healthDelta)),
      academic: Math.max(0, Math.min(100, prev.academic + choice.academicDelta)),
      dignity: Math.max(0, Math.min(100, prev.dignity + choice.dignityDelta)),
      siblingSecurity: Math.max(
        0,
        Math.min(100, Math.round((newFloat / activePersona.startingFloat) * 100))
      ),
    }));

    const decisionRecord: RoundDecision = {
      roundId: currentRound.id,
      roundTitle: currentRound.title,
      cost: choice.cost,
      decision: choice.action,
      remainingFloatAfter: newFloat,
      totalDebtAccumulated: newDebt,
      cutItems: choice.action === 'cut' ? [currentRound.title] : [],
      choiceDetails: choice,
    };

    const updatedDecisions = [...decisions, decisionRecord];
    setRemainingFloat(newFloat);
    setTotalDebt(newDebt);
    setDecisions(updatedDecisions);
    setLastChoiceMade(choice);

    // Dynamically nudge the audience room counters
    setAudienceStats((prev) => {
      const shift = 0.8;
      if (choice.action === 'borrowed') {
        return {
          ...prev,
          borrowRate: Math.min(100, +(prev.borrowRate + shift).toFixed(1)),
          paidRate: Math.max(0, +(prev.paidRate - shift).toFixed(1)),
          activeRound: currentRound.id,
        };
      } else if (choice.action === 'cut') {
        return {
          ...prev,
          cutRate: Math.min(100, +(prev.cutRate + shift).toFixed(1)),
          paidRate: Math.max(0, +(prev.paidRate - shift).toFixed(1)),
          activeRound: currentRound.id,
        };
      }
      return {
        ...prev,
        activeRound: currentRound.id,
      };
    });

    // Show immediate consequence drawer
    setStage('consequence');
  };

  // Continue from consequence drawer to next roadmap step or closing
  const handleContinueFromConsequence = () => {
    if (currentRoundIndex + 1 < activePersona.rounds.length) {
      setCurrentRoundIndex(currentRoundIndex + 1);
      setStage('roadmap');
    } else {
      setStage('closing');
    }
  };

  // Shock round lottery draw handler
  const handleLotteryDraw = (won: boolean) => {
    setLotteryDrawn(true);
    setLotteryResult(won);
    if (won) {
      // +PKR 3,000 cash relief added to float
      setRemainingFloat((prev) => prev + 3000);
      setPlayerStats((prev) => ({
        ...prev,
        dignity: Math.min(100, prev.dignity + 15),
      }));
    }
  };

  return (
    <div className="min-h-screen bg-[#F0FDF4] text-slate-900 flex flex-col font-sans">
      {/* Universal Top Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-900/10 shadow-xs px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-[#00C274] flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black tracking-tight text-slate-900 leading-tight">
              The Real Cost of Educating a Girl in Pakistan
            </h1>
            <span className="text-[10px] text-slate-500 hidden md:inline">
              1,000 Household Empirical Study Simulator
            </span>
          </div>
        </div>

        {/* Zone 2: View Switcher (Dual / Mobile / Projector) */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl shadow-inner">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setViewMode('dual');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              viewMode === 'dual'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Columns2 className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Dual Synchronized</span>
            <span className="sm:hidden">Dual</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setViewMode('mobile');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              viewMode === 'mobile'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Mobile Attendee</span>
            <span className="sm:hidden">Mobile</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setViewMode('projector');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              viewMode === 'projector'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Tv className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Stage Projector</span>
            <span className="sm:hidden">Projector</span>
          </button>
        </div>

        {/* Zone 3: Primary Actions (Persona selector, Audio, Study Modal, Reset) */}
        <div className="flex items-center gap-2">
          {/* Persona Selector Dropdown */}
          <div className="relative">
            <select
              value={selectedRegionId}
              onChange={(e) => handleSelectRegion(e.target.value as RegionId)}
              className="appearance-none bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-extrabold py-2 pl-3 pr-8 rounded-xl border border-emerald-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
            >
              <option value="balochistan">Balochistan (PKR 26k · 5km)</option>
              <option value="punjab">Punjab (PKR 46k · &lt;1km)</option>
              <option value="kp">KP (PKR 34k · 3.2km)</option>
              <option value="sindh">Sindh (PKR 29k · 4.1km)</option>
              <option value="ict">ICT Islamabad (PKR 58k · 1.5km)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-emerald-700 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-emerald-700" />}
          </button>

          {/* Study Methodology Modal Button */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setIsMethodologyOpen(true);
            }}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>Study Data</span>
          </button>

          {/* Restart Button */}
          <button
            type="button"
            onClick={handleRestart}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Dynamic Viewport */}
      <main className="flex-1 p-3 sm:p-6 max-w-[1720px] mx-auto w-full flex flex-col justify-center">
        {/* VIEW 1: DUAL SYNCHRONIZED VIEW */}
        {viewMode === 'dual' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* Left: Attendee Mobile Shell (5 cols) */}
            <div className="xl:col-span-5 flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-2 px-2 text-xs font-bold text-slate-600">
                <span className="flex items-center gap-1.5 text-emerald-800">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  Attendee Mobile View (Participant Phone)
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Step {stage === 'intro' ? '1: Intro' : stage === 'roadmap' ? '2: Roadmap' : stage === 'decision' || stage === 'consequence' ? '3: In-Round' : '4: Closing'}
                </span>
              </div>

              <MobileSimulator
                persona={activePersona}
                currentRoundIndex={currentRoundIndex}
                stage={stage}
                remainingFloat={remainingFloat}
                totalDebt={totalDebt}
                playerStats={playerStats}
                decisions={decisions}
                lastChoiceMade={lastChoiceMade}
                onStartGame={handleStartGame}
                onEnterRound={handleEnterRound}
                onMakeDecision={handleMakeDecision}
                onContinueFromConsequence={handleContinueFromConsequence}
                onLotteryDraw={handleLotteryDraw}
                onRestart={handleRestart}
                lotteryResult={lotteryResult}
                lotteryDrawn={lotteryDrawn}
              />
            </div>

            {/* Right: Stage Projector Screen (7 cols) */}
            <div className="xl:col-span-7 flex flex-col">
              <div className="w-full flex items-center justify-between mb-2 px-2 text-xs font-bold text-slate-600">
                <span className="flex items-center gap-1.5 text-emerald-800">
                  <Tv className="w-4 h-4 text-emerald-600" />
                  Venue Auditorium Projector (Synchronized Live Screen)
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold">
                  Audience Size: {audienceStats.totalParticipants} Participants
                </span>
              </div>

              <VenueProjector
                currentRoundNumber={currentRoundIndex + 1}
                activePersona={activePersona}
                audienceStats={audienceStats}
                onSelectRegion={handleSelectRegion}
                className="w-full min-h-[680px]"
              />
            </div>
          </div>
        )}

        {/* VIEW 2: MOBILE SCREEN ONLY */}
        {viewMode === 'mobile' && (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="mb-3 text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
                Attendee Interactive Mobile View
              </span>
              <p className="text-xs text-slate-500">
                Zero-install responsive web browser experience for conference attendees
              </p>
            </div>

            <MobileSimulator
              persona={activePersona}
              currentRoundIndex={currentRoundIndex}
              stage={stage}
              remainingFloat={remainingFloat}
              totalDebt={totalDebt}
              playerStats={playerStats}
              decisions={decisions}
              lastChoiceMade={lastChoiceMade}
              onStartGame={handleStartGame}
              onEnterRound={handleEnterRound}
              onMakeDecision={handleMakeDecision}
              onContinueFromConsequence={handleContinueFromConsequence}
              onLotteryDraw={handleLotteryDraw}
              onRestart={handleRestart}
              lotteryResult={lotteryResult}
              lotteryDrawn={lotteryDrawn}
            />
          </div>
        )}

        {/* VIEW 3: STAGE PROJECTOR SCREEN ONLY */}
        {viewMode === 'projector' && (
          <div className="w-full max-w-6xl mx-auto flex flex-col justify-center py-2">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
                  Auditorium Venue Display
                </span>
                <h2 className="text-lg font-black text-slate-900">
                  Live Stage Projection System
                </h2>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-emerald-700">
                  Current Round: {currentRoundIndex + 1} of 6
                </span>
              </div>
            </div>

            <VenueProjector
              currentRoundNumber={currentRoundIndex + 1}
              activePersona={activePersona}
              audienceStats={audienceStats}
              onSelectRegion={handleSelectRegion}
              className="w-full min-h-[640px]"
            />
          </div>
        )}
      </main>

      {/* Research Transparency Modal */}
      <MethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />
    </div>
  );
}
