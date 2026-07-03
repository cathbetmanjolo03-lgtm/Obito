import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Send, Bot, User as UserIcon, Loader2, RefreshCw } from "lucide-react";
import { User, GMHDatabase } from "../types";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
}

interface AICopilotViewProps {
  database: GMHDatabase;
  currentUser: User;
}

const SUGGESTIONS = [
  "Explain the current Actuarial Solvency Ratio (174.2%) and its reserve margins.",
  "Draft a board resolution for Potipher Moses' Pine Forestry thinning operations.",
  "Compare agricultural crop yields of Maize vs Soya under Shire River center pivot irrigation.",
  "Describe the WACC & Terminal Growth DCF formula used for GMH subsidiary valuations."
];

export default function AICopilotView({ database, currentUser }: AICopilotViewProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender: "bot",
      text: `Hello **${currentUser.name}**. I am the GMH Corporate AI Copilot, configured with server-side secure operations knowledge. I have access to active project budgets, ledger lines, physical asset logs, and risk mitigated registers. How can I assist you with Gula Mvula Holdings (GMH) calculations, reports, or resolutions today?`
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsgId = `user-${Date.now()}`;
    const botMsgId = `bot-${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      { id: userMsgId, sender: "user", text: textToSend }
    ]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/gemini/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: textToSend,
          context: {
            projects: database.projects,
            assets: database.assets,
            accounts: database.accounts,
            risks: database.risks,
            valuations: database.valuations,
            currentUserRole: currentUser.role
          }
        })
      });

      const data = await res.json();

      if (res.ok && data.text) {
        setMessages((prev) => [
          ...prev,
          { id: botMsgId, sender: "bot", text: data.text }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { id: botMsgId, sender: "bot", text: `I encountered an operational issue: ${data.error || "Unable to retrieve calculations."}` }
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: botMsgId, sender: "bot", text: "Communication error: Unable to contact the secure server-side model." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="ai-copilot-tab" className="h-[75vh] flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="text-left">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl font-mono flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-indigo-600" /> GMH AI Copilot
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Server-side AI helper for solvency calculations, forestry yields, and corporate reports.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMessages([messages[0]])}
          className="p-1.5 rounded-sm border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 bg-white flex items-center space-x-1 text-xs font-mono font-bold shadow-sm"
          title="Clear Conversation"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Chat</span>
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 border border-slate-200 bg-slate-50 p-4 rounded-sm min-h-[300px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 max-w-3xl ${
              msg.sender === "user" ? "ml-auto flex-row-reverse space-x-reverse" : "mr-auto"
            }`}
          >
            <div className={`p-2 rounded-sm border ${
              msg.sender === "user"
                ? "bg-slate-100 border-slate-200 text-slate-600"
                : "bg-indigo-50 border-indigo-100 text-indigo-600"
            }`}>
              {msg.sender === "user" ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4 text-indigo-600" />}
            </div>

            <div className={`rounded-sm p-4 text-xs leading-relaxed space-y-2 max-w-lg sm:max-w-xl text-left ${
              msg.sender === "user"
                ? "bg-indigo-600 text-white"
                : "bg-white border border-slate-200 text-slate-850 shadow-sm"
            }`}>
              {/* Parse rudimentary markdown in line items */}
              {msg.text.split("\n").map((line, idx) => {
                let formatted = line;
                // Bold replacement **abc** -> <strong>abc</strong>
                const boldRegex = /\*\*(.*?)\*\*/g;
                const matches = formatted.match(boldRegex);
                if (matches) {
                  return (
                    <p
                      key={idx}
                      dangerouslySetInnerHTML={{
                        __html: formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                      }}
                    />
                  );
                }
                return <p key={idx}>{line}</p>;
              })}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-sm bg-indigo-50 border border-indigo-100">
              <Bot className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-sm p-4 text-xs text-indigo-600 flex items-center space-x-2 font-mono text-left">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
              <span>Analyzing portfolio data and performing actuarial computations...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Prompts Grid */}
      {messages.length === 1 && !loading && (
        <div className="space-y-1.5 text-left">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Query Templates</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SUGGESTIONS.map((sug, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(sug)}
                className="text-left p-2.5 rounded-sm border border-slate-200 bg-white text-[11px] text-slate-600 hover:text-indigo-600 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all truncate shadow-sm cursor-pointer"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="flex items-center space-x-2 bg-slate-50 border border-slate-200 p-2 rounded-sm"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Query calculations as ${currentUser.name.split(" ")[0]}...`}
          className="flex-1 bg-transparent px-3 py-2 text-xs text-slate-800 focus:outline-none placeholder-slate-400"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-sm disabled:opacity-40 transition-colors flex items-center justify-center cursor-pointer shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
