import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import { Phone, ArrowRight, Calendar, MessageSquare } from 'lucide-react';

// --- Supabase Client ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://rmvlncyhsfurhmmekguh.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_bl4MaDWBBafanj59v85gPA_QavvSdch";
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
      recommendations.push('You have decent coverage, but AI helps every call get answered 24/7.');
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
                  <div className="text-sm opacity-80">Handles check ins, payments, and phones</div>
                </button>
                <button
                  onClick={() => updateField('receptionConfig', 'Dedicated')}
                  className={`p-6 rounded-2xl border text-left transition-all ${formData.receptionConfig === 'Dedicated' ? 'bg-brand border-brand text-white' : 'bg-white/10 border-white/10 hover:bg-white/20 text-text-muted'}`}
                >
                  <div className="text-xl font-bold mb-1">Dedicated Phone Staff</div>
                  <div className="text-sm opacity-80">Someone answers phones 100% of the time without in office tasks</div>
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
        <div className={`glass-panel rounded-3xl p-6 sm:p-12 border ${getRiskBgColor(results.riskLevel)} text-center relative overflow-hidden`}>
          <div className="absolute inset-0 bg-brand/5 animate-pulse duration-[3000ms]"></div>
          <div className="relative z-10 space-y-2">
            <h3 className="text-base sm:text-lg text-text-muted font-bold uppercase tracking-normal">Potential Monthly Revenue Recovered</h3>
            <div className="text-5xl md:text-7xl font-black text-white drop-shadow-[0_0_20px_rgba(255,106,0,0.5)]">
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
            <div className="text-text-muted text-sm font-black uppercase tracking-normal mb-4">Missed Calls</div>
            <div className="text-4xl sm:text-5xl font-black text-white">{slidingMissedCalls}</div>
            <div className="text-text-muted mt-2">calls/month slipping through</div>
          </div>
          <div className="glass-panel rounded-2xl p-8 border border-white/10">
            <div className="text-text-muted text-sm font-black uppercase tracking-normal mb-4">Lost New Starts</div>
            {/* Estimate lost starts based on revenue divided by case value */}
            <div className="text-4xl sm:text-5xl font-black text-brand">{(slidingRevenue / data.avgCaseValue).toFixed(1)}</div>
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
  // Widget relocation logic removed to restore stability.





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

  const handleStartVoiceDemo = () => {
    const findAndClickWidget = (attempts = 0) => {
      const container = document.querySelector('#nedzo-widget-container');
      let widgetBtn: HTMLElement | null = null;

      if (container && container.shadowRoot) {
        widgetBtn = container.shadowRoot.querySelector('button[aria-label="Talk to Chloe"]');
      }

      if (!widgetBtn) {
        const selectors = ['iframe[src*="nedzo"]', 'div[id*="nedzo"] button'];
        for (const selector of selectors) {
          const found = document.querySelector(selector);
          if (found instanceof HTMLElement) widgetBtn = found;
          if (widgetBtn) break;
        }
      }

      if (widgetBtn) {
        widgetBtn.click();
      } else if (attempts < 10) {
        setTimeout(() => findAndClickWidget(attempts + 1), 500);
      } else {
        window.dispatchEvent(new CustomEvent('nedzo-open'));
        alert("The AI agent is loading. Please try again in a moment.");
      }
    };

    findAndClickWidget();
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
      title: 'Always On Coverage',
      description: 'Nova AI Voice answers missed calls, calls after business hours, and overflow calls before they go to voicemail.',
      outcome: 'Fewer missed opportunities'
    },
    {
      id: 'qualification',
      step: '02',
      title: 'Structured Intake',
      description: 'Chloe collects the details your team needs so every caller arrives qualified and documented.',
      outcome: 'Better handoff to the front desk'
    },
    {
      id: 'booking',
      step: '03',
      title: 'Controlled Booking',
      description: 'Appointments are only placed when hours, availability, and required patient info all line up.',
      outcome: 'Cleaner schedules'
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
    <div className="overflow-x-hidden bg-bg-main text-white font-sans selection:bg-brand/20">
      {/* (Rest of the original landing page content remains here, slightly adjusted for navigation) */}
      {/* 1) HEADER + STICKY NAV */}
      <header className="fixed w-full top-0 z-50 bg-bg-main/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[5.5rem] sm:h-24">
            {/* Logo */}
            <div
              className="flex items-center cursor-pointer group py-2"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <img
                src="/lockup-dark.svg"
                alt="Nova AI Voice"
                className="h-12 sm:h-14 md:h-16 w-auto object-contain transition-all duration-500 group-hover:scale-105 group-hover:drop-shadow-[0_0_25px_rgba(0,212,255,0.35)]"
              />
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8">
              <a href="#live-demo" className="text-sm font-medium uppercase tracking-normal text-text-muted hover:text-white hover:text-glow transition-all">Live Demo</a>
              <a href="#features" className="text-sm font-medium uppercase tracking-normal text-text-muted hover:text-white hover:text-glow transition-all">Features</a>
              <a href="#pricing" className="text-sm font-medium uppercase tracking-normal text-text-muted hover:text-white hover:text-glow transition-all">Pricing</a>
              <button
                onClick={() => setView('assessment')}
                className="text-sm font-medium uppercase tracking-normal text-text-muted hover:text-white hover:text-glow transition-all flex items-center gap-2"
              >
                <span>ROI Calculator</span>
                <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] uppercase tracking-wider font-bold">New</span>
              </button>
            </nav>

            {/* CTA */}
            <div className="flex items-center gap-4">
              <a href="#demo" className="hidden md:inline-flex items-center justify-center px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold rounded-full text-white backdrop-blur-md transition-all hover:scale-105 hover:border-brand/30">
                Request Intro Call
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
              <a href="#demo" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center mt-4 px-6 py-3 border border-transparent text-base font-bold rounded-lg text-bg-main bg-brand hover:bg-brand-hover">Request Intro Call</a>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* 2) HERO SECTION */}
        <section className="relative min-h-[92svh] flex flex-col justify-center items-center pt-36 pb-20 overflow-hidden">

          {/* Background Grid Pattern */}
          <div className="absolute inset-0 bg-grid-pattern bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_70%_55%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-70"></div>

          {/* THE SENTINEL: AI CORE ANIMATION */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand/10 rounded-full blur-[120px] animate-pulse-slow pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-[420px] h-[420px] bg-accent/10 rounded-full blur-[140px] pointer-events-none"></div>

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 flex flex-col items-center">

            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-brand-light text-xs font-bold uppercase tracking-normal mb-8 animate-[fadeIn_0.6s_ease-out] hover:bg-white/10 transition-colors cursor-default backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
              </span>
              Built for Orthodontic & Dental Practices
            </div>

            {/* H1 */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-normal mb-8 leading-tight drop-shadow-xl relative z-20">
              Stop Losing Serious Patients <br className="hidden md:block" />
              to <span className="gradient-text relative inline-block">
                Missed Calls
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mt-4 max-w-3xl mx-auto text-xl md:text-2xl text-text-muted leading-relaxed font-medium">
              Nova AI Voice helps orthodontic and dental practices answer every call, qualify the right patient, and book consultations <span className="text-brand font-bold">24/7</span> without replacing the front desk.
            </p>
            <p className="mt-5 max-w-2xl mx-auto text-sm md:text-base uppercase tracking-normal text-text-soft">
              Chloe handles overflow, calls after business hours, and busy moments so your team stays focused in the office.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6 w-full max-w-lg mx-auto sm:max-w-none justify-center">
              <button
                onClick={() => {
                  document.getElementById('live-demo')?.scrollIntoView({ behavior: 'smooth' });
                  setTimeout(() => document.getElementById('start-demo-btn')?.focus(), 800);
                }}
                className="group relative w-full sm:w-auto flex items-center justify-center gap-3 px-6 sm:px-8 py-4 sm:py-5 bg-brand hover:bg-brand-hover text-bg-main text-base sm:text-lg font-bold rounded-2xl shadow-[0_0_40px_rgba(0,212,255,0.22)] hover:shadow-[0_0_60px_rgba(0,212,255,0.32)] transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-shimmer"></div>
                <span>Talk to Chloe</span>
                <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </button>

              <button
                onClick={() => setView('assessment')}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 sm:px-8 py-4 sm:py-5 bg-white/5 hover:bg-white/10 text-white text-base sm:text-lg font-semibold rounded-2xl border border-white/10 hover:border-white/20 backdrop-blur-md transition-all">
                <span>Estimate Missed Revenue</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-14 sm:mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-4 sm:gap-8 opacity-70 transition-all duration-500">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold tracking-normal text-text-muted"><svg className="w-4 h-4 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.21a12.002 12.002 0 00-16.45 0A12.002 12.002 0 003 12c0 2.757 1.12 5.257 2.988 7.071L12 22l6.012-2.929A12.002 12.002 0 0021 12c0-2.757-1.12-5.257-2.988-7.071z"></path></svg> BUILT FOR TRUST</div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold tracking-normal text-text-muted"><svg className="w-4 h-4 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> CONTROLLED SCHEDULING</div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold tracking-normal text-text-muted"><svg className="w-4 h-4 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> SUPPORTS YOUR TEAM</div>
            </div>

          </div>
        </section>

        {/* 3) LIVE DEMO SECTION */}
        <section id="live-demo" className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-bg-main via-[#091425] to-bg-card"></div>

          <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
            <div className="inline-block px-4 py-1 rounded-full border border-brand/20 bg-white/5 backdrop-blur-sm mb-6">
              <span className="text-brand font-bold tracking-normal uppercase text-xs animate-pulse">Interactive Demo</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-normal text-white mb-6">Experience Chloe Live</h2>

            <p className="text-text-muted text-lg max-w-2xl mx-auto mb-12">
              Chloe is the Nova AI Voice receptionist for orthodontic and dental practices. Test how missed call capture, qualification, and booking feel in a live conversation.
            </p>

            <div className="relative mx-auto max-w-4xl">
              <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-r from-brand/50 via-brand-light/40 to-accent/45 blur opacity-20"></div>

              <div id="demo-widget-mount" className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_26%_18%,rgba(0,212,255,0.16),transparent_28%),linear-gradient(145deg,rgba(14,30,54,0.95),rgba(8,17,31,0.98))] p-5 shadow-2xl sm:p-8">
                <div className="absolute inset-0 bg-grid-pattern bg-[size:32px_32px] opacity-20 pointer-events-none"></div>

                <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[0.92fr_1.08fr]">
                  <div className="flex justify-center lg:justify-end">
                    <div className="demo-phone-tilt relative w-[13.5rem] sm:w-[15rem]">
                      <div className="absolute -inset-5 rounded-full bg-brand/20 blur-[55px]"></div>
                      <div className="relative rounded-[2.2rem] border border-white/15 bg-gradient-to-br from-white/[0.16] to-white/[0.04] p-1.5 shadow-[0_28px_80px_rgba(0,0,0,0.36)]">
                        <div className="overflow-hidden rounded-[1.85rem] border border-white/10 bg-[#071425] p-3">
                          <div className="mx-auto mb-3 h-4 w-20 rounded-b-2xl bg-black/70"></div>
                          <div className="relative min-h-[20rem] overflow-hidden rounded-[1.5rem] bg-[radial-gradient(circle_at_50%_0%,rgba(0,212,255,0.20),transparent_36%),linear-gradient(180deg,#0D2440,#07101F)] p-4 text-left">
                            <div className="mb-5 flex items-center justify-between">
                              <div>
                                <div className="text-[9px] font-bold uppercase tracking-normal text-brand-light">Nova AI Voice</div>
                                <div className="text-lg font-black text-white">Chloe</div>
                              </div>
                              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-brand text-bg-main">
                                <span className="demo-ring absolute inset-0 rounded-full border border-brand"></span>
                                <Phone className="relative h-5 w-5" />
                              </div>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-3">
                              <div className="mb-2 flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-normal text-brand-light">Live call</span>
                                <span className="text-xs font-bold text-text-soft">00:18</span>
                              </div>
                              <div className="text-sm font-black text-white">New patient inquiry</div>
                              <div className="mt-1 text-xs text-text-muted">Morning consult preferred</div>
                            </div>

                            <div className="mt-4 flex h-12 items-center justify-between rounded-2xl bg-bg-main/60 px-4 text-brand">
                              <span className="voice-bar h-4 w-1.5 rounded-full bg-current"></span>
                              <span className="voice-bar h-8 w-1.5 rounded-full bg-current"></span>
                              <span className="voice-bar h-5 w-1.5 rounded-full bg-current"></span>
                              <span className="voice-bar h-10 w-1.5 rounded-full bg-current"></span>
                              <span className="voice-bar h-6 w-1.5 rounded-full bg-current"></span>
                              <span className="voice-bar h-9 w-1.5 rounded-full bg-current"></span>
                            </div>

                            <div className="mt-4 rounded-2xl border border-brand/20 bg-brand/10 p-3">
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-bg-main">
                                  <Calendar className="h-4 w-4" />
                                </div>
                                <div>
                                  <div className="text-[10px] font-bold uppercase tracking-normal text-brand-light">Consult booked</div>
                                  <div className="text-sm font-black text-white">Tuesday, 10:30 AM</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 text-left">
                    <div className="demo-flow-card rounded-2xl border border-white/10 bg-bg-main/70 p-4 backdrop-blur-xl">
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/15 text-brand">
                          <Phone className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-normal text-text-soft">1. Patient calls</div>
                          <div className="text-base font-black text-white">A new inquiry comes in</div>
                        </div>
                      </div>
                    </div>

                    <div className="demo-flow-card answer rounded-2xl border border-white/10 bg-bg-main/70 p-4 backdrop-blur-xl">
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/15 text-brand">
                          <MessageSquare className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-normal text-text-soft">2. Chloe answers</div>
                          <div className="text-base font-black text-white">She qualifies the patient calmly</div>
                        </div>
                      </div>
                    </div>

                    <div className="demo-flow-card book rounded-2xl border border-white/10 bg-bg-main/70 p-4 backdrop-blur-xl">
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/15 text-accent">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-normal text-text-soft">3. Appointment booked</div>
                          <div className="text-base font-black text-white">Your team gets the handoff</div>
                        </div>
                      </div>
                    </div>

                    <button
                      id="start-demo-btn"
                      onClick={handleStartVoiceDemo}
                      className="group relative mt-6 flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-brand px-5 py-4 text-base font-black text-bg-main shadow-[0_0_45px_rgba(0,212,255,0.25)] transition-all duration-300 hover:-translate-y-1 hover:bg-brand-hover hover:shadow-[0_0_60px_rgba(0,212,255,0.34)] focus:outline-none focus:ring-4 focus:ring-brand/50 sm:text-lg"
                    >
                      <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/25 to-transparent group-hover:animate-shimmer"></div>
                      <Phone className="h-5 w-5 transition-transform group-hover:rotate-12" />
                      <span>Start Demo With Chloe</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section id="features" className="py-24 relative bg-[linear-gradient(180deg,rgba(14,30,54,0.72),rgba(10,22,40,0.98))]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold tracking-normal mb-4">Built to support a strong front desk</h2>
              <p className="text-text-muted max-w-2xl mx-auto">
                Keep your current team focused on patients in the office while Nova AI Voice handles overflow, calls after business hours, and consistent intake.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 sm:gap-8">
              <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-brand/30 transition-all hover:-translate-y-1 group">
                <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand/20 transition-colors">
                  <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">No missed first impressions</h3>
                <p className="text-text-muted">Nova AI Voice answers fast when your team is busy, at lunch, or already on the phone, so serious patients do not fall to voicemail.</p>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-brand/30 transition-all hover:-translate-y-1 group">
                <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand/20 transition-colors">
                  <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Scheduling with guardrails</h3>
                <p className="text-text-muted">Consultations are booked only when the right information is captured and the appointment fits your clinic's rules and availability.</p>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-brand/30 transition-all hover:-translate-y-1 group">
                <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand/20 transition-colors">
                  <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Consistent qualification</h3>
                <p className="text-text-muted">Every caller is guided through a structured intake so your team receives cleaner handoffs and more qualified consultations.</p>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-brand/30 transition-all hover:-translate-y-1 group">
                <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand/20 transition-colors">
                  <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">24/7 coverage</h3>
                <p className="text-text-muted">Calls after business hours, weekend demand, and calls from ads still get answered with a calm, polished experience for patients.</p>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-brand/30 transition-all hover:-translate-y-1 group">
                <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand/20 transition-colors">
                  <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Overflow without burnout</h3>
                <p className="text-text-muted">Nova gives your staff breathing room during peak periods while keeping service quality steady for every inbound call.</p>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-brand/30 transition-all hover:-translate-y-1 group">
                <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand/20 transition-colors">
                  <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Clear patient experience</h3>
                <p className="text-text-muted">Patients get a fast, professional interaction that sounds modern and helpful, not like a generic call center or rigid automation.</p>
              </div>
            </div>
          </div>
        </section >




        {/* BRIDGE: 48-HOUR DEMO CHALLENGE */}
        < section className="py-24 relative overflow-hidden" >
          {/* Background Gradient to smooth transition from Hero Black to Pricing Black */}
          < div className="absolute inset-0 bg-gradient-to-b from-bg-main via-[#0B1930] to-bg-main pointer-events-none" ></div >

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="bg-gradient-to-br from-white/5 to-white/0 border border-brand/20 p-6 sm:p-8 md:p-14 rounded-3xl relative overflow-hidden text-center group hover:border-brand/40 transition-all duration-500 shadow-2xl">

              {/* Glow Effect */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-gradient-to-r from-transparent via-brand to-transparent opacity-50 blur-sm"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-brand/20 to-accent/20 blur-3xl opacity-10 group-hover:opacity-30 transition-opacity duration-500"></div>

              <span className="inline-block py-1 px-4 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-bold uppercase tracking-normal">
                Custom Demo Build
              </span>

              <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-6 tracking-normal leading-tight">
                We will build your Nova AI Voice <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-accent">demo in 48 hours</span>
              </h2>

              <p className="text-xl text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                Instead of asking you to imagine the workflow, we configure a tailored demo around your clinic's hours, intake flow, and booking rules so you can hear the difference before committing.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                <a
                  href="#demo"
                  className="w-full sm:w-auto justify-center px-6 sm:px-10 py-4 sm:py-5 bg-brand hover:bg-brand-hover text-bg-main text-base sm:text-xl font-black rounded-2xl shadow-[0_0_40px_rgba(0,212,255,0.22)] hover:shadow-[0_0_60px_rgba(0,212,255,0.32)] transition-all hover:-translate-y-1 transform flex items-center gap-3 group"
                >
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  Request Your 48h Demo
                </a>
                <div className="flex items-center gap-2 text-sm text-text-muted opacity-80">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                  <span>Setup begins only when you are ready to go live</span>
                </div>
              </div>

            </div>
          </div>
        </section >

        {/* 7) PRICING */}
        < section id="pricing" className="py-24 bg-bg-main relative" >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-normal">Simple pricing for booked consultations</h2>
              <p className="text-text-muted mb-8">Clear setup, clear monthly pricing, and a live trial before rollout.</p>

              {/* Setup Banner */}
              <div className="inline-block bg-brand/10 border border-brand/30 rounded-lg px-6 py-2 mb-8">
                <span className="text-brand font-semibold text-sm md:text-base">$300 Setup Fee • 14 Day Free Trial Included</span>
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
                  <p className="text-sm text-text-muted mt-2 min-h-10">Perfect for smaller clinics just starting with automation.</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">${isYearly ? 237 : 297}</span>
                  <span className="text-text-muted">/mo</span>
                  <div className="text-xs text-text-muted mt-1">{isYearly ? 'Billed Yearly' : 'Billed Monthly'}</div>
                </div>
                <a href="#demo" className="block w-full text-center py-3 border border-white/20 rounded-lg text-white font-semibold hover:bg-white/5 transition-colors">Talk Through Starter</a>
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
              <div className="bg-bg-card border border-brand/50 rounded-2xl p-8 relative shadow-[0_0_40px_rgba(0,212,255,0.15)] transform md:-translate-y-4 flex flex-col h-full">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand text-bg-main text-xs font-bold px-3 py-1 rounded-full uppercase tracking-normal">Most Popular</div>
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white">Growth</h3>
                  <p className="text-sm text-text-muted mt-2 min-h-10">Our standard plan for growing practices with EMR needs.</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">${isYearly ? 397 : 497}</span>
                  <span className="text-text-muted">/mo</span>
                  <div className="text-xs text-text-muted mt-1">{isYearly ? 'Billed Yearly' : 'Billed Monthly'}</div>
                </div>
                <a href="#demo" className="block w-full text-center py-3 bg-brand rounded-lg text-bg-main font-bold hover:bg-brand-hover transition-colors shadow-lg">Start 14 Day Trial</a>
                <ul className="mt-8 space-y-4 text-sm text-text-muted flex-grow">
                  <li className="flex gap-3"><svg className="w-5 h-5 text-brand flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> 1 AI Voice Agent</li>
                  <li className="flex gap-3"><svg className="w-5 h-5 text-brand flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> 400 Minutes / Month</li>
                  <li className="flex gap-3"><svg className="w-5 h-5 text-brand flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> 24/7 Inbound Call Handling</li>
                  <li className="flex gap-3"><svg className="w-5 h-5 text-brand flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> <span className="text-white font-medium">Seamless Calendar Sync</span></li>
                  <li className="flex gap-3"><svg className="w-5 h-5 text-brand flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Advanced Patient Qualification</li>
                  <li className="flex gap-3"><svg className="w-5 h-5 text-brand flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Smart Scheduling Logic</li>
                </ul>
                <div className="mt-6 pt-6 border-t border-white/5 text-xs text-text-muted text-center">
                  Extra minutes are available
                </div>
              </div>

              {/* Pro */}
              <div className="bg-bg-card border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all flex flex-col h-full">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white">Pro</h3>
                  <p className="text-sm text-text-muted mt-2 min-h-10">Maximum coverage for clinics with higher call volume.</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">${isYearly ? 557 : 697}</span>
                  <span className="text-text-muted">/mo</span>
                  <div className="text-xs text-text-muted mt-1">{isYearly ? 'Billed Yearly' : 'Billed Monthly'}</div>
                </div>
                <a href="#demo" className="block w-full text-center py-3 border border-white/20 rounded-lg text-white font-semibold hover:bg-white/5 transition-colors">Talk Through Pro</a>
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
        </section >

        {/* 8) FAQ SECTION */}
        <section id="faq" className="py-24 relative overflow-hidden bg-[linear-gradient(180deg,rgba(10,22,40,0.98),rgba(14,30,54,0.72))]">
          <div className="absolute inset-0 bg-grid-pattern bg-[size:32px_32px] opacity-20 pointer-events-none"></div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-block px-4 py-1 rounded-full border border-brand/20 bg-brand/10 backdrop-blur-sm mb-6">
                <span className="text-brand font-bold tracking-normal uppercase text-xs">FAQ</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 tracking-normal">Frequently Asked Questions</h2>
              <p className="text-text-muted text-lg">Everything you need to know before trying Nova AI Voice with your practice.</p>
            </div>
            <div className="space-y-4">
              {[
                {
                  q: "What exactly is Nova AI Voice?",
                  a: "Nova AI Voice is an AI receptionist built for orthodontic and dental practices. It answers calls, qualifies patients, captures key details, and books consultations while your front desk stays focused on the people already in the office."
                },
                {
                  q: "Does Nova AI Voice replace my front desk team?",
                  a: "No. Nova AI Voice supports your team during overflow, calls after business hours, lunch breaks, and busy moments. Your staff stays in control while Chloe handles the repetitive intake work."
                },
                {
                  q: "Can Chloe book appointments?",
                  a: "Yes. Chloe can collect the right patient information and book consultations using the calendar rules you approve during setup."
                },
                {
                  q: "Which calendar systems can it work with?",
                  a: "Nova AI Voice can be configured around Google Calendar, Outlook, iCloud, Jane, Cliniko, or another scheduling process your clinic already uses."
                },
                {
                  q: "Can I try it before committing?",
                  a: "Yes. We can build a tailored demo around your hours, intake flow, and booking rules so you can hear how Chloe handles real patient scenarios before rollout."
                }
              ].map((item, i) => (
                <details key={i} className="glass-card rounded-2xl group">
                  <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none">
                    <span className="font-semibold text-white text-lg pr-4">{item.q}</span>
                    <span className="text-brand text-2xl flex-shrink-0 transition-transform duration-200 group-open:rotate-45">+</span>
                  </summary>
                  <p className="px-6 pb-6 text-text-muted leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 9) FOOTER WITH FORM */}
        < footer className="bg-[#08111f] pt-20 pb-12 border-t border-white/5 relative overflow-hidden" id="demo" >
          {/* Ambient Background Glow for Footer */}
          < div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[120px] pointer-events-none" ></div >

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid md:grid-cols-2 gap-16 items-center">

              {/* Left Column: Value Prop & Trust */}
              <div className="space-y-8">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-bold uppercase tracking-normal mb-6">
                    <span className="w-2 h-2 rounded-full bg-brand animate-pulse"></span>
                    Intro Call Request
                  </div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight tracking-normal">
                    See how Nova AI Voice can <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-accent">support your front desk</span>
                  </h2>
                  <p className="text-xl text-text-muted leading-relaxed">
                    We will review your call flow, show where leads are leaking, and map a live demo that fits your current scheduling process.
                  </p>
                </div>

                {/* Trust Elements */}
                <div className="pt-8 border-t border-white/5">
                  <p className="text-sm text-text-muted font-medium mb-4 uppercase tracking-normal">Compatible With</p>
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
                  <span>Secure and private patient handling</span>
                </div>
              </div>

              {/* Right Column: High Ticket Intake Terminal */}
              <div className="bg-bg-card border border-white/10 p-1 rounded-3xl shadow-2xl relative">
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-3xl pointer-events-none"></div>

                <div className="bg-[#0A0B10] rounded-[22px] p-6 sm:p-8 md:p-10 relative overflow-hidden">
                  {/* Glow Effect */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-brand to-transparent opacity-50"></div>

                  {formState === 'success' ? (
                    <div className="flex flex-col items-center justify-center text-center py-6 z-20 animate-[fadeIn_0.5s_ease-out]">
                      <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-3">Request Received</h3>
                      <p className="text-text-muted mb-6">Our team will contact you shortly to confirm your intro call and demo setup details.</p>
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
                        <h3 className="text-2xl font-bold text-white mb-2">Request Your Intro Call</h3>
                        <p className="text-sm text-text-muted">Tell us about your clinic. We will use this to tailor the Nova AI Voice demo around your current workflow.</p>
                      </div>

                      <form onSubmit={handleBookDemo} className="space-y-5 relative z-10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="name" className="block text-xs font-semibold text-text-muted uppercase tracking-normal mb-2">Practice Owner</label>
                            <input type="text" id="name" required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all placeholder:text-white/20" placeholder="Dr. Name" />
                          </div>
                          <div>
                            <label htmlFor="email" className="block text-xs font-semibold text-text-muted uppercase tracking-normal mb-2">Work Email</label>
                            <input type="email" id="email" required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all placeholder:text-white/20" placeholder="name@clinic.com" />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="calendar" className="block text-xs font-semibold text-text-muted uppercase tracking-normal mb-2">Current Calendar System</label>
                          <select id="calendar" defaultValue="" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all appearance-none cursor-pointer">
                            <option value="" disabled className="bg-[#0A0B10] text-gray-500">Select System...</option>
                            <option value="Google Calendar" className="bg-[#0A0B10] text-white">Google Calendar</option>
                            <option value="Outlook / Office 365" className="bg-[#0A0B10] text-white">Outlook / Office 365</option>
                            <option value="iCloud" className="bg-[#0A0B10] text-white">iCloud</option>
                            <option value="Paper Agenda" className="bg-[#0A0B10] text-white">Paper Agenda</option>
                            <option value="Other" className="bg-[#0A0B10] text-white">Other</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="volume" className="block text-xs font-semibold text-text-muted uppercase tracking-normal mb-2">Monthly Patient Volume</label>
                          <select id="volume" defaultValue="" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all appearance-none cursor-pointer">
                            <option value="" disabled className="bg-[#0A0B10] text-gray-500">Select Volume...</option>
                            <option value="Startup (0-200)" className="bg-[#0A0B10] text-white">Startup (0-200)</option>
                            <option value="Growing (200-1000)" className="bg-[#0A0B10] text-white">Growing (200-1000)</option>
                            <option value="High call volume (1000+)" className="bg-[#0A0B10] text-white">High call volume (1000+)</option>
                          </select>
                        </div>

                        <button
                          type="submit"
                          disabled={formState === 'processing'}
                          className="w-full bg-brand hover:bg-brand-hover text-bg-main font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(0,212,255,0.22)] transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-wait mt-4 flex items-center justify-center gap-2 group"
                        >
                          <span>{formState === 'processing' ? 'Processing...' : 'Request Intro Call'}</span>
                          {formState !== 'processing' && <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>}
                        </button>

                        <p className="text-center text-[10px] text-text-muted">
                          No credit card required. Takes less than 30 seconds.
                        </p>
                      </form>
                    </>
                  )}
                </div>
              </div>

            </div>
          </div>
          {/* Bottom Bar */}
          <div className="mt-16 pt-8 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-text-muted text-sm">© 2025 Nova AI Voice. All rights reserved. HIPAA Compliant.</p>
              <div className="flex flex-wrap items-center gap-6 text-sm text-text-muted">
                <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
                <span className="text-white/20">|</span>
                <span className="text-white/40 text-xs">Integrates with:</span>
                <a href="https://workspace.google.com/products/calendar/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Google Calendar</a>
                <a href="https://www.jane.app/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Jane App</a>
                <a href="https://www.cliniko.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Cliniko</a>
              </div>
            </div>
          </div>
        </footer >
      </main >
    </div >
  );
};

// --- SEO helper for sub-pages ---
const updatePageMeta = (title: string, description: string, canonicalPath: string) => {
  document.title = title;
  const setMeta = (selector: string, attr: string, content: string) => {
    let el = document.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
    if (!el) {
      const tag = selector.startsWith('link') ? 'link' : 'meta';
      el = document.createElement(tag) as any;
      const match = selector.match(/\[([\w-]+)="([^"]+)"\]/);
      if (match) (el as any).setAttribute(match[1], match[2]);
      document.head.appendChild(el);
    }
    el.setAttribute(attr, content);
  };
  setMeta('meta[name="description"]', 'content', description);
  setMeta('link[rel="canonical"]', 'href', `https://novaaivoice.com${canonicalPath}`);
  setMeta('meta[property="og:title"]', 'content', title);
  setMeta('meta[property="og:description"]', 'content', description);
  setMeta('meta[property="og:url"]', 'content', `https://novaaivoice.com${canonicalPath}`);
};

// --- Privacy Policy Page ---
const PrivacyPage = () => {
  React.useEffect(() => {
    updatePageMeta(
      'Privacy Policy | Nova AI Voice',
      'Privacy Policy for Nova AI Voice. Learn how we handle patient data, HIPAA compliance, and data retention for our AI receptionist service.',
      '/privacy'
    );
  }, []);
  return (
  <div className="min-h-screen bg-[#07080B] text-white font-sans">
    <header className="border-b border-white/5 py-6 px-8">
      <a href="/" className="text-brand font-bold text-lg hover:opacity-80 transition-opacity">← Nova AI Voice</a>
    </header>
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-black mb-4">Privacy Policy</h1>
      <p className="text-text-muted mb-10 text-sm">Last updated: April 27, 2025</p>
      <div className="space-y-8 text-text-muted leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-white mb-3">1. Information We Collect</h2>
          <p>Nova AI Voice collects information you provide when scheduling a strategy call or demo, including your name, work email, practice name, and calendar system preference. We also collect call data processed through our AI voice agents on behalf of your practice, which may include protected health information (PHI).</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-white mb-3">2. HIPAA Compliance</h2>
          <p>Nova AI Voice operates in compliance with the Health Insurance Portability and Accountability Act (HIPAA). We act as a Business Associate under HIPAA when processing PHI on behalf of covered entities. A Business Associate Agreement (BAA) is available and required for all clinical deployments. PHI is encrypted in transit and at rest, and is never sold or used for advertising purposes.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-white mb-3">3. How We Use Your Information</h2>
          <p>We use collected information to provide and improve our AI receptionist service, communicate with you about your account or demo, and send relevant product updates with your consent. We do not sell personal data to third parties.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-white mb-3">4. Data Retention</h2>
          <p>Call recordings and transcripts are retained for a period defined in your service agreement. You may request deletion of your data at any time by contacting us. Practice data is permanently deleted within 30 days of account termination.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-white mb-3">5. Third-Party Integrations</h2>
          <p>Nova integrates with third-party calendar systems including Google Calendar, Microsoft Outlook, Apple iCloud, Jane App, and Cliniko. Data shared with these systems is governed by their respective privacy policies. We only transmit the minimum data necessary to complete appointment bookings.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-white mb-3">6. Contact</h2>
          <p>For privacy-related inquiries, data deletion requests, or BAA execution, please contact us via the strategy call form on our website at <a href="/" className="text-brand hover:underline">novaaivoice.com</a>.</p>
        </section>
      </div>
    </main>
  </div>
  );
};

// --- Terms of Service Page ---
const TermsPage = () => {
  React.useEffect(() => {
    updatePageMeta(
      'Terms of Service | Nova AI Voice',
      'Terms of Service for Nova AI Voice. Subscription, billing, acceptable use, and limitation of liability for our AI receptionist service.',
      '/terms'
    );
  }, []);
  return (
  <div className="min-h-screen bg-[#07080B] text-white font-sans">
    <header className="border-b border-white/5 py-6 px-8">
      <a href="/" className="text-brand font-bold text-lg hover:opacity-80 transition-opacity">← Nova AI Voice</a>
    </header>
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-black mb-4">Terms of Service</h1>
      <p className="text-text-muted mb-10 text-sm">Last updated: April 27, 2025</p>
      <div className="space-y-8 text-text-muted leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-white mb-3">1. Service Description</h2>
          <p>Nova AI Voice provides AI-powered voice receptionist services for orthodontic and dental practices. By subscribing to any plan, you agree to these Terms of Service. The service includes inbound call handling, patient qualification, appointment booking, and reactivation campaigns as described in your selected plan.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-white mb-3">2. Subscription & Billing</h2>
          <p>All plans require a one-time setup fee of $297. Monthly subscriptions are billed on the first day of each billing cycle. Yearly subscriptions receive a 20% discount. Minutes reset monthly and do not roll over. Additional minutes are available as add-ons on Growth and Pro plans. You may cancel at any time with 30 days' written notice.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-white mb-3">3. Acceptable Use</h2>
          <p>You agree to use Nova AI Voice exclusively for lawful purposes within a licensed healthcare practice. You are responsible for ensuring your use of the service complies with applicable laws and regulations, including HIPAA, and that appropriate consent is obtained from patients regarding AI-assisted call handling.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-white mb-3">4. Limitation of Liability</h2>
          <p>Nova AI Voice is a supplemental communication tool and does not replace clinical judgment or emergency services. We are not liable for missed appointments, patient outcomes, or revenue loss arising from service interruptions. Our maximum liability is limited to the monthly subscription fees paid in the 30 days preceding any claim.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-white mb-3">5. Modifications</h2>
          <p>We reserve the right to update these terms with 30 days' prior notice. Continued use of the service after notification constitutes acceptance of the updated terms.</p>
        </section>
      </div>
    </main>
  </div>
  );
};

// --- Router ---
const pathname = window.location.pathname;
let AppToRender: React.FC;
if (pathname === '/privacy') {
  AppToRender = PrivacyPage;
} else if (pathname === '/terms') {
  AppToRender = TermsPage;
} else {
  AppToRender = App;
}

const root = createRoot(document.getElementById('root')!);
root.render(<AppToRender />);

// Forced clean build for Vercel production deployment
