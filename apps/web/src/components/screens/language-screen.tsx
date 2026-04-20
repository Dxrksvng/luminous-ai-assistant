"use client";

export function LanguageScreen() {
  return (
    <div className="px-9 py-6 flex flex-col gap-5 overflow-y-auto h-full">
      <div>
        <div
          className="font-display text-[11px] tracking-[0.3em] text-cyan-400/40 mb-3 uppercase"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          Language Learning
        </div>
        <div className="flex gap-1">
          {["Translation", "Grammar Check", "Practice", "Summarize"].map((tab, index) => (
            <button
              key={tab}
              className={`px-4 py-1.5 rounded-lg border font-ui text-[11px] tracking-[0.1em] uppercase transition-all ${
                index === 0
                  ? "bg-[rgba(0,212,255,0.15)] border-[rgba(0,212,255,0.16)] text-cyan-400"
                  : "border-[rgba(240,244,255,0.07)] bg-[rgba(240,244,255,0.04)] text-[rgba(240,244,255,0.3)]"
              }`}
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[rgba(240,244,255,0.04)] border border-[rgba(240,244,255,0.07)] rounded-[12px] p-5">
        <div
          className="font-ui text-[10px] tracking-[0.15em] uppercase text-cyan-400/35 mb-2.5"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Thai ↔ English Translation
        </div>
        <textarea
          className="w-full bg-[rgba(5,8,18,0.6)] border border-[rgba(240,244,255,0.07)] rounded-lg px-3.5 py-3 font-ui text-[13.5px] text-white outline-none resize-vertical min-h-[80px] transition-all focus:border-[rgba(0,212,255,0.35)]"
          style={{ fontFamily: "'Inter', sans-serif" }}
          placeholder="พิมพ์ข้อความที่ต้องการแปล… / Enter text to translate…"
          rows={3}
        />
        <button className="mt-2.5 px-5 py-2 bg-gradient-to-br from-cyan-400 to-[#009ec0] border-none rounded-lg font-ui text-[11px] tracking-[0.1em] uppercase text-[#0a0e1a] cursor-pointer font-semibold transition-all hover:shadow-[0_0_22px_rgba(0,212,255,0.4)] hover:-translate-y-px shadow-[0_0_14px_rgba(0,212,255,0.2)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          แปลภาษา / Translate
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: "👂", title: "Listening", desc: "ฝึกฟังเสียงภาษาอังกฤษ" },
          { icon: "🗣", title: "Speaking", desc: "ฝึกออกเสียงและสำเนียง" },
          { icon: "📖", title: "Reading", desc: "ฝึกอ่านและเข้าใจ" },
          { icon: "✍️", title: "Writing", desc: "ฝึกเขียนประโยค" },
        ].map((card) => (
          <div
            key={card.title}
            className="bg-[rgba(240,244,255,0.04)] border border-[rgba(240,244,255,0.07)] rounded-[12px] p-4.5 cursor-pointer transition-all hover:bg-[rgba(0,212,255,0.15)] hover:border-[rgba(0,212,255,0.16)] text-center"
          >
            <div className="text-2xl mb-2">{card.icon}</div>
            <div
              className="font-ui text-[12px] tracking-[0.1em] uppercase text-cyan-400 mb-1"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {card.title}
            </div>
            <div className="text-[11.5px] text-[rgba(240,244,255,0.3)] leading-relaxed">
              {card.desc}
            </div>
            <div className="flex gap-1.5 mt-2.5 justify-center">
              {["Beginner", "Inter", "Advanced"].map((level, i) => (
                <span
                  key={level}
                  className={`px-2 py-0.5 rounded-full border font-ui text-[9.5px] tracking-[0.1em] uppercase cursor-pointer transition-all ${
                    i === 0
                      ? "bg-[rgba(0,212,255,0.15)] border-[rgba(0,212,255,0.16)] text-cyan-400"
                      : "border-[rgba(240,244,255,0.07)] text-[rgba(240,244,255,0.3)]"
                  }`}
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {level}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
