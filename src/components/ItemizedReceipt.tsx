import React from 'react';
import { Paperclip, Footprints, BookOpen, Shirt, Utensils, FileSpreadsheet, AlertTriangle, Coins } from 'lucide-react';
import { RoundInfo } from '../types/game';

interface ItemizedReceiptProps {
  round: RoundInfo;
  className?: string;
}

export const ItemizedReceipt: React.FC<ItemizedReceiptProps> = ({ round, className = '' }) => {
  const getRoundIcon = (iconName: string) => {
    switch (iconName) {
      case 'book':
        return <BookOpen className="w-8 h-8 text-emerald-600" />;
      case 'shirt':
        return <Shirt className="w-8 h-8 text-emerald-600" />;
      case 'walk':
        return <Footprints className="w-8 h-8 text-emerald-600" />;
      case 'food':
        return <Utensils className="w-8 h-8 text-emerald-600" />;
      case 'file-text':
        return <FileSpreadsheet className="w-8 h-8 text-emerald-600" />;
      case 'alert-triangle':
        return <AlertTriangle className="w-8 h-8 text-rose-600" />;
      default:
        return <Coins className="w-8 h-8 text-emerald-600" />;
    }
  };

  return (
    <div className={`relative mx-auto w-full max-w-[270px] select-none ${className}`}>
      {/* 3D Paperclip Element on top left as seen in reference image */}
      <div className="absolute -top-3.5 left-6 z-30 pointer-events-none drop-shadow-md">
        <svg width="24" height="42" viewBox="0 0 24 42" fill="none">
          <path
            d="M 6 12 L 6 32 C 6 36 12 36 12 32 L 12 8 C 12 2 20 2 20 8 L 20 28"
            stroke="#94A3B8"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 6 12 L 6 32 C 6 36 12 36 12 32 L 12 8 C 12 2 20 2 20 8 L 20 28"
            stroke="#F1F5F9"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>

      {/* Main Paper Receipt Card */}
      <div className="relative bg-white rounded-t-2xl shadow-xl border border-slate-200/80 pt-5 pb-4 px-5 text-center overflow-hidden">
        {/* Subtle Paper Texture Watermark Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500" />

        {/* Central Graphic Badge */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-[#E8F8F0] flex items-center justify-center mb-3 shadow-inner">
          {getRoundIcon(round.icon)}
        </div>

        {/* Item Title in all caps */}
        <h3 className="text-xs font-black tracking-wider text-slate-800 uppercase mb-1">
          {round.id === 3
            ? "THIS MONTH'S WALK"
            : round.id === 6
            ? "EMERGENCY CLINIC BILL"
            : `THIS MONTH'S ${round.title}`}
        </h3>

        {/* Optional Distance or Category Subtitle */}
        {round.distanceNote ? (
          <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500 mb-2">
            <span>Distance:</span>
            <span className="font-semibold text-slate-700">{round.distanceNote}</span>
          </div>
        ) : (
          <div className="text-[11px] text-slate-500 mb-2">
            Category: <span className="font-semibold text-slate-700">{round.category}</span>
          </div>
        )}

        {/* Perforated Divider */}
        <div className="my-2 border-b border-dashed border-slate-300 relative">
          <div className="absolute -left-7 -top-2 w-4 h-4 rounded-full bg-[#E8F8F0]" />
          <div className="absolute -right-7 -top-2 w-4 h-4 rounded-full bg-[#E8F8F0]" />
        </div>

        {/* Priced Cost Section */}
        <div className="flex items-baseline justify-between pt-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-tight">
            Priced Cost:
          </span>
          <span className="text-base font-extrabold text-slate-900 font-mono tracking-tight">
            PKR {round.cost.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Jagged / Perforated Receipt Bottom Fringe */}
      <div className="w-full h-3 bg-white receipt-jagged filter drop-shadow-[0_2px_1px_rgba(0,0,0,0.06)]" />
    </div>
  );
};
