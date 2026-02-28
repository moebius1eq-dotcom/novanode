"use client";

import { useEffect, useState } from "react";

interface SentimentData {
  title: string;
  url: string;
  source: string;
}

export default function SentimentSnippet({ spotName }: { spotName: string }) {
  const [item, setItem] = useState<SentimentData | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/sentiment?q=${encodeURIComponent(spotName)}`);
      if (res.ok) {
        const json = (await res.json()) as { item: SentimentData | null };
        setItem(json.item);
      }
    })();
  }, [spotName]);

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200">
      <h3 className="font-semibold text-slate-900 mb-2">💬 What people are saying</h3>
      {item ? (
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:underline">
          {item.title} <span className="text-slate-500">({item.source})</span>
        </a>
      ) : (
        <p className="text-sm text-slate-500">Sentiment snippet not available yet.</p>
      )}
    </div>
  );
}
