"use client";
import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [jd, setJd] = useState('');
  const [resume, setResume] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // The fixed function that connects the button to the backend API
  const generate = async () => {
    // Basic validation to ensure both fields are filled
    if (!jd || !resume) {
      setError("Please paste both the Job Description and your Resume Details.");
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jd, resume }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setResult(data.text);
    } catch (err: any) {
      console.error("Fetch Error:", err);
      setError(`Error: ${err.message}. Please check your console/logs.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ backgroundColor: '#EAEFEF', color: '#25343F' }}>
      
      {/* NAVBAR */}
      <nav className="p-5 shadow-xl border-b border-[#25343F]/10 flex justify-between items-center" style={{ backgroundColor: '#25343F' }}>
        <div className="flex items-center gap-4">
          <Image src="/logo.png" alt="Logo" width={55} height={55} className="rounded-lg shadow-inner border border-[#FF9B51]/30" />
          <div className="flex flex-col">
            <span className="text-[#FF9B51] font-extrabold text-2xl tracking-tight">CLH Gen</span>
            <span className="text-[#BFC9D1] text-xs">AI Covers</span>
          </div>
        </div>
        <div className="text-[#EAEFEF] text-sm font-medium bg-[#FF9B51]/10 px-4 py-1 rounded-full hidden md:block">
          Powered by Mistral & OpenRouter
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow p-4 md:p-8 max-w-7xl mx-auto w-full">
        
        {/* INPUT CARDS GRID */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          
          {/* Card 1: Job Description */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-[#25343F]">
            <label className="font-bold text-xl mb-4 block flex items-center gap-2">
              <span className="text-[#25343F]">1. Job Description</span>
            </label>
            <textarea 
              className="w-full h-80 p-5 rounded-xl border border-[#BFC9D1] focus:ring-2 focus:ring-[#FF9B51] focus:border-[#FF9B51] outline-none transition-all resize-none text-gray-700 bg-gray-50"
              placeholder="Paste the job requirements from the listing here..."
              value={jd}
              onChange={(e) => setJd(e.target.value)}
            />
          </div>

          {/* Card 2: Resume */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-[#FF9B51]">
            <label className="font-bold text-xl mb-4 block flex items-center gap-2">
              <span className="text-[#25343F]">2. Your Resume Details</span>
            </label>
            <textarea 
              className="w-full h-80 p-5 rounded-xl border border-[#BFC9D1] focus:ring-2 focus:ring-[#FF9B51] focus:border-[#FF9B51] outline-none transition-all resize-none text-gray-700 bg-gray-50"
              placeholder="Paste the raw text from your resume here (skills, roles)..."
              value={resume}
              onChange={(e) => setResume(e.target.value)}
            />
          </div>
        </div>

        {/* Action and Output Section */}
        <div className="flex flex-col items-center">
          
          {error && <div className="text-red-600 bg-red-100 p-3 rounded-lg font-medium mb-4">{error}</div>}

          <button 
            onClick={generate}
            disabled={loading}
            className="w-full md:w-3/4 transform active:scale-95 bg-[#FF9B51] text-white font-extrabold py-5 rounded-2xl text-xl hover:bg-[#e08a46] transition-all duration-150 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                DRAFTING...
              </>
            ) : "GENERATE COVER LETTER"}
          </button>

          {/* GENERATION ANIMATION */}
          {/* FULL SCREEN OVERLAY ANIMATION */}
          {loading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#25343F]/80 backdrop-blur-sm transition-opacity">
              <div className="bg-white p-10 rounded-3xl shadow-2xl flex flex-col items-center gap-6 border-b-8 border-[#FF9B51] animate-in zoom-in duration-300">
                
                {/* The Paper Animation Container */}
                <div className="w-20 h-24 border-4 border-[#25343F] relative rounded-lg overflow-hidden bg-gray-50 shadow-inner">
                  <div className="bg-[#FF9B51] w-full doc-animation absolute bottom-0"></div>
                  
                  {/* Decorative lines to look like text */}
                  <div className="absolute top-4 left-4 right-4 h-1.5 bg-[#25343F]/10 rounded"></div>
                  <div className="absolute top-8 left-4 right-4 h-1.5 bg-[#25343F]/10 rounded"></div>
                  <div className="absolute top-12 left-4 right-4 h-1.5 bg-[#25343F]/10 rounded"></div>
                  <div className="absolute top-16 left-4 right-8 h-1.5 bg-[#25343F]/10 rounded"></div>
                </div>

                <div className="text-center">
                  <h3 className="text-[#25343F] text-2xl font-black tracking-tight">DRAFTING...</h3>
                  <p className="text-[#25343F]/60 font-medium animate-pulse mt-2">
                    Syncing JD with your experience
                  </p>
                </div>
                
                {/* Small spinning sub-loader */}
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-[#FF9B51] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-[#FF9B51] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-[#FF9B51] rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}

          {result && !loading && (
            <div className="mt-12 w-full p-8 bg-white rounded-3xl shadow-2xl border-t-8 border-[#FF9B51] animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#BFC9D1]">
                <h2 className="text-2xl font-bold text-[#25343F]">Your Human-Like Cover Letter</h2>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(result);
                    alert("Copied to clipboard!");
                  }}
                  className="flex items-center gap-2 bg-[#25343F] text-white px-4 py-2 rounded-lg hover:bg-black transition-all text-sm font-bold"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="Ref8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  COPY LETTER
                </button>

                
              </div>
              
              {/* Clean, readable text area */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-inner">
                <p className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed text-lg tracking-wide">
                  {result}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="p-10 mt-16 shadow-inner" style={{ backgroundColor: '#25343F', color: '#BFC9D1' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
          <div className="flex items-center gap-3">
            <Image src="/logo.jpg" alt="Logo" width={40} height={40} className="rounded shadow" />
            <p className="text-sm">Powered by Mistral AI on OpenRouter.</p>
          </div>
          <p className="text-xs max-w-md">© 2026 CLH Gen. AI generates text based strictly on input. Intentional minor errors are included for a more authentic human feel.</p>
        </div>
      </footer>
    </div>
  );
}