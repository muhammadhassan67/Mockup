import React, { useState } from 'react';
import { Volume2, Languages, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface FatimaCharacterProps {
  emotion: 'cheerful' | 'worried' | 'distressed';
  urduText?: string;
  englishText?: string;
  showDialogue?: boolean;
  scale?: number;
  className?: string;
  interactiveBubble?: boolean;
}

export const FatimaCharacter: React.FC<FatimaCharacterProps> = ({
  emotion = 'cheerful',
  urduText,
  englishText,
  showDialogue = true,
  className = '',
  interactiveBubble = true,
}) => {
  const [showEnglishTranslation, setShowEnglishTranslation] = useState(false);
  const [isSpeakingAnimation, setIsSpeakingAnimation] = useState(false);

  const triggerDialogueVoice = () => {
    sound.playClick();
    setIsSpeakingAnimation(true);
    setTimeout(() => setIsSpeakingAnimation(false), 800);
  };

  const isDistressed = emotion === 'worried' || emotion === 'distressed';

  return (
    <div className={`relative flex flex-col items-center justify-end select-none ${className}`}>
      {/* Speech / Dialogue Bubble */}
      {showDialogue && (urduText || englishText) && (
        <div
          onClick={interactiveBubble ? triggerDialogueVoice : undefined}
          className={`relative z-20 mb-3 max-w-[280px] sm:max-w-xs transition-all duration-300 transform ${
            interactiveBubble ? 'cursor-pointer hover:scale-[1.02]' : ''
          }`}
        >
          <div
            className={`rounded-2xl px-4 py-3 shadow-lg border text-left transition-colors duration-200 ${
              isDistressed
                ? 'bg-amber-50/95 border-amber-200 text-slate-800 shadow-amber-900/10'
                : 'bg-white/95 border-emerald-100 text-slate-800 shadow-emerald-900/10'
            } backdrop-blur-sm`}
          >
            {/* Top Bubble Action Bar */}
            <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-black/5 text-[11px] text-slate-400">
              <span className="font-semibold tracking-wide flex items-center gap-1 text-emerald-800">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Fatima (10 yrs)
              </span>
              {englishText && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playClick();
                    setShowEnglishTranslation(!showEnglishTranslation);
                  }}
                  className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-medium flex items-center gap-1 transition-colors"
                  title="Toggle translation"
                >
                  <Languages className="w-3 h-3" />
                  {showEnglishTranslation ? 'اردو' : 'English'}
                </button>
              )}
            </div>

            {/* Dialogue Body */}
            {showEnglishTranslation && englishText ? (
              <p className="text-xs text-slate-700 leading-relaxed font-medium italic">
                &ldquo;{englishText}&rdquo;
              </p>
            ) : (
              urduText && (
                <p
                  className="font-urdu text-sm sm:text-base text-slate-900 text-right leading-loose py-0.5"
                  dir="rtl"
                >
                  {urduText}
                </p>
              )
            )}

            {/* Bubble Tail */}
            <div
              className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 border-r border-b ${
                isDistressed ? 'bg-amber-50 border-amber-200' : 'bg-white border-emerald-100'
              }`}
            />
          </div>
        </div>
      )}

      {/* 3D Pixar Styled Vector SVG Character */}
      <div
        className={`relative w-48 h-64 sm:w-56 sm:h-72 flex items-center justify-center transition-transform duration-500 ${
          isDistressed ? 'animate-tremble' : 'animate-float'
        } ${isSpeakingAnimation ? 'scale-105' : ''}`}
      >
        <svg
          viewBox="0 0 240 320"
          className="w-full h-full drop-shadow-xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Skin Tone Gradients */}
            <radialGradient id="skinGlow" cx="45%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#FFE0C2" />
              <stop offset="70%" stopColor="#F9BE9B" />
              <stop offset="100%" stopColor="#E29A74" />
            </radialGradient>
            <radialGradient id="blushGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F472B6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#F472B6" stopOpacity="0" />
            </radialGradient>

            {/* Eye Pupil Gradients */}
            <radialGradient id="irisGrad" cx="40%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#5C3317" />
              <stop offset="60%" stopColor="#2E1708" />
              <stop offset="100%" stopColor="#150B04" />
            </radialGradient>

            {/* Sky Blue Uniform Gradient */}
            <linearGradient id="kameezGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#0EA5E9" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>

            {/* Hijab / Dupatta Fabric Gradient */}
            <linearGradient id="dupattaGrad" x1="0" y1="0" x2="0.3" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="65%" stopColor="#F1F5F9" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>

            {/* School Satchel Green Leather Gradient */}
            <linearGradient id="satchelGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#15803D" />
              <stop offset="50%" stopColor="#166534" />
              <stop offset="100%" stopColor="#14532D" />
            </linearGradient>

            {/* Soft Ambient Ground Shadow */}
            <radialGradient id="groundShadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0F172A" stopOpacity="0.25" />
              <stop offset="80%" stopColor="#0F172A" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
            </radialGradient>

            {/* Teardrop Gradient */}
            <linearGradient id="tearGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Ground Shadow */}
          <ellipse cx="120" cy="308" rx="60" ry="10" fill="url(#groundShadow)" />

          {/* Back Dupatta / Hair Silhouette */}
          <path
            d="M 68 120 C 60 70 85 35 120 35 C 155 35 180 70 172 120 C 180 180 182 220 170 240 C 150 250 90 250 70 240 C 58 220 60 180 68 120 Z"
            fill="url(#dupattaGrad)"
          />

          {/* Shalwar (White Trousers) */}
          <g>
            <path
              d="M 98 228 L 88 285 C 88 288 95 292 105 290 L 114 240 Z"
              fill="#FFFFFF"
              stroke="#E2E8F0"
              strokeWidth="1.5"
            />
            <path
              d="M 126 240 L 135 290 C 145 292 152 288 152 285 L 142 228 Z"
              fill="#FFFFFF"
              stroke="#E2E8F0"
              strokeWidth="1.5"
            />
            {/* White Shalwar Folds */}
            <path d="M 96 260 Q 102 270 100 282" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M 144 260 Q 138 270 140 282" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />

            {/* School Bata Canvas Shoes */}
            <path
              d="M 85 285 C 85 282 103 280 108 285 C 110 292 102 298 90 298 C 82 298 80 292 85 285 Z"
              fill="#1E293B"
            />
            <path
              d="M 132 285 C 137 280 155 282 155 285 C 160 292 158 298 150 298 C 138 298 130 292 132 285 Z"
              fill="#1E293B"
            />
            {/* White Shoe Soles */}
            <path d="M 83 295 Q 96 299 108 295" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
            <path d="M 132 295 Q 144 299 157 295" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* Kameez (Sky-Blue School Uniform Tunic) */}
          <g>
            <path
              d="M 82 150 C 78 190 74 235 78 245 C 90 248 150 248 162 245 C 166 235 162 190 158 150 Z"
              fill="url(#kameezGrad)"
              stroke="#0284C7"
              strokeWidth="1"
            />
            {/* Kameez Draping Hem Slits */}
            <path d="M 78 232 L 80 245" stroke="#0369A1" strokeWidth="2" />
            <path d="M 162 232 L 160 245" stroke="#0369A1" strokeWidth="2" />

            {/* Subtle Fabric Fold Lines */}
            <path d="M 98 160 Q 100 200 95 240" stroke="#38BDF8" strokeWidth="1.2" opacity="0.6" />
            <path d="M 142 160 Q 140 200 145 240" stroke="#0369A1" strokeWidth="1.2" opacity="0.6" />
          </g>

          {/* Shoulders & Arms */}
          <g>
            {/* Left Arm / Sleeve */}
            <path
              d="M 82 150 C 70 160 62 190 68 215 C 72 220 78 220 80 215 C 84 195 90 170 94 156 Z"
              fill="url(#kameezGrad)"
            />
            {/* Left Hand */}
            <ellipse cx="72" cy="220" rx="6" ry="7" fill="url(#skinGlow)" />

            {/* Right Arm holding satchel */}
            <path
              d="M 158 150 C 168 162 172 195 165 218 C 160 222 154 220 152 215 C 148 198 144 172 142 156 Z"
              fill="url(#kameezGrad)"
            />
            {/* Right Hand */}
            <ellipse cx="160" cy="220" rx="6" ry="7" fill="url(#skinGlow)" />
          </g>

          {/* Green School Satchel Bag with Brass Buckle */}
          <g transform={isDistressed ? 'translate(0, -6)' : 'translate(0, 0)'}>
            {/* Cross-body Satchel Leather Strap */}
            <path
              d="M 92 145 Q 115 178 148 215"
              stroke="#14532D"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M 92 145 Q 115 178 148 215"
              stroke="#22C55E"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.6"
            />

            {/* Satchel Bag Body */}
            <rect
              x="52"
              y="180"
              width="36"
              height="44"
              rx="6"
              fill="url(#satchelGrad)"
              stroke="#052E16"
              strokeWidth="1.5"
              transform="rotate(6, 70, 202)"
            />
            {/* Satchel Flap */}
            <path
              d="M 52 182 L 88 186 C 88 186 86 208 84 212 C 78 214 62 212 56 208 C 54 204 52 182 52 182 Z"
              fill="#166534"
              stroke="#052E16"
              strokeWidth="1"
            />
            {/* Satchel Brass Lock */}
            <rect
              x="67"
              y="204"
              width="7"
              height="6"
              rx="1.5"
              fill="#FBBF24"
              stroke="#B45309"
              strokeWidth="1"
            />
          </g>

          {/* White Dupatta / Hijab Chest Drape */}
          <path
            d="M 86 138 C 76 160 90 205 120 205 C 150 205 164 160 154 138 C 145 146 135 152 120 152 C 105 152 95 146 86 138 Z"
            fill="url(#dupattaGrad)"
            stroke="#E2E8F0"
            strokeWidth="1"
          />
          {/* Dupatta Fold Fringes */}
          <path d="M 105 152 Q 110 185 116 205" stroke="#CBD5E1" strokeWidth="1" strokeLinecap="round" />
          <path d="M 135 152 Q 130 185 124 205" stroke="#CBD5E1" strokeWidth="1" strokeLinecap="round" />

          {/* Head & Neck */}
          <g>
            {/* Neck */}
            <path d="M 112 124 L 112 142 L 128 142 L 128 124 Z" fill="#F9BE9B" />

            {/* Draped Dupatta Head Veil Framing Face */}
            <path
              d="M 74 100 C 70 54 90 32 120 32 C 150 32 170 54 166 100 C 166 132 152 146 120 146 C 88 146 74 132 74 100 Z"
              fill="url(#dupattaGrad)"
              stroke="#E2E8F0"
              strokeWidth="1"
            />

            {/* Black Hair Fringe Peeking under Dupatta */}
            <path
              d="M 85 78 C 95 62 110 60 120 62 C 130 60 145 62 155 78 C 150 72 135 68 120 69 C 105 68 90 72 85 78 Z"
              fill="#1A0D08"
            />

            {/* Face Shape (Round, Soft, Cute 10-year-old Girl) */}
            <path
              d="M 86 92 C 86 68 100 64 120 64 C 140 64 154 68 154 92 C 154 118 140 134 120 134 C 100 134 86 118 86 92 Z"
              fill="url(#skinGlow)"
            />

            {/* Rosy Blush on Cheeks */}
            <circle cx="98" cy="108" r="8" fill="url(#blushGlow)" />
            <circle cx="142" cy="108" r="8" fill="url(#blushGlow)" />

            {/* Cute Little Button Nose */}
            <path
              d="M 118 101 C 118 103 122 103 122 101"
              stroke="#C27A56"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            {/* Eyebrows */}
            {isDistressed ? (
              // Arched worried / sad eyebrows
              <g>
                <path
                  d="M 94 82 Q 102 77 108 84"
                  stroke="#3A1C0E"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                <path
                  d="M 146 82 Q 138 77 132 84"
                  stroke="#3A1C0E"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
              </g>
            ) : (
              // Friendly curved eyebrows
              <g>
                <path
                  d="M 94 82 Q 102 78 110 82"
                  stroke="#3A1C0E"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <path
                  d="M 146 82 Q 138 78 130 82"
                  stroke="#3A1C0E"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </g>
            )}

            {/* Eyes */}
            <g>
              {/* Left Eye */}
              <ellipse cx="102" cy="94" rx="7.5" ry="9" fill="#FFFFFF" />
              <ellipse cx="102" cy="94" rx="5.5" ry="7" fill="url(#irisGrad)" />
              {/* Eye Catchlight Reflections */}
              <circle cx="100" cy="91" r="2.4" fill="#FFFFFF" />
              <circle cx="104" cy="97" r="1.2" fill="#FFFFFF" />
              <path d="M 94 88 Q 102 85 110 89" stroke="#1F1209" strokeWidth="1.5" strokeLinecap="round" />

              {/* Right Eye */}
              <ellipse cx="138" cy="94" rx="7.5" ry="9" fill="#FFFFFF" />
              <ellipse cx="138" cy="94" rx="5.5" ry="7" fill="url(#irisGrad)" />
              {/* Eye Catchlight Reflections */}
              <circle cx="136" cy="91" r="2.4" fill="#FFFFFF" />
              <circle cx="140" cy="97" r="1.2" fill="#FFFFFF" />
              <path d="M 130 89 Q 138 85 146 88" stroke="#1F1209" strokeWidth="1.5" strokeLinecap="round" />

              {/* Tear Drop when distressed */}
              {isDistressed && (
                <g>
                  <path
                    d="M 142 100 Q 146 112 144 116 C 142 119 138 119 138 116 Q 138 112 142 100 Z"
                    fill="url(#tearGrad)"
                  />
                  <circle cx="141" cy="116" r="1" fill="#FFFFFF" />
                </g>
              )}
            </g>

            {/* Mouth */}
            {isDistressed ? (
              // Worried tremulous slight downward mouth
              <path
                d="M 112 120 Q 120 115 128 120"
                stroke="#A84343"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            ) : (
              // Warm open smile showing teeth
              <g>
                <path
                  d="M 111 114 Q 120 126 129 114 C 126 113 114 113 111 114 Z"
                  fill="#991B1B"
                />
                {/* White teeth */}
                <path
                  d="M 113 114 Q 120 118 127 114 Z"
                  fill="#FFFFFF"
                />
                <path
                  d="M 110 114 Q 120 126 130 114"
                  stroke="#7F1D1D"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  fill="none"
                />
              </g>
            )}
          </g>
        </svg>
      </div>
    </div>
  );
};
