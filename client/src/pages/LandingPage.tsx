import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Heart } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-stone-900 selection:bg-teal-200">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-[#FDFBF7]/90 backdrop-blur-md z-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-700 flex items-center justify-center text-white font-serif italic text-xl">S</div>
            <span className="font-bold text-xl tracking-tight text-stone-900">Smriti Care</span>
          </div>
          <div className="flex items-center gap-6 font-medium text-sm">
            <a href="#work" className="hidden sm:block hover:text-teal-700 transition-colors">Our Work</a>
            <a href="#impact" className="hidden sm:block hover:text-teal-700 transition-colors">Impact</a>
            <Link to="/login" className="px-5 py-2.5 rounded-full bg-stone-900 text-white hover:bg-teal-700 transition-colors">
              Access Portal
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.1] mb-8 text-stone-900">
              We believe in the power of <span className="text-teal-700 italic font-serif">presence</span> — no complex interfaces, no forgotten days. Just real connection for elderly minds across the North East.
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 mt-12">
              <Link to="/login" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold bg-teal-700 text-white rounded-full hover:bg-teal-800 transition-colors">
                Explore Our Work
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <a href="#demo" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold bg-transparent border-2 border-stone-300 text-stone-900 rounded-full hover:border-stone-900 transition-colors">
                Try the Demo
              </a>
            </div>
          </div>
          <div className="lg:w-1/2 w-full">
            <img 
              src="/images/hero.jpg" 
              alt="Elderly care" 
              className="w-full h-auto rounded-3xl shadow-2xl object-cover object-center aspect-[4/3]"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-stone-100">
            {[
              { label: 'Families Reached', value: '450+' },
              { label: 'Memories Preserved', value: '12,000+' },
              { label: 'Languages Supported', value: '6' },
              { label: 'Communities Served', value: '24' },
            ].map((stat, i) => (
              <div key={i} className="text-center sm:text-left sm:pl-8 first:pl-0 first:border-0">
                <div className="text-4xl sm:text-5xl font-bold text-stone-900 mb-2">{stat.value}</div>
                <div className="text-sm font-bold text-stone-500 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center" id="work">
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-8 tracking-tight">We show up for those everyone else overlooks.</h2>
        <p className="text-xl sm:text-2xl text-stone-600 leading-relaxed font-medium">
          Smriti Care was born from a simple belief: that every elderly person deserves to age with dignity, routine, and joy. Not just the ones in urban centers. Every. Single. One.
        </p>
      </section>

      {/* Programs (Pillars) */}
      <section className="py-24 bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { img: '/images/engage.jpg', title: 'Engage', desc: 'Culturally familiar cognitive activities that keep the mind sharp without frustration.' },
              { img: '/images/empower.jpg', title: 'Empower', desc: 'Giving families the tools to care, track, and understand their loved ones better.' },
              { img: '/images/connect.jpg', title: 'Connect', desc: 'Bridging the gap between rural patients and specialized urban neurologists.' },
              { img: '/images/sustain.jpg', title: 'Sustain', desc: 'Offline-first routines and reminders that build long-term, independent habits.' },
            ].map((pillar, i) => (
              <div key={i} className="space-y-6">
                <div className="aspect-square w-full rounded-2xl overflow-hidden">
                  <img src={pillar.img} alt={pillar.title} className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-2xl font-bold">{pillar.title}</h3>
                <p className="text-stone-400 text-lg leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Campaign */}
      <section className="py-32 bg-teal-50 border-b border-teal-100 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
            <img 
              src="/images/campaign.jpg" 
              alt="Elderly Dignity" 
              className="w-full rounded-3xl shadow-xl aspect-[3/4] object-cover"
            />
          </div>
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-4xl sm:text-5xl font-bold text-teal-900 mb-8 leading-tight">
              "Memory loss shouldn't mean the loss of dignity."
            </h2>
            <p className="text-xl text-teal-700 font-medium mb-10 max-w-2xl">
              In remote areas, families often face cognitive decline alone. Smriti Care brings daily structure, cognitive support, and clinical monitoring directly to their hands—completely offline.
            </p>
            <Link to="/login" className="inline-flex items-center justify-center font-bold text-teal-700 hover:text-teal-900 text-lg underline underline-offset-8">
              Read The Campaign <ChevronRight className="ml-1 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Visual Gallery */}
      <section className="py-24 bg-white px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-stone-900 mb-12 text-center tracking-tight">From the field.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
             <img src="/images/gallery1.jpg" alt="Community Outreach" className="w-full h-80 object-cover rounded-2xl shadow-sm mb-4"/>
             <p className="text-stone-500 font-medium">Community outreach · Tea Gardens of Assam</p>
          </div>
          <div>
             <img src="/images/gallery2.jpg" alt="Preserving Memories" className="w-full h-80 object-cover rounded-2xl shadow-sm mb-4"/>
             <p className="text-stone-500 font-medium">Preserving personal histories · Offline Memory Book</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-stone-50 px-4 sm:px-6 lg:px-8 border-y border-stone-200" id="impact">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-stone-900 mb-16 tracking-tight text-center">They said it was too complex. <br/> <span className="text-teal-700 font-serif italic">We proved them wrong.</span></h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { img: '/images/priya.jpg', quote: "Smriti Care gave me the confidence to leave my mother at home while I work. The voice reminders in Assamese mean she never misses her medicine.", author: "Priya S.", role: "Caregiver, Guwahati" },
              { img: '/images/doctor.jpg', quote: "I can review patient progress from 200 kilometers away. The offline sync ensures I get the data whenever they enter a connectivity zone.", author: "Dr. Ananya Das", role: "Neurologist, Shillong" },
              { img: '/images/hero.jpg', quote: "The Bihu and Tea Garden memory games make him smile. He recognizes the images, and it keeps his mind active every morning.", author: "Remi S.", role: "Son, Aizawl" },
            ].map((t, i) => (
              <div key={i} className="space-y-6">
                <p className="text-xl text-stone-600 font-medium leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-4 pt-4">
                  <img src={t.img} alt={t.author} className="w-12 h-12 rounded-full object-cover shadow-sm"/>
                  <div>
                    <div className="font-bold text-stone-900">{t.author}</div>
                    <div className="text-stone-500 text-sm">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Links (retained for functionality) */}
      <section className="py-24 bg-white" id="demo">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-10">Access the Platform</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {['Patient', 'Caregiver', 'Doctor', 'Admin'].map(role => (
              <div key={role} className="bg-stone-50 p-6 rounded-2xl shadow-sm text-left border border-stone-200">
                <div className="font-bold text-lg mb-2">{role}</div>
                <div className="text-xs text-stone-500 space-y-1 font-mono">
                  <div>{role.toLowerCase()}@demo.smriticare.in</div>
                  <div>Demo@1234</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-32 bg-stone-900 text-center px-4">
        <h2 className="text-4xl sm:text-6xl font-extrabold text-white mb-10 tracking-tight">The world needs people<br/>who show up.</h2>
        <Link to="/login" className="inline-flex items-center justify-center px-10 py-5 text-xl font-bold bg-white text-stone-900 rounded-full hover:bg-teal-50 transition-colors">
          Access Smriti Care
        </Link>
      </section>
      
      <footer className="bg-black text-stone-500 py-8 text-center text-sm">
        <p>Smriti Care Foundation. Designed for the North Eastern Region.</p>
        <p className="mt-2 flex items-center justify-center gap-1"><Heart size={14} className="text-rose-500"/> Not a medical diagnostic tool.</p>
      </footer>
    </div>
  );
}
