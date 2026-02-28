interface NeighborhoodFAQProps {
  neighborhood: "arlington" | "tysons";
}

const FAQS = {
  arlington: [
    {
      q: "Which cafe in Arlington is best for a 3-hour deep work session?",
      a: "For long deep-work blocks, prioritize high-speed Wi-Fi plus low noise. In current NoVaNode data, spots tagged #DeepWork with 100+ Mbps are your best starting point.",
    },
    {
      q: "Where can I find free parking near Clarendon Metro for remote work?",
      a: "Check spots with free-garage or validated parking details first, then confirm latest lot rules before arrival. NoVaNode lists parking guidance in each spot card.",
    },
  ],
  tysons: [
    {
      q: "What is the best Tysons spot for reliable Zoom calls?",
      a: "Look for a higher meeting-ready score and acoustic labels like soundproof booths. Those typically outperform social coffee environments for calls.",
    },
    {
      q: "Where can I work in Tysons with fast Wi-Fi and easy parking?",
      a: "Start with high-speed spots (100+ Mbps) that also list free-garage parking. NoVaNode’s compare pages can narrow this down quickly.",
    },
  ],
} as const;

export default function NeighborhoodFAQ({ neighborhood }: NeighborhoodFAQProps) {
  const items = FAQS[neighborhood];

  return (
    <section className="py-10 px-4 bg-white border-t border-slate-200">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 mb-5">AI-friendly local FAQs</h2>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.q} className="rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900 mb-2">{item.q}</h3>
              <p className="text-slate-600 text-sm">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
