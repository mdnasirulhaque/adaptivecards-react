import React, { useState } from 'react';
import AdaptiveCardDesignerComponent from './components/AdaptiveCardDesigner';
import { FileJson, LayoutTemplate, Copy, Check } from 'lucide-react';

export default function App() {
  const [savedPayload, setSavedPayload] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSave = (payload: any) => {
    setSavedPayload(JSON.stringify(payload, null, 2));
  };

  const handleCopy = () => {
    if (savedPayload) {
      navigator.clipboard.writeText(savedPayload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-slate-50 font-sans text-slate-800">
      <header className="flex items-center justify-between h-14 bg-white border-b border-slate-200 px-6 shrink-0">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold">A</div>
          <h1 className="text-lg font-semibold tracking-tight">Adaptive Studio <span className="text-slate-400 font-normal text-sm ml-2">v2.4.0</span></h1>
        </div>
        <div className="flex items-center space-x-3">
          <span className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-50 rounded border border-slate-200">
            Vite + React
          </span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 flex flex-col relative overflow-hidden">
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center shrink-0">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Designer</span>
            <span className="text-xs text-slate-400">Click "Save Card" in toolbar to export JSON</span>
          </div>
          <div className="flex-1 bg-white relative">
             {/* The adaptive card designer injects its own absolute positioned UI, so we give it a large container */}
             <div className="absolute inset-0">
               <AdaptiveCardDesignerComponent onSave={handleSave} />
             </div>
          </div>
        </main>

        {savedPayload && (
          <aside className="w-[400px] bg-white border-l border-slate-200 flex flex-col shrink-0 shadow-xl z-10 transition-all duration-300 ease-in-out">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center space-x-2">
                <FileJson className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Saved JSON Payload</span>
              </div>
              <button 
                onClick={handleCopy}
                className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                title="Copy JSON"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="p-3 bg-slate-900 text-slate-300 rounded text-[10px] font-mono leading-relaxed overflow-x-auto">
                <pre className="whitespace-pre-wrap">{savedPayload}</pre>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-200">
              <button 
                onClick={() => setSavedPayload(null)}
                className="w-full py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg font-semibold text-sm shadow-sm transition-colors"
              >
                Close Output
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
