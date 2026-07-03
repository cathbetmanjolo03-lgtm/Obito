import React, { useState } from "react";
import { motion } from "motion/react";
import { Users, ChevronDown, UserCheck, Mail, Shield, Award, Target, Briefcase } from "lucide-react";
import { User } from "../types";

interface OrganigramViewProps {
  currentUser: User;
  onSimulateUser: (user: User) => void;
}

interface OrganigramMember {
  id: number;
  name: string;
  email: string;
  role: string;
  pin: string;
  desc: string;
  deliverables: string[];
}

const MEMBERS: OrganigramMember[] = [
  {
    id: 1,
    name: "Cathbet Manjolo",
    email: "cathbetmanjolo6@gmail.com",
    role: "Directing Manager, Chief Actuary, Treasurer & Subsidiaries Director",
    pin: "0000",
    desc: "Provides overarching corporate governance, solvency modeling, asset-liability allocation, and manages high-level subsidiaries.",
    deliverables: ["Solvency II Compliance", "Asset-Liability Matching", "Capital Allocation Protocols", "Treasury Liquidity Reserves"]
  },
  {
    id: 2,
    name: "Gift Kameta",
    email: "gift.kameta@gmh.com",
    role: "Physical Asset Director & Investment Monitor",
    pin: "1111",
    desc: "Monitors the condition and security of physical holdings (forest land, farm crops, heavy equipment) and keeps investment metrics accurate.",
    deliverables: ["Physical Asset Register", "Depreciation Forecasting", "Investment Yield Performance", "Asset Security Auditing"]
  },
  {
    id: 3,
    name: "Potipher Moses",
    email: "potipher.moses@gmh.com",
    role: "Pine Project Director",
    pin: "2222",
    desc: "Supervises all timber and forestry actions including land prep, seedling growth, planting densities, thinning cycles, and final harvest yields.",
    deliverables: ["Silviculture Standards", "Timber Harvesting Projections", "Forestry Expansion Plans", "Eco-System Stewardship"]
  },
  {
    id: 4,
    name: "Gerald Mulinde",
    email: "gerald.mulinde@gmh.com",
    role: "Mega Farming & GMH Media Director",
    pin: "3333",
    desc: "Manages large-scale grain production, pivots, soil nutrients, harvesting machinery, and directs GMH public relations and press releases.",
    deliverables: ["Crop Yield Optimization", "Agricultural Operations Logs", "Press Disclosures", "Stakeholder Communications"]
  },
  {
    id: 5,
    name: "Misheck Chioko",
    email: "misheck.chioko@gmh.com",
    role: "Projects Manager",
    pin: "4444",
    desc: "Unifies the execution timelines, resource leveling, and project management Gantt milestones across all capital projects.",
    deliverables: ["Unified Project Gantt Chart", "Resource Leveling Tables", "Operational Coordination", "Milestone Tracking Reports"]
  },
  {
    id: 6,
    name: "Judgement Phiri",
    email: "judgement.phiri@gmh.com",
    role: "Accounts, Systems & Data Analytics Director",
    pin: "5555",
    desc: "Directs internal accounting, digital systems orchestration, servers, analytical reports, and corporate ledger accuracy.",
    deliverables: ["System Architecture Logs", "Double-Entry Ledger Integrity", "Operational Data Analytics", "Security Gateway Systems"]
  },
  {
    id: 7,
    name: "Andrew Kaumba",
    email: "andrew.kaumba@gmh.com",
    role: "Risk & Optimization Director & Secretary",
    pin: "6666",
    desc: "Identifies system-wide business risks, develops mitigation frameworks, and records corporate secretary boards resolutions.",
    deliverables: ["Risk Matrix Register", "Mitigation Compliance Reviews", "Board Resolutions Log", "Statutory Filings Compliance"]
  },
  {
    id: 8,
    name: "Nelson Nkhoma",
    email: "nelson.nkhoma@gmh.com",
    role: "Value Chain & Business Developments Director",
    pin: "7777",
    desc: "Develops downstream value-addition strategies (crop processing, lumber milling) and drafts strategic expansion contracts.",
    deliverables: ["Value Chain Integration Maps", "Strategic Partnerships contracts", "Market Arbitrage Analysis", "Downstream Processing Setups"]
  },
  {
    id: 9,
    name: "Peter Msamba",
    email: "peter.msamba@gmh.com",
    role: "Real Estate & Properties Development Director",
    pin: "8888",
    desc: "Coordinates the commercial property leasing assets, construction projects, tenant leasing registers, and building maintenance.",
    deliverables: ["Properties Valuation Register", "Tenant Leasing Roll", "Construction Management", "Facility Inspections Log"]
  },
  {
    id: 10,
    name: "Sosten Kamowa",
    email: "sosten.kamowa@gmh.com",
    role: "Quantitative & Business Valuation Director",
    pin: "9999",
    desc: "Develops discounted cash flow (DCF) models, conducts business valuations of subsidiaries, and performs quantitative modeling of investment yields.",
    deliverables: ["DCF Financial Modeling", "Subsidiary Valuation Reports", "Yield Risk Sensitivity Tables", "Investment Portfolios Math"]
  }
];

