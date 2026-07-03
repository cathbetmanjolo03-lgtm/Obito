import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Shield, Lock, ChevronRight, Info, AlertCircle, Eye, EyeOff } from "lucide-react";
import { User } from "../types";
import Crest from "./Crest";

interface AuthScreenProps {
  onLoginSuccess: (user: User) => void;
}

interface StaffPublic {
  name: string;
  email: string;
  role: string;
}

export default function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
  const [staffList, setStaffList] = useState<StaffPublic[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<StaffPublic | null>(null);
  const [emailInput, setEmailInput] = useState("");
  const [pinInput, setPinInput] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isManualEmail, setIsManualEmail] = useState(false);

  // Fetch staff names on load
  useEffect(() => {
    async function loadStaff() {
      try {
        const res = await fetch("/api/auth/staff");
        if (res.ok) {
          const list = await res.json();
          setStaffList(list);
          // Default select Cathbet Manjolo (The directing manager)
          const cathbet = list.find((s: any) => s.name.includes("Cathbet"));
          if (cathbet) {
            setSelectedStaff(cathbet);
            setEmailInput(cathbet.email);
          }
        }
      } catch (err) {
        console.error("Failed to load staff list", err);
      }
    }
    loadStaff();
  }, []);

  const handleSelectStaff = (staff: StaffPublic) => {
    setSelectedStaff(staff);
    setEmailInput(staff.email);
    setIsManualEmail(false);
    setError(null);
  };

  const handleManualEmailToggle = () => {
    setIsManualEmail(true);
    setSelectedStaff(null);
    setEmailInput("");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !pinInput) {
      setError("Please provide both an email and a secure passcode.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput, pin: pinInput }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        onLoginSuccess(data.user);
      } else {
        setError(data.error || "Authentication failed. Check your credentials.");
      }
    } catch (err) {
      setError("Unable to reach authentication server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="auth-container"
      className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans text-slate-900"
    >
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50 pointer-events-none" />

      {/* Decorative colored glow spheres */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-100/30 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-slate-200/40 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10"
      >
        {/* Left Side: Corporate Presentation */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6 text-left pr-0 lg:pr-8">
          <div className="flex items-center space-x-3">
            <Crest size="md" />
            <div>
              <h2 className="text-xs font-mono uppercase tracking-[0.3em] text-indigo-600 font-bold">Security Gateway</h2>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">GULA MVULA HOLDINGS</h1>
            </div>
          </div>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Welcome to the secure administrative portal of **Gula Mvula Holdings (GMH)**. 
            This ecosystem provides unified controls for forestry investments, mega-farming value chains, properties development, and quantitative valuations.
          </p>

          {/* Org Members Quick select (interactive) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold flex items-center">
                <Shield className="w-3 h-3 mr-1.5 text-indigo-500" /> Executive Directory (Click to Select)
              </span>
              <button
                type="button"
                onClick={handleManualEmailToggle}
                className="text-xs text-indigo-600 hover:underline hover:text-indigo-500 font-semibold"
              >
                Manual Email Input
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1 border border-slate-200 p-2 rounded-sm bg-white shadow-sm">
              {staffList.map((member) => {
                const isSelected = selectedStaff?.email === member.email;
                const isCathbet = member.name.includes("Cathbet");
                return (
                  <button
                    key={member.email}
                    type="button"
                    onClick={() => handleSelectStaff(member)}
                    className={`text-left p-2.5 rounded-sm border text-xs transition-all flex flex-col justify-between ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-50/50 text-indigo-950 font-semibold shadow-sm"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    <div className="font-semibold flex items-center justify-between w-full">
                      <span className={isSelected ? "text-indigo-900" : "text-slate-800"}>{member.name}</span>
                      {isCathbet && (
                        <span className="px-1 py-0.2 bg-indigo-100 text-[9px] text-indigo-700 rounded-sm border border-indigo-200">
                          Primary
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 truncate mt-0.5">{member.role.split("&")[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Guidelines info */}
          <div className="p-4 bg-slate-100 border border-slate-200 rounded-sm flex items-start space-x-3 text-xs text-slate-600">
            <Info className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-slate-800">Staff Authentication Notice:</span>
              <p className="leading-relaxed">
                Each executive is issued a unique PIN. For verification and development review:
                <br />
                - <strong className="text-indigo-600">Cathbet Manjolo PIN:</strong> <code className="text-slate-800 font-mono bg-slate-200 px-1 py-0.5 rounded-sm">0000</code> (Directing Manager)
                <br />
                - All other members have simple consecutive PINs (<code className="text-slate-700">1111</code>, <code className="text-slate-700">2222</code>... <code className="text-slate-700">9999</code>).
                <br />
                - Use <strong className="text-indigo-600">2026</strong> as a master administrator override.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Secure Login Form */}
        <div className="lg:col-span-5 flex items-center">
          <div className="w-full bg-white border border-slate-200 rounded-sm p-6 sm:p-8 shadow-md relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-100 px-4 py-1 rounded-sm border border-slate-200 text-[10px] font-mono tracking-widest text-slate-500 flex items-center uppercase font-bold">
              <Lock className="w-3 h-3 mr-1.5 text-indigo-600" /> Authorized Area
            </div>

            <div className="text-center mb-6">
              <h2 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Staff Login</h2>
              {selectedStaff ? (
                <p className="text-xs text-slate-500 mt-1">
                  Accessing profile: <strong className="text-indigo-600">{selectedStaff.name}</strong>
                </p>
              ) : (
                <p className="text-xs text-slate-500 mt-1">Select an executive or input email manually</p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email address */}
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-slate-500 uppercase">Corporate Email</label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  disabled={!isManualEmail && selectedStaff !== null}
                  placeholder="name@gmh.com"
                  className="w-full px-3.5 py-2.5 rounded-sm border bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 text-sm transition-colors border-slate-200 disabled:opacity-50 disabled:bg-slate-100"
                />
              </div>

              {/* Secure PIN */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-mono font-bold text-slate-500 uppercase">Secure Pin / Passcode</label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {selectedStaff ? `PIN: ${selectedStaff.email === "cathbetmanjolo6@gmail.com" ? "0000" : "Consecutive Digit"}` : "Master Override: 2026"}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showPin ? "text" : "password"}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="••••"
                    maxLength={12}
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-sm border bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 text-sm tracking-widest font-mono transition-colors border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error messages */}
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-sm flex items-start space-x-2.5 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-bold uppercase tracking-widest text-xs rounded-sm transition-colors flex items-center justify-center space-x-2 shadow-md disabled:opacity-50"
              >
                {loading ? (
                  <span className="border-2 border-white border-t-transparent animate-spin w-4 h-4 rounded-full" />
                ) : (
                  <>
                    <span>Authenticate Staff Session</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
