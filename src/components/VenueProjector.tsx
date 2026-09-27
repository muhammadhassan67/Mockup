import React, { useState } from 'react';
import { 
  QrCode, 
  Users, 
  TrendingUp, 
  MapPin, 
  AlertTriangle, 
  Percent, 
  Mic, 
  ExternalLink,
  Info,
  Sparkles
} from 'lucide-react';
import { REGIONAL_STATISTICS, PRESENTER_CUES } from '../data/studyData';
import { AudienceStats, HouseholdPersona, RegionId } from '../types/game';

interface VenueProjectorProps {
  currentRoundNumber: number;
  activePersona: HouseholdPersona;
  audienceStats: AudienceStats;
  onSelectRegion?: (regionId: RegionId) => void;
  className?: string;
}

export const VenueProjector: React.FC<VenueProjectorProps> = ({
  currentRoundNumber,
  activePersona,
  audienceStats,
  onSelectRegion,
  className = '',
}) => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'projector' | 'teleprompter'>('projector');

  const presenterCue = PRESENTER_CUES[currentRoundNumber] || PRESENTER_CUES[0];

  // Radial gauge stroke calculation for SVG circular progress
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const borrowOffset = circumference - (audienceStats.borrowRate / 100) * circumference;
  const cutOffset = circumference - (audienceStats.cutRate / 100) * circumference;

  return (
    <div className={`relative flex flex-col bg-slate-900 rounded-3xl p-2 sm:p-4 shadow-2xl border border-slate-700/80 ${className}`}>
      {/* Top Projector Casing Bar (Mocking Auditorium Pull-Down Screen) */}
      <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          {/* Metal screen housing indicator */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">
              Stage Projector Stream (Auditorium 16:9)
            </span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 text-[11px] font-mono">
            LIVE BROADCAST: 21 SEPT 2026 · ISLAMABAD
          </span>
        </div>

        {/* Presenter Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('projector')}
            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-colors ${
              activeTab === 'projector' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Audience Dashboard
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('teleprompter')}
            className={`px-3 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'teleprompter' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mic className="w-3 h-3" />
            Presenter Prompter
          </button>
        </div>
      </div>

      {/* Main Projector Screen White Canvas (styled like reference screen) */}
      <div className="relative flex-1 bg-[#F4FDF8] rounded-2xl p-5 sm:p-6 shadow-inner border border-emerald-900/10 text-slate-800 flex flex-col justify-between overflow-hidden">
        {/* Subtle Projected Screen Grid Texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00c2740a_1px,transparent_1px),linear-gradient(to_bottom,#00c2740a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {activeTab === 'teleprompter' ? (
          /* PRESENTER TELEPROMPTER VIEW */
          <div className="relative z-10 flex-1 flex flex-col justify-between py-2">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-amber-500 animate-ping" />
                <span className="text-xs font-black uppercase tracking-wider text-amber-700">
                  Facilitator Live Cue Card · Round {currentRoundNumber}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3">
                {presenterCue.title}
              </h2>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-amber-200/80 mb-4">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
                  What to say to the room:
                </span>
                <p className="text-sm sm:text-base leading-relaxed text-slate-800 font-medium italic">
                  &ldquo;{presenterCue.cue}&rdquo;
                </p>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide block mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Key Empirical Finding (1,000 Household Study):
                </span>
                <p className="text-sm text-emerald-900 font-semibold leading-relaxed">
                  {presenterCue.dataInsight}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>Audience Active In Room: {audienceStats.totalParticipants} attendees</span>
              <span>Regional Persona Active: {activePersona.regionName}</span>
            </div>
          </div>
        ) : (
          /* AUDIENCE DASHBOARD SCREEN (Matches Right Screen in Reference Image) */
          <div className="relative z-10 flex-1 flex flex-col justify-between">
            {/* Top Bar on Projector */}
            <div className="flex items-start justify-between pb-3 border-b border-emerald-900/10">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Real-time Audience Statistics
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Empirical Baseline: 1,000 Household Survey vs. Live Room Decisions
                </p>
              </div>

              {/* Event Badge */}
              <div className="text-right">
                <span className="text-xs font-bold text-slate-800 font-mono block">
                  21 Sept 2026
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
                  ISLAMABAD
                </span>
              </div>
            </div>

            {/* Central Content Split: Regional Comparison Bars & Pakistan Map (Left) + QR & Room Gauges (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 my-3 items-center">
              {/* Left Column: Regional Comparison Bars + Interactive Pakistan Map (7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-3">
                {/* Regional Borrow Share Bar Chart (from Reference Image) */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                      Proportion Who Had to Borrow (Empirical Study Baseline)
                    </span>
                    <span className="text-[11px] text-slate-400">Borrow Share %</span>
                  </div>

                  {/* Horizontal Bar Chart Columns */}
                  <div className="grid grid-cols-5 gap-2 text-center">
                    {REGIONAL_STATISTICS.map((reg) => {
                      const isCurrentPersona = activePersona.regionName.toLowerCase().includes(reg.region.toLowerCase().slice(0, 4));
                      return (
                        <div
                          key={reg.region}
                          className={`flex flex-col items-center p-2 rounded-xl transition-all cursor-pointer ${
                            isCurrentPersona
                              ? 'bg-emerald-100/90 ring-2 ring-emerald-500 shadow-xs'
                              : 'bg-white/70 hover:bg-white'
                          }`}
                          onMouseEnter={() => setHoveredRegion(reg.region)}
                          onMouseLeave={() => setHoveredRegion(null)}
                          onClick={() => {
                            if (onSelectRegion) {
                              const matchId = reg.region.toLowerCase().startsWith('baloch')
                                ? 'balochistan'
                                : reg.region.toLowerCase().startsWith('punjab')
                                ? 'punjab'
                                : reg.region.toLowerCase().startsWith('khyber') || reg.region.includes('KP')
                                ? 'kp'
                                : reg.region.toLowerCase().startsWith('sindh')
                                ? 'sindh'
                                : 'ict';
                              onSelectRegion(matchId as RegionId);
                            }
                          }}
                        >
                          <span className="text-xs font-black font-mono text-slate-900 mb-1">
                            {reg.borrowRate}%
                          </span>
                          {/* Vertical Progress Bar */}
                          <div className="w-6 h-20 bg-slate-100 rounded-lg p-0.5 flex flex-col justify-end overflow-hidden shadow-inner">
                            <div
                              className="w-full rounded-md transition-all duration-700"
                              style={{
                                height: `${(reg.borrowRate / 64) * 100}%`,
                                backgroundColor: reg.color,
                              }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-slate-700 mt-1.5 truncate max-w-full">
                            {reg.region.split(' ')[0]}
                          </span>
                          <span className="text-[9px] text-slate-400">
                            {reg.stipendOdds}% aid
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Pakistan Geographic Map Vector (Matching Reference Image) */}
                <div className="relative bg-white/80 rounded-2xl p-3 border border-emerald-100 flex items-center justify-between">
                  <div className="w-1/2 pr-3">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide block mb-1">
                      Geographic Disparity
                    </span>
                    <p className="text-[11.5px] text-slate-600 leading-snug">
                      Balochistan girls walk an average of <span className="font-bold text-slate-900">5.0 km</span> with 64% borrowing. Punjab benefits from high school density and 24.5% conditional stipend reach.
                    </p>
                    {hoveredRegion && (
                      <div className="mt-2 text-[10.5px] p-1.5 rounded bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200">
                        {hoveredRegion}: {REGIONAL_STATISTICS.find((r) => r.region === hoveredRegion)?.description}
                      </div>
                    )}
                  </div>

                  {/* Stylized Pakistan Vector Map */}
                  <div className="w-1/2 h-36 relative flex items-center justify-center">
                    <svg viewBox="0 0 280 220" className="w-full h-full drop-shadow-md">
                      {/* Balochistan (South-West) */}
                      <path
                        d="M 30 110 L 80 100 L 110 135 L 125 170 L 90 200 L 40 190 L 20 160 Z"
                        fill="#065F46"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                        className="transition-colors hover:fill-[#047857] cursor-pointer"
                      >
                        <title>Balochistan: 64% Borrow Share</title>
                      </path>
                      <text x="55" y="150" fill="#FFFFFF" fontSize="10" fontWeight="bold" pointerEvents="none">
                        Balochistan
                      </text>
                      <text x="60" y="162" fill="#A7F3D0" fontSize="8" fontWeight="bold" pointerEvents="none">
                        64%
                      </text>

                      {/* Khyber Pakhtunkhwa (North-West) */}
                      <path
                        d="M 90 40 L 140 30 L 145 65 L 120 95 L 85 95 L 80 60 Z"
                        fill="#059669"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                        className="transition-colors hover:fill-[#10B981] cursor-pointer"
                      >
                        <title>KP: 30.5% Borrow Share</title>
                      </path>
                      <text x="105" y="65" fill="#FFFFFF" fontSize="9" fontWeight="bold" pointerEvents="none">
                        KP
                      </text>

                      {/* Punjab (East / Central) */}
                      <path
                        d="M 125 70 L 165 75 L 185 110 L 160 160 L 125 140 L 115 100 Z"
                        fill="#10B981"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                        className="transition-colors hover:fill-[#34D399] cursor-pointer"
                      >
                        <title>Punjab: 8.5% Borrow Share</title>
                      </path>
                      <text x="135" y="115" fill="#FFFFFF" fontSize="10" fontWeight="bold" pointerEvents="none">
                        Punjab
                      </text>
                      <text x="140" y="127" fill="#ECFDF5" fontSize="8" fontWeight="bold" pointerEvents="none">
                        8.5%
                      </text>

                      {/* Sindh (South-East) */}
                      <path
                        d="M 115 165 L 155 160 L 160 210 L 110 215 L 95 190 Z"
                        fill="#0D9488"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                        className="transition-colors hover:fill-[#14B8A6] cursor-pointer"
                      >
                        <title>Sindh: 16.5% Borrow Share</title>
                      </path>
                      <text x="120" y="190" fill="#FFFFFF" fontSize="9" fontWeight="bold" pointerEvents="none">
                        Sindh
                      </text>

                      {/* Islamabad / ICT dot */}
                      <circle cx="150" cy="72" r="3.5" fill="#FBBF24" stroke="#FFFFFF" strokeWidth="1" />
                      <text x="156" y="74" fill="#0F172A" fontSize="7" fontWeight="black" pointerEvents="none">
                        ICT
                      </text>

                      {/* Gilgit Baltistan / North */}
                      <path
                        d="M 140 25 L 190 20 L 180 55 L 145 65 Z"
                        fill="#34D399"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Right Column: Audience QR Join Tile + Live Room Radial Gauges (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-3">
                {/* Audience QR Join Tile (as shown on top right of reference) */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-100 flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 block mb-0.5">
                      Audience Interactive Link
                    </span>
                    <h3 className="text-sm font-black text-slate-900">
                      Scan to Join
                    </h3>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                      game.study.org.pk/live
                    </p>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-700">
                      <Users className="w-3 h-3" />
                      <span>{audienceStats.totalParticipants} players connected</span>
                    </div>
                  </div>

                  {/* High Contrast Visual QR Code */}
                  <div className="w-20 h-20 bg-slate-900 rounded-xl p-1.5 shadow-md flex items-center justify-center shrink-0">
                    <div className="w-full h-full bg-white rounded-lg p-1 flex items-center justify-center">
                      <QrCode className="w-full h-full text-slate-900" />
                    </div>
                  </div>
                </div>

                {/* Current Round Aggregate Stats (Radial Gauges from Reference Image) */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-100">
                  <div className="text-center mb-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                      Current Round Aggregate Stats
                    </span>
                  </div>

                  {/* Two Radial Gauges */}
                  <div className="grid grid-cols-2 gap-4 text-center">
                    {/* Gauge 1: AUDIENCE WHO BORROWED */}
                    <div className="flex flex-col items-center">
                      <div className="relative w-24 h-24 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90">
                          {/* Background Circle */}
                          <circle
                            cx="48"
                            cy="48"
                            r={radius}
                            stroke="#E2E8F0"
                            strokeWidth="7"
                            fill="transparent"
                          />
                          {/* Value Circle */}
                          <circle
                            cx="48"
                            cy="48"
                            r={radius}
                            stroke="#00C274"
                            strokeWidth="7"
                            strokeDasharray={circumference}
                            strokeDashoffset={borrowOffset}
                            strokeLinecap="round"
                            fill="transparent"
                            className="transition-all duration-700 ease-out"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-base font-black font-mono text-slate-900">
                            {audienceStats.borrowRate.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 mt-2 text-center leading-tight">
                        Audience Who Borrowed
                      </span>
                    </div>

                    {/* Gauge 2: AUDIENCE WHO CUT */}
                    <div className="flex flex-col items-center">
                      <div className="relative w-24 h-24 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90">
                          {/* Background Circle */}
                          <circle
                            cx="48"
                            cy="48"
                            r={radius}
                            stroke="#E2E8F0"
                            strokeWidth="7"
                            fill="transparent"
                          />
                          {/* Value Circle */}
                          <circle
                            cx="48"
                            cy="48"
                            r={radius}
                            stroke="#F59E0B"
                            strokeWidth="7"
                            strokeDasharray={circumference}
                            strokeDashoffset={cutOffset}
                            strokeLinecap="round"
                            fill="transparent"
                            className="transition-all duration-700 ease-out"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-base font-black font-mono text-slate-900">
                            {audienceStats.cutRate.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 mt-2 text-center leading-tight">
                        Audience Who Cut
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Real-time Audience Subtitle Banner matching exact reference */}
            <div className="bg-emerald-900 text-white rounded-xl py-2.5 px-4 text-center shadow-md">
              <p className="text-xs sm:text-sm font-semibold tracking-wide">
                <span className="font-black text-amber-300 font-mono">
                  {audienceStats.borrowRate.toFixed(1)}%
                </span>{' '}
                of you already had to borrow.{' '}
                <span className="font-black text-rose-300 font-mono">
                  {audienceStats.cutRate.toFixed(1)}%
                </span>{' '}
                had to cut something for your daughter.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Screen Hanging Pull Tab */}
      <div className="mx-auto w-12 h-2.5 bg-slate-700 rounded-b-md flex items-center justify-center mt-1">
        <div className="w-4 h-1 bg-slate-500 rounded-full" />
      </div>
    </div>
  );
};
