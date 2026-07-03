import React, { useState } from "react";
import { motion } from "motion/react";
import { TrendingUp, TreePine, DollarSign, Activity, FileText, Calendar, Plus, Trash2, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { GMHDatabase, User, AccountEntry, Announcement } from "../types";

interface ExecutiveOverviewProps {
  database: GMHDatabase;
  currentUser: User;
  onRefresh: () => void;
}

export default function ExecutiveOverview({ database, currentUser, onRefresh }: ExecutiveOverviewProps) {
  const [showAddTx, setShowAddTx] = useState(false);
  const [txForm, setTxForm] = useState({
    description: "",
    category: "Revenue" as const,
    amount: "",
    ref: currentUser.name
  });

  const [annForm, setAnnForm] = useState({
    title: "",
    content: "",
    category: "Corporate" as const
  });
  const [showAddAnn, setShowAddAnn] = useState(false);

  // Math summaries
  const totalAssetsValue = database.assets.reduce((sum, a) => sum + a.value, 0);
  const totalBudget = database.projects.reduce((sum, p) => sum + p.budget, 0);
  const totalRevenue = database.accounts.filter(a => a.category === "Revenue").reduce((sum, a) => sum + a.amount, 0);
  const totalExpense = database.accounts.filter(a => a.category === "Expense").reduce((sum, a) => sum + Math.abs(a.amount), 0);
  const netReserveFlow = database.accounts.reduce((sum, a) => sum + a.amount, 0);

  const handleAddTx = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txForm.description || !txForm.amount) return;

    const amountNum = parseFloat(txForm.amount);
    const finalAmount = txForm.category === "Expense" ? -Math.abs(amountNum) : amountNum;

    try {
      const res = await fetch("/api/data/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "accounts",
          action: "add",
          payload: {
            date: new Date().toISOString().split("T")[0],
            description: txForm.description,
            category: txForm.category,
            amount: finalAmount,
            ref: txForm.ref
          }
        })
      });

      if (res.ok) {
        onRefresh();
        setTxForm({ description: "", category: "Revenue", amount: "", ref: currentUser.name });
        setShowAddTx(false);
      }
    } catch (err) {
      console.error("Failed to add transaction", err);
    }
  };

  const handleAddAnn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annForm.title || !annForm.content) return;

    try {
      const res = await fetch("/api/data/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "announcements",
          action: "add",
          payload: {
            date: new Date().toISOString().split("T")[0],
            title: annForm.title,
            content: annForm.content,
            category: annForm.category
          }
        })
      });

      if (res.ok) {
        onRefresh();
        setAnnForm({ title: "", content: "", category: "Corporate" });
        setShowAddAnn(false);
      }
    } catch (err) {
      console.error("Failed to add announcement", err);
    }
  };

  const handleDeleteItem = async (type: "accounts" | "announcements", id: string) => {
    try {
      const res = await fetch("/api/data/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          action: "delete",
          payload: { id }
        })
      });
      if (res.ok) {
        onRefresh();
      }
    } catch (err) {
      console.error("Failed to delete item", err);
    }
  };

  return (
    <div id="executive-overview-tab" className="space-y-6">
      {/* Header and Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl font-mono">Executive Overview</h1>
          <p className="text-xs text-slate-500 mt-1">Consolidated holdings, ledger balances, and recent corporate activity.</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowAddTx(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold uppercase tracking-wider text-[11px] rounded-sm transition-colors flex items-center space-x-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Transaction</span>
          </button>
          <button
            type="button"
            onClick={() => setShowAddAnn(true)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-950 text-white font-bold uppercase tracking-wider text-[11px] rounded-sm transition-colors flex items-center space-x-1.5 border border-slate-700 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post Bulletin</span>
          </button>
        </div>
      </div>

      {/* Grid of Key Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Actuarial Solvency */}
        <div className="bg-white border border-slate-200 rounded-sm p-5 relative overflow-hidden shadow-sm">
          <div className="absolute top-4 right-4 text-indigo-600 bg-indigo-50 p-2 rounded-sm border border-indigo-100">
            <Activity className="w-4 h-4" />
          </div>
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">Solvency Ratio</span>
          <span className="text-2xl font-bold text-slate-950 tracking-tight mt-2 block">174.2%</span>
          <div className="mt-2.5 flex items-center text-[11px] text-emerald-600 font-semibold">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            <span>+1.4% change from Q1</span>
          </div>
          <span className="text-[9px] text-slate-400 font-mono mt-1.5 block">Managed by: Cathbet Manjolo</span>
        </div>

        {/* Metric 2: Asset Register */}
        <div className="bg-white border border-slate-200 rounded-sm p-5 relative overflow-hidden shadow-sm">
          <div className="absolute top-4 right-4 text-indigo-600 bg-indigo-50 p-2 rounded-sm border border-indigo-100">
            <DollarSign className="w-4 h-4" />
          </div>
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">Managed Assets Register</span>
          <span className="text-2xl font-bold text-slate-950 tracking-tight mt-2 block">
            K{(totalAssetsValue / 1000).toFixed(1)}M
          </span>
          <div className="mt-2.5 flex items-center text-[11px] text-slate-500">
            <span className="font-semibold text-slate-700 mr-1">{database.assets.length} Assets</span>
            <span>monitored by Gift Kameta</span>
          </div>
          <span className="text-[9px] text-slate-400 font-mono mt-1.5 block">Current valuations indexed</span>
        </div>

        {/* Metric 3: Active Budgets */}
        <div className="bg-white border border-slate-200 rounded-sm p-5 relative overflow-hidden shadow-sm">
          <div className="absolute top-4 right-4 text-indigo-600 bg-indigo-50 p-2 rounded-sm border border-indigo-100">
            <TreePine className="w-4 h-4" />
          </div>
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">Capital Project Allocations</span>
          <span className="text-2xl font-bold text-slate-950 tracking-tight mt-2 block">
            K{(totalBudget / 1000).toFixed(1)}M
          </span>
          <div className="mt-2.5 flex items-center text-[11px] text-slate-500">
            <span className="font-semibold text-slate-700 mr-1">{database.projects.length} Projects</span>
            <span>managed by Misheck Chioko</span>
          </div>
          <span className="text-[9px] text-slate-400 font-mono mt-1.5 block">Pine, Farm, & Commercial Real Estate</span>
        </div>

        {/* Metric 4: Net Treasury */}
        <div className="bg-white border border-slate-200 rounded-sm p-5 relative overflow-hidden shadow-sm">
          <div className="absolute top-4 right-4 text-indigo-600 bg-indigo-50 p-2 rounded-sm border border-indigo-100">
            <TrendingUp className="w-4 h-4" />
          </div>
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">Net Ledger Reserve Flow</span>
          <span className={`text-2xl font-bold tracking-tight mt-2 block ${netReserveFlow >= 0 ? 'text-slate-950' : 'text-rose-600'}`}>
            K{(netReserveFlow / 1000).toFixed(1)}M
          </span>
          <div className="mt-2.5 flex items-center text-[11px] text-slate-500">
            <span className="font-semibold text-emerald-600 mr-1">K{(totalRevenue / 1000).toFixed(1)}M In</span>
            <span>/ K{(totalExpense / 1000).toFixed(1)}M Out</span>
          </div>
          <span className="text-[9px] text-slate-400 font-mono mt-1.5 block">Audit ref: Judgement Phiri</span>
        </div>
      </div>

      {/* Main Content Split: Ledger and Corporate Bulletins */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Treasury Ledger Register */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold tracking-wider uppercase font-mono text-slate-800 flex items-center">
              <DollarSign className="w-4 h-4 mr-1 text-indigo-600" /> Active General Ledger
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Real-time data synchronization</span>
          </div>

          <div className="border border-slate-200 rounded-sm bg-white overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-mono text-[10px] uppercase font-bold">
                    <th className="py-2.5 px-4">Date</th>
                    <th className="py-2.5 px-4">Description</th>
                    <th className="py-2.5 px-4">Category</th>
                    <th className="py-2.5 px-4 text-right">Amount</th>
                    <th className="py-2.5 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {database.accounts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400 italic">No ledger transactions on file.</td>
                    </tr>
                  ) : (
                    database.accounts.map((tx: AccountEntry) => (
                      <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 font-mono text-slate-500 text-[11px] whitespace-nowrap">{tx.date}</td>
                        <td className="py-3 px-4 font-medium text-slate-800">
                          <div className="font-semibold">{tx.description}</div>
                          <div className="text-[9px] text-slate-400 font-mono mt-0.5">Ref: {tx.ref}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-sm text-[9px] font-mono font-semibold tracking-wide uppercase ${
                            tx.category === "Revenue" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                            tx.category === "Expense" ? "bg-rose-50 text-rose-700 border border-rose-100" :
                            "bg-amber-50 text-amber-700 border border-amber-100"
                          }`}>
                            {tx.category}
                          </span>
                        </td>
                        <td className={`py-3 px-4 text-right font-mono font-bold ${tx.amount >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                          {tx.amount >= 0 ? "+" : ""}{(tx.amount).toLocaleString("en-US", { style: "currency", currency: "MWK" }).replace("MWK", "K")}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteItem("accounts", tx.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded-sm hover:bg-slate-100 transition-colors"
                            title="Remove transaction"
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
        </div>

        {/* Right column: Corporate Bulletins Feed */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold tracking-wider uppercase font-mono text-slate-800 flex items-center">
              <FileText className="w-4 h-4 mr-1 text-indigo-600" /> Executive Bulletins
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Corporate disclosures</span>
          </div>

          <div className="space-y-3.5">
            {database.announcements.length === 0 ? (
              <div className="border border-slate-200 rounded-sm p-6 text-center text-slate-400 italic bg-white shadow-sm">
                No active corporate announcements on file.
              </div>
            ) : (
              database.announcements.map((ann: Announcement) => (
                <div key={ann.id} className="p-4 bg-white border border-slate-200 rounded-sm space-y-2 relative group hover:border-slate-300 transition-colors shadow-sm text-left">
                  <div className="flex items-start justify-between">
                    <span className={`px-1.5 py-0.5 rounded-sm text-[9px] font-mono font-bold uppercase ${
                      ann.category === "Corporate" ? "bg-indigo-50 text-indigo-700 border border-indigo-100" :
                      ann.category === "Farming" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                      "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    }`}>
                      {ann.category}
                    </span>
                    <div className="flex items-center space-x-1">
                      <span className="text-[10px] text-slate-400 font-mono flex items-center">
                        <Calendar className="w-3 h-3 mr-1" /> {ann.date}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem("announcements", ann.id)}
                        className="text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 p-0.5 rounded-sm transition-all ml-1"
                        title="Remove announcement"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">{ann.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{ann.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* --- POPUPS / MODALS --- */}
      {/* 1. Record Transaction Popup */}
      {showAddTx && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-sm p-6 w-full max-w-md space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-800 font-mono uppercase">Record Ledger Transaction</h3>
              <button
                type="button"
                onClick={() => setShowAddTx(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xs uppercase font-mono"
              >
                Close
              </button>
            </div>
            <form onSubmit={handleAddTx} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase font-bold">Description</label>
                <input
                  type="text"
                  required
                  value={txForm.description}
                  onChange={(e) => setTxForm({ ...txForm, description: e.target.value })}
                  placeholder="e.g., Pine Timber Sale Dividend"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-900 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase font-bold">Category</label>
                  <select
                    value={txForm.category}
                    onChange={(e) => setTxForm({ ...txForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-900 text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Revenue">Revenue (Income)</option>
                    <option value="Expense">Expense (Outgoing)</option>
                    <option value="Reserve Transfer">Reserve Transfer</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase font-bold">Amount (K)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={txForm.amount}
                    onChange={(e) => setTxForm({ ...txForm, amount: e.target.value })}
                    placeholder="e.g., 50000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-900 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase font-bold">Authorized Ref / Staff</label>
                <input
                  type="text"
                  required
                  value={txForm.ref}
                  onChange={(e) => setTxForm({ ...txForm, ref: e.target.value })}
                  placeholder="e.g., Cathbet Manjolo"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-900 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-bold uppercase tracking-wider text-xs rounded-sm transition-colors shadow-md"
              >
                Log Entry Into Ledger
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Post Announcement Popup */}
      {showAddAnn && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-sm p-6 w-full max-w-md space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-800 font-mono uppercase">Publish Executive Bulletin</h3>
              <button
                type="button"
                onClick={() => setShowAddAnn(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xs uppercase font-mono"
              >
                Close
              </button>
            </div>
            <form onSubmit={handleAddAnn} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase font-bold">Bulletin Title</label>
                <input
                  type="text"
                  required
                  value={annForm.title}
                  onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })}
                  placeholder="e.g., Board Resolution on Land Acquisition"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-900 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase font-bold">Category</label>
                <select
                  value={annForm.category}
                  onChange={(e) => setAnnForm({ ...annForm, category: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-900 text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="Corporate">Corporate Announcement</option>
                  <option value="Farming">Farming Updates</option>
                  <option value="Forestry">Forestry Operations</option>
                  <option value="General">General Disclosures</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase font-bold">Content Body</label>
                <textarea
                  required
                  rows={4}
                  value={annForm.content}
                  onChange={(e) => setAnnForm({ ...annForm, content: e.target.value })}
                  placeholder="Draft details here..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-900 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-bold uppercase tracking-wider text-xs rounded-sm transition-colors shadow-md"
              >
                Publish Bulletin
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
