"use client";
import { useState } from 'react';
import Image from 'next/image';
import jsPDF from 'jspdf'; // Import the PDF library

export default function Home() {
  const [jd, setJd] = useState('');
  const [resume, setResume] = useState('');
  const [instructions, setInstructions] = useState(''); // New State for instructions
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generate = async () => {
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
        // Pass instructions to your API
        body: JSON.stringify({ jd, resume, instructions }), 
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setResult(data.text);
    } catch (err: any) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // PDF Generation Logic
  const downloadPDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    const width = 170; // Wrap text to page width
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    
    // Split text to fit into the PDF page width
    const splitText = doc.splitTextToSize(result, width);
    doc.text(splitText, margin, 30);
    
    doc.save("Cover_Letter.pdf");
  };

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ backgroundColor: '#EAEFEF', color: '#25343F' }}>
      
      {/* NAVBAR */}
      <nav className="p-5 shadow-xl border-b border-[#25343F]/10 flex justify-between items-center" style={{ backgroundColor: '#25343F' }}>
        <div className="flex items-center gap-4">
          <Image src="/logo.png" alt="Logo" width={55} height={55} className="rounded-lg shadow-inner border border-[#FF9B51]/30" />
          <div className="flex flex-col">
            <span className="text-[#FF9B51] font-extrabold text-2xl tracking-tight">CLH Gen</span>
            <span className="text-[#BFC9D1] text-xs">Human-Like AI Covers</span>
          </div>
        </div>
        <div className="text-[#EAEFEF] text-sm font-medium bg-[#FF9B51]/10 px-4 py-1 rounded-full hidden md:block">
          OpenRouter's Power
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow md:p-3 max-w-7xl mx-auto w-full">
        
        {/* INPUT CARDS GRID */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-3 rounded-2xl shadow-lg border-l-4 border-[#25343F]">
            <label className="font-bold text-xl block text-[#25343F]">1. Job Description</label>
            <textarea 
              className="w-full h-60 p-3 rounded-xl border border-[#BFC9D1] focus:ring-2 focus:ring-[#FF9B51] outline-none transition-all resize-none text-gray-700 bg-gray-50"
              placeholder="Paste requirements..."
              value={jd}
              onChange={(e) => setJd(e.target.value)}
            />
          </div>

          <div className="bg-white p-3 rounded-2xl shadow-lg border-l-4 border-[#FF9B51]">
            <label className="font-bold text-xl block text-[#25343F]">2. Your Resume Details</label>
            <textarea 
              className="w-full h-60 p-3 rounded-xl border border-[#BFC9D1] focus:ring-2 focus:ring-[#FF9B51] outline-none transition-all resize-none text-gray-700 bg-gray-50"
              placeholder="Paste skills & roles..."
              value={resume}
              onChange={(e) => setResume(e.target.value)}
            />
          </div>
        </div>

        {/* 3. CUSTOM INSTRUCTIONS (FULL WIDTH) */}
        <div className="w-full mb-4 bg-white p-3 rounded-2xl shadow-lg border-t-4 border-[#BFC9D1]">
          <label className="font-bold text-xl mb-3 block text-[#25343F]">3. Custom Instructions (Optional)</label>
          <textarea 
            className="w-full h-14 p-4 rounded-xl border border-[#BFC9D1] focus:ring-2 focus:ring-[#FF9B51] outline-none transition-all resize-none text-gray-700 bg-gray-50"
            placeholder="E.g. 'Focus more on my internship', 'Hightlight web development skills', ..."
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </div>

        <div className="flex flex-col items-center">
          {error && <div className="text-red-600 bg-red-100 p-3 rounded-lg font-medium mb-4">{error}</div>}

          <button 
            onClick={generate}
            disabled={loading}
            className="w-full md:w-3/4 transform active:scale-95 bg-[#FF9B51] text-white font-extrabold py-5 rounded-2xl text-xl hover:bg-[#e08a46] transition-all shadow-lg disabled:opacity-50"
          >
            {loading ? "DRAFTING..." : "GENERATE COVER LETTER"}
          </button>

          {/* LOADER OVERLAY */}
          {loading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#25343F]/80 backdrop-blur-sm">
              <div className="bg-white p-10 rounded-3xl shadow-2xl flex flex-col items-center gap-6 border-b-8 border-[#FF9B51]">
                <div className="w-20 h-24 border-4 border-[#25343F] relative rounded-lg overflow-hidden">
                  <div className="bg-[#FF9B51] w-full doc-animation absolute bottom-0"></div>
                </div>
                <h3 className="text-[#25343F] text-2xl font-black">DRAFTING...</h3>
              </div>
            </div>
          )}

          {result && !loading && (
            <div className="mt-12 w-full p-8 bg-white rounded-3xl shadow-2xl border-t-8 border-[#FF9B51]">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 pb-4 border-b border-[#BFC9D1]">
                <h2 className="text-2xl font-bold text-[#25343F]">Your Human-Like Cover Letter</h2>
                
                {/* BUTTON GROUP */}
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(result);
                      alert("Copied!");
                    }}
                    className="flex items-center gap-2 bg-[#25343F] text-white px-5 py-2.5 rounded-lg hover:bg-black transition-all text-sm font-bold shadow-md"
                  >
                    COPY
                  </button>
                  
                  <button 
                    onClick={downloadPDF}
                    className="flex items-center gap-2 bg-[#FF9B51] text-white px-5 py-2.5 rounded-lg hover:bg-[#e08a46] transition-all text-sm font-bold shadow-md"
                  >
                    DOWNLOAD PDF
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <p className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed text-lg tracking-wide">
                  {result}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="p-10 mt-16 shadow-inner" style={{ backgroundColor: '#25343F', color: '#BFC9D1' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Logo" width={40} height={40} className="rounded shadow" />
            <div className="flex flex-col items-start">
              <p className="text-sm font-bold text-white">CLH Gen</p>
              <span className="text-xs">
                Questions? <a href="mailto:vpawar6254@gmail.com" className="text-[#FF9B51] hover:underline">vpawar6254@gmail.com</a>
              </span>
            </div>
          </div>
          <p className="text-xs">© 2026 CoverLetterHere Gen.</p>
        </div>
      </footer>
    </div>
  );
}