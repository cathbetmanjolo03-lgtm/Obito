import React, { useState } from "react";
import { motion } from "motion/react";
import { AlertTriangle, Plus, Trash2, ShieldAlert, FileText, CheckSquare } from "lucide-react";
import { GMHDatabase, User, RiskEntry } from "../types";

interface RiskComplianceViewProps {
  database: GMHDatabase;
  currentUser: User;
  onRefresh: () => void;
}

export default function RiskComplianceView({ database, currentUser, onRefresh }: RiskComplianceViewProps) {
  const [showAddRisk, setShowAddRisk] = useState(false);
  const [riskForm, setRiskForm] = useState({
    category: "",
    severity: "Medium" as const,
    probability: "Low" as const,
    mitigation: "",
    director: currentUser.name
  });

  // Board minutes drafting
  const [boardSubject, setBoardSubject] = useState("");
  const [resolutionText, setResolutionText] = useState("");
  const [boardMinutes, setBoardMinutes] = useState<{ id: string; date: string; subject: string; text: string; approvedBy: string }[]>([
    { id: "bm-1", date: "2026-06-12", subject: "Approval of Pine Thinning Contracts", text: "RESOLVED that the company contracts Blue Ridge Lumber Ltd to perform scheduled commercial thinning of Viphya Compartment 9.", approvedBy: "Andrew Kaumba" }
  ]);

  const handleAddRisk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!riskForm.category || !riskForm.mitigation) return;

    try {
      const res = await fetch("/api/data/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "risks",
          action: "add",
          payload: riskForm
        })
      });

      if (res.ok) {
        onRefresh();
        setRiskForm({ category: "", severity: "Medium", probability: "Low", mitigation: "", director: currentUser.name });
        setShowAddRisk(false);
      }
    } catch (err) {
      console.error("Failed to add risk entry", err);
    }
  };

  const handleDeleteRisk = async (id: string) => {
    try {
      const res = await fetch("/api/data/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "risks",
          action: "delete",
          payload: { id }
        })
      });
      if (res.ok) {
        onRefresh();
      }
    } catch (err) {
      console.error("Failed to delete risk entry", err);
    }
  };

  const handleCreateResolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardSubject || !resolutionText) return;

    const newMin = {
      id: `bm-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      subject: boardSubject,
      text: resolutionText,
      approvedBy: currentUser.name
    };

    setBoardMinutes([newMin, ...boardMinutes]);
    setBoardSubject("");
    setResolutionText("");
  };

  return (
    <div id="risk-compliance-tab" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl font-mono">Risk &amp; Compliance</h1>
          <p className="text-xs text-slate-500 mt-1">Mitigation frameworks maintained by Andrew Kaumba (Risk &amp; Optimization Director).</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddRisk(true)}
          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wider text-[11px] rounded-sm transition-colors flex items-center space-x-1.5 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Register Business Risk</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Risks Register Table */}
        <div className="lg:col-span-7 space-y-4 text-left">
          <h3 className="text-xs font-mono uppercase tracking-wider text-indigo-600 flex items-center font-bold">
            <ShieldAlert className="w-4 h-4 mr-1.5 text-indigo-600" /> Active Corporate Risk Ledger
          </h3>

          <div className="border border-slate-200 rounded-sm bg-white overflow-hidden text-xs shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-mono text-[10px] font-bold">
                  <th className="py-2.5 px-4">Risk Category</th>
                  <th className="py-2.5 px-4">Severity / Prob.</th>
                  <th className="py-2.5 px-4">Mitigation Protocol</th>
                  <th className="py-2.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {database.risks.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-400 italic">No risks registered on file.</td>
                  </tr>
                ) : (
                  database.risks.map((risk: RiskEntry) => (
                    <tr key={risk.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800">{risk.category}</div>
                        <div className="text-[9px] text-slate-400 font-mono mt-0.5">Assessed by: {risk.director.split(" ")[0]}</div>
                      </td>
                      <td className="py-3 px-4 space-y-1">
                        <div className="flex items-center space-x-1">
                          <span className="text-[9px] text-slate-400 font-mono">Sev:</span>
                          <span className={`px-1.5 py-0.2 rounded-sm text-[8px] font-mono font-bold ${
                            risk.severity === "High" ? "bg-red-50 text-red-600 border border-red-100" :
                            risk.severity === "Medium" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                            "bg-indigo-50 text-indigo-600 border border-indigo-100"
                          }`}>{risk.severity}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-[9px] text-slate-400 font-mono">Prob:</span>
                          <span className={`px-1.5 py-0.2 rounded-sm text-[8px] font-mono font-bold ${
                            risk.probability === "High" ? "bg-red-50 text-red-600 border border-red-100" :
                            risk.probability === "Medium" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                            "bg-indigo-50 text-indigo-600 border border-indigo-100"
                          }`}>{risk.probability}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-500 max-w-xs break-words">
                        {risk.mitigation}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteRisk(risk.id)}
                          className="text-slate-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Corporate Secretary Board Minutes & Resolutions */}
        <div className="lg:col-span-5 space-y-4 text-left">
          <div className="bg-white border border-slate-200 p-5 rounded-sm space-y-4 shadow-sm">
            <div className="flex items-center space-x-2 border-b border-slate-200 pb-2.5">
              <FileText className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-800 font-bold">Board Resolutions Architect</h3>
            </div>

            <form onSubmit={handleCreateResolution} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Board Meeting Subject</label>
                <input
                  type="text"
                  required
                  value={boardSubject}
                  onChange={(e) => setBoardSubject(e.target.value)}
                  placeholder="e.g., Q3 Capital Allocation Limits"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Resolution Draft Text</label>
                <textarea
                  required
                  rows={3}
                  value={resolutionText}
                  onChange={(e) => setResolutionText(e.target.value)}
                  placeholder="RESOLVED that the board approves..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wider text-[11px] rounded-sm transition-colors cursor-pointer shadow-sm"
              >
                Log Approved Board Minutes
              </button>
            </form>

            <div className="border-t border-slate-200 pt-4 space-y-3">
              <span className="text-[10px] font-mono text-slate-500 uppercase block tracking-wider font-bold">Minutes Archives</span>
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {boardMinutes.map((min) => (
                  <div key={min.id} className="p-3 bg-slate-50 border border-slate-200 rounded-sm space-y-1.5">
                    <div className="flex justify-between items-center text-[9px] font-mono text-slate-400">
                      <span>Date: {min.date}</span>
                      <span>By: {min.approvedBy.split(" ")[0]}</span>
                    </div>
                    <h4 className="text-[11px] font-bold text-slate-800 font-mono">{min.subject}</h4>
                    <p className="text-[10px] text-slate-500 italic leading-relaxed">{min.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Register Business Risk Popup */}
      {showAddRisk && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-sm p-6 w-full max-w-md space-y-4 shadow-xl text-left">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-tight">Register Operational Risk</h3>
              <button
                type="button"
                onClick={() => setShowAddRisk(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-wider font-mono"
              >
                Close
              </button>
            </div>
            <form onSubmit={handleAddRisk} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Risk Category / Title</label>
                <input
                  type="text"
                  required
                  value={riskForm.category}
                  onChange={(e) => setRiskForm({ ...riskForm, category: e.target.value })}
                  placeholder="e.g., Pine Seedling Fungus Blight"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Severity Level</label>
                  <select
                    value={riskForm.severity}
                    onChange={(e) => setRiskForm({ ...riskForm, severity: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Probability Level</label>
                  <select
                    value={riskForm.probability}
                    onChange={(e) => setRiskForm({ ...riskForm, probability: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Active Mitigation Protocol</label>
                <textarea
                  required
                  rows={3}
                  value={riskForm.mitigation}
                  onChange={(e) => setRiskForm({ ...riskForm, mitigation: e.target.value })}
                  placeholder="Describe step-by-step mitigation paths..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Assessed Director Ref</label>
                <input
                  type="text"
                  required
                  value={riskForm.director}
                  onChange={(e) => setRiskForm({ ...riskForm, director: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-sm"
              >
                Log Risk Element
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
