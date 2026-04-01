'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import Link from 'next/link'
import styles from './About.module.css'
import {
  UserPlus, Compass, Zap, Shield, CheckCircle,
  AlertTriangle, ArrowRight, MapPin, Home, Leaf
} from 'lucide-react'

export default function HowItWorks() {
  /* -------------------------------------------------------------------------- */
  /* SECTION 1: BACKEND & STATE LOGIC (Backend Connection)                      */
  /* -------------------------------------------------------------------------- */
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    }
    checkUser();
  }, []);

  /* -------------------------------------------------------------------------- */
  /* SECTION 2: DATA CONFIGURATION (Frontend Logic)                             */
  /* -------------------------------------------------------------------------- */
  const protocolSteps = [
    { title: "Deploy Profile", desc: "Sign up and build your 'Adventure ID'. Beyond just a bio, we log your gear, certifications, and past trail experience.", icon: <UserPlus size={24} />, tag: "STEP 01" },
    { title: "Filter The Grid", desc: "Narrow explorers by real-time distance and shared skill levels. No more matching with people 100 miles away.", icon: <MapPin size={24} />, tag: "STEP 02" },
    { title: "Find Commonalities", desc: "Our engine highlights activities in common—whether it's bouldering, backcountry skiing, or kayaking.", icon: <Compass size={24} />, tag: "STEP 03" },
    { title: "Sync & Strike", desc: "When you're both online, use our real-time instant messaging to finalize the plan. High-speed coordination.", icon: <Zap size={24} />, tag: "STEP 04" }
  ];

  const safetyFeatures = [
    { title: "Encrypted Comms", desc: "Keep your personal digits private. Coordinate safely within our secure internal grid until trust is built.", icon: <Shield size={22} /> },
    { title: "Vouch System", desc: "Build your reputation. After the exit, partners vouch for your skills and reliability on the trail.", icon: <CheckCircle size={22} /> },
    { title: "Emergency Beacon", desc: "Safety first. Integrated check-ins notify your base contacts of your coordinates and return window.", icon: <AlertTriangle size={22} /> }
  ];

  /* -------------------------------------------------------------------------- */
  /* SECTION 3: PAGE CONTENT (Frontend UI)                                      */
  /* -------------------------------------------------------------------------- */
  return (
    <main className={styles.mainWrapper}>
      {/* 3.1 Background Layers */}
      <div className={styles.fixedBg}></div>
      <div className={styles.gradientOverlay}></div>

      <div className="z-10 max-w-7xl w-full px-6 pt-32"> {/* Added pt-32 to clear the Global Nav */}

            {/* 3.2 Navigation Header (GUEST ONLY) */}
            {/* Logic: Only show these local buttons if the user is NOT logged in */}
            {!user && !loading && (
              <div className="flex justify-between items-center mb-24">
                 <div className="flex gap-4">
                   <Link href="/" className={styles.navHomeBtn}>
                     <Home size={16}/> Home
                   </Link>
                 </div>
              </div>
            )}

        {/* 3.3 Mission Section */}
        <section className="mb-32 grid lg:grid-cols-2 gap-16 items-end border-b border-white/20 pb-24">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Leaf size={24} className="text-emerald-400" />
              <span className={styles.labelText}>The Mission</span>
            </div>
            <h2 className={`${styles.headingText} text-6xl md:text-8xl leading-[0.85]`}>
              Redefining <br/><span className="text-emerald-500">The Solo Exit.</span>
            </h2>
          </div>
          <div className="flex flex-col gap-8 pb-2">
            <p className={styles.bodyText}>
              Outty was founded in 2026 to bridge the gap between digital connection and physical exploration. We believe the wilderness is best experienced with those who share your intensity and respect for the trail.
            </p>
            <p className={styles.bodyText}>
              Our platform is a specialized coordinate system designed to foster high-trust partnerships for high-stakes adventures.
            </p>
          </div>
        </section>

        {/* 3.4 The Protocol Grid */}
        <div className="text-center mb-20">
          <h1 className={`${styles.headingText} text-7xl md:text-9xl opacity-100`}>The Protocol</h1>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-32">
          {protocolSteps.map((step, idx) => (
            <div key={idx} className={`${styles.protocolCard} group`}>
              <span className="text-emerald-400 font-black text-xs tracking-[0.3em] mb-8 group-hover:text-emerald-300 transition-colors">{step.tag}</span>
              <div className="w-14 h-14 bg-emerald-500 text-[#022c22] rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                {step.icon}
              </div>
              <h3 className={`${styles.headingText} text-2xl mb-4 tracking-tight`}>{step.title}</h3>
              <p className="text-base leading-relaxed text-white font-medium opacity-90">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* 3.5 Safety Section */}
        <section className={styles.safetySection}>
          <div className="grid lg:grid-cols-3 gap-16">
            <div className="lg:col-span-1">
              <h2 className={`${styles.headingText} text-5xl mb-6 leading-none`}>The <span className="text-emerald-500 font-black">Safe</span> Exit</h2>
              <p className={styles.bodyText}>Verified explorers. Encrypted coordinates. Real-time safety nets.</p>
            </div>
            <div className="lg:col-span-2 flex flex-col gap-6">
              {safetyFeatures.map((f, i) => (
                <div key={i} className={`${styles.safetyRow} group`}>
                  <div className="p-4 bg-emerald-500/20 text-emerald-400 rounded-xl group-hover:bg-emerald-500 group-hover:text-[#022c22] transition-all">
                    {f.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest mb-2 text-white"> {f.title}</h4>
                    <p className="text-white/80 text-base leading-snug font-medium">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3.6 Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 py-20 border-t border-white/20 text-center mb-24">
          {[
            { label: "Active Explorers", val: "12.4K+" },
            { label: "Trails Logged", val: "850+" },
            { label: "Safe Returns", val: "100%" },
            { label: "Matches", val: "4.2K" }
          ].map((s, i) => (
            <div key={i}>
              <p className={`${styles.headingText} text-5xl md:text-6xl mb-2`}>{s.val}</p>
              <p className="text-emerald-400 font-black uppercase tracking-[0.2em] text-xs drop-shadow-sm">{s.label}</p>
            </div>
          ))}
        </div>

        {/* 3.7 Call to Action */}
        <div className="text-center pb-20">
          {!loading && !user && (
            <Link href="/login" className={styles.ctaButton}>
              Start Protocol <ArrowRight size={24}/>
            </Link>
          )}
          {user && (
            <p className="text-emerald-400 font-black uppercase tracking-[0.4em] text-sm md:text-base animate-pulse drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">
              Protocol Active • Ready for Ascent
            </p>
          )}
        </div>
      </div>

    </main>
  )
}