export default function OrganigramView({ currentUser, onSimulateUser }: OrganigramViewProps) {
  const [selectedMember, setSelectedMember] = useState<OrganigramMember | null>(null);

  const handleSimulate = (member: OrganigramMember) => {
    onSimulateUser({
      name: member.name,
      email: member.email,
      role: member.role
    });
    setSelectedMember(null);
  };

  return (
    <div id="organigram-view-tab" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl font-mono">Organigram</h1>
          <p className="text-xs text-slate-500 mt-1">Official Executive Structure - Roles &amp; Responsibilities.</p>
        </div>
        <div className="text-xs text-slate-500 flex items-center bg-white px-3.5 py-1.5 rounded-sm border border-slate-200 font-mono">
          <Users className="w-4 h-4 mr-1.5 text-indigo-600" /> Total Board Members: 10
        </div>
      </div>

      {/* Split layout: Tree + Selected member details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Vertical chain matching the PDF organigram */}
        <div className="lg:col-span-6 flex flex-col items-center bg-slate-50 border border-slate-200 p-6 rounded-sm max-h-[70vh] overflow-y-auto">
          <div className="text-[10px] uppercase font-mono tracking-widest text-slate-500 mb-6 flex items-center font-bold">
            <Briefcase className="w-3.5 h-3.5 mr-1.5 text-indigo-600" /> Linear Command Chain (PDF Organigram)
          </div>

          <div className="flex flex-col items-center space-y-4 w-full max-w-sm">
            {MEMBERS.map((member, index) => {
              const isCurrent = currentUser.email === member.email;
              const isSelected = selectedMember?.id === member.id;
              
              return (
                <React.Fragment key={member.id}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedMember(member)}
                    className={`w-full p-4 rounded-sm text-left border transition-all relative ${
                      isCurrent
                        ? "bg-indigo-50/55 border-indigo-400 shadow-sm"
                        : isSelected
                        ? "bg-slate-100 border-slate-300"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                    }`}
                  >
                    {isCurrent && (
                      <span className="absolute top-2 right-2 bg-indigo-100 border border-indigo-200 text-[8px] font-mono uppercase tracking-widest text-indigo-700 px-1.5 py-0.5 rounded-sm font-bold">
                        Active
                      </span>
                    )}
                    <span className="text-[9px] font-mono text-slate-400 block uppercase font-bold">Role #{member.id}</span>
                    <h3 className="text-xs font-bold text-slate-800 mt-1">{member.name}</h3>
                    <p className="text-[10px] text-indigo-600 mt-0.5 truncate font-semibold">{member.role}</p>
                  </motion.button>
                  
                  {index < MEMBERS.length - 1 && (
                    <div className="flex flex-col items-center">
                      <div className="w-0.5 h-4 bg-gradient-to-b from-indigo-500 to-indigo-100" />
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 -my-0.5" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Executive Spec Sheet */}
        <div className="lg:col-span-6 space-y-4">
          {selectedMember ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border border-slate-200 rounded-sm p-6 space-y-6 shadow-sm"
            >
              {/* Profile card header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-indigo-600 uppercase tracking-widest font-bold">Executive Dossier</span>
                  <h2 className="text-lg font-bold text-slate-900 mt-1">{selectedMember.name}</h2>
                  <p className="text-xs text-slate-500 font-mono mt-0.5 flex items-center">
                    <Mail className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> {selectedMember.email}
                  </p>
                </div>
                <div className="bg-indigo-50 border border-indigo-100 p-2.5 rounded-sm text-indigo-600">
                  <Shield className="w-5 h-5" />
                </div>
              </div>

              {/* Title & description */}
              <div className="space-y-2 text-left">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Official Charter Roles</span>
                <div className="p-3 bg-slate-50 rounded-sm border border-slate-200 text-xs font-semibold text-slate-700">
                  {selectedMember.role}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pt-2">
                  {selectedMember.desc}
                </p>
              </div>

              {/* Core Deliverables / Responsibilities */}
              <div className="space-y-2.5 text-left">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Core Charter Deliverables</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedMember.deliverables.map((del, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-sm flex items-center space-x-2 text-xs text-slate-700">
                      <Target className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                      <span className="truncate">{del}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick simulation controls */}
              <div className="border-t border-slate-200 pt-5 flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  <span>Passcode PIN: </span>
                  <code className="text-slate-700 bg-slate-100 px-1 py-0.5 rounded-sm font-mono">{selectedMember.pin}</code>
                </div>
                <button
                  type="button"
                  onClick={() => handleSimulate(selectedMember)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold uppercase tracking-wider text-[11px] rounded-sm transition-colors flex items-center space-x-1.5 shadow-sm"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Simulate Login</span>
                </button>
              </div>

            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-slate-50 border border-dashed border-slate-300 rounded-sm min-h-[300px]">
              <Award className="w-10 h-10 text-slate-300 mb-2" />
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-tight">Executive Spec Sheet</h3>
              <p className="text-xs text-slate-500 max-w-xs mt-1 leading-relaxed">
                Select any director card from the linear organigram chain to inspect details, view deliverables, or simulate a login session.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
