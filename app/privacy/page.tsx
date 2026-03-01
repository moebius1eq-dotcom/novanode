import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | NoVaNode",
  description: "Privacy policy for NoVaNode.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-xl p-6 md:p-8 space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Privacy Policy</h1>
        <p className="text-slate-600 text-sm">
          NoVaNode collects limited usage and community-submitted data (e.g., speed tests, seat status, vibe photos) to improve spot accuracy.
        </p>
        <p className="text-slate-600 text-sm">
          We do not sell personal data. Community submissions may be moderated for quality and safety.
        </p>
        <p className="text-slate-600 text-sm">
          For privacy questions, contact us via the Contact page.
        </p>
      </div>
    </div>
  );
}
