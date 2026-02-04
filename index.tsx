import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import { Phone, ArrowRight, Play, ShieldCheck, Smile, Calendar, MessageSquare, Clock, Database, Globe } from 'lucide-react';

// --- Supabase Client ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Components ---

// --- Supabase Client (Initialized at top) ---
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL; // Already declared above
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY; 
// const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Components ---
// Removed Auth and Dashboard components per user request

// --- Assessment Components ---

interface AssessmentData {
  clinicName: string;
  avgCallsPerDay: number;
  receptionConfig: 'Dedicated' | 'Multitasking';
  leadFollowUpTime: '< 5 min' | '< 1 hour' | 'Same Day' | 'Next Day';
  runsAds: boolean;
  missedCallsStrategy: 'Voicemail' | 'Answering Service' | 'Nothing';
  avgCaseValue: number;
}

interface AssessmentResults {
  riskScore: number;
  missedCallsPerMonth: number;
  potentialRevenueRecovered: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendations: string[];
}

const calculateMissedCallRisk = (data: AssessmentData): AssessmentResults => {
  let riskScore = 0;
  let missedCallsPerMonth = 0;
  const recommendations: string[] = [];

  const dailyCalls = data.avgCallsPerDay;
  const monthlyCalls = dailyCalls * 22; // Assuming ~22 working days

  // 1. Staffing & Config Risk
  // Industry standard: 1 receptionist can handle ~40-50 calls/day effectively while doing other tasks
  // But MULTITASKING is the killer.

  // Base missed call rate
  let missedCallRate = 0.15; // Even with perfect staffing, 15% are missed

  if (data.receptionConfig === 'Multitasking') {
    missedCallRate += 0.15;
    riskScore += 25;
    recommendations.push('Staff balancing patients and phones means calls go unanswered during busy times.');
  }

  // 2. Speed to Lead Risk
  switch (data.leadFollowUpTime) {
    case 'Next Day':
      missedCallRate += 0.15;
      riskScore += 25;
      recommendations.push('Responding next day reduces conversion by 90% vs responding in 5 mins.');
      break;
    case 'Same Day':
    case '< 1 hour':
      missedCallRate += 0.05;
      riskScore += 10;
      break;
    case '< 5 min':
      // Best practice
      break;
  }

  // 3. Strategy Risk
  if (data.missedCallsStrategy === 'Nothing') {
    missedCallRate += 0.15;
    riskScore += 30;
    recommendations.push('Calls going nowhere means 100% loss of that lead.');
  } else if (data.missedCallsStrategy === 'Voicemail') {
    missedCallRate += 0.10; // Most people don't leave voicemails or wait for call backs
    riskScore += 15;
    recommendations.push('70% of callers hang up on voicemail and call a competitor.');
  }

  // Ad Spend Risk Multiplier
  if (data.runsAds) {
    riskScore += 10;
    recommendations.push('Paid traffic with missed calls burns budget twice as fast.');
  }

  // Calculate actual missed calls
  missedCallsPerMonth = Math.round(monthlyCalls * missedCallRate);

  // 3. Value Risk (Ortho Specific)
  // Conversion assumption: 20% of callers booking -> 50% showcase -> 60% close
  // Conservative: 5% of raw inbound calls turn into starts
  const conversionRate = 0.05;
  const lostPatients = Math.round(missedCallsPerMonth * conversionRate);
  const potentialRevenueRecovered = lostPatients * data.avgCaseValue;

  if (potentialRevenueRecovered > 20000) {
    riskScore += 20;
    recommendations.push(`High case value ($${data.avgCaseValue}) means every missed call is expensive.`);
  }

  const riskLevel = riskScore >= 60 ? 'HIGH' : riskScore >= 30 ? 'MEDIUM' : 'LOW';

  if (recommendations.length === 0) {
    recommendations.push('You have decent coverage, but AI ensures 0% slip-through rate 24/7.');
  }

  return {
    riskScore: Math.min(riskScore, 100),
    missedCallsPerMonth,
    potentialRevenueRecovered,
    riskLevel,
    recommendations
  };
};

