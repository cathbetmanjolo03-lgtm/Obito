import React, { useState } from "react";
import { motion } from "motion/react";
import { TreePine, Wheat, Plus, Trash2, Droplets, Shovel, Sparkles } from "lucide-react";
import { GMHDatabase, User } from "../types";

interface ForestryAgriViewProps {
  database: GMHDatabase;
  currentUser: User;
  onRefresh: () => void;
}

export default function ForestryAgriView({ database, currentUser, onRefresh }: ForestryAgriViewProps) {
  // Forestry State
  const [forestTracts, setForestTracts] = useState([
    { id: "ft-1", name: "Zomba Plateau Block C", area: "120 Hectares", variety: "Pinus Patula", density: 1600, plantingYear: 2018, status: "Thinning Phase" },
    { id: "ft-2", name: "Viphya Reserve Compartment 9", area: "350 Hectares", variety: "Pinus Patula", density: 1400, plantingYear: 2021, status: "Growth Phase" },
    { id: "ft-3", name: "Mulanje Foothills Area 2", area: "80 Hectares", variety: "Pinus Patula", density: 1800, plantingYear: 2025, status: "Seedling Phase" }
  ]);

  const [farmingBlocks, setFarmingBlocks] = useState([
    { id: "fb-1", location: "Chikwawa West Block 1A", crop: "Maize", area: "150 Hectares", waterSource: "Shire River Pivot", health: "Optimal", yieldEst: "9.2 Tons/Ha" },
    { id: "fb-2", location: "Chikwawa Central Block 2", crop: "Soya Beans", area: "120 Hectares", waterSource: "Borehole Drip", health: "Optimal", yieldEst: "3.4 Tons/Ha" },
    { id: "fb-3", location: "Chikwawa North Block 4", crop: "Winter Wheat", area: "100 Hectares", waterSource: "Shire River Pivot", health: "Under-watered", yieldEst: "5.8 Tons/Ha" }
  ]);

  // Forest Tract Form
  const [showAddForest, setShowAddForest] = useState(false);
  const [forestForm, setForestForm] = useState({
    name: "",
    area: "",
    variety: "Pinus Patula",
    density: 1600,
    plantingYear: 2026,
    status: "Seedling Phase"
  });

  // Farming Block Form
  const [showAddFarm, setShowAddFarm] = useState(false);
  const [farmForm, setFarmForm] = useState({
    location: "",
    crop: "Maize",
    area: "",
    waterSource: "Shire River Pivot",
    health: "Optimal",
    yieldEst: "8.5 Tons/Ha"
  });

  // Calculators
  const [calcAge, setCalcAge] = useState(15);
  const [calcHectares, setCalcHectares] = useState(100);

  const calculateTimberVolume = () => {
    // Estimations: patches of Patula pines yield approx 280 m3 of timber per hectare at 20 years.
    // Linear scale estimate
    const volumePerHa = (calcAge / 20) * 280;
    const totalVolume = volumePerHa * calcHectares;
    const estimatedValue = totalVolume * 45000; // 45000 MKW per cubic meter of softwood
    return {
      volume: totalVolume.toFixed(0),
      m3PerHa: volumePerHa.toFixed(1),
      value: estimatedValue
    };
  };

  const volumeResults = calculateTimberVolume();

  const handleAddForest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forestForm.name || !forestForm.area) return;

    const newTract = {
      id: `ft-${Date.now()}`,
      name: forestForm.name,
      area: `${forestForm.area} Hectares`,
      variety: forestForm.variety,
      density: Number(forestForm.density),
      plantingYear: Number(forestForm.plantingYear),
      status: forestForm.status
    };

    setForestTracts([newTract, ...forestTracts]);
    setForestForm({ name: "", area: "", variety: "Pinus Patula", density: 1600, plantingYear: 2026, status: "Seedling Phase" });
    setShowAddForest(false);
  };

  const handleAddFarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmForm.location || !farmForm.area) return;

    const newBlock = {
      id: `fb-${Date.now()}`,
      location: farmForm.location,
      crop: farmForm.crop,
      area: `${farmForm.area} Hectares`,
      waterSource: farmForm.waterSource,
      health: farmForm.health,
      yieldEst: farmForm.yieldEst
    };

    setFarmingBlocks([newBlock, ...farmingBlocks]);
    setFarmForm({ location: "", crop: "Maize", area: "", waterSource: "Shire River Pivot", health: "Optimal", yieldEst: "8.5 Tons/Ha" });
    setShowAddFarm(false);
  };

  return (
    <div id="forestry-agri-tab" className="space-y-6">
      {/* Tab Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl font-mono">Forestry &amp; Agriculture</h1>
          <p className="text-xs text-slate-500 mt-1">Operational registers for Potipher Moses (Pine Project) &amp; Gerald Mulinde (Mega Farming).</p>
        </div>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setShowAddForest(true)}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wider text-[11px] rounded-sm transition-colors flex items-center space-x-1.5 shadow-sm"
          >
            <TreePine className="w-3.5 h-3.5" />
            <span>Add Pine Tract</span>
          </button>
          <button
            type="button"
            onClick={() => setShowAddFarm(true)}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[11px] rounded-sm transition-colors border border-slate-200 flex items-center space-x-1.5 shadow-sm"
          >
            <Wheat className="w-3.5 h-3.5" />
            <span>Add Crop Block</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Operations Lists */}
        <div className="lg:col-span-8 space-y-6 text-left">
          
          {/* Pine Forestry Registry */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-indigo-600 flex items-center font-bold">
              <TreePine className="w-4 h-4 mr-1.5 text-indigo-600" /> Pine Silviculture Reserve
            </h3>
            <div className="border border-slate-200 rounded-sm bg-white overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-mono text-[10px] font-bold">
                    <th className="py-2.5 px-4">Tract Name</th>
                    <th className="py-2.5 px-4">Area &amp; Variety</th>
                    <th className="py-2.5 px-4">Density / Ha</th>
                    <th className="py-2.5 px-4">Planting Year</th>
                    <th className="py-2.5 px-4">Operations Phase</th>
                    <th className="py-2.5 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {forestTracts.map((ft) => (
                    <tr key={ft.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-slate-800">{ft.name}</td>
                      <td className="py-3 px-4">
                        <div className="text-slate-700 font-medium">{ft.area}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{ft.variety}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">{ft.density} seedlings</td>
                      <td className="py-3 px-4 font-mono text-slate-500">{ft.plantingYear}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-sm text-[9px] font-mono font-bold uppercase ${
                          ft.status.includes("Seedling") ? "bg-amber-100 text-amber-800 border border-amber-200" :
                          ft.status.includes("Thinning") ? "bg-blue-100 text-blue-800 border border-blue-200" :
                          "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        }`}>
                          {ft.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => setForestTracts(forestTracts.filter(item => item.id !== ft.id))}
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

          {/* Mega Farming Registry */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-indigo-600 flex items-center font-bold">
              <Wheat className="w-4 h-4 mr-1.5 text-indigo-600" /> Mega Farming Crop Blocks
            </h3>
            <div className="border border-slate-200 rounded-sm bg-white overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-mono text-[10px] font-bold">
                    <th className="py-2.5 px-4">Block Location</th>
                    <th className="py-2.5 px-4">Crop &amp; Size</th>
                    <th className="py-2.5 px-4">Water Inflow</th>
                    <th className="py-2.5 px-4">Condition</th>
                    <th className="py-2.5 px-4">Yield Forecast</th>
                    <th className="py-2.5 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {farmingBlocks.map((fb) => (
                    <tr key={fb.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-slate-800">{fb.location}</td>
                      <td className="py-3 px-4">
                        <div className="text-slate-700 font-semibold">{fb.crop}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{fb.area}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 flex items-center space-x-1">
                        <Droplets className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{fb.waterSource}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-sm text-[9px] font-mono font-bold uppercase ${
                          fb.health === "Optimal" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" :
                          "bg-amber-100 text-amber-800 border border-amber-200"
                        }`}>
                          {fb.health}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">{fb.yieldEst}</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => setFarmingBlocks(farmingBlocks.filter(item => item.id !== fb.id))}
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

        </div>

        {/* Right Column: Actuarial Timber Growth Math Calculator */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 p-5 rounded-sm space-y-5 shadow-sm text-left">
            <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-800 font-bold">Silviculture Math Projections</h3>
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              Model hypothetical timber yields for softwood varieties based on age and density. Used by **Cathbet Manjolo** (Actuary) and **Potipher Moses** (Pine Director) for capital evaluations.
            </p>

            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Pine Average Age</span>
                  <span className="text-indigo-600 font-mono font-semibold">{calcAge} years</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={calcAge}
                  onChange={(e) => setCalcAge(Number(e.target.value))}
                  className="w-full accent-indigo-600 h-1 bg-slate-100 rounded-sm cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Total Forest Scale</span>
                  <span className="text-indigo-600 font-mono font-semibold">{calcHectares} Hectares</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="500"
                  step="10"
                  value={calcHectares}
                  onChange={(e) => setCalcHectares(Number(e.target.value))}
                  className="w-full accent-indigo-600 h-1 bg-slate-100 rounded-sm cursor-pointer"
                />
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 space-y-3">
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span>Estimated Yield Density:</span>
                <span className="font-mono text-slate-800 font-semibold">{volumeResults.m3PerHa} m³/Hectare</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span>Total Recoverable Timber:</span>
                <span className="font-mono text-slate-800 font-semibold">{volumeResults.volume} m³</span>
              </div>
              <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-sm flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Projected Yield Value</span>
                <span className="text-base font-bold text-indigo-600 font-mono">
                  K{volumeResults.value.toLocaleString("en-US")}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* --- POPUPS / MODALS --- */}
      {/* 1. Add Pine Tract */}
      {showAddForest && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-sm p-6 w-full max-w-md space-y-4 shadow-xl text-left">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-tight">Add Pine Forestry Tract</h3>
              <button
                type="button"
                onClick={() => setShowAddForest(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-wider font-mono"
              >
                Close
              </button>
            </div>
            <form onSubmit={handleAddForest} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Tract Location/Name</label>
                <input
                  type="text"
                  required
                  value={forestForm.name}
                  onChange={(e) => setForestForm({ ...forestForm, name: e.target.value })}
                  placeholder="e.g., Zomba Block F"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Hectares Scale</label>
                  <input
                    type="number"
                    required
                    value={forestForm.area}
                    onChange={(e) => setForestForm({ ...forestForm, area: e.target.value })}
                    placeholder="e.g., 140"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Seedling Density (per Ha)</label>
                  <input
                    type="number"
                    value={forestForm.density}
                    onChange={(e) => setForestForm({ ...forestForm, density: Number(e.target.value) })}
                    placeholder="e.g., 1600"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Planting Year</label>
                  <input
                    type="number"
                    value={forestForm.plantingYear}
                    onChange={(e) => setForestForm({ ...forestForm, plantingYear: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Status Phase</label>
                  <select
                    value={forestForm.status}
                    onChange={(e) => setForestForm({ ...forestForm, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    <option value="Seedling Phase">Seedling Phase</option>
                    <option value="Growth Phase">Growth Phase</option>
                    <option value="Thinning Phase">Thinning Phase</option>
                    <option value="Harvest Ready">Harvest Ready</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-sm"
              >
                Log Tract into Silviculture Register
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Add Crop Block */}
      {showAddFarm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-sm p-6 w-full max-w-md space-y-4 shadow-xl text-left">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-tight">Add Mega Farm Crop Block</h3>
              <button
                type="button"
                onClick={() => setShowAddFarm(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-wider font-mono"
              >
                Close
              </button>
            </div>
            <form onSubmit={handleAddFarm} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Block Location/Designation</label>
                <input
                  type="text"
                  required
                  value={farmForm.location}
                  onChange={(e) => setFarmForm({ ...farmForm, location: e.target.value })}
                  placeholder="e.g., Chikwawa East Section 4"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Crop Variety</label>
                  <select
                    value={farmForm.crop}
                    onChange={(e) => setFarmForm({ ...farmForm, crop: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    <option value="Maize">Maize</option>
                    <option value="Winter Wheat">Winter Wheat</option>
                    <option value="Soya Beans">Soya Beans</option>
                    <option value="Sunflower Seed">Sunflower Seed</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Area Size (Hectares)</label>
                  <input
                    type="number"
                    required
                    value={farmForm.area}
                    onChange={(e) => setFarmForm({ ...farmForm, area: e.target.value })}
                    placeholder="e.g., 100"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Irrigation Source</label>
                  <select
                    value={farmForm.waterSource}
                    onChange={(e) => setFarmForm({ ...farmForm, waterSource: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    <option value="Shire River Pivot">Shire River Center Pivot</option>
                    <option value="Borehole Drip">Borehole Drip</option>
                    <option value="Dryland / Rainfed">Dryland / Rainfed</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Est. Yield (Tons/Ha)</label>
                  <input
                    type="text"
                    value={farmForm.yieldEst}
                    onChange={(e) => setFarmForm({ ...farmForm, yieldEst: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-sm"
              >
                Log Block into Farming Register
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
