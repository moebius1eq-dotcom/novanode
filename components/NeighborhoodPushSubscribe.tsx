"use client";

import { useState } from "react";

export default function NeighborhoodPushSubscribe() {
  const [status, setStatus] = useState("");

  async function enable() {
    if (!("Notification" in window)) {
      setStatus("This browser does not support notifications.");
      return;
    }

    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      setStatus("Neighborhood updates enabled in this browser.");
      localStorage.setItem("novanodePushEnabled", "true");
    } else {
      setStatus("Notifications were not enabled.");
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="font-semibold text-slate-900 mb-2">🔔 Neighborhood updates</h3>
      <p className="text-sm text-slate-600 mb-3">Enable browser notifications for new work-spot alerts.</p>
      <button onClick={enable} className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm">Enable Updates</button>
      {status && <p className="text-xs text-slate-500 mt-2">{status}</p>}
    </div>
  );
}
