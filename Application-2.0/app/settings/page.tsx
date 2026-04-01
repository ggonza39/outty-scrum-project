'use client'

/* -------------------------------------------------------------------------- */
/* SECTION 1: IMPORTS & DEPENDENCIES                                          */
/* -------------------------------------------------------------------------- */
import { useState, useEffect, Suspense } from 'react'
import { supabase } from '../supabaseClient'
import { Shield, Eye, Trash2, ChevronLeft, PauseCircle, PlayCircle, AlertTriangle, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import styles from './Settings.module.css'

/* -------------------------------------------------------------------------- */
/* SECTION 2: SETTINGS CONTENT COMPONENT                                      */
/* -------------------------------------------------------------------------- */
function SettingsContent() {
  /* -------------------------------------------------------------------------- */
  /* SECTION 2.1: STATE & BACKEND LOGIC                                         */
  /* -------------------------------------------------------------------------- */
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(true)
  const [status, setStatus] = useState('active')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')

  // 2.1.1: Settings Initialization
  useEffect(() => {
    async function fetchSettings() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('profiles')
        .select('is_visible, account_status')
        .eq('id', user.id)
        .single()

      if (!error && data) {
        setIsVisible(data.is_visible)
        setStatus(data.account_status)
      }
      setLoading(false)
    }
    fetchSettings()
  }, [])

  /* -------------------------------------------------------------------------- */
  /* SECTION 2.2: ACTION HANDLERS (BACKEND LOGIC)                               */
  /* -------------------------------------------------------------------------- */
  const toggleVisibility = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from('profiles').update({ is_visible: !isVisible }).eq('id', user.id)
    if (!error) setIsVisible(!isVisible)
  }

  const handlePasswordReset = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email) return
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/settings/update-password`,
    })
    if (error) alert(error.message)
    else alert("Success! Check your email for the reset link.")
  }

  const toggleSuspension = async () => {
    const newStatus = status === 'active' ? 'suspended' : 'active'
    if (!confirm(status === 'active' ? "Suspend account?" : "Reactivate account?")) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from('profiles').update({ account_status: newStatus }).eq('id', user.id)
    if (!error) setStatus(newStatus)
  }

  const finalDeleteAction = async () => {
    if (deleteConfirmation !== 'DELETE') return
    try {
      const { error } = await supabase.rpc('delete_user')
      if (error) throw error
      await supabase.auth.signOut()
      window.location.href = '/'
    } catch (err: any) {
      alert("Error: " + err.message)
    }
  }

  /* -------------------------------------------------------------------------- */
  /* SECTION 2.3: LOADING STATE (FRONTEND)                                      */
  /* -------------------------------------------------------------------------- */
  if (loading) return (
    <div className="flex flex-1 items-center justify-center min-h-screen">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  /* -------------------------------------------------------------------------- */
  /* SECTION 3: RENDER SETTINGS UI (FRONTEND)                                   */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="max-w-2xl w-full relative z-20 pt-40 pb-24 px-6">

        {/* 3.1: PAGE HEADER SECTION */}
        <header className="flex items-center gap-6 mb-12">
          {/* NAVIGATION BUTTON */}
          <button
            onClick={() => router.back()}
            className="group p-4 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 shadow-xl shadow-black/20"
          >
            <ChevronLeft size={24} className="text-white group-hover:-translate-x-1 transition-transform" />
          </button>

          <div>
            <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase leading-none text-white drop-shadow-2xl">Settings</h1>
            <p className="text-emerald-400 text-xs font-black uppercase tracking-[0.25em] mt-3 drop-shadow-sm">Control your presence on Outty</p>
          </div>
        </header>

        {/* 3.2: MAIN SETTINGS SHELL */}
        <div className={styles.glassCard}>

          {/* 3.2.1: PRIVACY & VISIBILITY SECTION */}
          <section className="space-y-8 mb-14">
            <div className="flex items-center gap-4 px-2">
              <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/20">
                <Eye className="text-emerald-400" size={20} />
              </div>
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-emerald-100/60">Privacy & Visibility</h2>
            </div>

            {/* TOGGLE BUTTON: Discovery Mode */}
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 flex justify-between items-center group hover:bg-white/10 transition-all duration-500">
              <div className="max-w-[75%]">
                <p className="font-black text-xl uppercase tracking-tight text-white">Discovery Mode</p>
                <p className="text-sm text-white/50 font-bold leading-relaxed mt-2">
                  {isVisible ? "Your profile is active in local adventure feeds." : "Ghost Mode: You are hidden from search results."}
                </p>
              </div>
              <button
                onClick={toggleVisibility}
                className={`w-16 h-8 rounded-full relative transition-all duration-500 ${isVisible ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]' : 'bg-white/10 border border-white/10'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-500 ${isVisible ? 'left-9' : 'left-1'}`} />
              </button>
            </div>
          </section>

          {/* 3.2.2: SECURITY ACCESS SECTION */}
          <section className="space-y-8 mb-14">
            <div className="flex items-center gap-4 px-2">
              <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/20">
                <Shield className="text-emerald-400" size={20} />
              </div>
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-emerald-100/60">Security Access</h2>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden divide-y divide-white/5">
              {/* BUTTON: Password Reset */}
              <button onClick={handlePasswordReset} className="w-full flex justify-between items-center py-7 px-8 hover:bg-emerald-500/10 transition-all group">
                <span className="font-black text-sm uppercase tracking-widest text-white/80 group-hover:text-emerald-400 transition-colors">Reset Password</span>
                <ChevronLeft size={20} className="rotate-180 text-white/20" />
              </button>
              {/* DISABLED BUTTON: 2FA */}
              <button className="w-full flex justify-between items-center py-7 px-8 opacity-30 cursor-not-allowed">
                <span className="font-black text-sm uppercase tracking-widest text-white/60">Two-Factor Auth</span>
                <span className="text-[10px] bg-white/10 px-3 py-1.5 rounded-lg text-white/40 font-black uppercase">Soon</span>
              </button>
            </div>
          </section>

          {/* 3.2.3: DANGER ZONE ACTIONS (BUTTONS) */}
          <section className="pt-8 space-y-5">
            {/* BUTTON: Toggle Suspension */}
            <button onClick={toggleSuspension} className={`flex items-center justify-center gap-4 w-full py-6 border rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] transition-all duration-300 ${status === 'active' ? 'bg-white/5 border-white/10 hover:bg-emerald-500/10 text-white/70' : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'}`}>
              {status === 'active' ? <><PauseCircle size={22} /> Suspend Account</> : <><PlayCircle size={22} /> Reactivate Account</>}
            </button>

            {/* BUTTON: Permanent Delete */}
            <button onClick={() => setShowDeleteModal(true)} className="flex items-center justify-center gap-4 w-full py-6 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-500 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] transition-all duration-300 backdrop-blur-md">
              <Trash2 size={22} /> Delete Permanently
            </button>
          </section>
        </div>

        {/* 3.3: DELETE MODAL OVERLAY (TEXT FIELDS & BUTTONS) */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <div className="bg-emerald-950/40 border border-white/10 backdrop-blur-[60px] w-full max-w-lg rounded-[3rem] p-12 shadow-2xl animate-in fade-in zoom-in duration-300">
              <div className="flex justify-between items-start mb-10">
                <div className="bg-red-500/20 p-5 rounded-2xl text-red-500 border border-red-500/20">
                  <AlertTriangle size={32} />
                </div>
                <button onClick={() => {setShowDeleteModal(false); setDeleteConfirmation('');}} className="p-3 hover:bg-white/10 rounded-full text-white/30">
                  <X size={24} />
                </button>
              </div>

              <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 text-white">Irreversible Action</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-10 font-bold">Purge all data from the Outty grid. This cannot be undone.</p>

              <div className="space-y-8">
                {/* TEXT FIELD: Delete Confirmation */}
                <input type="text" value={deleteConfirmation} onChange={(e) => setDeleteConfirmation(e.target.value)} placeholder="Type 'DELETE'" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-lg font-black tracking-[0.4em] text-center focus:outline-none focus:border-red-500/40 transition-all uppercase text-white placeholder:text-white/10" />

                {/* BUTTON: Finalize Deletion */}
                <button disabled={deleteConfirmation !== 'DELETE'} onClick={finalDeleteAction} className={`w-full py-6 rounded-2xl font-black uppercase text-xs tracking-[0.3em] transition-all ${deleteConfirmation === 'DELETE' ? 'bg-red-600 text-white' : 'bg-white/5 text-white/10 cursor-not-allowed'}`}>Finalize Deletion</button>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* SECTION 4: MAIN PAGE WRAPPER & BACKGROUND LAYERS                           */
/* -------------------------------------------------------------------------- */
export default function ManageAccount() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <main className={`${styles.mainWrapper} flex flex-col min-h-screen`}>

      {/* 4.1: BACKGROUND VISUALS */}
      <div className={styles.fixedBg}></div>
      <div className={styles.gradientOverlay}></div>

      {/* 4.2: PARTICLE EFFECT LAYER */}
      <div className="fixed inset-0 pointer-events-none z-[5]">
        <div className="absolute top-0 left-1/4 w-[50%] h-[50%] bg-emerald-500/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[50%] h-[50%] bg-emerald-900/40 rounded-full blur-[120px]"></div>
        {mounted && [...Array(15)].map((_, i) => (
          <div key={i} className="absolute bg-emerald-400 rounded-full animate-pulse opacity-20"
               style={{ width: '2px', height: '2px', left: Math.random() * 100 + '%', top: Math.random() * 100 + '%', animationDelay: Math.random() * 5 + 's' }}>
          </div>
        ))}
      </div>

      {/* 4.3: CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col items-center w-full">
        <Suspense fallback={null}>
          <SettingsContent />
        </Suspense>
      </div>
    </main>
  )
}