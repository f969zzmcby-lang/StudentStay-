import React, { useState } from 'react';
import {
  Rocket,
  CheckCircle2,
  Calendar,
  DollarSign,
  Compass,
  ArrowRight,
  Sparkles,
  Smartphone,
  ShieldAlert,
  Users,
  Building2,
  Check,
} from 'lucide-react';

export const LaunchPlanModal: React.FC = () => {
  // Questionnaire state
  const [firstPriority, setFirstPriority] = useState<string>('Design the homepage and room-listing screens');
  const [budgetTier, setBudgetTier] = useState<string>('R0 — free tools only for now');
  const [experienceLevel, setExperienceLevel] = useState<string>("I've tried building websites or apps before");
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({
    'step-1-1': true, // Identified Vaal market
    'step-2-1': true, // Designed database (Properties & Rooms separated)
    'step-2-2': true, // Created working prototype with search & filters
    'step-2-3': true, // Added WhatsApp landlord connectivity
  });

  const toggleStep = (id: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const totalTasksCount = 12;
  const progressPercent = Math.round((completedCount / totalTasksCount) * 100);

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">
              <span>Execution Blueprint</span>
              <span aria-hidden="true">·</span>
              <span>Vaal Triangle Pilot</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              StudentStay: Practical 30-Day Launch Plan 🏠🎓
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Start with one working product, prove students and landlords want it around VUT and NWU Vaal, and keep initial costs low before scaling.
            </p>
          </div>

          <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 text-xs text-amber-950 flex items-center gap-3">
            <Rocket className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <div className="font-bold">Pilot Progress</div>
              <div className="text-[11px] text-amber-800">
                {completedCount} of {totalTasksCount} milestones completed ({progressPercent}%)
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-amber-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Interactive Questionnaire: Your StudentStay Build Setup */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-600" />
            Your StudentStay Build Setup
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Select your preferences to customize your immediate next steps for the Vaal launch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* Question 1 */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 block">
              1. What should we do first?
            </label>
            <div className="space-y-1.5">
              {[
                'Design the homepage and room-listing screens',
                'Build the first website prototype in Bubble',
                'Set up the database and search filters',
                'Find and validate the first students and landlords',
              ].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setFirstPriority(opt)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all cursor-pointer ${
                    firstPriority === opt
                      ? 'bg-amber-50 border-amber-400 font-semibold text-slate-900 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Question 2 */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 block">
              2. What is your current budget for building?
            </label>
            <div className="space-y-1.5">
              {[
                'R0 — free tools only for now',
                'Up to R500',
                'More than R500',
              ].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setBudgetTier(opt)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all cursor-pointer ${
                    budgetTier === opt
                      ? 'bg-amber-50 border-amber-400 font-semibold text-slate-900 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Question 3 */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 block">
              3. How experienced are you with no-code tools?
            </label>
            <div className="space-y-1.5">
              {[
                'Beginner — guide me through every step',
                "I've tried building websites or apps before",
                "I'm comfortable with databases and workflows",
              ].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setExperienceLevel(opt)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all cursor-pointer ${
                    experienceLevel === opt
                      ? 'bg-amber-50 border-amber-400 font-semibold text-slate-900 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Advice Recommendation */}
        <div className="bg-slate-900 text-white rounded-xl p-4 sm:p-5 text-xs space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Tailored Strategy for Your Vaal Pilot</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            {budgetTier.includes('R0')
              ? 'Recommendation: Stay on 100% free prototype mode. You do not need to pay $59/mo for Bubble right now. Use this live working web app to showcase 5 real landlords in CW1 and Bedworth Park to students at VUT Gate 2. Collect 10 WhatsApp viewings first.'
              : 'Recommendation: With a modest budget, secure a .co.za domain name (~R89/year) to gain massive credibility with students and landlords, and allocate the remainder to printing physical QR-code flyers for student notice boards at VUT and NWU Vaal.'}
          </p>
          <div className="pt-1 text-slate-400 flex items-center gap-1.5 font-medium">
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            <span>Primary Focus: {firstPriority} · Experience Level: {experienceLevel}</span>
          </div>
        </div>
      </div>

      {/* The 4 Phases: 30-Day Execution Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Phase 1 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[11px] font-bold text-amber-700 uppercase">Phase 1 · Days 1–7</span>
              <h4 className="text-base font-bold text-slate-900">Validate the Idea</h4>
            </div>
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">
              Week 1
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Establish whether students and landlords in Vanderbijlpark want the platform.
          </p>
          <ul className="space-y-2 text-xs text-slate-700">
            {[
              { id: 'step-1-1', label: 'Speak to 10–15 students at VUT and NWU about accommodation struggles' },
              { id: 'step-1-2', label: 'Interview 5–10 local landlords in CW1, CW2, and Bedworth Park' },
              { id: 'step-1-3', label: 'Map out the first campuses to cover around the Vaal' },
            ].map((task) => (
              <li
                key={task.id}
                onClick={() => toggleStep(task.id)}
                className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer select-none"
              >
                <div
                  className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border transition-all ${
                    completedSteps[task.id]
                      ? 'bg-amber-500 border-amber-600 text-slate-950'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {completedSteps[task.id] && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className={completedSteps[task.id] ? 'line-through text-slate-400' : 'text-slate-800'}>
                  {task.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Phase 2 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[11px] font-bold text-amber-700 uppercase">Phase 2 · Days 8–14</span>
              <h4 className="text-base font-bold text-slate-900">Build the Prototype</h4>
            </div>
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">
              Week 2
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Have a working demonstration that works cleanly on phones and computers.
          </p>
          <ul className="space-y-2 text-xs text-slate-700">
            {[
              { id: 'step-2-1', label: 'Separate Properties from Rooms in database architecture' },
              { id: 'step-2-2', label: 'Build homepage, search, and room detail screens with ZAR pricing' },
              { id: 'step-2-3', label: 'Add price, room type, and Wi-Fi / solar backup filters' },
            ].map((task) => (
              <li
                key={task.id}
                onClick={() => toggleStep(task.id)}
                className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer select-none"
              >
                <div
                  className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border transition-all ${
                    completedSteps[task.id]
                      ? 'bg-amber-500 border-amber-600 text-slate-950'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {completedSteps[task.id] && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className={completedSteps[task.id] ? 'line-through text-slate-400' : 'text-slate-800'}>
                  {task.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Phase 3 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[11px] font-bold text-amber-700 uppercase">Phase 3 · Days 15–21</span>
              <h4 className="text-base font-bold text-slate-900">Add Real Functionality</h4>
            </div>
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">
              Week 3
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Create a functional private beta with genuine, permission-based listings.
          </p>
          <ul className="space-y-2 text-xs text-slate-700">
            {[
              { id: 'step-3-1', label: 'Implement landlord listing submission & room inventory management' },
              { id: 'step-3-2', label: 'Connect 1-click room availability confirmation & freshness tags' },
              { id: 'step-3-3', label: 'Connect enquiry tracking and direct WhatsApp contact options' },
            ].map((task) => (
              <li
                key={task.id}
                onClick={() => toggleStep(task.id)}
                className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer select-none"
              >
                <div
                  className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border transition-all ${
                    completedSteps[task.id]
                      ? 'bg-amber-500 border-amber-600 text-slate-950'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {completedSteps[task.id] && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className={completedSteps[task.id] ? 'line-through text-slate-400' : 'text-slate-800'}>
                  {task.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Phase 4 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[11px] font-bold text-amber-700 uppercase">Phase 4 · Days 22–30</span>
              <h4 className="text-base font-bold text-slate-900">Pilot Launch in the Vaal</h4>
            </div>
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">
              Week 4
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Invite students to test, measure searches, and verify landlord viewings.
          </p>
          <ul className="space-y-2 text-xs text-slate-700">
            {[
              { id: 'step-4-1', label: 'Invite small test group of 30 VUT/NWU students looking for rooms' },
              { id: 'step-4-2', label: 'Verify first 5 landlords with South African ID & municipal bill' },
              { id: 'step-4-3', label: 'Facilitate first 10 successful in-person room viewings' },
            ].map((task) => (
              <li
                key={task.id}
                onClick={() => toggleStep(task.id)}
                className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer select-none"
              >
                <div
                  className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border transition-all ${
                    completedSteps[task.id]
                      ? 'bg-amber-500 border-amber-600 text-slate-950'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {completedSteps[task.id] && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className={completedSteps[task.id] ? 'line-through text-slate-400' : 'text-slate-800'}>
                  {task.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Budget Breakdown Table (Section 5) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            Vaal Pilot Launch Budget Breakdown (ZAR)
          </h3>
          <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
            Lean Bootstrap Method
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="px-4 py-2.5">Item</th>
                <th className="px-4 py-2.5">Initial Approach</th>
                <th className="px-4 py-2.5 font-mono">Estimated Cost (ZAR)</th>
                <th className="px-4 py-2.5">Timing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-4 py-3 font-bold text-slate-900">Prototype & Web App</td>
                <td className="px-4 py-3 text-slate-600">Free prototype tier / hosted web app</td>
                <td className="px-4 py-3 font-mono font-bold text-emerald-700">R 0.00</td>
                <td className="px-4 py-3 text-slate-500">Day 1</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-slate-900">Domain Name (.co.za)</td>
                <td className="px-4 py-3 text-slate-600">Local registrar (e.g. Domains.co.za)</td>
                <td className="px-4 py-3 font-mono font-bold text-slate-800">~R 89.00 / year</td>
                <td className="px-4 py-3 text-slate-500">When ready to launch</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-slate-900">Room Photography</td>
                <td className="px-4 py-3 text-slate-600">Obtain permission to use landlords' photos or take phone photos during inspection</td>
                <td className="px-4 py-3 font-mono font-bold text-emerald-700">R 0.00</td>
                <td className="px-4 py-3 text-slate-500">Days 8–15</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-slate-900">Campus Marketing</td>
                <td className="px-4 py-3 text-slate-600">WhatsApp campus groups, student SRC reps, 50 printed flyers at VUT & NWU gates</td>
                <td className="px-4 py-3 font-mono font-bold text-slate-800">~R 150.00</td>
                <td className="px-4 py-3 text-slate-500">Days 22–30</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-slate-900">Native App Stores</td>
                <td className="px-4 py-3 text-slate-600">Defer until validated demand; use mobile-friendly PWA first</td>
                <td className="px-4 py-3 font-mono font-bold text-emerald-700">R 0.00</td>
                <td className="px-4 py-3 text-slate-500">After validation</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
