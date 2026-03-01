"use client";

import { useEffect } from "react";
import * as amplitude from "@amplitude/analytics-browser";
import { sessionReplayPlugin } from "@amplitude/plugin-session-replay-browser";

let initialized = false;

export default function AmplitudeInit() {
  useEffect(() => {
    if (initialized) return;

    amplitude.add(sessionReplayPlugin());
    amplitude.init("173866292f0463c4fbe6444123adca26", {
      autocapture: {
        attribution: true,
        fileDownloads: true,
        formInteractions: true,
        pageViews: true,
        sessions: true,
        elementInteractions: true,
        networkTracking: true,
        webVitals: true,
        frustrationInteractions: {
          thrashedCursor: true,
          errorClicks: true,
          deadClicks: true,
          rageClicks: true,
        },
      },
    });

    // Optional custom event example:
    // amplitude.track("Sign Up");

    initialized = true;
  }, []);

  return null;
}
