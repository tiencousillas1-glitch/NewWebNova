import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isYearly, setIsYearly] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formState, setFormState] = useState<'idle' | 'processing' | 'success'>('idle');

  const features = [
    {
      id: 'inbound',
      step: '01',
      title: 'Instant Answer',
      description: 'Nova picks up immediately, 24/7. No voicemail, no hold times.',
    },
    {
      id: 'qualification',
      step: '02',
      title: 'Smart Triage',
      description: 'AI filters emergencies and collects insurance details instantly.',
    },
    {
      id: 'booking',
      step: '03',
      title: 'Real-time Booking',
      description: 'Direct sync with Dentrix/Eaglesoft to fill open slots automatically.',
    }
  ];

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
                <div className="flex items-center gap-2 font-bold text-xl text-white"><svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg> APEX DENTAL</div>
                <div className="flex items-center gap-2 font-bold text-xl text-white"><svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg> SMILE ORTHO</div>
                <div className="flex items-center gap-2 font-bold text-xl text-white"><svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg> BRIGHT CLINIC</div>
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

            <div className="grid lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Interactive Steps */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                {features.map((feature, index) => (
                  <button
                    key={feature.id}
                    onClick={() => setActiveFeature(index)}
                    className={`group text-left p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                      activeFeature === index 
                        ? 'bg-[#1A1C20] border-brand shadow-[0_0_30px_rgba(255,106,0,0.15)]' 
                        : 'bg-bg-card border-white/5 hover:bg-white/5'
                    }`}
                  >
                    <div className="relative z-10">
                      <div className={`text-xs font-bold tracking-widest uppercase mb-2 ${
                        activeFeature === index ? 'text-brand' : 'text-text-muted group-hover:text-white'
                      }`}>
                        Step {feature.step}
                      </div>
                      <h3 className={`text-xl font-bold mb-2 ${
                        activeFeature === index ? 'text-white' : 'text-white/70 group-hover:text-white'
                      }`}>
                        {feature.title}
                      </h3>
                      <p className={`text-sm leading-relaxed ${
                        activeFeature === index ? 'text-text-muted' : 'text-text-muted/60'
                      }`}>
                        {feature.description}
                      </p>
                    </div>
                    {/* Active Indicator Bar */}
                    {activeFeature === index && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand" />
                    )}
                  </button>
                ))}
              </div>

              {/* Right Column: Dynamic Device Preview */}
              <div className="lg:col-span-8 min-h-[500px]">
                <div className="h-full glass-panel rounded-3xl p-8 border border-white/10 relative overflow-hidden flex items-center justify-center bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-5">
                  {/* Background Radial Glow */}
                  <div className="absolute inset-0 bg-radial-gradient from-brand/5 to-transparent opacity-50 pointer-events-none"></div>

                  {/* VISUAL 1: INBOUND COVERAGE */}
                  {activeFeature === 0 && (
                    <div className="relative w-80 bg-black rounded-[2.5rem] border-4 border-[#1A1C20] shadow-2xl p-4 overflow-hidden animate-[fadeIn_0.5s_ease-out]">
                      {/* Notch */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1A1C20] rounded-b-xl z-20"></div>
                      
                      {/* Screen Content */}
                      <div className="h-[500px] flex flex-col items-center justify-between pt-16 pb-12 bg-gradient-to-b from-gray-900 to-black relative">
                        {/* Caller Info */}
                        <div className="text-center space-y-2 z-10">
                          <div className="w-20 h-20 bg-gray-800 rounded-full mx-auto flex items-center justify-center text-2xl font-bold text-gray-500 mb-4 border border-white/10">
                            JD
                          </div>
                          <h4 className="text-2xl font-bold text-white">John Doe</h4>
                          <p className="text-brand font-medium animate-pulse">Incoming Call...</p>
                        </div>

                        {/* Connection Animation */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand/5 rounded-full blur-3xl animate-pulse"></div>
                        
                        {/* Call Actions */}
                        <div className="w-full px-6 flex justify-between items-center z-10">
                          <div className="flex flex-col items-center gap-2">
                             <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                               <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm1 18h-2v-2h2v2zm-2-4h2v-6h-2v6zm6-8.58c-.57.6-1.35.95-2.18 1.05l-1.37.16c-1.3.15-2.58.31-3.77 1.02-1.46.88-2.68 2.59-2.68 4.35V22h2v-8c0-1.12.82-2.3 1.83-2.9 1.05-.62 2.21-.78 3.39-.92l1.36-.16c1.13-.13 2.19-.6 3.01-1.39.46-.45.71-1.07.71-1.71 0-1.33-1.07-2.42-2.3-2.5zm-5.69 8.93l-.31.31c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l.31-.31c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0z"/></svg>
                             </div>
                             <span className="text-xs text-text-muted">Remind</span>
                          </div>
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-16 h-16 rounded-full bg-brand flex items-center justify-center shadow-[0_0_20px_rgba(255,106,0,0.4)] animate-bounce">
                              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-2.2 2.2a15.05 15.05 0 01-6.59-6.59l2.2-2.21a.96.96 0 00.25-1.01A11.36 11.36 0 018.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 13.81 13.81 0 0013.81 13.81c.55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"/></svg>
                            </div>
                            <span className="text-xs text-white font-bold">Answer</span>
                          </div>
                          <div className="flex flex-col items-center gap-2">
                             <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                               <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                             </div>
                             <span className="text-xs text-text-muted">Message</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* VISUAL 2: AI QUALIFICATION */}
                  {activeFeature === 1 && (
                    <div className="w-full max-w-md bg-[#0F1014] rounded-2xl border border-white/10 shadow-2xl p-6 flex flex-col gap-4 animate-[fadeIn_0.5s_ease-out]">
                      {/* Header */}
                      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                        <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white font-bold text-sm shadow-lg">N</div>
                        <div>
                          <div className="text-white font-bold text-sm">Nova AI</div>
                          <div className="text-brand text-xs">Active Call • 0:42</div>
                        </div>
                      </div>

                      {/* Chat Area */}
                      <div className="flex flex-col gap-4">
                        {/* Nova Message */}
                        <div className="flex gap-3">
                           <div className="w-8 h-8 rounded-full bg-brand/20 flex-shrink-0 flex items-center justify-center"><span className="text-brand text-xs font-bold">AI</span></div>
                           <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none text-sm text-gray-200">
                             Thanks for calling. Are you a new or existing patient?
                           </div>
                        </div>
                        
                        {/* User Message */}
                        <div className="flex gap-3 flex-row-reverse">
                           <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0 flex items-center justify-center"><span className="text-white text-xs font-bold">JD</span></div>
                           <div className="bg-brand p-3 rounded-2xl rounded-tr-none text-sm text-white shadow-lg">
                             I'm a new patient. I have a really bad toothache.
                           </div>
                        </div>

                        {/* Nova Thinking/Typing */}
                        <div className="flex gap-3">
                           <div className="w-8 h-8 rounded-full bg-brand/20 flex-shrink-0 flex items-center justify-center"><span className="text-brand text-xs font-bold">AI</span></div>
                           <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none text-sm text-gray-200 flex items-center gap-2">
                             <span className="text-xs text-text-muted">Checking availability...</span>
                             <div className="flex gap-1">
                               <div className="w-1 h-1 bg-brand rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                               <div className="w-1 h-1 bg-brand rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                               <div className="w-1 h-1 bg-brand rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                             </div>
                           </div>
                        </div>

                         {/* Qualification Badge */}
                         <div className="self-center mt-2 px-3 py-1 bg-brand/10 border border-brand/30 rounded-full flex items-center gap-2">
                            <div className="w-2 h-2 bg-brand rounded-full animate-pulse"></div>
                            <span className="text-brand text-xs font-bold uppercase tracking-wider">Emergency Qualifed</span>
                         </div>
                      </div>
                    </div>
                  )}

                  {/* VISUAL 3: REAL-TIME BOOKING */}
                  {activeFeature === 2 && (
                    <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl overflow-hidden animate-[fadeIn_0.5s_ease-out] text-gray-900">
                      {/* Calendar Header */}
                      <div className="bg-[#1A1C20] p-4 flex justify-between items-center text-white">
                        <span className="font-bold">October 2023</span>
                        <div className="flex gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        </div>
                      </div>

                      {/* Calendar Body */}
                      <div className="p-4 bg-gray-50">
                        <div className="flex justify-between mb-4 text-xs font-bold text-gray-400 uppercase tracking-wide">
                          <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span>
                        </div>
                        <div className="space-y-3">
                           {/* Time Slot 1 */}
                           <div className="flex items-center gap-3 opacity-50">
                              <span className="text-xs font-bold text-gray-400 w-10">09:00</span>
                              <div className="flex-1 h-8 bg-gray-200 rounded border border-gray-300 relative overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-400">BOOKED</div>
                              </div>
                           </div>
                           
                           {/* Time Slot 2 (Target) */}
                           <div className="flex items-center gap-3">
                              <span className="text-xs font-bold text-gray-900 w-10">10:00</span>
                              <div className="flex-1 h-10 bg-brand rounded border border-brand shadow-lg relative overflow-hidden group">
                                <div className="absolute inset-0 flex items-center justify-between px-3">
                                  <span className="text-xs font-bold text-white">John Doe</span>
                                  <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase">New Patient</span>
                                </div>
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                              </div>
                           </div>

                           {/* Time Slot 3 */}
                           <div className="flex items-center gap-3 opacity-50">
                              <span className="text-xs font-bold text-gray-400 w-10">11:00</span>
                              <div className="flex-1 h-8 bg-gray-200 rounded border border-gray-300 relative overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-400">BOOKED</div>
                              </div>
                           </div>
                        </div>
                      </div>

                      {/* Success Toast */}
                      <div className="bg-green-50 border-t border-green-100 p-3 flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <div>
                           <div className="text-xs font-bold text-green-800">Appointment Confirmed</div>
                           <div className="text-[10px] text-green-600">Synced with Dentrix</div>
                        </div>
                      </div>
                    </div>
                  )}

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