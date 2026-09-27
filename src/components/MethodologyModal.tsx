import React from 'react';
import { X, BookCheck, ShieldAlert, GraduationCap, Building2 } from 'lucide-react';
import { sound } from '../utils/audio';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 shadow-2xl border border-emerald-100 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <BookCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">
              The Real Cost of Educating a Girl in Pakistan
            </h2>
            <p className="text-xs text-emerald-800 font-semibold">
              Empirical Research Protocol & Household Survey Methodology
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200">
            <h3 className="font-bold text-emerald-900 text-sm mb-1 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-emerald-700" />
              Constitutional Mandate vs. Out-of-Pocket Reality
            </h3>
            <p className="text-xs text-emerald-950">
              Article 25-A of the Constitution of Pakistan states: <em>&ldquo;The State shall provide free and compulsory education to all children of the age of five to sixteen years in such manner as may be determined by law.&rdquo;</em> However, zero-tuition government schools do not mean zero cost.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
              1. Sample Size & Survey Demographics
            </h4>
            <p>
              This live audience tool is calibrated from 1,000 empirical in-depth household surveys conducted across five administrative units:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs">
              <li><strong>Balochistan:</strong> 250 households (Khuzdar, Quetta peri-urban, Pishin)</li>
              <li><strong>Khyber Pakhtunkhwa:</strong> 220 households (Mardan, Swat, Peshawar rural)</li>
              <li><strong>Sindh:</strong> 230 households (Larkana, Dadu, Tharparkar)</li>
              <li><strong>Punjab:</strong> 220 households (Vehari, Faisalabad rural, Muzaffargarh)</li>
              <li><strong>ICT (Islamabad):</strong> 80 households (Bhara Kahu, Tarnol peri-urban)</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
              2. Core Expenditure Drivers Examined
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-0.5">Transportation Cliff</span>
                <span className="text-slate-600">Walking distance beyond 2 km triggers a 40%+ drop in retention unless reliable transport is funded.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-0.5">Delayed Textbooks</span>
                <span className="text-slate-600">83% of families buy commercial copies on the open market due to 3-month distribution delays.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-0.5">Nutrition Deficits</span>
                <span className="text-slate-600">Children going without lunch experience severe cognitive fatigue, increasing chronic absenteeism.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-0.5">Informal Levies</span>
                <span className="text-slate-600">Schools routinely charge for printing examination papers, sports funds, and security guards.</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p>
              <strong>The Sibling Reality:</strong> In low-income households with multiple children, resources are finite. Every rupee borrowed or spent for Fatima directly affects the nutritional and educational chances of her 2 siblings.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Fieldwork: Pakistan Girls&apos; Education Empirical Initiative
          </span>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-xl btn-3d-green text-white font-bold text-xs cursor-pointer"
          >
            RETURN TO SIMULATOR
          </button>
        </div>
      </div>
    </div>
  );
};
