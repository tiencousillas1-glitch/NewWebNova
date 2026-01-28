import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isYearly, setIsYearly] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formState, setFormState] = useState<'idle' | 'processing' | 'success'>('idle');
  const [progress, setProgress] = useState(0);

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

  const handleBookDemo = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('processing');
    setTimeout(() => {
      setFormState('success');
    }, 1500);
  };

  return (
    <div className="overflow-x-hidden">
      {/* 1) HEADER + STICKY NAV */}
      <header className="fixed w-full top-0 z-50 bg-[#07080B]/90 backdrop-blur-md border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-brand to-brand-light rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_rgba(255,106,0,0.4)]">
                N
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Nova <span className="text-brand font-medium">AI Voice</span></span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8">
              <a href="#why-nova" className="text-sm font-medium text-text-muted hover:text-brand transition-colors">Why Nova</a>
              <a href="#how-it-works" className="text-sm font-medium text-text-muted hover:text-brand transition-colors">How it Works</a>
              <a href="#pricing" className="text-sm font-medium text-text-muted hover:text-brand transition-colors">Pricing</a>
            </nav>

            {/* CTA */}
            <div className="flex items-center gap-4">
              <a href="#demo" className="hidden md:inline-flex items-center justify-center px-6 py-2 border border-transparent text-sm font-semibold rounded-full text-white bg-brand hover:bg-brand-hover transition-all shadow-[0_4px_14px_0_rgba(255,106,0,0.39)] hover:shadow-[0_6px_20px_rgba(255,106,0,0.23)] hover:-translate-y-0.5">
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
              <a href="#why-nova" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-text-muted hover:text-white hover:bg-white/5 rounded-md">Why Nova</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-text-muted hover:text-white hover:bg-white/5 rounded-md">How it Works</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-text-muted hover:text-white hover:bg-white/5 rounded-md">Pricing</a>
              <a href="#demo" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center mt-4 px-6 py-3 border border-transparent text-base font-bold rounded-lg text-white bg-brand hover:bg-brand-hover">Book a Demo</a>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* 2) HERO SECTION */}
        <section className="relative min-h-screen flex flex-col justify-center items-center pt-20 pb-16 overflow-hidden">
          {/* Background Glow */}
          <div className="absolute inset-0 bg-hero-glow pointer-events-none"></div>

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand-light text-xs font-semibold uppercase tracking-wider mb-8 animate-[fadeIn_0.6s_ease-out]">
              <span className="w-2 h-2 rounded-full bg-brand animate-pulse"></span>
              Live for Dental & Orthodontics
            </div>

            {/* H1 */}
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-[1.1]">
              Stop Losing Patients <br className="hidden md:block" />
              to <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-light">Missed Calls</span>
            </h1>

            {/* Subheadline */}
            <p className="mt-4 max-w-2xl mx-auto text-xl text-text-muted leading-relaxed">
              Nova AI Voice answers every call 24/7, qualifies patients, and books consultations directly into your calendar. Stop playing phone tag and start filling your chairs.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="#demo" className="w-full sm:w-auto px-8 py-4 bg-brand hover:bg-brand-hover text-white text-lg font-bold rounded-lg shadow-[0_0_20px_rgba(255,106,0,0.4)] transition-all hover:scale-105 flex items-center justify-center">
                Book a Demo
              </a>
              <a href="#how-it-works" className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-lg font-medium rounded-lg backdrop-blur-sm transition-all flex items-center justify-center">
                See How It Works
              </a>
            </div>

            {/* Trusted By */}
            <div className="mt-20 pt-10 border-t border-white/5">
              <p className="text-sm font-medium text-text-muted uppercase tracking-widest mb-6">Trusted by industry leaders</p>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="flex items-center gap-2 font-bold text-xl text-white"><svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" /></svg> APEX DENTAL</div>
                <div className="flex items-center gap-2 font-bold text-xl text-white"><svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg> SMILE ORTHO</div>
                <div className="flex items-center gap-2 font-bold text-xl text-white"><svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" /></svg> BRIGHT CLINIC</div>
              </div>
              <p className="mt-4 text-xs text-text-muted italic">Built for clinics that can’t afford missed calls.</p>
            </div>
          </div>
        </section>

        {/* 3) INTERACTIVE PRODUCT DEMO (Redesigned) */}
        <section id="why-nova" className="py-24 bg-bg-main relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-brand font-semibold tracking-wide uppercase text-sm">Clear Value. Clear Bookings.</span>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold text-white">Why Clinics Choose Nova</h2>
            </div>

            <div className="grid lg:grid-cols-12 gap-12 items-start">

              {/* Left Column: Interactive Steps (Vertical Stepper on Desktop, Horizontal on Mobile) */}
              <div className="lg:col-span-4 relative flex flex-row lg:flex-col gap-4 lg:gap-10 overflow-x-auto lg:overflow-visible pb-6 lg:pb-0 hide-scrollbar snap-x no-scrollbar">
                {/* Vertical Line (Desktop Only) */}
                <div className="absolute left-8 top-10 bottom-10 w-[1px] bg-white/10 hidden lg:block" />

                {features.map((feature, index) => (
                  <button
                    key={feature.id}
                    onClick={() => handleStepClick(index)}
                    className={`group text-left relative z-10 flex flex-shrink-0 lg:flex-shrink w-[280px] lg:w-full items-start gap-4 lg:gap-6 transition-all duration-300 snap-center ${activeFeature === index ? 'opacity-100' : 'opacity-40 hover:opacity-100'
                      }`}
                  >
                    {/* Step Number with Progress Ring */}
                    <div className="relative flex-shrink-0 w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center">
                      <div className={`absolute inset-0 rounded-full border-2 transition-all duration-300 ${activeFeature === index ? 'border-brand/40 scale-110 shadow-[0_0_20px_rgba(255,106,0,0.3)]' : 'border-white/10'
                        }`} />

                      {activeFeature === index && (
                        <svg className="absolute inset-0 w-full h-full -rotate-90 scale-110">
                          <circle
                            cx={index >= 100 ? "24" : "32"} /* Adjust cx/cy if size changes */
                            cy={index >= 100 ? "24" : "32"}
                            r={index >= 100 ? "22" : "30"}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeDasharray="188.5"
                            strokeDashoffset={188.5 - (188.5 * progress) / 100}
                            className="text-brand transition-all duration-100 ease-linear"
                          />
                        </svg>
                      )}

                      {/* Responsive SVG fix: use consistent size or scale */}
                      {activeFeature === index && (
                        <div className="absolute inset-0 scale-[0.75] lg:scale-110 origin-center">
                          <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
                            <circle
                              cx="32"
                              cy="32"
                              r="30"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeDasharray="188.5"
                              strokeDashoffset={188.5 - (188.5 * progress) / 100}
                              className="text-brand transition-all duration-100 ease-linear"
                            />
                          </svg>
                        </div>
                      )}

                      <span className={`text-sm lg:text-lg font-bold transition-colors ${activeFeature === index ? 'text-white' : 'text-text-muted'}`}>
                        {feature.step}
                      </span>

                      {/* Subtle pulse for active step */}
                      {activeFeature === index && (
                        <div className="absolute inset-0 rounded-full bg-brand/20 animate-ping -z-10" />
                      )}
                    </div>

                    <div className="flex flex-col pt-1">
                      <h3 className={`text-lg lg:text-2xl font-black tracking-tight mb-1 lg:mb-2 transition-colors ${activeFeature === index ? 'text-white' : 'text-white/70'
                        }`}>
                        {feature.title}
                      </h3>
                      <p className="text-xs lg:text-sm text-text-muted leading-relaxed max-w-[200px] lg:max-w-xs mb-2 lg:mb-4 line-clamp-2 lg:line-clamp-none">
                        {feature.description}
                      </p>
                      <div className={`text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 lg:py-1.5 rounded-full w-fit bg-brand/10 border border-brand/20 transition-all duration-500 ${activeFeature === index ? 'text-brand opacity-100 translate-y-0' : 'text-brand/50 opacity-0 translate-y-2'
                        }`}>
                        Outcome: {feature.outcome}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Right Column: Dynamic Device Preview */}
              <div className="lg:col-span-8 min-h-[600px] flex items-center justify-center relative">
                {/* Visual Transitions Wrapper */}
                <div className="w-full h-full glass-panel rounded-[2rem] p-4 md:p-12 border border-white/10 relative overflow-hidden flex items-center justify-center bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-5">
                  {/* Background Radial Glow */}
                  <div className="absolute inset-0 bg-radial-gradient from-brand/10 to-transparent opacity-40 pointer-events-none"></div>

                  {/* VISUAL 1: INBOUND COVERAGE */}
                  <div className={`absolute transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] flex items-center justify-center ${activeFeature === 0 ? 'opacity-100 scale-100 translate-y-0 rotate-0' : 'opacity-0 scale-90 translate-y-12 rotate-[-2deg] pointer-events-none'
                    }`}>
                    <div className="relative w-80 bg-black rounded-[3rem] border-8 border-[#1A1C20] shadow-2xl p-4 overflow-hidden">
                      {/* Notch */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#1A1C20] rounded-b-2xl z-20"></div>

                      {/* Screen Content */}
                      <div className="h-[520px] flex flex-col items-center justify-between pt-16 pb-12 bg-gradient-to-b from-gray-900 to-black relative">
                        {/* Caller Info */}
                        <div className="text-center space-y-2 z-10">
                          <div className="w-24 h-24 bg-gray-800 rounded-full mx-auto flex items-center justify-center text-3xl font-bold text-gray-400 mb-6 border border-white/10 shadow-lg">
                            JD
                          </div>
                          <h4 className="text-2xl font-bold text-white tracking-tight">John Doe</h4>
                          <p className="text-brand font-bold text-sm uppercase tracking-widest animate-pulse">Incoming Call...</p>
                        </div>

                        {/* Connection Animation */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand/5 rounded-full blur-3xl animate-pulse"></div>

                        {/* Call Actions */}
                        <div className="w-full px-8 flex justify-between items-center z-10">
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10">
                              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm1 18h-2v-2h2v2zm-2-4h2v-6h-2v6zm6-8.58c-.57.6-1.35.95-2.18 1.05l-1.37.16c-1.3.15-2.58.31-3.77 1.02-1.46.88-2.68 2.59-2.68 4.35V22h2v-8c0-1.12.82-2.3 1.83-2.9 1.05-.62 2.21-.78 3.39-.92l1.36-.16c1.13-.13 2.19-.6 3.01-1.39.46-.45.71-1.07.71-1.71 0-1.33-1.07-2.42-2.3-2.5zm-5.69 8.93l-.31.31c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l.31-.31c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0z" /></svg>
                            </div>
                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Remind</span>
                          </div>
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-16 h-16 rounded-full bg-brand flex items-center justify-center shadow-[0_0_30px_rgba(255,106,0,0.5)] animate-bounce border-2 border-white/20">
                              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-2.2 2.2a15.05 15.05 0 01-6.59-6.59l2.2-2.21a.96.96 0 00.25-1.01A11.36 11.36 0 018.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 13.81 13.81 0 0013.81 13.81c.55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z" /></svg>
                            </div>
                            <span className="text-[10px] text-white font-black uppercase tracking-widest">Answer</span>
                          </div>
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10">
                              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
                            </div>
                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Message</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* VISUAL 2: AI QUALIFICATION */}
                  <div className={`absolute w-full max-w-md transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${activeFeature === 1 ? 'opacity-100 scale-100 translate-y-0 rotate-0' : 'opacity-0 scale-95 translate-y-12 rotate-[1deg] pointer-events-none'
                    }`}>
                    <div className="bg-[#0F1014] rounded-3xl border border-white/10 shadow-2xl p-8 flex flex-col gap-6 backdrop-blur-xl">
                      {/* Header */}
                      <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                        <div className="w-12 h-12 rounded-full bg-brand flex items-center justify-center text-white font-black text-lg shadow-[0_0_20px_rgba(255,106,0,0.3)]">N</div>
                        <div>
                          <div className="text-white font-bold text-base">Nova AI</div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-brand animate-pulse"></span>
                            <span className="text-brand text-xs font-bold uppercase tracking-widest">Active Call • 0:42</span>
                          </div>
                        </div>
                      </div>

                      {/* Chat Area */}
                      <div className="flex flex-col gap-5">
                        {/* Nova Message */}
                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-full bg-brand/20 flex-shrink-0 flex items-center justify-center border border-brand/20"><span className="text-brand text-xs font-black">AI</span></div>
                          <div className="bg-white/5 p-4 rounded-3xl rounded-tl-none text-sm text-gray-200 border border-white/5 max-w-[80%]">
                            Thanks for calling. Are you a new or existing patient?
                          </div>
                        </div>

                        {/* User Message */}
                        <div className="flex gap-4 flex-row-reverse">
                          <div className="w-10 h-10 rounded-full bg-gray-700 flex-shrink-0 flex items-center justify-center border border-white/10"><span className="text-white text-xs font-black">JD</span></div>
                          <div className="bg-brand p-4 rounded-3xl rounded-tr-none text-sm text-white shadow-xl max-w-[80%] font-medium">
                            I'm a new patient. I have a really bad toothache.
                          </div>
                        </div>

                        {/* Nova Thinking/Typing */}
                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-full bg-brand/20 flex-shrink-0 flex items-center justify-center border border-brand/20"><span className="text-brand text-xs font-black">AI</span></div>
                          <div className="bg-white/5 p-4 rounded-3xl rounded-tl-none text-sm text-gray-200 border border-white/5 flex items-center gap-3">
                            <span className="text-xs text-text-muted font-medium">Checking availability...</span>
                            <div className="flex gap-1.5">
                              <div className="w-1.5 h-1.5 bg-brand rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                              <div className="w-1.5 h-1.5 bg-brand rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                              <div className="w-1.5 h-1.5 bg-brand rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                          </div>
                        </div>

                        {/* Qualification Badge */}
                        <div className="self-center mt-4 px-4 py-2 bg-brand/10 border border-brand/30 rounded-full flex items-center gap-3 shadow-[0_0_20px_rgba(255,106,0,0.1)]">
                          <div className="w-2.5 h-2.5 bg-brand rounded-full animate-pulse shadow-[0_0_10px_rgba(255,106,0,1)]"></div>
                          <span className="text-brand text-xs font-black uppercase tracking-[0.15em]">Emergency Qualified</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* VISUAL 3: REAL-TIME BOOKING */}
                  <div className={`absolute w-full max-w-md transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${activeFeature === 2 ? 'opacity-100 scale-100 translate-y-0 rotate-0' : 'opacity-0 scale-105 translate-y-12 rotate-[-1deg] pointer-events-none'
                    }`}>
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden text-gray-900 border border-white/10">
                      {/* Calendar Header */}
                      <div className="bg-[#1A1C20] p-6 flex justify-between items-center text-white">
                        <span className="font-black text-lg tracking-tight">October 2023</span>
                        <div className="flex gap-2.5">
                          <div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
                          <div className="w-3 h-3 rounded-full bg-[#FEBC2E]"></div>
                          <div className="w-3 h-3 rounded-full bg-[#28C840]"></div>
                        </div>
                      </div>

                      {/* Calendar Body */}
                      <div className="p-8 bg-gray-50">
                        <div className="flex justify-between mb-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                          <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span>
                        </div>
                        <div className="space-y-4">
                          {/* Time Slot 1 */}
                          <div className="flex items-center gap-4 opacity-30">
                            <span className="text-xs font-bold text-gray-400 w-12">09:00</span>
                            <div className="flex-1 h-10 bg-gray-200 rounded-xl border border-gray-300 relative overflow-hidden">
                              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-gray-400 tracking-widest">BOOKED</div>
                            </div>
                          </div>

                          {/* Time Slot 2 (Target) */}
                          <div className="flex items-center gap-4">
                            <span className="text-xs font-black text-gray-900 w-12">10:00</span>
                            <div className="flex-1 h-14 bg-brand rounded-xl border-2 border-brand shadow-[0_10px_25px_-5px_rgba(255,106,0,0.4)] relative overflow-hidden group">
                              <div className="absolute inset-0 flex items-center justify-between px-5">
                                <span className="text-sm font-black text-white">John Doe</span>
                                <span className="bg-white/20 px-3 py-1 rounded-full text-[9px] font-black text-white uppercase tracking-wider">New Patient</span>
                              </div>
                              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                            </div>
                          </div>

                          {/* Time Slot 3 */}
                          <div className="flex items-center gap-4 opacity-30">
                            <span className="text-xs font-bold text-gray-400 w-12">11:00</span>
                            <div className="flex-1 h-10 bg-gray-200 rounded-xl border border-gray-300 relative overflow-hidden">
                              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-gray-400 tracking-widest">BOOKED</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Success Toast */}
                      <div className="bg-green-500 p-4 flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-white text-green-500 flex items-center justify-center shadow-lg">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <div>
                          <div className="text-xs font-black text-white uppercase tracking-wider">Appointment Confirmed</div>
                          <div className="text-[10px] text-white/80 font-bold">Synced with Dentrix EMR</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* 5) HOW IT WORKS */}
        <section id="how-it-works" className="py-24 bg-bg-main">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">From Ring to Booked</h2>
              <p className="text-xl text-brand">In about 60 seconds</p>
            </div>

            <div className="relative grid md:grid-cols-3 gap-8">
              {/* Connector Line (Desktop) */}
              <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-brand/50 to-transparent z-0"></div>

              {/* Step 1 */}
              <div className="relative z-10 bg-bg-card border border-white/10 rounded-2xl p-8 text-center hover:border-brand/50 transition-colors duration-300">
                <div className="w-16 h-16 mx-auto bg-brand rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-[0_0_20px_rgba(255,106,0,0.3)] mb-6">1</div>
                <h3 className="text-xl font-bold text-white mb-3">The Handoff</h3>
                <p className="text-text-muted">Patient calls. If you’re busy or closed, Nova picks up instantly. No ringing out.</p>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 bg-bg-card border border-white/10 rounded-2xl p-8 text-center hover:border-brand/50 transition-colors duration-300">
                <div className="w-16 h-16 mx-auto bg-brand rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-[0_0_20px_rgba(255,106,0,0.3)] mb-6">2</div>
                <h3 className="text-xl font-bold text-white mb-3">The AI Qualification</h3>
                <p className="text-text-muted">Nova chats naturally. It captures key details and filters the lead.</p>
              </div>

              {/* Step 3 */}
              <div className="relative z-10 bg-bg-card border border-white/10 rounded-2xl p-8 text-center hover:border-brand/50 transition-colors duration-300">
                <div className="w-16 h-16 mx-auto bg-brand rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-[0_0_20px_rgba(255,106,0,0.3)] mb-6">3</div>
                <h3 className="text-xl font-bold text-white mb-3">The Booking</h3>
                <p className="text-text-muted">Nova finds a slot in your real schedule and books it. You get a notification. Done.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 6) CASE STUDIES / TESTIMONIALS */}
        <section className="py-24 bg-[#0A0C10] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-brand/5 blur-3xl rounded-full translate-x-1/2 pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white">Results clinics care about</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { name: "DENTAL PLUS", metric: "+15 New Patients/mo", quote: "Zero Missed Calls", sub: "We used to miss 20% of calls during lunch. Nova caught 45 calls last month alone." },
                { name: "ORTHO CARE", metric: "20hrs Staff Time Saved", quote: "Front Desk Relief", sub: "My receptionists are happier and can focus on the patients in the lobby." },
                { name: "SMILE STUDIO", metric: "300% ROI", quote: "It pays for itself", sub: "Just one booked implant consultation covered the cost for the entire year." },
                { name: "ELITE DENTAL", metric: "Instant Setup", quote: "Live in 24 Hours", sub: "The setup was incredibly fast. We were booking patients the next day." }
              ].map((card, idx) => (
                <div key={idx} className="bg-white rounded-xl p-8 text-gray-900 shadow-xl hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <div className="font-bold text-gray-400 uppercase tracking-widest">{card.name}</div>
                    <span className="text-green-600 font-bold bg-green-100 px-3 py-1 rounded-full text-xs">{card.metric}</span>
                  </div>
                  <h3 className="text-4xl font-extrabold text-gray-900 mb-4">"{card.quote}"</h3>
                  <p className="text-gray-600 mb-6 italic">"{card.sub}"</p>
                  <a href="#demo" className="text-brand font-semibold hover:underline">Read full story &rarr;</a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7) PRICING */}
        <section id="pricing" className="py-24 bg-bg-main relative">
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
                  <li className="flex gap-3"><svg className="w-5 h-5 text-brand flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> <span className="text-white font-medium">Deep EMR Integration</span></li>
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
        <footer className="bg-[#050608] pt-16 pb-8 border-t border-white/5" id="demo">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-16 items-center">

              {/* Left Column */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to stop losing patients to missed calls?</h2>
                <p className="text-lg text-text-muted mb-8">
                  Join the top dental practices using Nova to cover their phones 24/7.
                  Qualify every lead, fill your calendar, and set it up in less than 24 hours.
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-brand font-bold">Nova AI Voice</span>
                </div>
                <p className="text-xs text-text-muted">&copy; 2023 Nova Voice AI. All rights reserved.</p>
              </div>

              {/* Right Column: Form */}
              <div className="bg-bg-card border border-white/10 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
                {formState === 'success' ? (
                  <div className="absolute inset-0 bg-bg-card flex flex-col items-center justify-center text-center p-8 z-20 animate-[fadeIn_0.5s_ease-out]">
                    <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">You're booked!</h3>
                    <p className="text-text-muted">Our team will be in touch shortly to schedule your demo.</p>
                  </div>
                ) : (
                  <form onSubmit={handleBookDemo} className="space-y-4 relative z-10">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-text-muted mb-1">Full Name</label>
                      <input type="text" id="name" required className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all" placeholder="Dr. John Smith" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-text-muted mb-1">Work Email</label>
                      <input type="email" id="email" required className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all" placeholder="john@clinic.com" />
                    </div>
                    <div>
                      <label htmlFor="size" className="block text-sm font-medium text-text-muted mb-1">Clinic Size (Employees)</label>
                      <select id="size" className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all appearance-none">
                        <option>1-10</option>
                        <option>11-25</option>
                        <option>26-50</option>
                        <option>51+</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      disabled={formState === 'processing'}
                      className="w-full bg-brand hover:bg-brand-hover text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all transform hover:scale-[1.02] mt-2 disabled:opacity-50 disabled:cursor-wait"
                    >
                      {formState === 'processing' ? 'Processing...' : 'Book a Demo'}
                    </button>
                  </form>
                )}
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