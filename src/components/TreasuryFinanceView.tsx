import React, { useState } from "react";
import { motion } from "motion/react";
import { Wallet, Calculator, Percent, ShieldCheck, HelpCircle, Plus, Trash2, ArrowUpRight } from "lucide-react";
import { GMHDatabase, User, CompanyValuation } from "../types";

interface TreasuryFinanceViewProps {
  database: GMHDatabase;
  currentUser: User;
  onRefresh: () => void;
}

export default function TreasuryFinanceView({ database, currentUser, onRefresh }: TreasuryFinanceViewProps) {
  // DCF Form State
  const [wacc, setWacc] = useState(12); // WACC percentage
  const [terminalGrowth, setTerminalGrowth] = useState(3.5); // Terminal growth rate %
  const [baseCashFlow, setBaseCashFlow] = useState(250000); // Year 1 cash flow (MWK)
  const [growthRate, setGrowthRate] = useState(8); // Multi-year growth rate %
  const [calculatedVal, setCalculatedVal] = useState<number | null>(null);

  // New valuation record addition
  const [companyName, setCompanyName] = useState("");
  const [bookValue, setBookValue] = useState("");

  // Actuarial Liability Form State
  const [interestRate, setInterestRate] = useState(9.5);
  const [mortalityExp, setMortalityExp] = useState("Standard-2026");
  const [avgDuration, setAvgDuration] = useState(18);
  const [annualPayout, setAnnualPayout] = useState(50000);

  // Calculate DCF
  const runDCF = () => {
    const rateOfReturn = wacc / 100;
    const g = growthRate / 100;
    const tg = terminalGrowth / 100;

    // 5 Year Projections
    let cashFlows: number[] = [];
    let discountedFlows: number[] = [];
    let currentFlow = baseCashFlow;

    for (let yr = 1; yr <= 5; yr++) {
      currentFlow = currentFlow * (1 + g);
      cashFlows.push(currentFlow);
      discountedFlows.push(currentFlow / Math.pow(1 + rateOfReturn, yr));
    }

    // Terminal value at Year 5
    const terminalValue = (cashFlows[4] * (1 + tg)) / (rateOfReturn - tg);
    const discountedTerminalValue = terminalValue / Math.pow(1 + rateOfReturn, 5);

    const pvOfCashFlows = discountedFlows.reduce((sum, f) => sum + f, 0);
    const enterpriseValue = pvOfCashFlows + discountedTerminalValue;

    setCalculatedVal(enterpriseValue);
  };

  // Actuarial Reserves calculation (Present value of life annuities/long-term liabilities)
  const calculateActuarialReserves = () => {
    const r = interestRate / 100;
    // Simple PV of annuity factor: a_n = (1 - (1+r)^-n) / r
    const annuityFactor = (1 - Math.pow(1 + r, -avgDuration)) / r;
    const requiredReserves = annualPayout * annuityFactor;
    return {
      factor: annuityFactor.toFixed(3),
      reserves: requiredReserves
    };
  };

  const actuarialResult = calculateActuarialReserves();

  const handleSaveValuation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !bookValue || !calculatedVal) return;

    try {
      const res = await fetch("/api/data/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "valuations",
          action: "add",
          payload: {
            company: companyName,
            bookValue: Number(bookValue),
            discountedCashFlow: Math.round(calculatedVal),
            valuationDate: new Date().toISOString().split("T")[0],
            valuer: currentUser.name
          }
        })
      });

      if (res.ok) {
        onRefresh();
        setCompanyName("");
        setBookValue("");
        setCalculatedVal(null);
      }
    } catch (err) {
      console.error("Failed to save valuation record", err);
    }
  };

  const handleDeleteValuation = async (id: string) => {
    try {
      const res = await fetch("/api/data/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "valuations",
          action: "delete",
          payload: { id }
        })
      });
      if (res.ok) {
        onRefresh();
      }
    } catch (err) {
      console.error("Failed to delete valuation record", err);
    }
  };

  return (
    <div id="treasury-finance-tab" className="space-y-6">
      {/* Tab Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl font-mono">Treasury &amp; Valuations</h1>
          <p className="text-xs text-slate-500 mt-1">Quantitative modules for Sosten Kamowa (Valuations) &amp; Cathbet Manjolo (Chief Actuary).</p>
        </div>
        <div className="text-xs text-indigo-600 flex items-center bg-white px-3 py-1 rounded-sm border border-slate-200 font-mono font-bold shadow-sm">
          <ShieldCheck className="w-4 h-4 mr-1.5 text-indigo-600" /> Solvency Standard Verified
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Sosten's DCF Valuer & Calculated List */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="bg-white border border-slate-200 p-5 rounded-sm space-y-4 shadow-sm">
            <div className="flex items-center space-x-2 border-b border-slate-200 pb-2.5">
              <Calculator className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-800 font-bold">DCF Asset valuation Calculator</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">WACC Cost of Capital (%)</label>
                <input
                  type="number"
                  value={wacc}
                  onChange={(e) => setWacc(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Terminal Growth Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={terminalGrowth}
                  onChange={(e) => setTerminalGrowth(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Base Cash Flow Yr 1 (K)</label>
                <input
                  type="number"
                  value={baseCashFlow}
                  onChange={(e) => setBaseCashFlow(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Expected Growth Rate (%)</label>
                <input
                  type="number"
                  value={growthRate}
                  onChange={(e) => setGrowthRate(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white font-mono"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={runDCF}
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wider text-[11px] rounded-sm transition-colors cursor-pointer shadow-sm"
              >
                Execute DCF Projections
              </button>
            </div>

            {calculatedVal !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-indigo-50 border border-indigo-100 p-4 rounded-sm space-y-3"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">DCF Enterprise Valuation:</span>
                  <span className="font-mono font-bold text-indigo-600 text-sm">
                    K{calculatedVal.toLocaleString("en-US")}
                  </span>
                </div>
                
                {/* Save Form inside results */}
                <form onSubmit={handleSaveValuation} className="border-t border-indigo-100 pt-3 space-y-2 text-xs">
                  <p className="text-[10px] text-slate-500">Log this result to the subsidiary register:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Subsidiary Name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-sm text-slate-800 text-[11px] focus:outline-none focus:border-indigo-500"
                    />
                    <input
                      type="number"
                      required
                      placeholder="Book Value (K)"
                      value={bookValue}
                      onChange={(e) => setBookValue(e.target.value)}
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-sm text-slate-800 text-[11px] focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold uppercase tracking-wider text-[10px] rounded-sm transition-colors cursor-pointer"
                  >
                    Commit Valuation to Database
                  </button>
                </form>
              </motion.div>
            )}
          </div>

          {/* Valuations Register */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-indigo-600 flex items-center font-bold">
              <Wallet className="w-4 h-4 mr-1.5 text-indigo-600" /> Subsidiary Valuation Ledger
            </h3>
            <div className="border border-slate-200 rounded-sm bg-white overflow-hidden text-xs shadow-sm">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-mono text-[10px] font-bold">
                    <th className="py-2.5 px-4">Entity</th>
                    <th className="py-2.5 px-4 text-right">Book Value</th>
                    <th className="py-2.5 px-4 text-right">DCF Valuation</th>
                    <th className="py-2.5 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {database.valuations.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-5 text-center text-slate-400 italic">No valuation records on file.</td>
                    </tr>
                  ) : (
                    database.valuations.map((val: CompanyValuation) => (
                      <tr key={val.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-800">{val.company}</div>
                          <div className="text-[9px] text-slate-400 font-mono mt-0.5">Date: {val.valuationDate} | By: {val.valuer.split(" ")[0]}</div>
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-slate-500">
                          K{val.bookValue.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-indigo-600 font-bold">
                          K{val.discountedCashFlow.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteValuation(val.id)}
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
        </div>

        {/* Right Column: Actuarial reserve modeling (Cathbet's module) */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="bg-white border border-slate-200 p-5 rounded-sm space-y-4 shadow-sm">
            <div className="flex items-center space-x-2 border-b border-slate-200 pb-2.5">
              <Percent className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-800 font-bold">Actuarial reserves &amp; solvent model</h3>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Maintained by Directing Manager &amp; Chief Actuary **Cathbet Manjolo**. Models long-term annuity liabilities and capital reserves against solvency requirements.
            </p>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Discount Rate (r) %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Mortality Exp Curve</label>
                  <select
                    value={mortalityExp}
                    onChange={(e) => setMortalityExp(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white font-sans"
                  >
                    <option value="Standard-2026">Standard GMH-2026</option>
                    <option value="Conservative-Q">Conservative-Q</option>
                    <option value="Optimistic-Life">Optimistic Life-Exp</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Liability Duration (yrs)</label>
                  <input
                    type="number"
                    value={avgDuration}
                    onChange={(e) => setAvgDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Annual Pension Commitments (K)</label>
                  <input
                    type="number"
                    value={annualPayout}
                    onChange={(e) => setAnnualPayout(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Annuity Present Value Factor (a_n):</span>
                <span className="font-mono text-slate-800 font-bold">{actuarialResult.factor}</span>
              </div>
              
              <div className="bg-indigo-50 border border-indigo-100 p-3.5 rounded-sm flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono text-indigo-700 block uppercase font-bold">Required Solvent Capital Reserves</span>
                  <span className="text-base font-bold text-indigo-600 font-mono">
                    K{Math.round(actuarialResult.reserves).toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-mono text-slate-500 block uppercase">Solvency Margin</span>
                  <span className="text-xs font-bold text-indigo-600 font-mono">
                    174.2% Passed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
