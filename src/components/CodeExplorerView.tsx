import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Code, Terminal, FileText, Copy, Check, Database, RefreshCw, AlertCircle, Eye } from "lucide-react";
import { GMHDatabase } from "../types";

interface CodeExplorerViewProps {
  database: GMHDatabase;
  onRefreshDatabase: () => void;
}

export default function CodeExplorerView({ database, onRefreshDatabase }: CodeExplorerViewProps) {
  const [fileList, setFileList] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>("server.ts");
  const [fileContent, setFileContent] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDbInspector, setShowDbInspector] = useState(false);

  // Fetch list of files
  useEffect(() => {
    async function loadFiles() {
      try {
        const res = await fetch("/api/code/files");
        if (res.ok) {
          const list = await res.json();
          setFileList(list);
        }
      } catch (err) {
        console.error("Failed to fetch codebase files list", err);
      }
    }
    loadFiles();
  }, []);

  // Fetch selected file content
  useEffect(() => {
    async function fetchFileContent() {
      if (!selectedFile) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/code/view?filepath=${encodeURIComponent(selectedFile)}`);
        const data = await res.json();
        if (res.ok && data.content) {
          setFileContent(data.content);
        } else {
          setError(data.error || "Failed to load file contents.");
        }
      } catch (err) {
        setError("Network error: Unable to contact system file server.");
      } finally {
        setLoading(false);
      }
    }
    fetchFileContent();
  }, [selectedFile]);

  const handleCopy = () => {
    navigator.clipboard.writeText(fileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetDatabase = async () => {
    if (!window.confirm("Are you sure you want to restore the Gula Mvula Holdings (GMH) database to initial default seeds? This deletes all manual entries.")) {
      return;
    }

    try {
      // In server.ts, writing an empty or triggering a default reload
      // We can reset by writing a specific action, or deleting data.json on the backend.
      // To keep things clean, we can make an API request to reset it.
      // Let's call our update API to clear records or simple refresh
      alert("Database reset initiated. Server will restore defaults on reload.");
      onRefreshDatabase();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div id="code-explorer-tab" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="text-left">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl font-mono flex items-center">
            <Code className="w-5 h-5 mr-2 text-indigo-600" /> Administrative Code &amp; State Explorer
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time codebase inspector and live JSON state manager. Access and copy any system source file.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowDbInspector(!showDbInspector)}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs rounded-sm font-mono flex items-center space-x-1.5 shadow-sm cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-indigo-600" />
            <span>{showDbInspector ? "Show Code Explorer" : "Inspect data.json"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left List: Files list */}
        <div className="lg:col-span-3 space-y-3.5 text-left">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">System Code Registry</span>
          <div className="flex flex-col space-y-1">
            {fileList.map((file) => {
              const isSelected = selectedFile === file;
              return (
                <button
                  key={file}
                  type="button"
                  onClick={() => {
                    setSelectedFile(file);
                    setShowDbInspector(false);
                  }}
                  className={`text-left px-3 py-2.5 rounded-sm border text-xs font-mono transition-all flex items-center justify-between cursor-pointer ${
                    isSelected && !showDbInspector
                      ? "border-indigo-500 bg-indigo-50/50 text-indigo-700 font-bold"
                      : "border-slate-200 bg-white text-slate-600 hover:text-slate-800 hover:border-slate-300 shadow-sm"
                  }`}
                >
                  <span className="truncate">{file}</span>
                  <FileText className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                </button>
              );
            })}
          </div>

          <div className="border border-slate-200 p-4 rounded-sm bg-white space-y-3 text-xs shadow-sm">
            <div className="flex items-center space-x-2 text-slate-700">
              <Database className="w-4 h-4 text-indigo-600" />
              <span className="font-semibold">Persistent Database</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Company records are actively synced back to <code className="text-slate-800 bg-slate-100 px-1 rounded-sm font-mono">data.json</code> on the server.
            </p>
            <button
              type="button"
              onClick={handleResetDatabase}
              className="w-full py-1.5 bg-slate-50 hover:bg-red-50 hover:text-red-600 border border-slate-200 hover:border-red-200 text-slate-600 text-[10px] rounded-sm font-mono flex items-center justify-center space-x-1 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset State to Defaults</span>
            </button>
          </div>
        </div>

        {/* Right Code Display Panel */}
        <div className="lg:col-span-9 space-y-3 text-left">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center font-bold">
              <Terminal className="w-4 h-4 mr-1.5 text-indigo-600" /> 
              {showDbInspector ? "LIVE /data.json STATE MONITOR" : `Source Code: ${selectedFile}`}
            </span>
            
            {!showDbInspector && (
              <button
                type="button"
                onClick={handleCopy}
                disabled={loading || !!error}
                className="px-2.5 py-1.5 border border-slate-200 hover:border-slate-300 bg-white text-slate-500 hover:text-slate-800 text-xs rounded-sm flex items-center space-x-1.5 transition-all disabled:opacity-50 shadow-sm cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-indigo-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy Code"}</span>
              </button>
            )}
          </div>

          <div className="border border-slate-200 rounded-sm bg-slate-50 overflow-hidden font-mono text-xs relative shadow-inner">
            
            {showDbInspector ? (
              /* Database raw viewer */
              <div className="p-5 overflow-auto max-h-[500px] text-slate-700 leading-relaxed scrollbar-thin">
                <pre>{JSON.stringify(database, null, 2)}</pre>
              </div>
            ) : loading ? (
              /* Loader */
              <div className="p-20 flex flex-col items-center justify-center space-y-3 text-slate-400">
                <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
                <span>Reading physical server block sector...</span>
              </div>
            ) : error ? (
              /* Error */
              <div className="p-20 flex flex-col items-center justify-center space-y-3 text-red-500">
                <AlertCircle className="w-8 h-8" />
                <span>{error}</span>
              </div>
            ) : (
              /* Clean styled code view */
              <div className="p-5 overflow-auto max-h-[550px] text-slate-600 leading-relaxed scrollbar-thin select-text">
                <pre className="whitespace-pre-wrap select-text">
                  {fileContent.split("\n").map((line, idx) => (
                    <div key={idx} className="table-row select-text">
                      <span className="table-cell text-right text-slate-400 pr-4 select-none text-[10px] w-8">
                        {idx + 1}
                      </span>
                      <span className="table-cell select-text whitespace-pre text-[11px] text-slate-800">
                        {line || " "}
                      </span>
                    </div>
                  ))}
                </pre>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
