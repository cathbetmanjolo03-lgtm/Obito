/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  LogOut, 
  Activity, 
  Users, 
  TreePine, 
  Percent, 
  ShieldAlert, 
  Building, 
  Sparkles, 
  Code, 
  Clock, 
  UserCheck 
} from "lucide-react";

// Subcomponents
import AuthScreen from "./components/AuthScreen";
import ExecutiveOverview from "./components/ExecutiveOverview";
import OrganigramView from "./components/OrganigramView";
import ForestryAgriView from "./components/ForestryAgriView";
import TreasuryFinanceView from "./components/TreasuryFinanceView";
import RiskComplianceView from "./components/RiskComplianceView";
import RealEstateView from "./components/RealEstateView";
import AICopilotView from "./components/AICopilotView";
import CodeExplorerView from "./components/CodeExplorerView";
import Crest from "./components/Crest";

// Types
import { User, GMHDatabase } from "./types";

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [database, setDatabase] = useState<GMHDatabase | null>(null);
  const [timeStr, setTimeStr] = useState("");

  // Periodically update date/time for the header status ticker
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch central database records from server disk
  const fetchDatabase = async () => {
    try {
      const res = await fetch("/api/data");
      if (res.ok) {
        const data = await res.json();
        setDatabase(data);
      }
    } catch (err) {
      console.error("Failed to load operations database", err);
    }
  };

  useEffect(() => {
    fetchDatabase();
  }, []);

  // Set simulated session profile from organigram clicks
  const handleSimulateUser = (simUser: User) => {
    setCurrentUser(simUser);
    setActiveTab("overview");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab("overview");
  };

  // If no staff user authenticated, prompt Auth Area
  if (!currentUser) {
    return <AuthScreen onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  // Load state until database arrives
  if (!database) {
    return (
      <div id="loader-screen" className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 font-mono text-xs space-y-4">
        <div className="border-4 border-emerald-500 border-t-transparent animate-spin w-10 h-10 rounded-full" />
        <span>Syncing GMH Ledger Records...</span>
      </div>
    );
  }

  return (
    <div id="portal-root" className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* 1. TOP SECURE SYSTEM BAR */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-30 shadow-sm">
        
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <Crest size="sm" />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-bold tracking-wider text-slate-800 uppercase font-mono">GMH Staff Operations Portal</h1>
              <span className="px-1.5 py-0.5 bg-indigo-50 border border-indigo-200 rounded-sm text-[9px] font-mono text-indigo-600 uppercase tracking-widest">
                Secure SSL
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Gula Mvula Holdings (GMH) Administrative Workspace</p>
          </div>
        </div>

        {/* System status ticker */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
          <div className="hidden lg:flex items-center space-x-1.5 text-slate-500 bg-slate-100 px-2.5 py-1 rounded-sm border border-slate-200 font-mono text-[10px]">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span>Time: {timeStr || "Loading..."}</span>
          </div>
          
          {/* User profile capsule */}
          <div className="flex items-center space-x-3 bg-slate-100 border border-slate-200 p-1.5 rounded-sm">
            <div className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-sm text-[10px] font-mono font-bold flex items-center space-x-1">
              <UserCheck className="w-3 h-3" />
              <span>{currentUser.name.split(" ")[0]}</span>
            </div>
            <div className="max-w-[150px] sm:max-w-[200px] text-left">
              <div className="text-[10px] font-semibold text-slate-800 truncate">{currentUser.name}</div>
              <div className="text-[9px] text-slate-500 truncate">{currentUser.role.split("&")[0]}</div>
            </div>
            <button
              onClick={handleLogout}
              type="button"
              className="p-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 rounded-sm transition-colors"
              title="Logout Session"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </header>

      {/* 2. MAIN LAYOUT CONTAINER */}
      <div className="flex-1 flex flex-col md:flex-row relative">
        
        {/* SIDEBAR NAVIGATION */}
        <nav className="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 p-4 space-y-1 relative z-20 text-slate-300 flex flex-col">
          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-2 px-2 font-bold">
            Operations Tabs
          </span>

          <div className="space-y-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full text-left px-4 py-3 rounded-sm text-xs font-semibold flex items-center space-x-2.5 transition-all ${
                activeTab === "overview" 
                  ? "bg-slate-800 text-white border-r-4 border-indigo-500 font-bold" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Executive Overview</span>
            </button>

            <button
              onClick={() => setActiveTab("organigram")}
              className={`w-full text-left px-4 py-3 rounded-sm text-xs font-semibold flex items-center space-x-2.5 transition-all ${
                activeTab === "organigram" 
                  ? "bg-slate-800 text-white border-r-4 border-indigo-500 font-bold" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Organigram &amp; Staff</span>
            </button>

            <button
              onClick={() => setActiveTab("forestry_agri")}
              className={`w-full text-left px-4 py-3 rounded-sm text-xs font-semibold flex items-center space-x-2.5 transition-all ${
                activeTab === "forestry_agri" 
                  ? "bg-slate-800 text-white border-r-4 border-indigo-500 font-bold" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <TreePine className="w-4 h-4" />
              <span>Forestry &amp; Agriculture</span>
            </button>

            <button
              onClick={() => setActiveTab("treasury_finance")}
              className={`w-full text-left px-4 py-3 rounded-sm text-xs font-semibold flex items-center space-x-2.5 transition-all ${
                activeTab === "treasury_finance" 
                  ? "bg-slate-800 text-white border-r-4 border-indigo-500 font-bold" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Percent className="w-4 h-4" />
              <span>Treasury &amp; Valuations</span>
            </button>

            <button
              onClick={() => setActiveTab("real_estate")}
              className={`w-full text-left px-4 py-3 rounded-sm text-xs font-semibold flex items-center space-x-2.5 transition-all ${
                activeTab === "real_estate" 
                  ? "bg-slate-800 text-white border-r-4 border-indigo-500 font-bold" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Building className="w-4 h-4" />
              <span>Real Estate &amp; Properties</span>
            </button>

            <button
              onClick={() => setActiveTab("risk_compliance")}
              className={`w-full text-left px-4 py-3 rounded-sm text-xs font-semibold flex items-center space-x-2.5 transition-all ${
                activeTab === "risk_compliance" 
                  ? "bg-slate-800 text-white border-r-4 border-indigo-500 font-bold" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Risk &amp; Compliance</span>
            </button>

            <button
              onClick={() => setActiveTab("copilot")}
              className={`w-full text-left px-4 py-3 rounded-sm text-xs font-semibold flex items-center space-x-2.5 transition-all ${
                activeTab === "copilot" 
                  ? "bg-slate-800 text-white border-r-4 border-indigo-500 font-bold" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>GMH AI Copilot</span>
            </button>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-1">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-2 px-2 font-bold">
              Source Explorer
            </span>

            <button
              onClick={() => setActiveTab("admin_code")}
              className={`w-full text-left px-4 py-3 rounded-sm text-xs font-semibold flex items-center space-x-2.5 transition-all ${
                activeTab === "admin_code" 
                  ? "bg-slate-800 text-white border-r-4 border-indigo-500 font-bold" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Code className="w-4 h-4" />
              <span>Admin Code Explorer</span>
            </button>
          </div>

          {/* Footer credentials reminder */}
          <div className="pt-6 mt-auto border-t border-slate-800 text-[10px] text-slate-500 space-y-1 px-2">
            <div>Holdings ID: 7bfabac0</div>
            <div>Server Node: Cloud Run v3</div>
            <div>Secure Key Proxied: Yes</div>
          </div>

        </nav>

        {/* WORKSPACE DISPLAY MAIN SCREEN */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[calc(100vh-68px)]">
          <div className="max-w-7xl mx-auto">
            {activeTab === "overview" && (
              <ExecutiveOverview 
                database={database} 
                currentUser={currentUser} 
                onRefresh={fetchDatabase} 
              />
            )}

            {activeTab === "organigram" && (
              <OrganigramView 
                currentUser={currentUser} 
                onSimulateUser={handleSimulateUser} 
              />
            )}

            {activeTab === "forestry_agri" && (
              <ForestryAgriView 
                database={database} 
                currentUser={currentUser} 
                onRefresh={fetchDatabase} 
              />
            )}

            {activeTab === "treasury_finance" && (
              <TreasuryFinanceView 
                database={database} 
                currentUser={currentUser} 
                onRefresh={fetchDatabase} 
              />
            )}

            {activeTab === "real_estate" && (
              <RealEstateView 
                database={database} 
                currentUser={currentUser} 
                onRefresh={fetchDatabase} 
              />
            )}

            {activeTab === "risk_compliance" && (
              <RiskComplianceView 
                database={database} 
                currentUser={currentUser} 
                onRefresh={fetchDatabase} 
              />
            )}

            {activeTab === "copilot" && (
              <AICopilotView 
                database={database} 
                currentUser={currentUser} 
              />
            )}

            {activeTab === "admin_code" && (
              <CodeExplorerView 
                database={database} 
                onRefreshDatabase={fetchDatabase} 
              />
            )}
          </div>
        </main>

      </div>

    </div>
  );
}
