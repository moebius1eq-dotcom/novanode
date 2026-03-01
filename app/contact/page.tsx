import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | NoVaNode",
  description: "Contact NoVaNode.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-xl p-6 md:p-8 space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Contact</h1>
        <p className="text-slate-600 text-sm">Questions, fixes, or partnership requests:</p>
        <a href="mailto:hello@novanode.dev" className="text-indigo-600 font-medium hover:underline">hello@novanode.dev</a>
      </div>
    </div>
  );
}
