"use client";

/* -------------------------------------------------------------------------- */
/* SECTION 1: IMPORTS                                                         */
/* -------------------------------------------------------------------------- */
import { useState, useEffect, useRef } from "react";
import { supabase } from "../supabaseClient";
import { useRouter, useSearchParams } from "next/navigation";
import zipData from "us-zips";
import styles from "./onboarding.module.css";

export default function OnboardingClient() {
  /* -------------------------------------------------------------------------- */
  /* SECTION 2: STATE MANAGEMENT                                                */
  /* -------------------------------------------------------------------------- */
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- NAVIGATION STATE ---
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  const searchParams = useSearchParams();
  const [showCancelModal, setShowCancelModal] = useState(false);

  // This flag determines the text on buttons/modals
  const isEditMode = searchParams.get("mode") === "edit";

  // --- STEP 1: THE BASICS ---
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Female");
  const [bio, setBio] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [skillLevels, setSkillLevels] = useState<string[]>([]);

  // Validation States
  const [usernameError, setUsernameError] = useState("");
  const [usernameSuccess, setUsernameSuccess] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);

  // --- STEP 2: ADVENTURES ---
  const [selectedAdventures, setSelectedAdventures] = useState<string[]>([]);
  const adventureOptions = [
    "Backpacking",
    "Hiking",
    "Camping",
    "Kayaking",
    "Rock Climbing",
    "Mountain Biking",
    "Skiing",
    "Fishing",
    "Photography",
    "Road Trips",
    "Stargazing",
  ];

  // --- STEP 3: MATCHING PREFS ---
  const [genderPrefs, setGenderPrefs] = useState<string[]>([]);
  const [mileRange, setMileRange] = useState(25);
  const [skillPref, setSkillPref] = useState<string[]>([]);

  // --- STEP 4 & 5: MEDIA & SOCIALS ---
  const [photos, setPhotos] = useState<string[]>([]);
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [facebook, setFacebook] = useState("");
  const [linkedin, setLinkedin] = useState("");

  /* -------------------------------------------------------------------------- */
  /* SECTION 3: LOGIC HELPERS                                                   */
  /* -------------------------------------------------------------------------- */
  const toggleSelection = (
    list: string[],
    setList: (val: string[]) => void,
    item: string,
  ) => {
    if (list.includes(item)) setList(list.filter((i) => i !== item));
    else setList([...list, item]);
  };

  const makePrimary = (index: number) => {
    if (index === 0) return;
    const newPhotos = [...photos];
    const [selectedPhoto] = newPhotos.splice(index, 1);
    newPhotos.unshift(selectedPhoto);
    setPhotos(newPhotos);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return (
          firstName &&
          lastName &&
          usernameSuccess &&
          age &&
          zipCode.length === 5 &&
          bio &&
          skillLevels.length > 0
        );
      case 2:
        return selectedAdventures.length >= 1;
      case 3:
        return genderPrefs.length > 0 && skillPref.length > 0;
      case 4:
        return photos.length >= 1;
      default:
        return true;
    }
  };

  /* -------------------------------------------------------------------------- */
  /* SECTION 4: EFFECTS & HANDLERS                                              */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    // 1. Define the flag at the top of the effect
    let isMounted = true;

    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // 2. Wrap everything in a check for the flag
      if (!isMounted) return;

      if (!user) {
        router.push("/login");
        return;
      }

      setUserEmail(user.email ?? "User");

      // If in edit mode, fetch their existing profile data
      if (isEditMode) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profile && isMounted) {
          // 3. Check flag before setting state
          setFirstName(profile.first_name || "");
          setLastName(profile.last_name || "");
          setUsername(profile.username || "");
          setAge(profile.age?.toString() || "");
          setBio(profile.bio || "");
          setZipCode(profile.zip_code || "");
          setGender(profile.gender || "Female");
          setSkillLevels(profile.skill_level || []);
          setSelectedAdventures(profile.adventure_type || []);
          setGenderPrefs(profile.gender_preference || []);
          setSkillPref(profile.skill_preference || []);
          setMileRange(profile.mile_range || 25);
          setPhotos(profile.profile_pictures || []);
          setInstagram(profile.instagram || "");
          setTiktok(profile.tiktok || "");
          setFacebook(profile.facebook || "");
          setLinkedin(profile.linkedin || "");
          setUsernameSuccess(true);
        }
      }
      if (isMounted) setLoading(false);
    }

    checkUser();

    // 4. Return the cleanup function to toggle the flag
    return () => {
      isMounted = false;
    };
  }, [router, isEditMode]);

  useEffect(() => {
    if (zipCode.length === 5) {
      const coords = (zipData as any)[zipCode];
      if (coords) {
        fetch(`https://api.zippopotam.us/us/${zipCode}`)
          .then((res) => res.json())
          .then((data) => {
            setCity(data.places[0]["place name"]);
            setState(data.places[0]["state abbreviation"]);
          });
      }
    }
  }, [zipCode]);

  const checkUsername = async (val: string) => {
    if (!val) return;
    setCheckingUsername(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data } = await supabase
      .from("profiles")
      .select("username, id")
      .eq("username", val)
      .maybeSingle();
    if (!data || data.id === user?.id) {
      setUsernameSuccess(true);
      setUsernameError("");
    } else {
      setUsernameSuccess(false);
      setUsernameError("Taken");
    }
    setCheckingUsername(false);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // Convert FileList to Array and map each file to an upload promise
      const uploadPromises = Array.from(files).map(async (file) => {
        // Check limit before starting each individual upload
        if (photos.length >= 6) return null;

        const fileExt = file.name.split(".").pop();
        const fileName = `${user.id}/${Math.random()}.${fileExt}`;

        const { error } = await supabase.storage
          .from("avatars")
          .upload(fileName, file);

        if (!error) {
          const {
            data: { publicUrl },
          } = supabase.storage.from("avatars").getPublicUrl(fileName);
          return publicUrl;
        }
        console.error("Upload error:", error);
        return null;
      });

      const results = await Promise.all(uploadPromises);
      const newUrls = results.filter((url): url is string => url !== null);

      // Merge new photos with existing ones, capping at 6 total
      setPhotos((prev) => [...prev, ...newUrls].slice(0, 6));
    }
    setLoading(false);

    // Reset input value so the same file can be uploaded again if deleted
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const coords = (zipData as any)[zipCode];
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        first_name: firstName,
        last_name: lastName,
        username,
        age: parseInt(age),
        bio,
        zip_code: zipCode,
        city,
        state,
        latitude: coords?.latitude || null,
        longitude: coords?.longitude || null,
        gender,
        gender_preference: genderPrefs,
        adventure_type: selectedAdventures,
        skill_level: skillLevels,
        skill_preference: skillPref,
        mile_range: mileRange,
        profile_pictures: photos,
        instagram,
        tiktok,
        facebook,
        linkedin,
        updated_at: new Date(),
      });
      if (!error) router.push("/profile");
      else alert(error.message);
    }
    setLoading(false);
  };

  // Triggered by the red Cancel button in the Top Nav
  const handleCancelTrigger = () => {
    setShowCancelModal(true);
  };

  // Triggered by the "Yes" buttons inside the Modal
  const confirmCancelAction = async () => {
    if (isEditMode) {
      // If editing, just send them back to the dashboard/profile
      router.push("/profile");
    } else {
      // If onboarding for the first time, cancel means logging out
      await supabase.auth.signOut();
      router.push("/login");
    }
  };

  /* -------------------------------------------------------------------------- */
  /* SECTION 5: RENDER                                                          */
  /* -------------------------------------------------------------------------- */
  const progressWidth = `${(step / totalSteps) * 100}%`;

  if (loading && step === 1) {
    return (
      <div className="min-h-screen bg-[#022c22] flex items-center justify-center relative overflow-hidden">
        {/* Background Elements to match the 'My Profile' feel */}
        <div
          className="absolute inset-0 z-0 opacity-40 bg-cover bg-center pointer-events-none"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 via-transparent to-transparent z-1" />

        {/* The Loading Text */}
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="animate-pulse text-emerald-400 font-black tracking-[0.4em] text-2xl md:text-3xl uppercase italic drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">
            Loading Outty...
          </div>
          {/* Optional: Add a subtle sub-text for extra polish */}
          <div className="text-white/1 text-[12px] font-black uppercase tracking-[0.8em] animate-pulse delay-75">
            Preparing your adventure
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-between bg-[#011a14] p-4 pt-32 md:pt-20 text-center overflow-x-hidden">
      {/* CANCEL MODAL */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 transition-all">
          <div className="w-full max-w-sm bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-3xl shadow-2xl text-center">
            <h3 className="text-2xl font-black italic text-white tracking-tighter mb-4">
              {isEditMode ? "DISCARD CHANGES?" : "ABANDON ADVENTURE?"}
            </h3>
            <p className="text-white/60 text-sm mb-8 font-bold uppercase tracking-widest leading-relaxed">
              {isEditMode
                ? "Your recent edits won't be saved. Return to your profile?"
                : "To view profiles, you must complete your own first. Exiting will log you out."}
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={confirmCancelAction}
                className="w-full py-4 bg-red-500 text-white font-black uppercase tracking-widest rounded-xl hover:bg-red-400 transition-all"
              >
                {isEditMode ? "Discard & Return" : "Yes, Log Out"}
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                className="w-full py-4 bg-white/5 text-white/40 font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all"
              >
                {isEditMode ? "Back to Editing" : "Keep Building"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* TOP NAV BAR - Fixed Clickability */}
      <div className="fixed top-0 left-0 right-0 z-[60] px-6 py-8 md:px-12 pointer-events-none">
        <div className="w-full flex justify-between items-center">
          <div className="text-3xl md:text-4xl font-black italic tracking-tighter text-white drop-shadow-lg pointer-events-auto">
            OUTTY
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleCancelTrigger();
            }}
            className="pointer-events-auto px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-red-500 hover:text-white transition-all active:scale-95"
          >
            Cancel
          </button>
        </div>
      </div>
      {/* BACKGROUND IMAGE & GRADIENT LAYER - LIGHT VERSION */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* 1. HIGH-RES FOREST: Increased opacity for more natural light */}
        <div
          className="absolute inset-0 opacity-40 bg-cover bg-center transition-opacity duration-1000"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80')",
          }}
        />
      </div>
      {/* MAIN CARD CONTAINER */}
      <div className="z-10 w-full max-w-2xl p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-500">
        <h1 className="text-4xl font-black italic tracking-tighter text-white mb-2">
          {isEditMode ? "UPDATE YOUR PROFILE" : "CREATE YOUR PROFILE"}
        </h1>

        {/* PROGRESS BAR */}
        <div className="w-full h-1.5 bg-white/10 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: progressWidth }}
          ></div>
        </div>

        {/* STEP 1: THE ESSENTIALS */}
        {step === 1 && (
          <div className="space-y-4 text-left">
            <h1 className={styles.title}>The Essentials</h1>
            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="First Name *"
                className={styles.inputBase}
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
              />
              <input
                placeholder="Last Name *"
                className={styles.inputBase}
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {["Male", "Female", "Other"].map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`py-3 rounded-xl border text-sm font-bold transition-all ${gender === g ? "bg-emerald-500 border-emerald-400 text-white" : "bg-white/5 border-white/10 text-white/40"}`}
                >
                  {g}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <input
                placeholder="Age *"
                className={styles.inputBase}
                onChange={(e) => setAge(e.target.value.replace(/\D/g, ""))}
                value={age}
              />
              <div className="col-span-2 relative">
                <input
                  placeholder="Username *"
                  className={styles.inputBase}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setUsernameSuccess(false);
                  }}
                  onBlur={(e) => checkUsername(e.target.value)}
                  value={username}
                />
                {checkingUsername && (
                  <span className="absolute right-4 top-4 text-[10px] text-emerald-400 animate-pulse">
                    VERIFYING...
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <input
                placeholder="ZIP *"
                maxLength={5}
                className="col-span-4 p-4 rounded-xl bg-white/10 border border-white/20 text-white"
                onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ""))}
                value={zipCode}
              />
              <input
                placeholder="City"
                disabled
                className="col-span-5 p-4 rounded-xl bg-black/20 text-white/30"
                value={city}
              />
              <input
                placeholder="ST"
                disabled
                className="col-span-3 p-4 rounded-xl bg-black/20 text-white/30 text-center"
                value={state}
              />
            </div>

            <textarea
              placeholder="Adventure Bio *"
              className={`${styles.inputBase} min-h-[100px]`}
              onChange={(e) => setBio(e.target.value)}
              value={bio}
            />

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                My Skill Level *
              </label>
              <div className="grid grid-cols-4 gap-2">
                {["Beginner", "Intermediate", "Advanced", "Expert"].map((s) => (
                  <button
                    key={s}
                    onClick={() =>
                      toggleSelection(skillLevels, setSkillLevels, s)
                    }
                    className={`py-2 rounded-xl border text-[10px] font-bold ${skillLevels.includes(s) ? "bg-emerald-500 border-emerald-400 text-white" : "bg-white/5 border-white/10 text-white/40"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: ADVENTURES */}
        {step === 2 && (
          <div className="text-center">
            <h1 className={styles.title}>Your Adventures</h1>
            <div className="flex flex-wrap justify-center gap-2 max-h-[300px] overflow-y-auto p-2">
              {adventureOptions.map((type) => (
                <button
                  key={type}
                  onClick={() =>
                    toggleSelection(
                      selectedAdventures,
                      setSelectedAdventures,
                      type,
                    )
                  }
                  className={`px-5 py-2.5 rounded-full border text-sm font-semibold transition-all ${selectedAdventures.includes(type) ? "bg-emerald-500 border-emerald-400 text-white" : "bg-white/5 border-white/10 text-white/40"}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: PREFERENCES */}
        {step === 3 && (
          <div className="space-y-8 text-left">
            <h1 className={styles.title}>Preferences</h1>
            <div>
              <label className="text-white/60 text-xs font-bold uppercase block mb-3">
                Partner Gender *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["Female", "Male", "Other"].map((g) => (
                  <button
                    key={g}
                    onClick={() =>
                      toggleSelection(genderPrefs, setGenderPrefs, g)
                    }
                    className={`py-3 rounded-xl border text-xs font-bold transition-all ${genderPrefs.includes(g) ? "bg-emerald-500 border-emerald-400 text-white" : "bg-white/5 border-white/10 text-white/40"}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-white/60 text-xs font-bold uppercase">
                  Search Range
                </label>
                <span className="text-emerald-400 font-bold">
                  {mileRange} miles
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={mileRange}
                onChange={(e) => setMileRange(parseInt(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>
            <div>
              <label className="text-white/60 text-xs font-bold uppercase block mb-3">
                Partner Skill Levels *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["Beginner", "Intermediate", "Advanced", "Expert"].map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleSelection(skillPref, setSkillPref, s)}
                    className={`py-3 rounded-xl border text-xs font-bold transition-all ${skillPref.includes(s) ? "bg-emerald-500 border-emerald-400 text-white" : "bg-white/5 border-white/10 text-white/40"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Pictures */}
        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-center">
            <h2 className="text-3xl font-black text-white mb-2 uppercase italic tracking-tighter">
              Photos *
            </h2>
            <p className="text-white/40 text-[10px] font-black uppercase mb-8 tracking-widest">
              Tap a photo to set as primary • Select multiple to batch upload
            </p>

            <input
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading || photos.length >= 6}
              className="w-full mb-10 py-5 bg-emerald-500/10 border-2 border-dashed border-emerald-500/30 text-emerald-400 font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-emerald-500/20 hover:border-emerald-500/60 transition-all active:scale-[0.98]"
            >
              {loading
                ? "Processing..."
                : `Upload Adventure Photos (${photos.length}/6)`}
            </button>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((url, idx) => (
                <div
                  key={idx}
                  onClick={() => makePrimary(idx)}
                  className={`relative group aspect-[4/5] rounded-[1.5rem] overflow-hidden border-2 cursor-pointer transition-all duration-500
                      ${
                        idx === 0
                          ? "border-emerald-500 ring-4 ring-emerald-500/20 z-10 scale-[1.02]"
                          : "border-white/10 hover:border-white/40"
                      }`}
                >
                  <img
                    src={url}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {idx === 0 ? (
                    <div className="absolute top-3 left-3 bg-emerald-500 text-[#022c22] text-[9px] font-black px-2 py-1 rounded-lg flex items-center gap-1.5 shadow-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                      PRIMARY
                    </div>
                  ) : (
                    <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-all transform translate-y-[-4px] group-hover:translate-y-0">
                      <div className="bg-black/40 backdrop-blur-md text-white/70 text-[8px] font-black px-2 py-1 rounded-lg border border-white/10">
                        SET PRIMARY
                      </div>
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPhotos(photos.filter((_, i) => i !== idx));
                    }}
                    className="absolute top-3 right-3 bg-black/40 backdrop-blur-md p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 text-white border border-white/10"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: SOCIALS */}
        {step === 5 && (
          <div className="space-y-4 text-left">
            <h1 className={styles.title}>Social Links</h1>
            {["Instagram", "TikTok", "Facebook", "LinkedIn"].map((label) => (
              <div key={label}>
                <label className="text-white/40 text-[10px] font-bold uppercase block mb-1">
                  {label}
                </label>
                <input
                  type="text"
                  placeholder={`@handle`}
                  className={styles.inputBase}
                  value={
                    label === "Instagram"
                      ? instagram
                      : label === "TikTok"
                        ? tiktok
                        : label === "Facebook"
                          ? facebook
                          : linkedin
                  }
                  onChange={(e) => {
                    if (label === "Instagram") setInstagram(e.target.value);
                    else if (label === "TikTok") setTiktok(e.target.value);
                    else if (label === "Facebook") setFacebook(e.target.value);
                    else setLinkedin(e.target.value);
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* STEP 6: EXACT PREVIEW CARD LAYOUT */}
        {step === 6 && (
          <div className="space-y-4 text-left">
            <h1 className={styles.title}>Profile Preview</h1>
            <div className="animate-in fade-in zoom-in duration-500 text-left">
              {/* Use the specific classes for scrolling and background depth */}
              <div className="bg-black/20 border border-white/10 rounded-[2rem] p-8 space-y-8 shadow-2xl overflow-y-auto max-h-[500px] custom-scrollbar">
                {/* Profile Header */}
                <div className="flex items-start gap-6 border-b border-white/5 pb-8">
                  <div className="relative shrink-0">
                    <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-emerald-500 shadow-lg shadow-emerald-500/20 bg-white/5">
                      <img
                        src={photos[0] || ""}
                        alt="Primary"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-[#022c22] px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter">
                      {age || "??"} YR OLD
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter leading-none uppercase">
                      {firstName} {lastName}
                    </h3>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 font-black text-[10px] uppercase tracking-[0.2em]">
                          @{username} • {gender?.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-white/40 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                        <span className="text-emerald-500 text-xs">📍</span>{" "}
                        {city}, {state} {zipCode}
                      </span>
                      <span className="text-emerald-400 text-[9px] font-black uppercase tracking-[0.2em] animate-pulse drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]">
                        Online Now
                      </span>
                    </div>
                  </div>
                </div>
                {/* Bio Section */}
                <div className="space-y-2">
                  <label className="text-emerald-400 text-[10px] font-black uppercase tracking-widest block">
                    The Adventure Bio
                  </label>
                  <p className="text-white/90 text-base font-medium leading-relaxed tracking-tight">
                    "{bio || "No bio added yet."}"
                  </p>
                </div>
                {/* Interests Tags - Fixed with Correct Variable Name */}
                <div className="space-y-3">
                  <label className="text-emerald-400 text-[10px] font-black uppercase tracking-widest block">
                    Adventure Interests
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {/* Swapping 'adventures' for 'selectedAdventures' */}
                    {(selectedAdventures?.length || 0) > 0 ? (
                      selectedAdventures.map((adv) => (
                        <span
                          key={adv}
                          className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold rounded-full uppercase"
                        >
                          {adv}
                        </span>
                      ))
                    ) : (
                      <span className="text-white/20 text-xs italic uppercase tracking-widest">
                        No adventures selected
                      </span>
                    )}
                  </div>
                </div>
                {/* Metrics Grid - Crash-Proof Version */}
                <div className="grid grid-cols-2 gap-y-8 gap-x-12 border-t border-white/5 pt-8">
                  {/* My Skill Levels - Now using White Transparent Pills */}
                  <div className="space-y-3">
                    <label className="text-white/40 text-[10px] font-black uppercase tracking-widest block">
                      My Skill Levels
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(skillLevels) && skillLevels.length > 0 ? (
                        skillLevels.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 bg-white/5 border border-white/10 text-white text-[10px] font-bold rounded-full uppercase tracking-tight"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-white/20 text-[10px] uppercase font-bold italic">
                          None Set
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Partner Gender - Using | separator and cleaning JSON artifacts */}
                  <div className="space-y-1">
                    <label className="text-white/40 text-[10px] font-black uppercase tracking-widest block">
                      Partner Gender
                    </label>
                    <p className="text-white text-base font-bold tracking-tight uppercase">
                      {Array.isArray(genderPrefs)
                        ? genderPrefs.join(" | ") || "Any"
                        : genderPrefs
                          ? String(genderPrefs)
                              .replace(/[\[\]"]/g, "")
                              .split(",")
                              .join(" | ")
                          : "Any"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-white/40 text-[10px] font-black uppercase tracking-widest block">
                      Search Range
                    </label>
                    <p className="text-emerald-400 text-base font-bold tracking-tight uppercase">
                      {mileRange} Miles
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-white/40 text-[10px] font-black uppercase tracking-widest block">
                      Partner Skill Levels
                    </label>
                    <p className="text-white text-base font-bold tracking-tight leading-none uppercase">
                      {Array.isArray(skillPref)
                        ? skillPref.join(" | ") || "Any"
                        : skillPref || "Any"}
                    </p>
                  </div>
                </div>{" "}
                {/* Socials Grid */}
                <div className="space-y-4 border-t border-white/5 pt-8 pb-4">
                  <label className="text-white/40 text-[10px] font-black uppercase tracking-widest block">
                    Connected Socials
                  </label>
                  <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                    {[
                      { label: "Instagram", val: instagram },
                      { label: "TikTok", val: tiktok },
                      { label: "Facebook", val: facebook },
                      { label: "LinkedIn", val: linkedin },
                    ].map((soc) => (
                      <div key={soc.label}>
                        <p className="text-white/30 text-[9px] font-bold uppercase">
                          {soc.label}
                        </p>
                        <p
                          className={`text-xs font-bold truncate ${soc.val ? "text-white" : "text-emerald-500"}`}
                        >
                          {soc.val || "Not added"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NAVIGATION - Added Hover Effects */}
        <div className="flex gap-4 mt-10">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 py-4 bg-white/5 text-white/60 font-black uppercase rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/30 hover:text-white transition-all active:scale-[0.98]"
            >
              Back
            </button>
          )}
          <button
            onClick={() => {
              if (step < totalSteps) setStep(step + 1);
              else handleSaveProfile();
            }}
            disabled={loading || checkingUsername || !isStepValid()}
            className="flex-[2] py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-20 text-white font-black uppercase rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
          >
            {loading
              ? "Processing..."
              : step < totalSteps
                ? "Continue"
                : isEditMode
                  ? "Update Profile"
                  : "Finalize Profile"}
          </button>
        </div>
      </div>{" "}
      {/* <-- This closes the Main Card Container */}
      <div className="pb-12 w-full"></div>
    </main>
  );
}
