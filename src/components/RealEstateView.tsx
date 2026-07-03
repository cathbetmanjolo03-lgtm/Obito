import React, { useState } from "react";
import { motion } from "motion/react";
import { Building, Plus, Trash2, Home, Key, TrendingUp, Sparkles } from "lucide-react";
import { GMHDatabase, User } from "../types";

interface RealEstateViewProps {
  database: GMHDatabase;
  currentUser: User;
  onRefresh: () => void;
}

export default function RealEstateView({ database, currentUser, onRefresh }: RealEstateViewProps) {
  const [properties, setProperties] = useState([
    { id: "prop-1", name: "Blantyre Corporate Hub", type: "Office", value: 1200000, yield: "8.5%", tenancy: "94%", suites: 18, manager: "Peter Msamba" },
    { id: "prop-2", name: "Limbe Commercial Center", type: "Retail Complex", value: 2400000, yield: "9.2%", tenancy: "82%", suites: 45, manager: "Peter Msamba" },
    { id: "prop-3", name: "Zomba Residential Block A", type: "Multi-family", value: 750000, yield: "7.1%", tenancy: "100%", suites: 12, manager: "Peter Msamba" }
  ]);

  const [showAddProp, setShowAddProp] = useState(false);
  const [propForm, setPropForm] = useState({
    name: "",
    type: "Office",
    value: "",
    yield: "8.5",
    tenancy: "90",
    suites: "10"
  });

  const handleAddProp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propForm.name || !propForm.value) return;

    const newProp = {
      id: `prop-${Date.now()}`,
      name: propForm.name,
      type: propForm.type,
      value: Number(propForm.value),
      yield: `${propForm.yield}%`,
      tenancy: `${propForm.tenancy}%`,
      suites: Number(propForm.suites),
      manager: currentUser.name
    };

    setProperties([newProp, ...properties]);
    setPropForm({ name: "", type: "Office", value: "", yield: "8.5", tenancy: "90", suites: "10" });
    setShowAddProp(false);
  };

  return (
    <div id="real-estate-tab" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl font-mono">Real Estate &amp; Properties</h1>
          <p className="text-xs text-slate-500 mt-1">Commercial developments managed by Peter Msamba (Real Estate &amp; Properties Director).</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddProp(true)}
          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wider text-[11px] rounded-sm transition-colors flex items-center space-x-1.5 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Register Property Asset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Properties List */}
        <div className="lg:col-span-8 space-y-4 text-left">
          <h3 className="text-xs font-mono uppercase tracking-wider text-indigo-600 flex items-center font-bold">
            <Building className="w-4 h-4 mr-1.5 text-indigo-600" /> Commercial Properties Register
          </h3>

          <div className="border border-slate-200 rounded-sm bg-white overflow-hidden text-xs shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-mono text-[10px] font-bold">
                  <th className="py-2.5 px-4">Property Complex</th>
                  <th className="py-2.5 px-4">Classification</th>
                  <th className="py-2.5 px-4 text-right">Market Valuation</th>
                  <th className="py-2.5 px-4 text-center">Rental Yield</th>
                  <th className="py-2.5 px-4 text-center">Occupancy</th>
                  <th className="py-2.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {properties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800">{prop.name}</div>
                      <div className="text-[9px] text-slate-400 font-mono mt-0.5">{prop.suites} fully configured suites | Mgr: {prop.manager.split(" ")[0]}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-sm font-mono text-[10px]">
                        {prop.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">
                      K{prop.value.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center text-indigo-600 font-mono font-semibold">
                      {prop.yield}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        <span className="font-mono text-slate-700">{prop.tenancy}</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => setProperties(properties.filter(item => item.id !== prop.id))}
                        className="text-slate-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Lease Rent yields math helper */}
        <div className="lg:col-span-4 space-y-4 text-left">
          <div className="bg-white border border-slate-200 p-5 rounded-sm space-y-4 shadow-sm">
            <div className="flex items-center space-x-2 border-b border-slate-200 pb-2.5">
              <Key className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-800 font-bold">Properties yield Estimator</h3>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Calculate the target annual revenue and cap rates of property assets based on square footage, monthly leasing averages, and general operational overhead percentages.
            </p>

            <div className="space-y-3 pt-1 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 font-mono block font-bold">Estimated Suites</span>
                <span className="font-semibold text-slate-800">12 Corporate Suites</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-mono block font-bold">Average Suite Rent</span>
                <span className="font-semibold text-slate-800">K250,000 / month</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-mono block font-bold">Operating Expense (OpEx)</span>
                <span className="font-semibold text-slate-800">15% on revenue</span>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 space-y-2">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Gross Annual Billing:</span>
                <span className="font-mono text-slate-800 font-semibold">K36,000,000</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Net Operating Income (NOI):</span>
                <span className="font-mono text-slate-800 font-semibold">K30,600,000</span>
              </div>
              <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-sm flex items-center justify-between mt-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Cap Rate yield @ K350M Value</span>
                <span className="text-xs font-bold text-indigo-600 font-mono">
                  8.74% Net
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Popups */}
      {showAddProp && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-sm p-6 w-full max-w-md space-y-4 shadow-xl text-left">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-tight">Register Commercial Asset</h3>
              <button
                type="button"
                onClick={() => setShowAddProp(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-wider font-mono"
              >
                Close
              </button>
            </div>
            <form onSubmit={handleAddProp} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Property Complex Name</label>
                <input
                  type="text"
                  required
                  value={propForm.name}
                  onChange={(e) => setPropForm({ ...propForm, name: e.target.value })}
                  placeholder="e.g., Zomba Commercial Block C"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Property Type</label>
                  <select
                    value={propForm.type}
                    onChange={(e) => setPropForm({ ...propForm, type: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    <option value="Office">Office</option>
                    <option value="Retail Complex">Retail Complex</option>
                    <option value="Multi-family">Multi-family Residential</option>
                    <option value="Industrial">Industrial Warehouse</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Valuation (K)</label>
                  <input
                    type="number"
                    required
                    value={propForm.value}
                    onChange={(e) => setPropForm({ ...propForm, value: e.target.value })}
                    placeholder="e.g., 1500000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">Target Yield (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={propForm.yield}
                    onChange={(e) => setPropForm({ ...propForm, yield: e.target.value })}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-800 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">Occupancy (%)</label>
                  <input
                    type="number"
                    value={propForm.tenancy}
                    onChange={(e) => setPropForm({ ...propForm, tenancy: e.target.value })}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-800 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">Suites Count</label>
                  <input
                    type="number"
                    value={propForm.suites}
                    onChange={(e) => setPropForm({ ...propForm, suites: e.target.value })}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-sm"
              >
                Log Commercial Asset
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
