import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | NoVaNode",
  description: "Terms of service for NoVaNode.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-xl p-6 md:p-8 space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Terms of Service</h1>
        <p className="text-slate-600 text-sm">
          NoVaNode provides informational workspace data and community signals. Availability, hours, and policies may change without notice.
        </p>
        <p className="text-slate-600 text-sm">
          Users are responsible for verifying critical details before visits. Abuse of community features may result in moderation or blocking.
        </p>
      </div>
    </div>
  );
}