const AssessmentForm = ({ onComplete }: { onComplete: (data: AssessmentData) => void }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<AssessmentData>({
    clinicName: '',
    avgCallsPerDay: 40,
    receptionConfig: 'Multitasking',
    leadFollowUpTime: '< 1 hour',
    runsAds: false,
    missedCallsStrategy: 'Voicemail',
    avgCaseValue: 4500 // Typical Ortho case value
  });

  const totalSteps = 7;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const updateField = (field: keyof AssessmentData, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-text-muted">Step {step} of {totalSteps}</span>
            <span className="text-sm font-bold text-brand">{Math.round((step / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand to-brand-light transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="glass-panel rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white">What's your practice name?</h2>
              <input
                type="text"
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white text-lg focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/50 transition-all"
                placeholder="e.g., Orthodontic Partners"
                value={formData.clinicName}
                onChange={(e) => updateField('clinicName', e.target.value)}
                autoFocus
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white">How many daily inbound calls?</h2>
              <p className="text-text-muted">An estimate is fine.</p>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="0"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white text-3xl font-bold focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/50 transition-all text-center"
                  value={formData.avgCallsPerDay}
                  onChange={(e) => updateField('avgCallsPerDay', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white">How does your front desk work?</h2>
              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => updateField('receptionConfig', 'Multitasking')}
                  className={`p-6 rounded-2xl border text-left transition-all ${formData.receptionConfig === 'Multitasking' ? 'bg-brand border-brand text-white' : 'bg-white/10 border-white/10 hover:bg-white/20 text-text-muted'}`}
                >
                  <div className="text-xl font-bold mb-1">Multitasking</div>
                  <div className="text-sm opacity-80">Handles check-ins, payments AND phones</div>
                </button>
                <button
                  onClick={() => updateField('receptionConfig', 'Dedicated')}
                  className={`p-6 rounded-2xl border text-left transition-all ${formData.receptionConfig === 'Dedicated' ? 'bg-brand border-brand text-white' : 'bg-white/10 border-white/10 hover:bg-white/20 text-text-muted'}`}
                >
                  <div className="text-xl font-bold mb-1">Dedicated Phone Staff</div>
                  <div className="text-sm opacity-80">Someone answers phones 100% of the time (no in-person tasks)</div>
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white">How fast do you call back missed leads?</h2>
              <div className="space-y-3">
                {['< 5 min', '< 1 hour', 'Same Day', 'Next Day'].map((option) => (
                  <button
                    key={option}
                    onClick={() => updateField('leadFollowUpTime', option)}
                    className={`w-full p-6 rounded-2xl font-bold text-lg text-left transition-all ${formData.leadFollowUpTime === option
                      ? 'bg-brand text-white shadow-[0_0_30px_rgba(255,106,0,0.4)]'
                      : 'bg-white/10 text-text-muted hover:bg-white/20'
                      }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white">Do you run paid ads?</h2>
              <p className="text-text-muted">Google Ads, Facebook/IG, TikTok, etc.</p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => updateField('runsAds', true)}
                  className={`p-8 rounded-2xl font-bold text-xl transition-all ${formData.runsAds
                    ? 'bg-brand text-white shadow-[0_0_30px_rgba(255,106,0,0.4)] scale-105'
                    : 'bg-white/10 text-text-muted hover:bg-white/20'
                    }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => updateField('runsAds', false)}
                  className={`p-8 rounded-2xl font-bold text-xl transition-all ${!formData.runsAds
                    ? 'bg-brand text-white shadow-[0_0_30px_rgba(255,106,0,0.4)] scale-105'
                    : 'bg-white/10 text-text-muted hover:bg-white/20'
                    }`}
                >
                  No
                </button>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white">What happens to missed calls?</h2>
              <div className="space-y-3">
                {['Voicemail', 'Answering Service', 'Nothing'].map((option) => (
                  <button
                    key={option}
                    onClick={() => updateField('missedCallsStrategy', option)}
                    className={`w-full p-6 rounded-2xl font-bold text-lg text-left transition-all ${formData.missedCallsStrategy === option
                      ? 'bg-brand text-white shadow-[0_0_30px_rgba(255,106,0,0.4)]'
                      : 'bg-white/10 text-text-muted hover:bg-white/20'
                      }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white">Average Case Value?</h2>
              <p className="text-text-muted">Revenue per new patient (e.g., Aligner/Braces case).</p>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 text-2xl font-bold">$</span>
                <input
                  type="number"
                  min="0"
                  step="500"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white text-3xl font-bold focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/50 transition-all"
                  value={formData.avgCaseValue}
                  onChange={(e) => updateField('avgCaseValue', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-12">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold rounded-xl transition-all"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={step === 1 && !formData.clinicName}
              className="flex-1 px-8 py-4 bg-brand hover:bg-brand-hover text-white font-bold rounded-xl shadow-[0_0_30px_rgba(255,106,0,0.3)] transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {step === totalSteps ? 'Calculate Revenue Loss' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AssessmentResults = ({ data, results, onBookDemo }: {
  data: AssessmentData;
  results: AssessmentResults;
  onBookDemo: () => void;
}) => {
  // Initialize state with the calculated missed call rate from the logic (approximate reverse engineering)
  // We'll stick to a default range but center it around the calculated risk for the initial view
  const [missedCallRate, setMissedCallRate] = useState(
    Math.round((results.missedCallsPerMonth / (data.avgCallsPerDay * 22)) * 100) || 15
  );

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'HIGH': return 'text-[#FF5F57]';
      case 'MEDIUM': return 'text-[#FEBC2E]';
      case 'LOW': return 'text-[#28C840]';
      default: return 'text-text-muted';
    }
  };

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case 'HIGH': return 'bg-[#FF5F57]/10 border-[#FF5F57]/30';
      case 'MEDIUM': return 'bg-[#FEBC2E]/10 border-[#FEBC2E]/30';
      case 'LOW': return 'bg-[#28C840]/10 border-[#28C840]/30';
      default: return 'bg-white/10 border-white/10';
    }
  };

  // Recalculate based on slider
  const monthlyCalls = data.avgCallsPerDay * 22;
  const slidingMissedCalls = Math.round(monthlyCalls * (missedCallRate / 100));
  const slidingRevenue = Math.round(slidingMissedCalls * 0.05 * data.avgCaseValue); // 5% conversion rate assumption

  return (
    <div className="min-h-screen bg-bg-main py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-white">Ortho Assessment Results</h1>
          <p className="text-xl text-text-muted">{data.clinicName}</p>
        </div>

        {/* REVENUE HERO */}
        <div className={`glass-panel rounded-3xl p-12 border ${getRiskBgColor(results.riskLevel)} text-center relative overflow-hidden`}>
          <div className="absolute inset-0 bg-brand/5 animate-pulse duration-[3000ms]"></div>
          <div className="relative z-10 space-y-2">
            <h3 className="text-lg text-text-muted font-bold uppercase tracking-widest">Potential Monthly Revenue Recovered</h3>
            <div className="text-6xl md:text-8xl font-black text-white drop-shadow-[0_0_20px_rgba(255,106,0,0.5)]">
              ${slidingRevenue.toLocaleString()}
            </div>

            {/* Interactive Slider Section */}
            <div className="max-w-md mx-auto mt-8 pt-8 border-t border-white/10">
              <div className="flex justify-between text-sm font-bold text-text-muted mb-4">
                <span>Conservative (5%)</span>
                <span>Your Estimate: <span className="text-brand text-lg">{missedCallRate}%</span></span>
                <span>Aggressive (50%)</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={missedCallRate}
                onChange={(e) => setMissedCallRate(parseInt(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand [&::-webkit-slider-thumb]:shadow-[0_0_15px_rgba(255,106,0,0.5)]"
              />
              <p className="text-xs text-text-muted mt-4">
                *Calculation: {slidingMissedCalls} missed calls x 5% conversion x ${data.avgCaseValue.toLocaleString()} case value
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-panel rounded-2xl p-8 border border-white/10">
            <div className="text-text-muted text-sm font-black uppercase tracking-widest mb-4">Missed Calls</div>
            <div className="text-5xl font-black text-white">{slidingMissedCalls}</div>
            <div className="text-text-muted mt-2">calls/month slipping through</div>
          </div>
          <div className="glass-panel rounded-2xl p-8 border border-white/10">
            <div className="text-text-muted text-sm font-black uppercase tracking-widest mb-4">Lost New Starts</div>
            {/* Estimate lost starts based on revenue divided by case value */}
            <div className="text-5xl font-black text-brand">{(slidingRevenue / data.avgCaseValue).toFixed(1)}</div>
            <div className="text-text-muted mt-2">cases/month missed</div>
          </div>
        </div>

        {/* Analysis */}
        <div className="glass-panel rounded-2xl p-8 border border-white/10">
          <h3 className="text-2xl font-bold text-white mb-6">Why you're losing patients</h3>
          <div className="space-y-4">
            {results.recommendations.map((rec, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-red-500 font-bold">!</span>
                </div>
                <p className="text-gray-200 font-medium flex-1">{rec}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-6 py-8">
          <h2 className="text-3xl md:text-4xl font-black text-white">Capture that ${slidingRevenue.toLocaleString()}</h2>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">
            Nova AI Voice answers instantly, qualifies the patient, and books the consult.
          </p>
          <button
            onClick={onBookDemo}
            className="px-12 py-5 bg-brand hover:bg-brand-hover text-white text-xl font-black rounded-2xl shadow-[0_0_40px_rgba(255,106,0,0.4)] transition-all transform hover:scale-105"
          >
            Claim Your Free Demo
          </button>
        </div>
      </div>
    </div>
  );
};



const App = () => {
  // Widget Relocation Logic (Enhanced for Premium UI)
  useEffect(() => {
    const i = setInterval(() => {
      const m = document.getElementById('demo-widget-mount');
      if (!m) return;

      // --- PART 1: MOVE WIDGET ---
      let w: Element | null = null;

      // Explicit search
      const selectors = ['nedzo-widget', '.nedzo-widget', '#nedzo-widget', '[class*="nedzo"]', '[id*="nedzo"]'];
      for (const s of selectors) {
        const found = document.querySelector(s);
        if (found && !m.contains(found)) { w = found; break; }
      }

      // Heuristic search
      if (!w) {
        Array.from(document.body.children).forEach(el => {
          if (w) return;
          const tag = el.tagName.toUpperCase();
          if (['SCRIPT', 'STYLE', 'LINK', 'META', 'NOSCRIPT'].includes(tag)) return;
          if (el.id === 'root' || el.id === '__next' || el.id === 'demo-widget-mount') return;

          // Content Safety Check
          const txt = el.textContent || "";
          if (txt.includes('.vapi-btn') || txt.includes('*/') || txt.includes('important;')) return;

          const style = window.getComputedStyle(el);
          if (style.position === 'fixed') {
            const rect = el.getBoundingClientRect();
            // Basic check if it looks like a floating widget
            if (rect.width > 0 && rect.height > 0 && rect.top > window.innerHeight * 0.5 && rect.left > window.innerWidth * 0.5) {
              w = el;
            }
          }
        });
      }

      if (w && m && w.parentNode !== m) {
        m.appendChild(w);
        if (w instanceof HTMLElement) {
          // Apply Premium Styles to Widget Wrapper
          // Force layout reset
          w.style.cssText = `
            position: absolute !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) scale(1.3) !important;
            margin: 0 !important;
            bottom: auto !important;
            right: auto !important;
            width: auto !important;
            height: auto !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            filter: drop-shadow(0 0 30px rgba(255, 106, 0, 0.3));
            z-index: 100 !important;
            pointer-events: auto !important;
          `;

          // AGGRESSIVE: Force all children to reset position
          // This fixes the issue where the inner button is absolutely positioned to the bottom-right
          Array.from(w.children).forEach((child) => {
            if (child instanceof HTMLElement) {
              child.style.position = 'relative';
              child.style.top = 'auto';
              child.style.left = 'auto';
              child.style.bottom = 'auto';
              child.style.right = 'auto';
              child.style.margin = '0';

            }
          });
        }
      }

      // --- PART 2: CLEANUP GARBAGE ---
      Array.from(m.children).forEach(child => {
        if (child === w) return; // Preserve the real widget

        // 1. Kill Style tags
        if (child.tagName === 'STYLE') {
          child.setAttribute('style', 'display: none !important');
          child.innerHTML = '';
        }

        // 2. Kill Text Garbage
        if (child.textContent && (child.textContent.includes('.vapi-btn') || child.textContent.includes('*/'))) {
          if (child instanceof HTMLElement) {
            child.style.display = 'none';
            child.innerHTML = '';
            child.remove();
          }
        }

        // 3. Hide loading placeholder only if we found the widget
        if (w && child.className && typeof child.className === 'string' && child.className.includes('loading-state')) {
          (child as HTMLElement).style.display = 'none';
        }
      });

    }, 800);
    return () => clearInterval(i);
  }, []);



  const [session, setSession] = useState<any>(null);
  const [view, setView] = useState<'landing' | 'auth' | 'dashboard' | 'assessment' | 'results'>('landing');
  const [activeFeature, setActiveFeature] = useState(0);
  const [isYearly, setIsYearly] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formState, setFormState] = useState<'idle' | 'processing' | 'success'>('idle');
  const [progress, setProgress] = useState(0);
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResults | null>(null);

  const handleAssessmentComplete = async (data: AssessmentData) => {
    const results = calculateMissedCallRisk(data);
    setAssessmentData(data);
    setAssessmentResults(results);
    setView('results');

    // Save Assessment to Supabase (Background)
    try {
      await supabase.from('assessments').insert({
        clinic_name: data.clinicName,
        daily_calls: data.avgCallsPerDay,
        reception_config: data.receptionConfig,
        missed_call_strategy: data.missedCallsStrategy,
        lead_follow_up_time: data.leadFollowUpTime,
        run_ads: data.runsAds,
        avg_case_value: data.avgCaseValue,
        risk_score: results.riskScore,
        potential_revenue: results.potentialRevenueRecovered,
        risk_level: results.riskLevel
      });
    } catch (err) {
      console.error('Failed to save assessment', err);
    }
  };

  const handleBookDemo = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('processing');

    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const calendar = (form.elements.namedItem('calendar') as HTMLSelectElement).value;
    const volume = (form.elements.namedItem('volume') as HTMLSelectElement).value;

    try {
      const { error } = await supabase.from('strategy_calls').insert({
        name,
        email,
        calendar_system: calendar,
        patient_volume: volume,
        status: 'pending'
      });

      if (error) throw error;
      setFormState('success');
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
      setFormState('idle');
    }
  };



  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const features = [
    {
      id: 'inbound',
      step: '01',
      title: 'Instant Answer',
      description: 'Nova picks up immediately, 24/7. No voicemail, no hold times.',
      outcome: 'No missed calls'
    },
    {
      id: 'qualification',
      step: '02',
      title: 'Smart Triage',
      description: 'AI filters emergencies and collects insurance details instantly.',
      outcome: 'Qualified leads only'
    },
    {
      id: 'booking',
      step: '03',
      title: 'Real-time Booking',
      description: 'Direct sync with your calendar to fill open slots automatically.',
      outcome: 'Full schedule'
    }
  ];

  useEffect(() => {
    const interval = 50; // Update progress every 50ms
    const stepDuration = 5000; // 5 seconds per step
    const increment = (interval / stepDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveFeature((current) => (current + 1) % features.length);
          return 0;
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [activeFeature, features.length]);

  const handleStepClick = (index: number) => {
    setActiveFeature(index);
    setProgress(0);
  };

  const handleBookDemoFromResults = () => {
    setView('landing');
    setTimeout(() => {
      document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // --- RENDER ---
  if (view === 'assessment') {
    return <AssessmentForm onComplete={handleAssessmentComplete} />;
  }

  if (view === 'results' && assessmentData && assessmentResults) {
    return (
      <AssessmentResults
        data={assessmentData}
        results={assessmentResults}
        onBookDemo={handleBookDemoFromResults}
      />
    );
  }

  return (
    <div className="overflow-x-hidden bg-[#07080B] text-white font-sans selection:bg-brand-500/30">
      {/* (Rest of the original landing page content remains here, slightly adjusted for navigation) */}
      {/* 1) HEADER + STICKY NAV */}
      <header className="fixed w-full top-0 z-50 bg-[#07080B]/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-brand to-brand-light rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-[0_0_20px_rgba(255,106,0,0.4)] group-hover:shadow-[0_0_30px_rgba(255,106,0,0.6)] transition-all duration-500">
                N
              </div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-white/90 transition-colors">Nova <span className="gradient-text font-black">AI Voice</span></span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8">
              <a href="#live-demo" className="text-sm font-medium text-text-muted hover:text-white hover:text-glow transition-all">Live Demo</a>
              <a href="#features" className="text-sm font-medium text-text-muted hover:text-white hover:text-glow transition-all">Features</a>
              <a href="#pricing" className="text-sm font-medium text-text-muted hover:text-white hover:text-glow transition-all">Pricing</a>
              <button
                onClick={() => setView('assessment')}
                className="text-sm font-medium text-text-muted hover:text-white hover:text-glow transition-all flex items-center gap-2"
              >
                <span>ROI Calculator</span>
                <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] uppercase tracking-wider font-bold">New</span>
              </button>
            </nav>

            {/* CTA */}
            <div className="flex items-center gap-4">
              <a href="#demo" className="hidden md:inline-flex items-center justify-center px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold rounded-full text-white backdrop-blur-md transition-all hover:scale-105 hover:border-brand/30">
                Book a Demo
              </a>
              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-gray-300 focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-bg-card border-b border-white/10">
            <div className="px-4 pt-2 pb-6 space-y-2">
              <a href="#live-demo" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-text-muted hover:text-white hover:bg-white/5 rounded-md">Live Demo</a>
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-text-muted hover:text-white hover:bg-white/5 rounded-md">Features</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-text-muted hover:text-white hover:bg-white/5 rounded-md">Pricing</a>
              <button
                onClick={() => { setView('assessment'); setMobileMenuOpen(false); }}
                className="block px-3 py-2 text-base font-medium text-text-muted hover:text-white hover:bg-white/5 rounded-md w-full text-left"
              >
                ROI Calculator
              </button>
              <a href="#demo" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center mt-4 px-6 py-3 border border-transparent text-base font-bold rounded-lg text-white bg-brand hover:bg-brand-hover">Book a Demo</a>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* 2) HERO SECTION */}
        <section className="relative min-h-screen flex flex-col justify-center items-center pt-24 pb-16 overflow-hidden">

          {/* Background Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

          {/* THE SENTINEL: AI CORE ANIMATION */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand/5 rounded-full blur-[120px] animate-pulse-slow pointer-events-none"></div>

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 flex flex-col items-center">

            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/5 border border-brand/20 text-brand-light text-xs font-bold uppercase tracking-widest mb-8 animate-[fadeIn_0.6s_ease-out] hover:bg-brand/10 transition-colors cursor-default backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
              </span>
              For Growth Focused Orthodontists
            </div>

            {/* H1 */}
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tight mb-8 leading-[1.0] drop-shadow-xl relative z-20">
              Stop Losing Patients <br className="hidden md:block" />
              to <span className="gradient-text relative inline-block">
                Missed Calls
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mt-4 max-w-3xl mx-auto text-xl md:text-2xl text-text-muted leading-relaxed font-light">
              Your front desk is overwhelmed. <strong className="text-white font-semibold">Nova answers instantly</strong>, qualifies patients, and books consultations <span className="text-brand font-bold">24/7</span>.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-6 w-full max-w-md mx-auto sm:max-w-none justify-center">
              <button
                onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative flex items-center justify-center gap-3 px-8 py-5 bg-brand hover:bg-brand-hover text-white text-lg font-bold rounded-2xl shadow-[0_0_40px_rgba(255,106,0,0.3)] hover:shadow-[0_0_60px_rgba(255,106,0,0.5)] transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-shimmer"></div>
                <span>Talk to Nova Now</span>
                <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </button>

              <button
                onClick={() => setView('assessment')}
                className="flex items-center justify-center gap-3 px-8 py-5 bg-white/5 hover:bg-white/10 text-white text-lg font-semibold rounded-2xl border border-white/10 hover:border-white/20 backdrop-blur-md transition-all">
                <span>Take Assessment</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-16 pt-8 border-t border-white/5 flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex items-center gap-2 text-sm font-bold tracking-widest"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.21a12.002 12.002 0 00-16.45 0A12.002 12.002 0 003 12c0 2.757 1.12 5.257 2.988 7.071L12 22l6.012-2.929A12.002 12.002 0 0021 12c0-2.757-1.12-5.257-2.988-7.071z"></path></svg> HIPAA COMPLIANT</div>
              <div className="flex items-center gap-2 text-sm font-bold tracking-widest"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> PRACTICE MANAGEMENT SYNC</div>
              <div className="flex items-center gap-2 text-sm font-bold tracking-widest"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> INVISALIGN READY</div>
            </div>

          </div>
        </section>

        {/* 3) LIVE DEMO SECTION */}
        <section id="live-demo" className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/40"></div>

          <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
            <div className="inline-block px-4 py-1 rounded-full border border-brand/20 bg-brand/5 backdrop-blur-sm mb-6">
              <span className="text-brand font-bold tracking-widest uppercase text-xs animate-pulse">Interactive Demo</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Experience Nova Live</h2>

            <p className="text-text-muted text-lg max-w-2xl mx-auto mb-12">
              Chloe is a virtual dental receptionist built with Nova AI Voice. Try a real conversation and see how inbound clinic calls are handled.
            </p>

            {/* Clarification Text */}
            <p className="text-sm text-text-muted/60 mb-8 font-medium">
              This is a live demo experience. Chloe represents one of Nova’s AI receptionists.
            </p>

            {/* WIDGET CONTAINER - Styled like a premium glass card */}
            <div className="relative mx-auto max-w-3xl">
              {/* Glow behind */}
              <div className="absolute -inset-1 bg-gradient-to-r from-brand via-purple-500 to-brand rounded-[2.5rem] blur opacity-20 animate-bg-pan"></div>

              <div id="demo-widget-mount" className="relative h-80 w-full flex flex-col items-center justify-center bg-[#0B0F19]/80 backdrop-blur-2xl rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden group">

                {/* Initial Placeholder State (Visible before widget moves) */}
                <div className="loading-state absolute inset-0 flex flex-col items-center justify-center text-text-muted/50 pointer-events-none z-0">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-brand/5 border border-brand/10 flex items-center justify-center mb-6">
                      <svg className="w-10 h-10 text-brand/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                    {/* Ring Animations */}
                    <div className="absolute inset-0 border border-brand/20 rounded-full animate-[ping_3s_linear_infinite] opacity-20"></div>
                    <div className="absolute -inset-4 border border-white/5 rounded-full animate-[ping_4s_linear_infinite_1s] opacity-10"></div>
                  </div>
                  <p className="animate-pulse font-mono text-xs tracking-widest uppercase text-brand">Initializing Orthodontic Secure Line...</p>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section id="features" className="py-24 relative bg-bg-card/50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Built for Growth Focused Orthodontists</h2>
              <p className="text-text-muted max-w-2xl mx-auto">
                Don't let your "Treatment Coordinator" waste time on tire kickers. Let AI handle the intake.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-brand/30 transition-all hover:-translate-y-1 group">
                <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand/20 transition-colors">
                  <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Zero Missed Calls</h3>
                <p className="text-text-muted">Nova picks up instantly on the first ring, ensuring you never lose a potential new patient to a competitor's voicemail.</p>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-brand/30 transition-all hover:-translate-y-1 group">
                <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand/20 transition-colors">
                  <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Smart Scheduling</h3>
                <p className="text-text-muted">Directly books New Patient Exams into your calendar, prioritizing high value Invisalign and Braces consultations.</p>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-brand/30 transition-all hover:-translate-y-1 group">
                <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand/20 transition-colors">
                  <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Patient Commitment</h3>
                <p className="text-text-muted">Automates the entire intake process by answering questions and verifying insurance on the spot. Patients arrive at your clinic ready to start treatment.</p>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-brand/30 transition-all hover:-translate-y-1 group">
                <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand/20 transition-colors">
                  <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">24/7 Coverage</h3>
                <p className="text-text-muted">Capture leads from your late night Instagram ads. Nova works nights, weekends, and holidays without overtime pay.</p>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-brand/30 transition-all hover:-translate-y-1 group">
                <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand/20 transition-colors">
                  <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Reactivation Campaigns</h3>
                <p className="text-text-muted">Automatically calls old leads to re-engage them. "Are you still interested in fixing your smile?"</p>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-brand/30 transition-all hover:-translate-y-1 group">
                <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand/20 transition-colors">
                  <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Multilingual Support</h3>
                <p className="text-text-muted">Serves your entire community by switching seamlessly between English, Spanish, and other key languages.</p>
              </div>
            </div>
          </div>
        </section>




        {/* BRIDGE: 48-HOUR DEMO CHALLENGE */}
        <section className="py-24 relative overflow-hidden">
          {/* Background Gradient to smooth transition from Hero Black to Pricing Black */}
          < div className="absolute inset-0 bg-gradient-to-b from-[#07080B] via-[#0A0B10] to-[#07080B] pointer-events-none" ></div >

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="bg-gradient-to-br from-white/5 to-white/0 border border-brand/20 p-8 md:p-14 rounded-3xl relative overflow-hidden text-center group hover:border-brand/40 transition-all duration-500 shadow-2xl">

              {/* Glow Effect */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-gradient-to-r from-transparent via-brand to-transparent opacity-50 blur-sm"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-brand/20 to-purple-600/20 blur-3xl opacity-10 group-hover:opacity-30 transition-opacity duration-500"></div>

              <span className="inline-block py-1 px-4 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-bold uppercase tracking-wide">
                High Demand • Limited Availability
              </span>

              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                We'll Build Your Custom Demo in <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-light">48 Hours</span>
              </h2>

              <p className="text-xl text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                Don't just take our word for it. We will configure a <strong>fully functional AI receptionist</strong> trained on your specific clinic data. Completely free. No risk.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                <a
                  href="#demo"
                  className="px-10 py-5 bg-brand hover:bg-brand-hover text-white text-xl font-black rounded-2xl shadow-[0_0_40px_rgba(255,106,0,0.3)] hover:shadow-[0_0_60px_rgba(255,106,0,0.5)] transition-all hover:-translate-y-1 transform flex items-center gap-3 group"
                >
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  Claim Free 48h Demo
                </a>
                <div className="flex items-center gap-2 text-sm text-text-muted opacity-80">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span>Only 2 spots left this week</span>
                </div>
              </div>

            </div>
          </div>
        </section >

        {/* 7) PRICING */}
        < section id="pricing" className="py-24 bg-bg-main relative" >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
              <p className="text-text-muted mb-8">No hidden fees. Just booked patients.</p>

              {/* Setup Banner */}
              <div className="inline-block bg-brand/10 border border-brand/30 rounded-lg px-6 py-2 mb-8">
                <span className="text-brand font-semibold text-sm md:text-base">$297 One-Time Setup • 14-Day Live Trial Included</span>
              </div>

              {/* Toggle */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <span className={`font-medium transition-colors ${!isYearly ? 'text-white' : 'text-text-muted'}`}>Monthly</span>
                <div className="relative inline-block w-14 h-8 align-middle select-none transition duration-200 ease-in">
                  <input
                    type="checkbox"
                    name="toggle"
                    id="price-toggle"
                    checked={isYearly}
                    onChange={(e) => setIsYearly(e.target.checked)}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer left-1 top-1 transition-all duration-300"
                  />
                  <label htmlFor="price-toggle" className="toggle-label block overflow-hidden h-8 rounded-full bg-gray-700 cursor-pointer transition-colors duration-300"></label>
                </div>
                <span className={`font-medium transition-colors ${isYearly ? 'text-white' : 'text-text-muted'}`}>Yearly</span>
                <span className="ml-2 bg-brand text-white text-xs font-bold px-2 py-1 rounded-full">Save 20%</span>
              </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-8 items-start">

              {/* Starter */}
              <div className="bg-bg-card border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all flex flex-col h-full">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white">Starter</h3>
                  <p className="text-sm text-text-muted mt-2 h-10">Perfect for smaller clinics just starting with automation.</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">${isYearly ? 237 : 297}</span>
                  <span className="text-text-muted">/mo</span>
                  <div className="text-xs text-text-muted mt-1">{isYearly ? 'Billed Yearly' : 'Billed Monthly'}</div>
                </div>
                <a href="#demo" className="block w-full text-center py-3 border border-white/20 rounded-lg text-white font-semibold hover:bg-white/5 transition-colors">Select Plan</a>
                <ul className="mt-8 space-y-4 text-sm text-text-muted flex-grow">
                  <li className="flex gap-3"><svg className="w-5 h-5 text-brand flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> 1 AI Voice Agent</li>
                  <li className="flex gap-3"><svg className="w-5 h-5 text-brand flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> 250 Minutes / Month</li>
                  <li className="flex gap-3"><svg className="w-5 h-5 text-brand flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> 24/7 Inbound Call Handling</li>
                  <li className="flex gap-3"><svg className="w-5 h-5 text-brand flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Basic Qualification & Booking</li>
                  <li className="flex gap-3"><svg className="w-5 h-5 text-brand flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Email Notifications</li>
                </ul>
                <div className="mt-6 pt-6 border-t border-white/5 text-xs text-text-muted text-center">
                  Minutes reset monthly
                </div>
              </div>

              {/* Growth */}
              <div className="bg-bg-card border border-brand/50 rounded-2xl p-8 relative shadow-[0_0_40px_rgba(255,106,0,0.15)] transform md:-translate-y-4 flex flex-col h-full">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Most Popular</div>
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white">Growth</h3>
                  <p className="text-sm text-text-muted mt-2 h-10">Our standard plan for growing practices with EMR needs.</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">${isYearly ? 397 : 497}</span>
                  <span className="text-text-muted">/mo</span>
                  <div className="text-xs text-text-muted mt-1">{isYearly ? 'Billed Yearly' : 'Billed Monthly'}</div>
                </div>
                <a href="#demo" className="block w-full text-center py-3 bg-brand rounded-lg text-white font-bold hover:bg-brand-hover transition-colors shadow-lg">Start 14-Day Trial</a>
                <ul className="mt-8 space-y-4 text-sm text-text-muted flex-grow">
                  <li className="flex gap-3"><svg className="w-5 h-5 text-brand flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> 1 AI Voice Agent</li>
                  <li className="flex gap-3"><svg className="w-5 h-5 text-brand flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> 400 Minutes / Month</li>
                  <li className="flex gap-3"><svg className="w-5 h-5 text-brand flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> 24/7 Inbound Call Handling</li>
                  <li className="flex gap-3"><svg className="w-5 h-5 text-brand flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> <span className="text-white font-medium">Seamless Calendar Sync</span></li>
                  <li className="flex gap-3"><svg className="w-5 h-5 text-brand flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Advanced Patient Qualification</li>
                  <li className="flex gap-3"><svg className="w-5 h-5 text-brand flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Smart Scheduling Logic</li>
                </ul>
                <div className="mt-6 pt-6 border-t border-white/5 text-xs text-text-muted text-center">
                  Add-ons available for extra minutes
                </div>
              </div>

              {/* Pro */}
              <div className="bg-bg-card border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all flex flex-col h-full">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white">Pro</h3>
                  <p className="text-sm text-text-muted mt-2 h-10">Maximum power for high-volume clinics.</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">${isYearly ? 557 : 697}</span>
                  <span className="text-text-muted">/mo</span>
                  <div className="text-xs text-text-muted mt-1">{isYearly ? 'Billed Yearly' : 'Billed Monthly'}</div>
                </div>
                <a href="#demo" className="block w-full text-center py-3 border border-white/20 rounded-lg text-white font-semibold hover:bg-white/5 transition-colors">Select Plan</a>
                <ul className="mt-8 space-y-4 text-sm text-text-muted flex-grow">
                  <li className="flex gap-3"><svg className="w-5 h-5 text-brand flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Up to 2 AI Voice Agents</li>
                  <li className="flex gap-3"><svg className="w-5 h-5 text-brand flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> 600 Minutes / Month</li>
                  <li className="flex gap-3"><svg className="w-5 h-5 text-brand flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> 24/7 Inbound Call Handling</li>
                  <li className="flex gap-3"><svg className="w-5 h-5 text-brand flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Priority Support</li>
                  <li className="flex gap-3"><svg className="w-5 h-5 text-brand flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Call Overflow Management</li>
                  <li className="flex gap-3"><svg className="w-5 h-5 text-brand flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Custom Scripting</li>
                </ul>
                <div className="mt-6 pt-6 border-t border-white/5 text-xs text-text-muted text-center">
                  Best for high call volume clinics
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 8) FOOTER WITH FORM */}
        <footer className="bg-[#050608] pt-20 pb-12 border-t border-white/5 relative overflow-hidden" id="demo">
          {/* Ambient Background Glow for Footer */}
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid md:grid-cols-2 gap-16 items-center">

              {/* Left Column: Value Prop & Trust */}
              <div className="space-y-8">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-bold uppercase tracking-wider mb-6">
                    <span className="w-2 h-2 rounded-full bg-brand animate-pulse"></span>
                    Priority Access
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                    Claim Your Practice's <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-light">24/7 AI Receptionist</span>
                  </h2>
                  <p className="text-xl text-text-muted leading-relaxed">
                    Join the top dental practices automating their front desk.
                    Qualify every lead, fill your calendar, and set it up in less than 24 hours.
                  </p>
                </div>

                {/* Trust Elements */}
                <div className="pt-8 border-t border-white/5">
                  <p className="text-sm text-text-muted font-medium mb-4 uppercase tracking-widest">Compatible With</p>
                  <div className="flex flex-wrap gap-4 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                    {/* Text-based mock logos for now, or ensure image assets exist. Using sleek text badges for safety if images missing */}
                    <span className="px-4 py-2 border border-white/10 rounded-lg text-white/60 font-semibold">Google Calendar</span>
                    <span className="px-4 py-2 border border-white/10 rounded-lg text-white/60 font-semibold">Outlook</span>
                    <span className="px-4 py-2 border border-white/10 rounded-lg text-white/60 font-semibold">iCloud</span>
                    <span className="px-4 py-2 border border-white/10 rounded-lg text-white/60 font-semibold">Jane / Cliniko</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-white/30">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                  <span>Secure & Private Data Handling</span>
                </div>
              </div>

              {/* Right Column: High Ticket Intake Terminal */}
              <div className="bg-bg-card border border-white/10 p-1 rounded-3xl shadow-2xl relative">
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-3xl pointer-events-none"></div>

                <div className="bg-[#0A0B10] rounded-[22px] p-8 md:p-10 relative overflow-hidden">
                  {/* Glow Effect */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-brand to-transparent opacity-50"></div>

                  {formState === 'success' ? (
                    <div className="absolute inset-0 bg-[#0A0B10] flex flex-col items-center justify-center text-center p-8 z-20 animate-[fadeIn_0.5s_ease-out]">
                      <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-3">Spot Reserved!</h3>
                      <p className="text-text-muted mb-6">Our integration team will contact you shortly to confirm your strategy call.</p>
                      <div className="w-full bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex justify-between text-xs text-text-muted mb-2">
                          <span>Status</span>
                          <span className="text-green-400">Pending Review</span>
                        </div>
                        <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                          <div className="bg-green-500 h-full w-1/3 animate-[loading_2s_ease-in-out_infinite]"></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mb-8">
                        <h3 className="text-2xl font-bold text-white mb-2">Schedule Strategy Call</h3>
                        <p className="text-sm text-text-muted">Fill out the intake form below. We only accept 5 new clinics per week.</p>
                      </div>

                      <form onSubmit={handleBookDemo} className="space-y-5 relative z-10">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="name" className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Practice Owner</label>
                            <input type="text" id="name" required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all placeholder:text-white/20" placeholder="Dr. Name" />
                          </div>
                          <div>
                            <label htmlFor="email" className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Work Email</label>
                            <input type="email" id="email" required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all placeholder:text-white/20" placeholder="name@clinic.com" />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="calendar" className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Current Calendar System</label>
                          <select id="calendar" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all appearance-none cursor-pointer">
                            <option value="" disabled selected>Select System...</option>
                            <option>Google Calendar</option>
                            <option>Outlook / Office 365</option>
                            <option>iCloud</option>
                            <option>Paper Agenda</option>
                            <option>Other</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="volume" className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Monthly Patient Volume</label>
                          <select id="volume" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all appearance-none cursor-pointer">
                            <option value="" disabled selected>Select Volume...</option>
                            <option>Startup (0-200)</option>
                            <option>Growing (200-1000)</option>
                            <option>High Volume (1000+)</option>
                          </select>
                        </div>

                        <button
                          type="submit"
                          disabled={formState === 'processing'}
                          className="w-full bg-brand hover:bg-brand-hover text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(255,106,0,0.3)] transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-wait mt-4 flex items-center justify-center gap-2 group"
                        >
                          <span>{formState === 'processing' ? 'Processing...' : 'Schedule Strategy Call'}</span>
                          {formState !== 'processing' && <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>}
                        </button>

                        <p className="text-center text-[10px] text-text-muted">
                          No credit card required. Application takes less than 30 seconds.
                        </p>
                      </form>
                    </>
                  )}
                </div>
              </div>

            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);

// Forced clean build for Vercel production deployment